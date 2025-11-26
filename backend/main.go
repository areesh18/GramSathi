package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey = []byte("hackathon_secret_key_123")

// --- STRUCTS ---
type Credentials struct {
	Phone    string `json:"phone"` // Changed
	Password string `json:"password"`
}

type Claims struct {
	UserID uint   `json:"user_id"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

// --- HANDLERS ---

// 1. REGISTER
func Register(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name     string `json:"name"`
		Phone    string `json:"phone"` // Changed
		Password string `json:"password"`
		Village  string `json:"village"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)

	user := User{
		Name:       req.Name,
		Phone:      req.Phone, // Changed
		Password:   string(hashedPassword),
		Role:       "user",
		Village:    req.Village,
		TotalScore: 0,
		CreatedAt:  time.Now(),
	}

	if result := DB.Create(&user); result.Error != nil {
		http.Error(w, "Phone number already exists", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User registered!"})
}

// 2. LOGIN
func Login(w http.ResponseWriter, r *http.Request) {
	var creds Credentials
	json.NewDecoder(r.Body).Decode(&creds)

	var user User
	// Search by Phone
	if err := DB.Where("phone = ?", creds.Phone).First(&user).Error; err != nil {
		http.Error(w, "User not found", http.StatusUnauthorized)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(creds.Password)); err != nil {
		http.Error(w, "Invalid password", http.StatusUnauthorized)
		return
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		UserID: user.ID,
		Role:   user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, _ := token.SignedString(jwtKey)

	json.NewEncoder(w).Encode(map[string]interface{}{
		"token": tokenString,
		"user":  user,
	})
}

// 3. GET PROFILE (UPDATED)
func GetProfile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	var user User
	if result := DB.First(&user, id); result.Error != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	var progress []Progress
	DB.Where("user_id = ?", user.ID).Find(&progress)

	badgeMap := make(map[string]bool)
	for _, p := range progress {
		if p.Points > 0 {
			badgeMap[p.ModuleID] = true
		}
	}

	user.Badges = make([]string, 0, len(badgeMap))
	for module := range badgeMap {
		user.Badges = append(user.Badges, module)
	}

	json.NewEncoder(w).Encode(user)
}

// 4. RECORD SCORE
func RecordProgress(w http.ResponseWriter, r *http.Request) {
	var p Progress
	json.NewDecoder(r.Body).Decode(&p)
	p.CreatedAt = time.Now()
	DB.Create(&p)

	var user User
	DB.First(&user, p.UserID)
	user.TotalScore += p.Points
	DB.Save(&user)
	w.WriteHeader(http.StatusOK)
}

// 5. LOG ACTIVITY
func LogActivity(w http.ResponseWriter, r *http.Request) {
	var log ActivityLog
	if err := json.NewDecoder(r.Body).Decode(&log); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}
	log.CreatedAt = time.Now()
	DB.Create(&log)
	w.WriteHeader(http.StatusOK)
}

// 6. ADMIN STATS
func GetAdminStats(w http.ResponseWriter, r *http.Request) {
	var totalUsers int64
	var avgScore float64
	DB.Model(&User{}).Where("role = ?", "user").Count(&totalUsers)
	DB.Model(&User{}).Where("role = ?", "user").Select("COALESCE(AVG(total_score), 0)").Scan(&avgScore)

	type MonthlyStat struct {
		Month string `json:"name"`
		Users int    `json:"users"`
	}
	var trend []MonthlyStat
	DB.Model(&User{}).
		Where("role = ?", "user").
		Select("TO_CHAR(created_at, 'Mon') as month, count(id) as users").
		Group("month").
		Order("MIN(created_at)").
		Scan(&trend)

	type VillageStat struct {
		Name  string  `json:"name"`
		Score float64 `json:"score"`
		Count int     `json:"count"`
	}
	var villageStats []VillageStat
	DB.Model(&User{}).
		Where("role = ?", "user").
		Select("village as name, AVG(total_score) as score, COUNT(id) as count").
		Group("village").
		Order("score desc").
		Limit(10).
		Scan(&villageStats)

	type ModuleStat struct {
		Name  string `json:"name"`
		Value int    `json:"value"`
	}
	var rawStats []ModuleStat

	DB.Model(&Progress{}).
		Select("module_id as name, COUNT(id) as value").
		Group("module_id").
		Scan(&rawStats)

	consolidatedMap := make(map[string]int)

	for _, stat := range rawStats {
		label := stat.Name
		switch stat.Name {
		case "upi", "upi_payment", "upi_balance_check":
			label = "UPI Payments"
		case "quiz_literacy_101":
			label = "Safety Quiz"
		case "sim_pm_kisan":
			label = "PM Kisan Form"
		case "grievance_filed":
			label = "Grievance"
		case "mandi_pass":
			label = "Mandi Pass"
		case "tele_medicine":
			label = "Tele-Medicine"
		case "sim_digilocker":
			label = "DigiLocker"
		}
		consolidatedMap[label] += stat.Value
	}

	var moduleStats []ModuleStat
	for name, value := range consolidatedMap {
		moduleStats = append(moduleStats, ModuleStat{Name: name, Value: value})
	}

	type StruggleStat struct {
		Module   string `json:"module"`
		Failures int    `json:"failures"`
	}
	var struggles []StruggleStat
	DB.Model(&ActivityLog{}).
		Where("action LIKE ?", "failed%").
		Select("module_id as module, COUNT(id) as failures").
		Group("module_id").
		Order("failures desc").
		Scan(&struggles)

	for i := range struggles {
		switch struggles[i].Module {
		case "upi":
			struggles[i].Module = "UPI (PIN Entry)"
		case "sim_pm_kisan":
			struggles[i].Module = "Form (Uploads)"
		}
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"total_users":  totalUsers,
		"avg_score":    int(avgScore),
		"trend":        trend,
		"villages":     villageStats,
		"module_stats": moduleStats,
		"struggles":    struggles,
	})
}

// 7. GET SCHEMES
func GetSchemes(w http.ResponseWriter, r *http.Request) {
	var schemes []Scheme
	if result := DB.Find(&schemes); result.Error != nil {
		http.Error(w, "Server Error", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(schemes)
}

func IsAuthorized(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Missing Token", http.StatusUnauthorized)
			return
		}
		tokenString := strings.Split(authHeader, "Bearer ")[1]
		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})
		if err != nil || !token.Valid {
			http.Error(w, "Invalid Token", http.StatusUnauthorized)
			return
		}
		next(w, r)
	}
}

func main() {
	InitDB()
	r := mux.NewRouter()

	r.HandleFunc("/api/register", Register).Methods("POST")
	r.HandleFunc("/api/login", Login).Methods("POST")

	r.HandleFunc("/api/user/{id}", IsAuthorized(GetProfile)).Methods("GET")
	r.HandleFunc("/api/progress", IsAuthorized(RecordProgress)).Methods("POST")
	r.HandleFunc("/api/log", IsAuthorized(LogActivity)).Methods("POST")
	r.HandleFunc("/api/admin/stats", IsAuthorized(GetAdminStats)).Methods("GET")
	r.HandleFunc("/api/schemes", IsAuthorized(GetSchemes)).Methods("GET")

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	fmt.Println("🔥 Secure Server running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", c.Handler(r)))
}

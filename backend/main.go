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
	Email    string `json:"email"`
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
		Email    string `json:"email"`
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
		Email:      req.Email,
		Password:   string(hashedPassword),
		Role:       "user",
		Village:    req.Village,
		TotalScore: 0,
		CreatedAt:  time.Now(),
	}

	if result := DB.Create(&user); result.Error != nil {
		http.Error(w, "Email already exists", http.StatusBadRequest)
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
	if err := DB.Where("email = ?", creds.Email).First(&user).Error; err != nil {
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

// 3. GET PROFILE
func GetProfile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	var user User
	DB.First(&user, id)
	json.NewEncoder(w).Encode(user)
}

// 4. RECORD SCORE
func RecordProgress(w http.ResponseWriter, r *http.Request) {
	var p Progress
	json.NewDecoder(r.Body).Decode(&p)
	DB.Create(&p)

	var user User
	DB.First(&user, p.UserID)
	user.TotalScore += p.Points
	DB.Save(&user)
	w.WriteHeader(http.StatusOK)
}

// 5. ADMIN STATS (UPDATED FOR REAL CHARTS)
func GetAdminStats(w http.ResponseWriter, r *http.Request) {
	// A. Basic Counters
	var totalUsers int64
	var avgScore float64
	DB.Model(&User{}).Where("role = ?", "user").Count(&totalUsers)
	DB.Model(&User{}).Where("role = ?", "user").Select("COALESCE(AVG(total_score), 0)").Scan(&avgScore)

	// B. Adoption Trend (Users per Month)
	type MonthlyStat struct {
		Month string `json:"name"`
		Users int    `json:"users"`
	}
	var trend []MonthlyStat
	// Note: This query uses Postgres specific syntax (TO_CHAR)
	DB.Model(&User{}).
		Where("role = ?", "user").
		Select("TO_CHAR(created_at, 'Mon') as month, count(id) as users").
		Group("month").
		Order("MIN(created_at)"). // Keep months in chronological order
		Scan(&trend)

	// C. Village Impact (Avg Score per Village)
	type VillageStat struct {
		Name  string  `json:"name"`
		Score float64 `json:"score"`
	}
	var villageStats []VillageStat
	DB.Model(&User{}).
		Where("role = ?", "user").
		Select("village as name, AVG(total_score) as score").
		Group("village").
		Limit(5). // Top 5 villages
		Scan(&villageStats)

	// Return combined data
	json.NewEncoder(w).Encode(map[string]interface{}{
		"total_users": totalUsers,
		"avg_score":   int(avgScore),
		"trend":       trend,
		"villages":    villageStats,
	})
}

// --- MIDDLEWARE ---
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
	r.HandleFunc("/api/admin/stats", IsAuthorized(GetAdminStats)).Methods("GET")

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	fmt.Println("🔥 Secure Server running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", c.Handler(r)))
}
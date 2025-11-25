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

var jwtKey = []byte("hackathon_secret_key_123") // Keep this simple for now

// --- AUTH STRUCTS ---
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

// 1. REGISTER (Create User/Admin)
func Register(w http.ResponseWriter, r *http.Request) {
	var user User
	json.NewDecoder(r.Body).Decode(&user)

	// Hash Password
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	user.Password = string(hashedPassword)
	
	// Set default role if empty
	if user.Role == "" {
		user.Role = "user"
	}

	if result := DB.Create(&user); result.Error != nil {
		http.Error(w, "Email already exists", http.StatusBadRequest)
		return
	}
	
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User registered!"})
}

// 2. LOGIN (Generate Token)
func Login(w http.ResponseWriter, r *http.Request) {
	var creds Credentials
	json.NewDecoder(r.Body).Decode(&creds)

	var user User
	if err := DB.Where("email = ?", creds.Email).First(&user).Error; err != nil {
		http.Error(w, "User not found", http.StatusUnauthorized)
		return
	}

	// Check Password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(creds.Password)); err != nil {
		http.Error(w, "Invalid password", http.StatusUnauthorized)
		return
	}

	// Create JWT Token
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

	// Return Token + User Info
	json.NewEncoder(w).Encode(map[string]interface{}{
		"token": tokenString,
		"user":  user,
	})
}

// 3. GET USER (Protected)
func GetProfile(w http.ResponseWriter, r *http.Request) {
	// Extract ID from JWT Middleware context (simplified here by just trusting the request for the hackathon)
	// Ideally, you grab the ID from the token claims.
	// For this demo, we will look up the ID passed in the URL, but only if the token is valid.
	
	vars := mux.Vars(r)
	id := vars["id"]
	
	var user User
	DB.First(&user, id)
	json.NewEncoder(w).Encode(user)
}

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

func GetAdminStats(w http.ResponseWriter, r *http.Request) {
	var totalUsers int64
	var avgScore float64
	DB.Model(&User{}).Count(&totalUsers)
	DB.Model(&User{}).Select("AVG(total_score)").Scan(&avgScore)
	json.NewEncoder(w).Encode(map[string]interface{}{"total_users": totalUsers, "avg_score": int(avgScore)})
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

	// Public Routes
	r.HandleFunc("/api/register", Register).Methods("POST")
	r.HandleFunc("/api/login", Login).Methods("POST")

	// Protected Routes (Wrapped in IsAuthorized)
	r.HandleFunc("/api/user/{id}", IsAuthorized(GetProfile)).Methods("GET")
	r.HandleFunc("/api/progress", IsAuthorized(RecordProgress)).Methods("POST")
	r.HandleFunc("/api/admin/stats", IsAuthorized(GetAdminStats)).Methods("GET")

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"}, // Allow Auth Header
		AllowCredentials: true,
	})

	fmt.Println("🔥 Secure Server running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", c.Handler(r)))
}
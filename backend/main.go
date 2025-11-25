package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

// 1. GET /api/user/1 -> Returns user profile & score
func GetUser(w http.ResponseWriter, r *http.Request) {
	var user User
	// Always fetching ID 1 for the demo
	if result := DB.First(&user, 1); result.Error != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// 2. POST /api/progress -> Saves points when simulation is done
func RecordProgress(w http.ResponseWriter, r *http.Request) {
	var p Progress
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Save log
	DB.Create(&p)

	// Update User's Total Score
	var user User
	DB.First(&user, p.UserID)
	user.TotalScore += p.Points
	DB.Save(&user)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Score updated!"})
}

func main() {
	InitDB()

	r := mux.NewRouter()
	r.HandleFunc("/api/user", GetUser).Methods("GET")
	r.HandleFunc("/api/progress", RecordProgress).Methods("POST")

	// Enable CORS so React (port 5173) can talk to Go (port 8080)
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: true,
	})

	fmt.Println("🔥 Server running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", c.Handler(r)))
}
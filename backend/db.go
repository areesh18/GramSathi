package main

import (
	"fmt"
	"log"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	// ⚠️ UPDATE PASSWORD IF NEEDED
	dsn := "host=localhost user=postgres password=postgres123 dbname=gramsathi port=5432 sslmode=disable"

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	DB.AutoMigrate(&User{}, &Progress{})
	fmt.Println("🚀 Database connected!")

	// --- 1. SEED MOCK ADMIN (The only way to get an admin account) ---
	var adminCount int64
	DB.Model(&User{}).Where("role = ?", "admin").Count(&adminCount)
	if adminCount == 0 {
		// Hash the password "admin123"
		hash, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)

		admin := User{
			Name:       "District Admin",
			Email:      "admin@gramsathi.in",
			Password:   string(hash),
			Role:       "admin",
			Village:    "District HQ",
			TotalScore: 100,
			CreatedAt:  time.Now(),
		}
		DB.Create(&admin)
		fmt.Println("🛡️  Seeded Admin User: admin@gramsathi.in / admin123")
	}

	// --- 2. SEED DEMO USER (Optional, for quick testing) ---
	var userCount int64
	DB.Model(&User{}).Where("role = ?", "user").Count(&userCount)
	if userCount == 0 {
		hash, _ := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)
		user := User{
			Name:       "Rajesh Kumar",
			Email:      "rajesh@village.in",
			Password:   string(hash),
			Role:       "user",
			Village:    "Rampur",
			TotalScore: 0,
			CreatedAt:  time.Now(),
		}
		DB.Create(&user)
		fmt.Println("👤 Seeded Normal User: rajesh@village.in / 123456")
	}
}

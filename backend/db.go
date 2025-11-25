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
	dsn := "host=localhost user=postgres password=postgres123 dbname=gramsathi port=5432 sslmode=disable"

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// AutoMigrate User, Progress, Scheme AND ActivityLog
	DB.AutoMigrate(&User{}, &Progress{}, &Scheme{}, &ActivityLog{})
	fmt.Println("🚀 Database connected!")

	// --- SEED ADMIN & USER ---
	var adminCount int64
	DB.Model(&User{}).Where("role = ?", "admin").Count(&adminCount)
	if adminCount == 0 {
		hash, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
		admin := User{Name: "District Admin", Email: "admin@gramsathi.in", Password: string(hash), Role: "admin", Village: "District HQ", TotalScore: 100, CreatedAt: time.Now()}
		DB.Create(&admin)
		fmt.Println("🛡️  Seeded Admin User")
	}

	var userCount int64
	DB.Model(&User{}).Where("role = ?", "user").Count(&userCount)
	if userCount == 0 {
		hash, _ := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)
		user := User{Name: "Rajesh Kumar", Email: "rajesh@village.in", Password: string(hash), Role: "user", Village: "Rampur", TotalScore: 0, CreatedAt: time.Now()}
		DB.Create(&user)
		fmt.Println("👤 Seeded Normal User")
	}

	// --- SEED SCHEMES ---
	var schemeCount int64
	DB.Model(&Scheme{}).Count(&schemeCount)
	if schemeCount == 0 {
		schemes := []Scheme{
			{Title: "PM Kisan Nidhi", Category: "gov", Color: "bg-green-100 text-green-700", Icon: "🌾", Description: "Financial support for farmers"},
			{Title: "Crop Insurance", Category: "agri", Color: "bg-yellow-100 text-yellow-700", Icon: "🛡️", Description: "Protect crops from damage"},
			{Title: "Tele-Medicine", Category: "health", Color: "bg-blue-100 text-blue-700", Icon: "👨‍⚕️", Description: "Consult doctors online"},
			{Title: "Practice UPI", Category: "finance", Color: "bg-purple-100 text-purple-700", Icon: "💸", Description: "Learn digital payments"},
			{Title: "Mandi Prices", Category: "agri", Color: "bg-orange-100 text-orange-700", Icon: "💰", Description: "Live market rates"},
			{Title: "DigiLocker", Category: "gov", Color: "bg-indigo-100 text-indigo-700", Icon: "📂", Description: "Store documents digitally"},
		}
		DB.Create(&schemes)
		fmt.Println("📜 Seeded Schemes Data")
	}
}
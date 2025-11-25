package main

import (
	"fmt"
	"log"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	// ⚠️ CHANGE 'password' TO YOUR ACTUAL POSTGRES PASSWORD ⚠️
	dsn := "host=localhost user=postgres password=postgres123 dbname=gramsathi port=5432 sslmode=disable"
	
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// This automatically creates the 'users' and 'progress' tables!
	DB.AutoMigrate(&User{}, &Progress{})
	fmt.Println("🚀 Database connected and tables created!")
	
	// Seed a dummy user if none exists 
	var count int64
	DB.Model(&User{}).Count(&count)
	if count == 0 {
		DB.Create(&User{Name: "Rajesh Kumar", Village: "Rampur", TotalScore: 0})
		fmt.Println("🌱 Seeded dummy user: Rajesh Kumar")
	}
}
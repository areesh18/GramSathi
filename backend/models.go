package main

import (
	"time"
)

type User struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	Name       string    `json:"name"`
	Email      string    `gorm:"unique" json:"email"` // Login ID
	Password   string    `json:"-"`                   // Hide password in JSON
	Role       string    `json:"role"`                // "user" or "admin"
	Village    string    `json:"village"`
	TotalScore int       `json:"total_score"`
	CreatedAt  time.Time `json:"created_at"`
}

type Progress struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `json:"user_id"`
	ModuleID  string    `json:"module_id"`
	Points    int       `json:"points"`
	CreatedAt time.Time `json:"created_at"`
}
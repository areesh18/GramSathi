package main

import (
	"time"
)

type User struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	Name       string    `json:"name"`
	Email      string    `gorm:"unique" json:"email"`
	Password   string    `json:"-"`
	Role       string    `json:"role"`
	Village    string    `json:"village"`
	TotalScore int       `json:"total_score"`
	CreatedAt  time.Time `json:"created_at"`
	Badges     []string  `json:"badges" gorm:"-"` 
}

type Progress struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `json:"user_id"`
	ModuleID  string    `json:"module_id"`
	Points    int       `json:"points"`
	CreatedAt time.Time `json:"created_at"`
}

// --- NEW: Activity Log for Analytics ---
type ActivityLog struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `json:"user_id"`
	ModuleID  string    `json:"module_id"` // e.g., "upi", "pm_kisan"
	Action    string    `json:"action"`    // e.g., "started", "failed_pin", "completed"
	CreatedAt time.Time `json:"created_at"`
}

// --- Scheme Model ---
type Scheme struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Title       string `json:"title"`
	Category    string `json:"category"` // gov, agri, finance, health
	Description string `json:"desc"`
	Icon        string `json:"icon"`  // Stores emoji char for now
	Color       string `json:"color"` // Tailwind class string
}
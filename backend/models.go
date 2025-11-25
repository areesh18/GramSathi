package main

import (
	"time"
)

type User struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	Name       string    `json:"name"`
	Village    string    `json:"village"`
	TotalScore int       `json:"total_score"` // Tracks literacy points
	CreatedAt  time.Time `json:"created_at"`
}

type Progress struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `json:"user_id"`
	ModuleID  string    `json:"module_id"` // e.g., "upi_simulation"
	Points    int       `json:"points"`
	CreatedAt time.Time `json:"created_at"`
}

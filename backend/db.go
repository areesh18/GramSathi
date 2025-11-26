package main

import (
	"fmt"
	"log"
	"math/rand"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	// Database Connection String
	dsn := "host=localhost user=postgres password=postgres123 dbname=gramsathi port=5432 sslmode=disable"

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// AutoMigrate User, Progress, Scheme AND ActivityLog
	DB.AutoMigrate(&User{}, &Progress{}, &Scheme{}, &ActivityLog{})
	fmt.Println("🚀 Database connected!")

	// --- SEED DATA ---
	var userCount int64
	DB.Model(&User{}).Count(&userCount)

	if userCount == 0 {
		fmt.Println("🌱 Seeding Database...")

		// 1. Setup Common Data
		password := "123456"
		hash, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		pwd := string(hash)

		adminHash, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
		adminPwd := string(adminHash)

		// 2. Create Fixed Users (Admin & Demo)
		// Admin: 9999999999
		admin := User{Name: "District Admin", Phone: "9999999999", Password: adminPwd, Role: "admin", Village: "District HQ", TotalScore: 100, CreatedAt: time.Now()}
		DB.Create(&admin)

		// Demo User: 9876543210 (Rampur)
		demoUser := User{Name: "Rajesh Kumar", Phone: "9876543210", Password: pwd, Role: "user", Village: "Rampur, UP", TotalScore: 150, CreatedAt: time.Now()}
		DB.Create(&demoUser)

		// 3. Configuration for 50 Diverse Users across 7 Villages
		// Uneven distribution: 12 + 9 + 8 + 6 + 6 + 5 + 4 = 50
		villageConfig := []struct {
			Name  string
			Count int
		}{
			{"Rampur, UP", 12},
			{"Madhubani, Bihar", 9},
			{"Kutch, Gujarat", 8},
			{"Warangal, Telangana", 6},
			{"Alleppey, Kerala", 6},
			{"Dispur, Assam", 5},
			{"Manali, Himachal", 4},
		}

		// Pool of Names
		names := []string{
			"Aarav Patel", "Vivaan Singh", "Aditya Sharma", "Vihaan Gupta", "Arjun Reddy",
			"Sai Kumar", "Rohan Das", "Priya Malik", "Sneha Iyer", "Anjali Mehta",
			"Sunita Devi", "Lakshmi Nair", "Fatima Khan", "Mohammed Ali", "Gurpreet Singh",
			"Rajeshwari Y", "Lalita Yadav", "Manoj Tiwari", "Pankaj Tripathi", "Suresh Raina",
			"Ramesh Pawar", "Suresh Patil", "Ganesh Gaikwad", "Mahesh Babu", "Venkatesh D",
			"Chiranjeevi K", "Nagarjuna A", "Binod Bihari", "Hemant Soren", "Shibu Lal",
			"Amit Shah", "Narendra M", "Rahul Gandhi", "Arvind K", "Yogi Adityanath",
			"Mamata B", "Nitish Kumar", "Laloo Prasad", "Mayawati", "Akhilesh Y",
			"Sania Mirza", "PV Sindhu", "Saina Nehwal", "Mary Kom", "Mithali Raj",
			"Jhulan G", "Harmanpreet K", "Smriti Mandhana", "Shafali Verma", "Poonam Yadav",
			"Virat Kohli", "Rohit Sharma", "MS Dhoni", "Sachin T", "Sourav Ganguly",
			"Rahul Dravid", "VVS Laxman", "Anil Kumble", "Zaheer Khan", "Harbhajan S",
			"Yuvraj Singh", "Gautam Gambhir", "Virender S", "Shikhar Dhawan", "Ravindra J",
			"Hardik Pandya", "Jasprit Bumrah", "Rishabh Pant", "KL Rahul", "Shreyas Iyer",
			"Ishant Sharma", "Umesh Yadav", "Mohammed Shami", "Bhuvneshwar K", "Kuldeep Yadav",
			"Yuzvendra C", "Axar Patel", "Washington S", "Shardul Thakur", "Deepak Chahar",
			"Suryakumar Y", "Ishan Kishan", "Sanju Samson", "Prithvi Shaw", "Shubman Gill",
			"Ruturaj G", "Devdutt P", "Venkatesh Iyer", "Varun C", "Rahul Chahar",
			"Ravi Bishnoi", "Arshdeep Singh", "Umran Malik", "Avesh Khan", "Mohsin Khan",
		}

		modules := []string{"upi", "pm_kisan", "digilocker", "tele_medicine", "mandi_pass"}
		actions := []string{"failed_pin", "failed_otp", "failed_upload", "started", "viewed"}

		globalPhoneCounter := 1

		for _, vCfg := range villageConfig {
			for i := 0; i < vCfg.Count; i++ {
				// Name Selection (Random)
				name := names[rand.Intn(len(names))]

				// Phone Series: 9000000001 onwards
				phone := fmt.Sprintf("900000%04d", globalPhoneCounter)
				globalPhoneCounter++

				// Random Date (last 6 months) to populate "Trend" charts
				daysAgo := rand.Intn(180)
				createdAt := time.Now().AddDate(0, 0, -daysAgo)

				// Random Score
				score := rand.Intn(600)

				user := User{
					Name:       name,
					Phone:      phone,
					Password:   pwd,
					Role:       "user",
					Village:    vCfg.Name,
					TotalScore: score,
					CreatedAt:  createdAt,
				}

				if result := DB.Create(&user); result.Error == nil {
					// B. Seed Progress (1-3 records per user) for "Skill Distribution"
					numProgress := rand.Intn(3) + 1
					for p := 0; p < numProgress; p++ {
						mod := modules[rand.Intn(len(modules))]
						DB.Create(&Progress{
							UserID:    user.ID,
							ModuleID:  mod,
							Points:    50,
							CreatedAt: createdAt.Add(time.Hour * time.Duration(rand.Intn(24))),
						})
					}

					// C. Seed Activity Logs (30% chance of failure) for "Struggles" chart
					if rand.Intn(10) > 6 {
						mod := modules[rand.Intn(len(modules))]
						action := actions[rand.Intn(len(actions))]
						DB.Create(&ActivityLog{
							UserID:    user.ID,
							ModuleID:  mod,
							Action:    action,
							CreatedAt: createdAt.Add(time.Minute * time.Duration(rand.Intn(6))),
						})
					}
				}
			}
		}
		fmt.Println("👥 Seeded 50 Users across 7 Villages with Uneven Distribution & History!")
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

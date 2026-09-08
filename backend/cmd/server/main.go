package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/JakeFen/watchr/backend/internal/api"
	"github.com/JakeFen/watchr/backend/internal/auth"
)

type healthResponse struct {
	Status string `json:"status"`
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(healthResponse{Status: "ok"})
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	if secretKey := os.Getenv("CLERK_SECRET_KEY"); secretKey != "" {
		clerk.SetKey(secretKey)
	} else {
		log.Println("warning: CLERK_SECRET_KEY not set, authenticated routes will reject all requests")
	}

	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL is required")
	}

	ctx := context.Background()
	db, err := pgxpool.New(ctx, databaseURL)
	if err != nil {
		log.Fatalf("failed to create database pool: %v", err)
	}
	defer db.Close()

	if err := db.Ping(ctx); err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	h := &api.Handler{DB: db}

	mux := http.NewServeMux()
	mux.HandleFunc("/health", healthHandler)
	mux.Handle("POST /movie-entries", auth.RequireAuth(http.HandlerFunc(h.CreateMovieEntry)))
	mux.HandleFunc("GET /movie-entries/{id}", h.GetMovieEntry)
	mux.Handle("DELETE /movie-entries/{id}", auth.RequireAuth(http.HandlerFunc(h.DeleteMovieEntry)))

	log.Printf("server listening on :%s", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatal(err)
	}
}

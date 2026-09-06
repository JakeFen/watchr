package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/clerk/clerk-sdk-go/v2"
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

	mux := http.NewServeMux()
	mux.HandleFunc("/health", healthHandler)

	log.Printf("server listening on :%s", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatal(err)
	}
}

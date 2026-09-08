package api

import (
	"encoding/json"
	"net/http"

	"github.com/JakeFen/watchr/backend/internal/database"
)

// Handler holds the dependencies shared across HTTP handlers.
type Handler struct {
	DB database.DB
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}

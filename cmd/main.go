package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	fmt.Println("Hello, World!")
	courses, err := ParseXlsx()
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(len(courses))
	fmt.Println(courses[195])

	http.HandleFunc("/api/courses", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		courses, err := ParseXlsx()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(courses)
	})

	// Serve static files from the ./dist directory
	distPath := "./dist"
	fs := http.FileServer(http.Dir(distPath))

	// Handle root and static file requests
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		// Check if the request is for a static file
		path := filepath.Join(distPath, r.URL.Path)
		if _, err := os.Stat(path); err == nil {
			// Serve the static file
			fs.ServeHTTP(w, r)
		} else {
			// If not found, serve index.html for client-side routing
			// http.ServeFile(w, r, "./dist/index.html")
			http.ServeFile(w, r, filepath.Join(distPath, "index.html"))
		}
	})

	fmt.Println("Server started at :8080")
	http.ListenAndServe(":8080", nil)
}

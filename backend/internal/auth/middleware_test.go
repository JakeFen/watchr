package auth

import (
	"crypto/rsa"
	"encoding/base64"
	"encoding/binary"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/clerktest"
)

func b64url(b []byte) string {
	return base64.RawURLEncoding.EncodeToString(b)
}

func encodeExponent(e int) string {
	buf := make([]byte, 4)
	binary.BigEndian.PutUint32(buf, uint32(e))
	// Trim leading zero bytes.
	i := 0
	for i < len(buf)-1 && buf[i] == 0 {
		i++
	}
	return b64url(buf[i:])
}

func TestRequireAuth(t *testing.T) {
	kid := "kid-" + t.Name()

	// GenerateJWT signs with a freshly generated RSA key each call, so
	// the mock JWKS endpoint below must serve *that* key's public half
	// rather than a fixed fixture, or signature verification fails.
	var pubKey *rsa.PublicKey

	clerkAPI := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/jwks" && r.Method == http.MethodGet {
			fmt.Fprintf(w, `{"keys":[{"use":"sig","kty":"RSA","kid":"%s","alg":"RS256","n":"%s","e":"%s"}]}`,
				kid, b64url(pubKey.N.Bytes()), encodeExponent(pubKey.E))
		}
	}))
	defer clerkAPI.Close()
	clerk.SetBackend(clerk.NewBackend(&clerk.BackendConfig{
		HTTPClient: clerkAPI.Client(),
		URL:        &clerkAPI.URL,
	}))

	var gotUserID string
	var gotOK bool
	protected := RequireAuth(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		gotUserID, gotOK = ClerkUserID(r.Context())
		w.WriteHeader(http.StatusOK)
	}))
	ts := httptest.NewServer(protected)
	defer ts.Close()

	t.Run("no token is rejected", func(t *testing.T) {
		res, err := http.Get(ts.URL)
		if err != nil {
			t.Fatal(err)
		}
		if res.StatusCode != http.StatusForbidden {
			t.Fatalf("want 403, got %d", res.StatusCode)
		}
	})

	t.Run("valid token is accepted and exposes the clerk user id", func(t *testing.T) {
		var token string
		var pub any
		token, pub = clerktest.GenerateJWT(t, map[string]any{
			"sid": "sess_123",
			"sub": "user_abc123",
			"iss": "https://clerk.com",
		}, kid)
		pubKey = pub.(*rsa.PublicKey)

		req, _ := http.NewRequest(http.MethodGet, ts.URL, nil)
		req.Header.Set("Authorization", "Bearer "+token)
		res, err := http.DefaultClient.Do(req)
		if err != nil {
			t.Fatal(err)
		}
		if res.StatusCode != http.StatusOK {
			t.Fatalf("want 200, got %d", res.StatusCode)
		}
		if !gotOK {
			t.Fatal("ClerkUserID: ok was false, want true")
		}
		if gotUserID != "user_abc123" {
			t.Fatalf("ClerkUserID: got %q, want %q", gotUserID, "user_abc123")
		}
	})
}

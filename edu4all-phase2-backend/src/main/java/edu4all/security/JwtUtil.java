// src/main/java/edu4all/security/JwtUtil.java
package edu4all.security;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
    // 1) load the same base64‐encoded secret every time
    private final Key key;
    private final long expirationMs = 1000 * 60 * 60; // 1h

    public JwtUtil(@Value("${jwt.secret}") String base64Secret) {
        byte[] secretBytes = Base64.getDecoder().decode(base64Secret);
        this.key = Keys.hmacShaKeyFor(secretBytes);
    }

    public String generateToken(String username, String role, int userId) {
        return Jwts.builder()
                .setSubject(username)          // <— subject is “username”
                .claim("role", role)
                .claim("userId", userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Jws<Claims> validateToken(String token) {
        return Jwts.parserBuilder()
                   .setSigningKey(key)
                   .build()
                   .parseClaimsJws(token);
    }

    /**
     * Parse the token (without throwing if expired) and return the “subject” (username/email).
     * You can call validateToken(token) first if you want to ensure it’s valid/unsigned, but
     * this convenience method both parses & returns the subject claim.
     */
    public String extractUsername(String token) {
        // parseClaimsJws() will throw if signature is invalid or token is malformed/expired.
        Jws<Claims> jws = Jwts.parserBuilder()
                              .setSigningKey(key)
                              .build()
                              .parseClaimsJws(token);
        return jws.getBody().getSubject();
    }
}

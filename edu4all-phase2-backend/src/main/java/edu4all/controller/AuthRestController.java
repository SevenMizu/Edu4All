// src/main/java/edu4all/controller/AuthRestController.java
package edu4all.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import edu4all.dto.AuthResponse;
import edu4all.dto.LoginRequest;
import edu4all.dto.ProfileResponse;
import edu4all.dto.RegistrationRequest;
import edu4all.model.auth.User;
import edu4all.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthRestController {

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegistrationRequest req) {
        try {
            if (User.existsByEmail(req.getEmail())) {
                return ResponseEntity.status(409).body("Email already in use");
            }
            User user = new User(
                    req.getUsername(),
                    req.getName(),
                    req.getEmail(),
                    req.getPassword(),
                    req.getType(),
                    req.getGrade(),
                    req.getCountry(),
                    req.getCurriculum(),
                    req.getProfilePictureUrl());
            user.saveToDatabase();

            int id = user.getId();
            // generate a JWT for the new user
            String token = jwtUtil.generateToken(user.getEmail(), user.getType(), id);

            return ResponseEntity.ok(new AuthResponse(
                    user.getUsername(),
                    user.getType(),
                    token,
                    id));

        } catch (IllegalArgumentException iae) {
            return ResponseEntity.badRequest().body(iae.getMessage());
        } catch (SQLException sqle) {
            return ResponseEntity.status(500).body("Registration failed");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            boolean valid = User.authenticate(req.getEmail(), req.getPassword());
            if (!valid) {
                return ResponseEntity.status(401).body("Invalid credentials");
            }
            User user = User.findByEmail(req.getEmail());
            int id = user.getId();
            String token = jwtUtil.generateToken(user.getEmail(), user.getType(), id);
            return ResponseEntity.ok(new AuthResponse(
                    user.getUsername(), user.getType(), token, id));
        } catch (SQLException sqle) {
            return ResponseEntity.status(500).body("Login failed");
        }
    }

    /**
     * GET /api/auth/me
     * Clients must send “Authorization: Bearer <token>” in the header.
     * Returns a ProfileResponse containing:
     *   { id, username, name, email, type, grade, country, curriculum, profilePictureUrl }
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            // 1) Check “Bearer <token>”
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Missing or invalid Authorization header");
            }
            String token = authorizationHeader.substring(7); // strip “Bearer ”

            // 2) Extract the subject (username/email) from the token
            String email = jwtUtil.extractUsername(token);
            if (email == null) {
                return ResponseEntity.status(401).body("Invalid token");
            }

            // 3) Find the user in the DB
            User user = User.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }

            // 4) Build a ProfileResponse (nine parameters, with grade as String)
            ProfileResponse profile = new ProfileResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getName(),
                    user.getEmail(),
                    user.getType(),
                    user.getGrade(),             // now a String
                    user.getCountry(),
                    user.getCurriculum(),
                    user.getProfilePictureUrl()
            );
            return ResponseEntity.ok(profile);

        } catch (Exception e) {
            // If parsing token fails or any other exception
            return ResponseEntity.status(500).body("Could not retrieve profile: " + e.getMessage());
        }
    }

    /**
     * Allow the user to update their own profile.
     * Consumes multipart/form-data:
     *   - username, name, email, password (optional), country, type
     *   - grade, curriculum (only if type != mentor)
     *   - profilePicture (file) (optional)
     */
    @PutMapping(
        value = "/me",
        consumes = { "multipart/form-data" }
    )
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam("username") String username,
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam("country") String country,
            @RequestParam("type") String type,
            @RequestParam(value = "grade", required = false) String grade,
            @RequestParam(value = "curriculum", required = false) String curriculum,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture
    ) {
        try {
            // 1) Validate Bearer token
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Missing or invalid Authorization header");
            }
            String token = authorizationHeader.substring(7);
            String currentEmail = jwtUtil.extractUsername(token);
            if (currentEmail == null) {
                return ResponseEntity.status(401).body("Invalid token");
            }

            // 2) Load existing user
            User user = User.findByEmail(currentEmail);
            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }

            // 3) Update basic fields
            user.setUsername(username);
            user.setName(name);
            user.setEmail(email);
            if (password != null && !password.isBlank()) {
                user.setPassword(password); // hashes internally
            }
            user.setCountry(country);
            user.setType(type);
            if (!"mentor".equalsIgnoreCase(type)) {
                user.setGrade(grade);
                user.setCurriculum(curriculum);
            } else {
                user.setGrade(null);
                user.setCurriculum(null);
            }

            // 4) Handle profile picture upload (if provided)
            if (profilePicture != null && !profilePicture.isEmpty()) {
                // Save into: src/main/resources/static/uploads
                Path uploadDir = Paths.get("src", "main", "resources", "static", "uploads");
                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                }

                String originalFilename = StringUtils.cleanPath(profilePicture.getOriginalFilename());
                if (originalFilename.isBlank()) {
                    return ResponseEntity.status(400).body("Profile picture has no filename");
                }

                int dotIdx = originalFilename.lastIndexOf('.');
                String baseName = (dotIdx > 0 ? originalFilename.substring(0, dotIdx) : originalFilename)
                                      .toLowerCase().replaceAll("\\s+", "_");
                String ext = (dotIdx > 0 ? originalFilename.substring(dotIdx) : "");
                String uniqueName = baseName + "_" + user.getId() + "_" + System.currentTimeMillis() + ext;

                Path targetPath = uploadDir.resolve(uniqueName);
                try {
                    Files.copy(profilePicture.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
                    String publicUrl = "/uploads/" + uniqueName;
                    user.setProfilePictureUrl(publicUrl);
                } catch (IOException ioex) {
                    return ResponseEntity.status(500).body("Failed to save profile picture");
                }
            }

            // 5) Persist changes
            user.updateInDatabase();

            // 6) Return updated profile
            ProfileResponse updated = new ProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getName(),
                user.getEmail(),
                user.getType(),
                user.getGrade(),
                user.getCountry(),
                user.getCurriculum(),
                user.getProfilePictureUrl()
            );
            return ResponseEntity.ok(updated);

        } catch (SQLException sqle) {
            return ResponseEntity.status(500).body("Database error: " + sqle.getMessage());
        } catch (IOException ioe) {
            return ResponseEntity.status(500).body("Could not write upload directory: " + ioe.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating profile: " + e.getMessage());
        }
    }

}

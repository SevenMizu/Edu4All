// src/main/java/edu4all/model/auth/User.java
package edu4all.model.auth;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import edu4all.config.DatabaseConnection;
import edu4all.security.PasswordUtil;

/**
 * Represents a user and handles persistence to the database.
 */
public class User {
    private int id;
    private String username;
    private String name;
    private String email;
    private String password; // Will store hashed password when updating
    private String type; // e.g. "student", "mentor", "administrator"
    private String grade;
    private String country;
    private String curriculum;
    private String profilePictureUrl;

    /**
     * Constructs a User with the given properties.
     */
    public User(int id,
                String username,
                String name,
                String email,
                String password,
                String type,
                String grade, 
                String country,
                String curriculum,
                String profilePictureUrl) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.password = password; // could be null when loading from DB
        this.type = type;
        this.grade = grade;
        this.country = country;
        this.curriculum = curriculum;
        this.profilePictureUrl = profilePictureUrl;
    }

    /**
     * Constructs a User before it’s saved to the database.
     * The database will assign the real user_id later.
     */
    public User(String username,
                String name,
                String email,
                String password,
                String type,
                String grade,
                String country,
                String curriculum,
                String profilePictureUrl) {
        // pass a dummy id (0) into the main constructor
        this(0,
             username,
             name,
             email,
             password,
             type,
             grade,
             country,
             curriculum,
             profilePictureUrl);
    }

    /**
     * Saves this User into the User table, hashing the password with BCrypt.
     * 
     * @throws IllegalArgumentException if the user type is invalid.
     * @throws SQLException             on any database error.
     */
    public void saveToDatabase() throws SQLException {
        String lookupSql = "SELECT usertype_id FROM usertype WHERE user_type = ?";
        String insertSql =
            "INSERT INTO users " +
            "(username, name, email, password, usertype_id, grade, country, curriculum, profile_picture_url, active_status) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement lookupPs = conn.prepareStatement(lookupSql)) {

            // 1) Resolve the type string into its primary key
            lookupPs.setString(1, type);
            try (ResultSet rs = lookupPs.executeQuery()) {
                if (!rs.next()) {
                    throw new IllegalArgumentException("Unknown user type: " + type);
                }
                int typeId = rs.getInt("usertype_id");

                // 2) Hash the plaintext password
                String hashedPwd = PasswordUtil.hashPassword(this.password);

                // 3) Insert the new user record
                try (PreparedStatement insertPs = conn.prepareStatement(insertSql, PreparedStatement.RETURN_GENERATED_KEYS)) {
                    insertPs.setString(1, username);
                    insertPs.setString(2, name);
                    insertPs.setString(3, email);
                    insertPs.setString(4, hashedPwd);
                    insertPs.setInt(5, typeId);
                    insertPs.setString(6, grade);
                    insertPs.setString(7, country);
                    insertPs.setString(8, curriculum);
                    insertPs.setString(9, profilePictureUrl);
                    insertPs.executeUpdate();

                    // Retrieve generated ID
                    try (ResultSet generatedKeys = insertPs.getGeneratedKeys()) {
                        if (generatedKeys.next()) {
                            this.id = generatedKeys.getInt(1);
                        }
                    }

                    // Clear plaintext password reference for security
                    this.password = null;
                }
            }
        }
    }

    /**
     * Updates this User’s record in the database.
     * If password is non-null, updates the password column; otherwise leaves it unchanged.
     * Looks up usertype_id based on the type string.
     * 
     * @throws SQLException on any database error.
     */
    public void updateInDatabase() throws SQLException {
        String lookupTypeSql = "SELECT usertype_id FROM usertype WHERE user_type = ?";
        int typeId;

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement lookupPs = conn.prepareStatement(lookupTypeSql)) {
            lookupPs.setString(1, this.type);
            try (ResultSet rs = lookupPs.executeQuery()) {
                if (!rs.next()) {
                    throw new IllegalArgumentException("Unknown user type: " + this.type);
                }
                typeId = rs.getInt("usertype_id");
            }
        }

        // If password is set (hashed), include it in the UPDATE; otherwise skip password column
        if (this.password != null && !this.password.isBlank()) {
            String updateSql =
                "UPDATE users SET " +
                "username = ?, name = ?, email = ?, password = ?, usertype_id = ?, " +
                "grade = ?, country = ?, curriculum = ?, profile_picture_url = ? " +
                "WHERE user_id = ?";
            try (Connection conn = DatabaseConnection.getConnection();
                 PreparedStatement ps = conn.prepareStatement(updateSql)) {
                ps.setString(1, this.username);
                ps.setString(2, this.name);
                ps.setString(3, this.email);
                ps.setString(4, this.password); // hashed password
                ps.setInt(5, typeId);
                ps.setString(6, this.grade);
                ps.setString(7, this.country);
                ps.setString(8, this.curriculum);
                ps.setString(9, this.profilePictureUrl);
                ps.setInt(10, this.id);
                ps.executeUpdate();
            }
        } else {
            String updateSql =
                "UPDATE users SET " +
                "username = ?, name = ?, email = ?, usertype_id = ?, " +
                "grade = ?, country = ?, curriculum = ?, profile_picture_url = ? " +
                "WHERE user_id = ?";
            try (Connection conn = DatabaseConnection.getConnection();
                 PreparedStatement ps = conn.prepareStatement(updateSql)) {
                ps.setString(1, this.username);
                ps.setString(2, this.name);
                ps.setString(3, this.email);
                ps.setInt(4, typeId);
                ps.setString(5, this.grade);
                ps.setString(6, this.country);
                ps.setString(7, this.curriculum);
                ps.setString(8, this.profilePictureUrl);
                ps.setInt(9, this.id);
                ps.executeUpdate();
            }
        }

        // Clear the in-memory plain password after updating (if used)
        this.password = null;
    }

    /**
     * Checks if the given email is already registered.
     *
     * @throws SQLException on any database error.
     * @return true if at least one record exists with this email.
     */
    public static boolean existsByEmail(String email) throws SQLException {
        String sql = "SELECT COUNT(*) FROM users WHERE email = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                return rs.getInt(1) > 0;
            }
        }
    }

    /**
     * Authenticates a user by email and plaintext password.
     *
     * @throws SQLException on any database error.
     * @return true if the email exists and the password matches the stored hash.
     */
    public static boolean authenticate(String email, String plainPassword) throws SQLException {
        String sql = "SELECT password FROM users WHERE email = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    String storedHash = rs.getString("password");
                    return PasswordUtil.checkPassword(plainPassword, storedHash);
                }
                return false;
            }
        }
    }

    /**
     * Finds and returns a User by email (without the plaintext password).
     *
     * @throws SQLException on any database error.
     * @return a User object populated from the DB, or null if not found.
     */
    public static User findByEmail(String email) throws SQLException {
        String sql =
            "SELECT u.user_id, u.username, u.name, u.email, t.user_type, " +
            "u.grade, u.country, u.curriculum, u.profile_picture_url " +
            "FROM users u " +
            "JOIN usertype t ON u.usertype_id = t.usertype_id " +
            "WHERE u.email = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new User(
                        rs.getInt("user_id"),
                        rs.getString("username"),
                        rs.getString("name"),
                        rs.getString("email"),
                        null, // password not loaded here
                        rs.getString("user_type"),
                        rs.getString("grade"),
                        rs.getString("country"),
                        rs.getString("curriculum"),
                        rs.getString("profile_picture_url")
                    );
                }
                return null;
            }
        }
    }

    public static User findByUsername(String username) {
        String sql =
            "SELECT u.user_id, u.username, u.name, u.email, t.user_type, " +
            "u.grade, u.country, u.curriculum, u.profile_picture_url " +
            "FROM users u " +
            "JOIN usertype t ON u.usertype_id = t.usertype_id " +
            "WHERE u.username = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, username);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new User(
                        rs.getInt("user_id"),
                        rs.getString("username"),
                        rs.getString("name"),
                        rs.getString("email"),
                        null, // password not loaded here
                        rs.getString("user_type"),
                        rs.getString("grade"),
                        rs.getString("country"),
                        rs.getString("curriculum"),
                        rs.getString("profile_picture_url")
                    );
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    // --- Getters ---

    public int getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getType() {
        return type;
    }

    public String getGrade() {
        return grade;
    }

    public String getCountry() {
        return country;
    }

    public String getCurriculum() {
        return curriculum;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    // --- Setters for update functionality ---

    public void setUsername(String username) {
        this.username = username;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Hashes and sets the password for updating.
     */
    public void setPassword(String rawPassword) {
        if (rawPassword != null && !rawPassword.isBlank()) {
            this.password = PasswordUtil.hashPassword(rawPassword);
        }
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public void setCurriculum(String curriculum) {
        this.curriculum = curriculum;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }
}

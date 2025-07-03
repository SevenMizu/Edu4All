// src/main/java/edu4all/config/DatabaseConnection.java
package edu4all.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {

    // Always returns a NEW Connection. Caller must close it (try-with-resources).
    public static Connection getConnection() throws SQLException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            // This should never happen if your driver is on the classpath
            throw new RuntimeException("MySQL JDBC Driver not found", e);
        }

        String url      = "jdbc:mysql://148.66.135.154:3306/aitiaa_edu4all"
                        + "?useSSL=true&autoReconnect=true&serverTimezone=UTC";
        String username = "aitiaa_edu4all";
        String password = "edu4all12355@";

        // Always return a brand-new connection
        return DriverManager.getConnection(url, username, password);
    }
}

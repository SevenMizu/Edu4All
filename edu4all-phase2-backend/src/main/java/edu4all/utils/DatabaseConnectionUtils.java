// src/main/java/edu4all/utils/DatabaseConnectionUtils.java
package edu4all.utils;

import java.sql.Connection;
import java.sql.SQLException;

import edu4all.config.DatabaseConnection;

public class DatabaseConnectionUtils {

  /** 
   * Open a Connection, run your lambda, and return whatever type T it produces.
   */
  public static <T> T connection(Function<T> function) {
    try (Connection c = DatabaseConnection.getConnection()) {
      if (c == null) {
        throw new RuntimeException("Connection failed.");
      }
      System.out.println("Connection successful!\n");
      return function.run(c);
    } catch (SQLException e) {
      System.err.println("Error with DB connectionxx: " + e.getMessage());
      throw new RuntimeException(e);
    }
  }

  /** A simple functional interface that can return any type T. */
  @FunctionalInterface
  public interface Function<T> {
    /** Your code can throw SQLException or any unchecked exception. */
    T run(Connection c) throws SQLException;
  }
}

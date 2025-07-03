package edu4all.security;

import org.mindrot.jbcrypt.BCrypt;

/**
 * Utility for hashing and verifying passwords with BCrypt.
 */
public class PasswordUtil {

  /**
   * Hashes a plain-text password using BCrypt.
   * 
   * @param plainPassword The password in plain text.
   * @return The BCrypt hash, including salt.
   */
  public static String hashPassword(String plainPassword) {
    return BCrypt.hashpw(plainPassword, BCrypt.gensalt(12)); // [UPDATED] work factor = 12
  }

  /**
   * Checks a plain-text password against a stored BCrypt hash.
   * 
   * @param plainPassword The user-supplied password.
   * @param hashed        The BCrypt hash from storage.
   * @return true if match, false otherwise.
   */
  public static boolean checkPassword(String plainPassword, String hashed) {
    if (hashed == null || !hashed.startsWith("$2a$")) {
      throw new IllegalArgumentException("Invalid BCrypt hash"); // English comment
    }
    return BCrypt.checkpw(plainPassword, hashed);
  }
}

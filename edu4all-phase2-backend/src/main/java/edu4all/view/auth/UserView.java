package edu4all.view.auth;

import java.util.Scanner;

import edu4all.model.auth.User;

/**
 * Handles console input/output for user registration.
 */
public class UserView {
  private Scanner scanner = new Scanner(System.in);
  // Default avatar URL for all new users
  private static final String DEFAULT_AVATAR_URL = "https://cdn.myapp.com/avatars/default.png";

  /** Prompts the user for registration details and returns a User object. */
  public User getRegistrationInfo() {
    System.out.println("===== Register =====");

    System.out.print("Enter user role (student/mentor/administrator): ");
    String type = scanner.nextLine().toLowerCase().trim();

    System.out.print("Enter username: ");
    String username = scanner.nextLine();

    System.out.print("Enter name: ");
    String name = scanner.nextLine();

    System.out.print("Enter email: ");
    String email = scanner.nextLine();

    System.out.print("Enter password: ");
    String password = scanner.nextLine();

    System.out.print("Enter country: ");
    String country = scanner.nextLine();

    String grade = null;
    String curriculum = null;

    if (type.equals("student")) {
      System.out.print("Enter grade: ");
      grade = scanner.nextLine();

      System.out.print("Enter curriculum: ");
      curriculum = scanner.nextLine();

    } else if (type.equals("mentor") || type.equals("administrator")) {

    } else {
      showInvalidUserTypeError();
      return null;
    }
    // always give new users the default avatar
    String pictureUrl = DEFAULT_AVATAR_URL;

    return new User(
        username,
        name,
        email,
        password,
        type,
        grade,
        country,
        curriculum,
        pictureUrl);
  }

  /** Successful registration. */
  public void showSuccess(User user) {
    System.out.println("Registration successful!");
    System.out.println("Welcome, " + user.getUsername() + " from " + user.getCountry());
    System.out.println("Your password has been securely encrypted.");
  }

  /** General error display. */
  private void showError(String message) {
    System.out.println("Error: " + message);
  }

  // Specific error cases moved here:

  /** User input was invalid. */
  public void showInvalidInputError() {
    showError("Registration aborted due to invalid input.");
  }

  /** Invalid role entered. */
  public void showInvalidUserTypeError() {
    showError("Invalid user type. Must be 'student', 'mentor' or 'administrator'.");
  }

  /** Duplicate email detected. */
  public void showDuplicateEmailError() {
    showError("Email already registered. Please use a different email.");
  }

  /** Database save failure. */
  public void showSaveError() {
    showError("Failed to save user to the database. Please try again later. Your password was not stored.");
  }
}

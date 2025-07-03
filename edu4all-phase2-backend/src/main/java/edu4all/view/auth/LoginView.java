package edu4all.view.auth;

import java.util.Scanner;

/**
 * Handles console input/output for user login.
 */
public class LoginView {
  private final Scanner scanner = new Scanner(System.in);

  /**
   * Prompts the user for email and password, returns them as a Credentials
   * object.
   */
  public Credentials getLoginInfo() {
    System.out.println("===== Login =====");
    System.out.print("Enter email: ");
    String email = scanner.nextLine().trim();
    System.out.print("Enter password: ");
    String password = scanner.nextLine();
    return new Credentials(email, password);
  }

  /** Called on successful login. */
  public void showLoginSuccess(String username, String type) {
    System.out.println("\nLogin successful!");
    System.out.println("Welcome back, " + username + " (" + type + ")");
  }

  /** Called when authentication fails. */
  public void showLoginError() {
    System.out.println("\nError: Invalid email or password.");
  }
}

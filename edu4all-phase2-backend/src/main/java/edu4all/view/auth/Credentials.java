package edu4all.view.auth;

/**
 * Simple DTO for carrying login credentials.
 */
public class Credentials {
  private final String email;
  private final String password;

  public Credentials(String email, String password) {
    this.email = email;
    this.password = password;
  }

  public String getEmail() {
    return email;
  }

  public String getPassword() {
    return password;
  }
}

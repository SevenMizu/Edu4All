package edu4all.controller.auth;

import java.sql.SQLException;

import edu4all.controller.StudentController;
import edu4all.model.auth.User;
import edu4all.view.auth.Credentials;
import edu4all.view.auth.LoginView;

public class LoginController {
  private final LoginView view;

  public LoginController(LoginView view) {
    this.view = view;
  }

  /**
   * Collects credentials, attempts authentication, and then
   * dispatches into the student or mentor workflow.
   */
  public void loginUser() {
    Credentials creds = view.getLoginInfo();
    try {
      boolean valid = User.authenticate(creds.getEmail(), creds.getPassword());
      if (valid) {
        // 1) load full user
        User user = User.findByEmail(creds.getEmail());
        // 2) show welcome message
        view.showLoginSuccess(user.getUsername(), user.getType());

        // 3) dispatch by role
        switch (user.getType()) {
          case "student":
            new StudentController(user).runMenu();
            break;
          case "mentor":
            // new MentorController(user).runMenu();
            break;
          default:
            System.out.println("No menu available for role: " + user.getType());
        }

      } else {
        view.showLoginError();
      }
    } catch (SQLException e) {
      e.printStackTrace();
      view.showLoginError();
    }
  }
}

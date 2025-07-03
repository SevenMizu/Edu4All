// File: src/main/java/controller/auth/UserController.java
package edu4all.controller.auth;

import java.sql.SQLException; // [UPDATED] import for SQLException

import edu4all.model.auth.User;
import edu4all.view.auth.UserView;

/**
 * Controls the registration workflow.
 */
public class UserController {
  private final UserView view;

  public UserController(UserView view) {
    this.view = view;
  }

  /**
   * Orchestrates collecting input, validating, and saving the user.
   */
  public void registerUser() {
    User user = view.getRegistrationInfo();

    if (user == null) {
      view.showInvalidInputError();
      return;
    }

    try {
      // Check for duplicate email (may throw SQLException)
      if (User.existsByEmail(user.getEmail())) {
        view.showDuplicateEmailError();
        return;
      }

      // Save to database (may throw IllegalArgumentException or SQLException)
      user.saveToDatabase();
      view.showSuccess(user);

    } catch (IllegalArgumentException iae) {
      // e.g. unknown user type
      view.showInvalidUserTypeError();

    } catch (SQLException sqle) {
      // any DB error during existsByEmail() or saveToDatabase()
      sqle.printStackTrace();
      view.showSaveError();
    }
  }
}

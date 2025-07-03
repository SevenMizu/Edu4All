package edu4all.controller;

import edu4all.controller.audio_video_sessions.UnsubscribeController;
import edu4all.model.audio_video_sessions.UserSessionDAO;
import edu4all.model.auth.User;
import edu4all.view.StudentView;
import edu4all.view.audio_video_sessions.UnsubscribeView;

public class StudentController {
  private final User user;
  private final StudentView view;

  public StudentController(User user) {
    this.user = user;
    this.view = new StudentView(user.getId());
  }

  public void runMenu() {
    while (true) {
      int choice = view.showMenuAndGetChoice();
      switch (choice) {
        case 1:
          // … other student actions …
          break;
        case 2:
          // Unsubscribe flow bound to current user:
          UnsubscribeController unCtrl = new UnsubscribeController(
              user.getId(),
              new UnsubscribeView(),
              new UserSessionDAO());
          unCtrl.unsubscribe();
          break;
        case 0:
          return; // logout or return to top‐level menu
        default:
          view.showInvalidOption();
      }
    }
  }
}
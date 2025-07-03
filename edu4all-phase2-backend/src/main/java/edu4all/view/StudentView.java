package edu4all.view;

import java.util.Scanner;

/**
 * Handles console input/output for the student menu.
 */
public class StudentView {
    private final Scanner scanner = new Scanner(System.in);
    private final int userId;

    public StudentView(int userId) {
        this.userId = userId;
    }

    /**
     * Displays the student menu and reads the user's choice.
     * 
     * @return 1 = join a session, 2 = unsubscribe, 0 = logout
     */
    public int showMenuAndGetChoice() {
        System.out.println("\n=== Student Menu ===");
        System.out.println("1) Join a video session");
        System.out.println("2) Unsubscribe from a session");
        System.out.println("0) Logout");
        System.out.print("Your choice: ");
        System.out.println("Student ID : " + userId);
        String line = scanner.nextLine().trim();
        try {
            return Integer.parseInt(line);
        } catch (NumberFormatException e) {
            return -1; // invalid input
        }
    }

    /**
     * Informs the user that their menu selection was invalid.
     */
    public void showInvalidOption() {
        System.out.println("Invalid option. Please enter 1, 2, or 0.");
    }
}

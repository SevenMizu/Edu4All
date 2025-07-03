package edu4all.view.audio_video_sessions;

import java.util.Scanner;

public class UnsubscribeView {
    private final Scanner scanner = new Scanner(System.in);

    public int promptForSessionId() {
        System.out.print("Enter session ID to unsubscribe: ");
        return Integer.parseInt(scanner.nextLine().trim());
    }

    public void showSuccess(int sessionId) {
        System.out.println("You have been unsubscribed from session " + sessionId + ".");
    }

    public void showFailure(int sessionId) {
        System.out.println("No subscription found for session " + sessionId + ".");
    }

    public void showError(String msg) {
        System.err.println("Error: " + msg);
    }
}

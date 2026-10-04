package com.krrish.studentmanagement.util;

import java.util.Scanner;

/**
 * Utility class for robust console input validation.
 * Prevents Scanner crashes (e.g., InputMismatchException) and handles newline buffer clearing.
 */
public class InputUtil {

    /**
     * Reads a valid integer from the user.
     */
    public static int readInt(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String input = scanner.nextLine().trim();
            try {
                return Integer.parseInt(input);
            } catch (NumberFormatException e) {
                System.out.println("❌ Invalid input! Please enter a valid whole number.");
            }
        }
    }

    /**
     * Reads an integer within an inclusive range [min, max].
     */
    public static int readIntInRange(Scanner scanner, String prompt, int min, int max) {
        while (true) {
            int val = readInt(scanner, prompt);
            if (val >= min && val <= max) {
                return val;
            }
            System.out.println("❌ Value must be between " + min + " and " + max + ".");
        }
    }

    /**
     * Reads a double value within an inclusive range [min, max].
     */
    public static double readDoubleInRange(Scanner scanner, String prompt, double min, double max) {
        while (true) {
            System.out.print(prompt);
            String input = scanner.nextLine().trim();
            try {
                double val = Double.parseDouble(input);
                if (val >= min && val <= max) {
                    return val;
                }
                System.out.println("❌ Value must be between " + min + " and " + max + ".");
            } catch (NumberFormatException e) {
                System.out.println("❌ Invalid input! Please enter a valid decimal number.");
            }
        }
    }

    /**
     * Reads a non-empty string.
     */
    public static String readNonEmptyString(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String input = scanner.nextLine().trim();
            if (!input.isEmpty()) {
                return input;
            }
            System.out.println("❌ Input cannot be empty! Please try again.");
        }
    }

    /**
     * Reads and validates an email format.
     */
    public static String readEmail(Scanner scanner, String prompt) {
        while (true) {
            String email = readNonEmptyString(scanner, prompt);
            if (email.contains("@") && email.contains(".") && email.indexOf("@") < email.lastIndexOf(".")) {
                return email;
            }
            System.out.println("❌ Invalid email format! (Example: krrish@college.edu)");
        }
    }

    /**
     * Reads and validates a 10-digit phone number.
     */
    public static String readPhone(Scanner scanner, String prompt) {
        while (true) {
            String phone = readNonEmptyString(scanner, prompt);
            boolean isAllDigits = true;
            for (int i = 0; i < phone.length(); i++) {
                if (!Character.isDigit(phone.charAt(i))) {
                    isAllDigits = false;
                    break;
                }
            }
            if (isAllDigits && phone.length() == 10) {
                return phone;
            }
            System.out.println("❌ Phone number must be exactly 10 digits without spaces or symbols.");
        }
    }
}

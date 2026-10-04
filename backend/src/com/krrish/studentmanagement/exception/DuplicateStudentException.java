package com.krrish.studentmanagement.exception;

/**
 * Thrown when trying to register a student with a roll number that already exists.
 */
public class DuplicateStudentException extends Exception {
    private static final long serialVersionUID = 1L;

    public DuplicateStudentException(String message) {
        super(message);
    }
}

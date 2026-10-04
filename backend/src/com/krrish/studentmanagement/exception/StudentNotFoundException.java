package com.krrish.studentmanagement.exception;

/**
 * Thrown when an operation expects a student that does not exist in the collection.
 */
public class StudentNotFoundException extends Exception {
    private static final long serialVersionUID = 1L;

    public StudentNotFoundException(String message) {
        super(message);
    }
}

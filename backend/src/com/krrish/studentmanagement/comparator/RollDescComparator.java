package com.krrish.studentmanagement.comparator;

import com.krrish.studentmanagement.model.Student;
import java.util.Comparator;

/**
 * Sorts students by roll number in descending order (e.g., 105, 104, 103...).
 */
public class RollDescComparator implements Comparator<Student> {
    @Override
    public int compare(Student s1, Student s2) {
        return Integer.compare(s2.getRollNumber(), s1.getRollNumber());
    }
}

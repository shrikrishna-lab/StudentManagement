package com.krrish.studentmanagement.comparator;

import com.krrish.studentmanagement.model.Student;
import java.util.Comparator;

/**
 * Sorts students by roll number in ascending order (e.g., 101, 102, 103...).
 */
public class RollAscComparator implements Comparator<Student> {
    @Override
    public int compare(Student s1, Student s2) {
        return Integer.compare(s1.getRollNumber(), s2.getRollNumber());
    }
}

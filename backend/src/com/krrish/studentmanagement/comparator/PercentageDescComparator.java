package com.krrish.studentmanagement.comparator;

import com.krrish.studentmanagement.model.Student;
import java.util.Comparator;

/**
 * Sorts students by percentage in descending order (highest to lowest/topper first).
 */
public class PercentageDescComparator implements Comparator<Student> {
    @Override
    public int compare(Student s1, Student s2) {
        return Double.compare(s2.getPercentage(), s1.getPercentage());
    }
}

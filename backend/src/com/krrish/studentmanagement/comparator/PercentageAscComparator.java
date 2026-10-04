package com.krrish.studentmanagement.comparator;

import com.krrish.studentmanagement.model.Student;
import java.util.Comparator;

/**
 * Sorts students by percentage in ascending order (lowest to highest).
 */
public class PercentageAscComparator implements Comparator<Student> {
    @Override
    public int compare(Student s1, Student s2) {
        return Double.compare(s1.getPercentage(), s2.getPercentage());
    }
}

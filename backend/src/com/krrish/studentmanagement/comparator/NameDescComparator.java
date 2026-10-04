package com.krrish.studentmanagement.comparator;

import com.krrish.studentmanagement.model.Student;
import java.util.Comparator;

/**
 * Sorts students alphabetically by name in descending order (Z to A), case-insensitive.
 */
public class NameDescComparator implements Comparator<Student> {
    @Override
    public int compare(Student s1, Student s2) {
        return s2.getName().compareToIgnoreCase(s1.getName());
    }
}

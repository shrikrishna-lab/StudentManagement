package com.krrish.studentmanagement.comparator;

import com.krrish.studentmanagement.model.Student;
import java.util.Comparator;

/**
 * Sorts students alphabetically by name (A to Z), case-insensitive.
 */
public class NameAscComparator implements Comparator<Student> {
    @Override
    public int compare(Student s1, Student s2) {
        return s1.getName().compareToIgnoreCase(s2.getName());
    }
}

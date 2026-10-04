package com.krrish.studentmanagement.model;

/**
 * Model class representing a Student entity.
 * Aligned with the MySQL 'students' table schema:
 * - id (Primary Key, Auto Increment)
 * - rollNumber (Unique)
 * - name, email, phone, course, year, division, percentage
 */
public class Student implements Comparable<Student> {
    private int id;
    private int rollNumber;
    private String prn;
    private String name;
    private String email;
    private String phone;
    private String course;
    private int year;
    private String division;
    private double percentage;

    // Default Constructor
    public Student() {
    }

    // Constructor without id
    public Student(int rollNumber, String name, String email, String phone,
                   String course, int year, String division, double percentage) {
        this.rollNumber = rollNumber;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.course = course;
        this.year = year;
        this.division = division;
        this.percentage = percentage;
        this.prn = String.format("RBT24%s%03d", course != null ? course.toUpperCase() : "IT", rollNumber);
    }

    // Constructor with prn
    public Student(int rollNumber, String prn, String name, String email, String phone,
                   String course, int year, String division, double percentage) {
        this.rollNumber = rollNumber;
        this.prn = prn;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.course = course;
        this.year = year;
        this.division = division;
        this.percentage = percentage;
    }

    // Constructor with id (used when reading existing records from MySQL ResultSet)
    public Student(int id, int rollNumber, String name, String email, String phone,
                   String course, int year, String division, double percentage) {
        this.id = id;
        this.rollNumber = rollNumber;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.course = course;
        this.year = year;
        this.division = division;
        this.percentage = percentage;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(int rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getPrn() {
        if (prn == null || prn.isEmpty()) {
            return String.format("RBT24%s%03d", course != null ? course.toUpperCase() : "IT", rollNumber);
        }
        return prn;
    }

    public void setPrn(String prn) {
        this.prn = prn;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public String getDivision() {
        return division;
    }

    public void setDivision(String division) {
        this.division = division;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }

    /**
     * Natural ordering by rollNumber (ascending).
     */
    @Override
    public int compareTo(Student other) {
        return Integer.compare(this.rollNumber, other.rollNumber);
    }

    @Override
    public String toString() {
        return String.format(
            "ID: %-3d | Roll: %-4d | Name: %-18s | Course: %-8s | Year: %d | Div: %-2s | %%: %-5.2f | Phone: %-10s | Email: %s",
            id, rollNumber, name, course, year, division, percentage, phone, email
        );
    }
}

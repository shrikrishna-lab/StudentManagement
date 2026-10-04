package com.krrish.studentmanagement.model;

/**
 * Model representing an Examination Paper / Session.
 * Combines Theory Written, Practical Lab Viva, and Project Defense sessions.
 */
public class ExamSchedule {
    private int id;
    private String paperCode;
    private String subjectName;
    private String semester;
    private String date;
    private String day;
    private String time;
    private String shift;
    private String duration;
    private int marks;
    private double credits;
    private String examType;
    private String room;
    private String seatingBlock;
    private String invigilator;
    private boolean isPublished;

    public ExamSchedule() {}

    public ExamSchedule(String paperCode, String subjectName, String semester, String date,
                        String day, String time, String shift, String duration, int marks,
                        double credits, String examType, String room, String seatingBlock,
                        String invigilator, boolean isPublished) {
        this.paperCode = paperCode;
        this.subjectName = subjectName;
        this.semester = semester;
        this.date = date;
        this.day = day;
        this.time = time;
        this.shift = shift;
        this.duration = duration;
        this.marks = marks;
        this.credits = credits;
        this.examType = examType;
        this.room = room;
        this.seatingBlock = seatingBlock;
        this.invigilator = invigilator;
        this.isPublished = isPublished;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getPaperCode() { return paperCode; }
    public void setPaperCode(String paperCode) { this.paperCode = paperCode; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getShift() { return shift; }
    public void setShift(String shift) { this.shift = shift; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public int getMarks() { return marks; }
    public void setMarks(int marks) { this.marks = marks; }

    public double getCredits() { return credits; }
    public void setCredits(double credits) { this.credits = credits; }

    public String getExamType() { return examType; }
    public void setExamType(String examType) { this.examType = examType; }

    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }

    public String getSeatingBlock() { return seatingBlock; }
    public void setSeatingBlock(String seatingBlock) { this.seatingBlock = seatingBlock; }

    public String getInvigilator() { return invigilator; }
    public void setInvigilator(String invigilator) { this.invigilator = invigilator; }

    public boolean isPublished() { return isPublished; }
    public void setPublished(boolean published) { isPublished = published; }

    @Override
    public String toString() {
        return String.format("[%s] %-38s | %s (%s) | %s | %-12s | %s",
                paperCode, subjectName, date, day.substring(0, Math.min(3, day.length())),
                time, room, examType);
    }
}

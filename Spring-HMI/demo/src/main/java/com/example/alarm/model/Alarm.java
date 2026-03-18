package com.example.alarm.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Alarms")
public class Alarm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false)
    private String code;
    
    @Column(nullable = false)
    private String message;
    
    @Column(nullable = false)
    private String severity; 
    
    @Column(nullable = false)
    private boolean isAcknowledged;

    // Default Constructor (Required by Hibernate)
    public Alarm() {
    }

    // Parameterized Constructor
    public Alarm(String code, String message, String severity, boolean isAcknowledged) {
        this.code = code;
        this.message = message;
        this.severity = severity;
        this.isAcknowledged = isAcknowledged;
    }

    // --- Getters and Setters ---
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public boolean getIsAcknowledged() {
        return isAcknowledged;
    }

    public void setIsAcknowledged(boolean isAcknowledged) {
        this.isAcknowledged = isAcknowledged;
    }
}
package com.example.alarm.repository;

import com.example.alarm.model.Alarm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlarmRepository extends JpaRepository<Alarm, Integer> {
    
    // Retrieves all alarms where isAcknowledged is false (Active alarms)
    List<Alarm> findByIsAcknowledgedFalse();
    
    // Retrieves all alarms where isAcknowledged is true (Cleared alarms) - ADD THIS LINE
    List<Alarm> findByIsAcknowledgedTrue();
    
    // Retrieves alarms filtered by their severity (High, Medium, Low)
    List<Alarm> findBySeverity(String severity);
    
    // Counts the total number of active alarms
    long countByIsAcknowledgedFalse();
    
    // Counts the total number of cleared (acknowledged) alarms
    long countByIsAcknowledgedTrue();
}
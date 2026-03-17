package com.example.alarm.repository;

import com.example.alarm.model.AlarmEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlarmEventRepository extends JpaRepository<AlarmEvent, Integer> {
    
    // Retrieves all events (history) associated with a specific alarm ID
    List<AlarmEvent> findByAlarmId(Integer alarmId);

    Optional<AlarmEvent> findByAlarmIdAndState(int alarmId, String state);

    
    // Retrieves the history of a specific alarm, ordered by the most recent events first
    List<AlarmEvent> findByAlarmIdOrderByTimestampDesc(Integer alarmId);
}
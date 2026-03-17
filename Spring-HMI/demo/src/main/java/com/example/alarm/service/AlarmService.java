package com.example.alarm.service;

import com.example.alarm.model.Alarm;
import com.example.alarm.model.AlarmEvent;
import com.example.alarm.repository.AlarmEventRepository;
import com.example.alarm.repository.AlarmRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AlarmService {
    private final AlarmRepository alarmRepository;
    private final AlarmEventRepository alarmEventRepository;

    public AlarmService(AlarmRepository alarmRepository, AlarmEventRepository alarmEventRepository) {
        this.alarmRepository = alarmRepository;
        this.alarmEventRepository = alarmEventRepository;
    }

    public List<Alarm> getActiveAlarms() {
        return alarmRepository.findByIsAcknowledgedFalse();
    }

    // OOP: Raise method (Used only manually or by our initial seeder now)
    @Transactional
    public Alarm raiseAlarm(String code, String message, String severity) {
        Alarm alarm = new Alarm(code, message, severity, false);
        alarm = alarmRepository.save(alarm);
        
        AlarmEvent event = new AlarmEvent();
        event.setAlarmId(alarm.getId());
        event.setTimestamp(LocalDateTime.now());
        event.setState("Active");
        alarmEventRepository.save(event);
        
        return alarm;
    }

    // OOP: Clear/Acknowledge method
    @Transactional
    public boolean clearAlarm(int id) {
        // 1. Find the event and immediately act on it if it exists
        return alarmEventRepository.findByAlarmIdAndState(id, "Active")
            .map(activeEvent -> {
                // If found, update the state
                activeEvent.setState("Cleared");
                activeEvent.setTimestamp(LocalDateTime.now());
                alarmEventRepository.save(activeEvent);

                // Update the main Alarm table
                alarmRepository.findById(id).ifPresent(alarm -> {
                    alarm.setIsAcknowledged(true);
                    alarmRepository.save(alarm);
                });

                return true; // Returns true to the map, which becomes the method result
            })
            .orElse(false); // If no 'Active' event was found, return false
    }

    // Add this to your AlarmService class
    @Transactional
    public void triggerRandomExistingAlarm() {
        // 1. Fetch all alarms that are currently cleared (isAcknowledged = true)
        List<Alarm> clearedAlarms = alarmRepository.findByIsAcknowledgedTrue();

        // 2. If there are cleared alarms available, pick a random one to activate
        if (!clearedAlarms.isEmpty()) {
            Random random = new Random();
            Alarm alarmToTrigger = clearedAlarms.get(random.nextInt(clearedAlarms.size()));

            // 3. Update the alarm to active
            alarmToTrigger.setIsAcknowledged(false);
            alarmRepository.save(alarmToTrigger);

            // 4. Create a new "Active" event in the history table
            AlarmEvent event = new AlarmEvent();
            event.setAlarmId(alarmToTrigger.getId());
            event.setTimestamp(LocalDateTime.now());
            event.setState("Active");
            alarmEventRepository.save(event);

            // 5. Print to console as requested by the project objectives
            System.out.println("Console: Random Alarm Raised - [" + alarmToTrigger.getSeverity() + "] " + alarmToTrigger.getMessage());
        }
    }

    public List<Map<String, Object>> getAlarmHistory() {
        List<Alarm> allAlarms = alarmRepository.findAll();
        
        // Cast to List if your repository returns an Iterable
        List<AlarmEvent> allEvents = (List<AlarmEvent>) alarmEventRepository.findAll();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss dd/MM/yyyy");

        return allEvents.stream()
                // 1. Filter for only the cleared events
                .filter(e -> "Cleared".equalsIgnoreCase(e.getState()))
                // 2. Sort so the newest clears are at the top
                .sorted((e1, e2) -> e2.getTimestamp().compareTo(e1.getTimestamp()))
                // 3. Map into a clean JSON object for Angular
                .map(event -> {
                    Map<String, Object> dto = new HashMap<>();
                    
                    // Find the matching parent alarm
                    Alarm parentAlarm = allAlarms.stream()
                            .filter(a -> String.valueOf(a.getId()).equals(String.valueOf(event.getAlarmId())))
                            .findFirst()
                            .orElse(null);

                    if (parentAlarm != null) {
                        dto.put("code", parentAlarm.getCode());
                        dto.put("message", parentAlarm.getMessage());
                        dto.put("severity", parentAlarm.getSeverity());
                    } else {
                        dto.put("code", "UNKNOWN");
                        dto.put("message", "Alarm data missing");
                        dto.put("severity", "LOW");
                    }
                    
                    dto.put("status", "CLEARED");
                    dto.put("clearedAt", event.getTimestamp() != null ? event.getTimestamp().format(formatter) : "");
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // ==========================================
    // NEW: MISSING METHOD ADDED HERE
    // ==========================================
    @Transactional
    public void clearAllHistory() {
        // Fetch all events
        Iterable<AlarmEvent> allEvents = alarmEventRepository.findAll();
        
        // Delete ONLY the events that are marked as "Cleared". 
        // This empties the history page, but leaves the hidden Alarm models 
        // so the random simulator can still use them!
        for (AlarmEvent event : allEvents) {
            if ("Cleared".equalsIgnoreCase(event.getState())) {
                alarmEventRepository.delete(event);
            }
        }
    }
}
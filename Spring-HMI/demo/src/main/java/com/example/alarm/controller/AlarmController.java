package com.example.alarm.controller;

import com.example.alarm.model.Alarm;
import com.example.alarm.service.AlarmService;
import com.example.alarm.repository.AlarmRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/Alarm")
@CrossOrigin(origins = "http://localhost:4200") // This allows Angular to communicate with Spring Boot
public class AlarmController {

    private final AlarmService alarmService;
    private final AlarmRepository alarmRepository;

    public AlarmController(AlarmService alarmService, AlarmRepository alarmRepository) {
        this.alarmService = alarmService;
        this.alarmRepository = alarmRepository;
    }

    // ================================
    // GET: /api/Alarm/active
    // Returns all ACTIVE alarms
    // ================================
    @GetMapping("/active")
    public ResponseEntity<List<Alarm>> getActiveAlarms() {
        return ResponseEntity.ok(alarmService.getActiveAlarms());
    }

    // ================================
    // POST: /api/Alarm/acknowledge/{id}
    // Clears/Acknowledges an alarm
    // ================================
    @PostMapping("/acknowledge/{id}")
    public ResponseEntity<?> acknowledge(@PathVariable int id) {
        boolean success = alarmService.clearAlarm(id);
        if (success) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ================================
    // GET: /api/Alarm/summary
    // Returns active vs cleared counts for the Donut Chart
    // ================================
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Long>> getSummary() {
        long activeCount = alarmRepository.countByIsAcknowledgedFalse();
        long clearedCount = alarmRepository.countByIsAcknowledgedTrue();

        return ResponseEntity.ok(Map.of(
                "active", activeCount,
                "cleared", clearedCount
        ));
    }

    // ================================
    // GET: /api/Alarm/all
    // Returns all alarms (History)
    // ================================
    @GetMapping("/all")
    public ResponseEntity<List<Alarm>> getAllAlarms() {
        return ResponseEntity.ok(alarmRepository.findAll());
    }

    // ================================
    // GET: /api/Alarm/history
    // Returns mapped cleared alarms
    // ================================
    @GetMapping("/history")
    public ResponseEntity<List<Map<String, Object>>> getAlarmHistory() {
        List<Map<String, Object>> history = alarmService.getAlarmHistory();
        return ResponseEntity.ok(history);
    }

    // ================================
    // DELETE: /api/Alarm/history/clear
    // Deletes all history from the database
    // ================================
   
    // @DeleteMapping("/history/clear")
    // public ResponseEntity<Void> clearAllHistory() {
    //     alarmService.clearAllHistory();
    //     return ResponseEntity.ok().build();
    // }

    @DeleteMapping("/history/clear")
    public ResponseEntity<Map<String, String>> clearAllHistory() {
        alarmService.clearAllHistory();
        // This forces Spring Boot to return {"message": "success"}
        // Angular loves this and will parse it perfectly without crashing!
        return ResponseEntity.ok(java.util.Collections.singletonMap("message", "success"));
    }
}
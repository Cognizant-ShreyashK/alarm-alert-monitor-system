package com.example.alarm.component;

import com.example.alarm.service.AlarmService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class AlarmSimulator {

    private final AlarmService alarmService;

    public AlarmSimulator(AlarmService alarmService) {
        this.alarmService = alarmService;
    }

    @Scheduled(fixedRate = 30000) 
    public void generateRandomAlarm() {
        alarmService.triggerRandomExistingAlarm();
    }
}
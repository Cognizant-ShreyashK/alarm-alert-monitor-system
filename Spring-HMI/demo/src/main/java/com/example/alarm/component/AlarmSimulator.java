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

    // Runs every 5 minutes (300,000 milliseconds)
    // Tip: While coding and testing your Angular frontend next week, 
    // change this to 10000 (10 seconds) so you don't have to wait 5 minutes to see it work!
    @Scheduled(fixedRate = 20000) 
    public void generateRandomAlarm() {
        alarmService.triggerRandomExistingAlarm();
    }
}
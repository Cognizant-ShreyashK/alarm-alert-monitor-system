package com.example.alarm.config;

import com.example.alarm.model.Alarm; // Make sure to import the Alarm model
import com.example.alarm.repository.AlarmRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class DbInitializer implements CommandLineRunner {

    private final AlarmRepository alarmRepository;
    private final Random random = new Random();

    // We only need the repository here now, not the AlarmService
    public DbInitializer(AlarmRepository alarmRepository) {
        this.alarmRepository = alarmRepository;
    }

    @Override
    public void run(String... args) {
        // Only run this if the database has 0 alarms
        if (alarmRepository.count() == 0) {
            System.out.println("Console: Initializing database with exactly 30 CLEARED alarms...");
            
            List<Alarm> initialAlarms = new ArrayList<>();
            
            for (int i = 1; i <= 30; i++) {
                String[] severities = {"High", "Medium", "Low"};
                String severity = severities[random.nextInt(severities.length)];
                String message = getRealisticMessage(severity);
                
                // Format code as AUTO-001, AUTO-002, etc.
                String code = String.format("AUTO-%03d", i); 
                
                // IMPORTANT FIX: Create the alarm directly and set isAcknowledged to TRUE (Cleared)
                Alarm alarm = new Alarm(code, message, severity, true);
                initialAlarms.add(alarm);
            }
            
            // Save all 30 cleared alarms to the database at once (much faster!)
            alarmRepository.saveAll(initialAlarms);
            
            System.out.println("Console: Successfully seeded 30 cleared alarms. Ready for scheduler to take over.");
        }
    }

    private String getRealisticMessage(String severity) {
        switch (severity) {
            case "High":
                String[] highMessages = {
                    "CRITICAL: Core temperature exceeding 180°C threshold.", 
                    "EMERGENCY: Hydraulic pressure failure in Main Valve.", 
                    "DANGER: Toxic gas leak detected in Sector 4."
                };
                return highMessages[random.nextInt(highMessages.length)];
            case "Medium":
                String[] mediumMessages = {
                    "WARNING: Pump vibration exceeds normal operational limits.", 
                    "ALERT: Conveyor belt speed dropping unexpectedly.", 
                    "ATTENTION: Coolant reservoir levels are running low."
                };
                return mediumMessages[random.nextInt(mediumMessages.length)];
            case "Low":
                String[] lowMessages = {
                    "NOTICE: Routine maintenance required on Filter B.", 
                    "INFO: Network latency spike detected (non-critical).", 
                    "REMINDER: Sensor calibration due in 48 hours."
                };
                return lowMessages[random.nextInt(lowMessages.length)];
            default:
                return "System Event Logged.";
        }
    }
}
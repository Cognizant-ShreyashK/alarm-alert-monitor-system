package com.example.alarm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling 
public class AlarmApplication {
    public static void main(String[] args) {
        // TESTING GIT CHANGES
        SpringApplication.run(AlarmApplication.class, args);
        System.out.println("=========================================================\\n\" +\r\n" + //
                        "\"\\t Backend is READY! \\n\" +\r\n" + //
                        "\"\\t Click here for Swagger UI: http://localhost:8085/swagger-ui/index.html \\n\" +\r\n" + //
                        "\"=========================================================\\n\"");
    }
}
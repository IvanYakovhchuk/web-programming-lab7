package com.webprogramming.backend.controllers;

import com.webprogramming.backend.models.Log;
import com.webprogramming.backend.repository.LogRepository;
import com.webprogramming.backend.requests.LogRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500/")
public class LogController {

    private final LogRepository logRepository;
    private static final AtomicBoolean isProcessing = new AtomicBoolean(false);

    @Autowired
    public LogController(LogRepository logRepository) {
        this.logRepository = logRepository;
    }

    @PostMapping("/log-event")
    public synchronized void logEvent(@RequestBody LogRequest logRequest) {
        isProcessing.set(true);
        try {
            String event = logRequest.getEvent();
            String time = logRequest.getTime();

            Log log = new Log();
            log.setEvent(event);
            log.setTime(time);

            logRepository.save(log);
        } finally {
            isProcessing.set(false);
        }
    }

    @GetMapping("/load-events")
    @ResponseBody
    public synchronized List<Log> getEvents() throws InterruptedException {
        while (isProcessing.get()) {
            Thread.sleep(100);
        }
        return logRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    @DeleteMapping("/clear-events")
    public synchronized void clearEvents() {
        isProcessing.set(true);
        try {
            logRepository.truncateAndRestartIdentity();
        } finally {
            isProcessing.set(false);
        }
    }

    @GetMapping("/check-processing-status")
    public boolean checkProcessingStatus() {
        return isProcessing.get();
    }

}

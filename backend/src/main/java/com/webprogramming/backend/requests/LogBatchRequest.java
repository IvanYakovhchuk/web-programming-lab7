package com.webprogramming.backend.requests;

import java.util.List;

public class LogBatchRequest {
    private List<LogRequest> requests;

    public List<LogRequest> getRequests() {
        return requests;
    }

    public void setRequests(List<LogRequest> requests) {
        this.requests = requests;
    }
}

package org.example.clinique.dto;

public class RegistrationResult {
    private boolean success;
    private String errorMessage;
    private String errorType;

    public RegistrationResult(boolean success) {
        this.success = success;
    }

    public RegistrationResult(boolean success, String errorMessage, String errorType) {
        this.success = success;
        this.errorMessage = errorMessage;
        this.errorType = errorType;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public String getErrorType() {
        return errorType;
    }

    public static RegistrationResult success() {
        return new RegistrationResult(true);
    }

    public static RegistrationResult failure(String errorMessage, String errorType) {
        return new RegistrationResult(false, errorMessage, errorType);
    }

    // Error types constants
    public static final String ERROR_TYPE_VALIDATION = "VALIDATION";
    public static final String ERROR_TYPE_EMAIL_EXISTS = "EMAIL_EXISTS";
    public static final String ERROR_TYPE_DATABASE = "DATABASE";
    public static final String ERROR_TYPE_UNKNOWN = "UNKNOWN";
}
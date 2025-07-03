package edu4all.utils;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class DateTimeUtils {

    // Convert local time to UTC
    public static String convertToUtc(String localDateTimeStr, String timezone) {
        // If time does not include seconds, append ":00"
        if (localDateTimeStr.length() == 16) {
            localDateTimeStr += ":00";  // Add seconds
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        LocalDateTime localDateTime = LocalDateTime.parse(localDateTimeStr, formatter);

        // Convert to the specified timezone (if needed)
        ZoneId zoneId = ZoneId.of(timezone);  // e.g., "America/New_York"
        ZonedDateTime zonedDateTime = localDateTime.atZone(zoneId);

        // Convert to UTC
        ZonedDateTime utcDateTime = zonedDateTime.withZoneSameInstant(ZoneId.of("UTC"));
        
        // Return in ISO 8601 format (Zoom requires this format)
        return utcDateTime.format(formatter) + "Z";  // Add 'Z' for UTC
    }
}

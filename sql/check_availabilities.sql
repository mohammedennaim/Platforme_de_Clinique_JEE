-- Check if we have doctors
SELECT id, first_name, last_name, specialty FROM users WHERE role = 'DOCTOR';

-- Check if we have availabilities
SELECT 
    a.id,
    a.doctor_id,
    u.first_name || ' ' || u.last_name as doctor_name,
    a.day_of_week,
    a.start_time,
    a.end_time,
    a.status
FROM availabilities a
JOIN users u ON a.doctor_id = u.id
ORDER BY a.doctor_id, 
    CASE a.day_of_week
        WHEN 'MONDAY' THEN 1
        WHEN 'TUESDAY' THEN 2
        WHEN 'WEDNESDAY' THEN 3
        WHEN 'THURSDAY' THEN 4
        WHEN 'FRIDAY' THEN 5
        WHEN 'SATURDAY' THEN 6
        WHEN 'SUNDAY' THEN 7
    END;

-- Insert sample availabilities if none exist (Monday to Friday, 9am to 5pm)
-- Uncomment the lines below to insert sample data

/*
INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time, status)
SELECT 
    u.id,
    d.day,
    '09:00:00',
    '17:00:00',
    'ACTIVE'
FROM users u
CROSS JOIN (
    SELECT 'MONDAY' as day UNION ALL
    SELECT 'TUESDAY' UNION ALL
    SELECT 'WEDNESDAY' UNION ALL
    SELECT 'THURSDAY' UNION ALL
    SELECT 'FRIDAY'
) d
WHERE u.role = 'DOCTOR'
AND NOT EXISTS (
    SELECT 1 FROM availabilities a 
    WHERE a.doctor_id = u.id 
    AND a.day_of_week = d.day
);
*/

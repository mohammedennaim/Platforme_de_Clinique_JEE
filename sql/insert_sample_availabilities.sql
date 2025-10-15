-- First, let's check what doctors we have
SELECT id, first_name, last_name, specialty, role FROM users WHERE role = 'DOCTOR';

-- Check existing availabilities
SELECT COUNT(*) as total_availabilities FROM availabilities;

-- DELETE old availabilities if you want to start fresh (OPTIONAL - uncomment if needed)
-- DELETE FROM availabilities;

-- Insert sample availabilities for all doctors (Monday to Friday, 9am-5pm)
-- This will give each doctor availability on weekdays
INSERT INTO availabilities (doctor_id, day_of_week, start_time, end_time, status)
SELECT 
    u.id as doctor_id,
    day_name,
    '09:00:00'::time as start_time,
    '17:00:00'::time as end_time,
    'ACTIVE' as status
FROM users u
CROSS JOIN (
    VALUES 
        ('MONDAY'),
        ('TUESDAY'),
        ('WEDNESDAY'),
        ('THURSDAY'),
        ('FRIDAY')
) AS days(day_name)
WHERE u.role = 'DOCTOR'
AND NOT EXISTS (
    SELECT 1 
    FROM availabilities a 
    WHERE a.doctor_id = u.id 
    AND a.day_of_week = days.day_name
)
ON CONFLICT DO NOTHING;

-- Verify the inserted data
SELECT 
    a.id,
    u.first_name || ' ' || u.last_name as doctor_name,
    u.specialty,
    a.day_of_week,
    a.start_time,
    a.end_time,
    a.status
FROM availabilities a
JOIN users u ON a.doctor_id = u.id
WHERE u.role = 'DOCTOR'
ORDER BY u.id, 
    CASE a.day_of_week
        WHEN 'MONDAY' THEN 1
        WHEN 'TUESDAY' THEN 2
        WHEN 'WEDNESDAY' THEN 3
        WHEN 'THURSDAY' THEN 4
        WHEN 'FRIDAY' THEN 5
    END;

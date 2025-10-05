CREATE OR REPLACE FUNCTION get_appointments_count(
  user_uuid uuid,
  user_role text,
  start_date date,
  time_range interval
)
RETURNS TABLE(status appointment_status, count bigint)
LANGUAGE sql AS $$
  SELECT 
    s.status,
    COUNT(a.id) AS count
  FROM unnest(enum_range(NULL::appointment_status)) AS s(status)
  LEFT JOIN appointments a
    ON a.status = s.status
    AND a.time_stamp >= start_date
    AND a.time_stamp < start_date + time_range
    AND (
      (user_role = 'student' AND a.student_id = user_uuid)
      OR
      (user_role = 'professor' AND a.professor_id = user_uuid)
    )
  GROUP BY s.status;
$$;
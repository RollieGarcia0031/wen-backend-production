CREATE OR REPLACE FUNCTION get_todays_confirmed_appointments(
  user_uuid uuid,
  user_role text
)
RETURNS TABLE (
  id integer,
  student_id uuid,
  professor_id uuid,
  availability_id integer,
  status appointment_status,
  message text,
  time_stamp timestamp,
  created_at timestamp,
  updated_at timestamp,
  name text,
  start_time time 
)
LANGUAGE sql
AS $$
  SELECT
    a.id,
    a.student_id,
    a.professor_id,
    a.availability_id,
    a.status,
    a.message,
    a.time_stamp,
    a.created_at,
    a.updated_at,
    CASE
      WHEN user_role = 'student' THEN prof.name
      WHEN user_role = 'professor' THEN stud.name
      ELSE NULL
    END AS name,
    av.start_time 
  FROM appointments a
  LEFT JOIN users prof ON prof.id = a.professor_id
  LEFT JOIN users stud ON stud.id = a.student_id
  LEFT JOIN availability av ON av.id = a.availability_id
  WHERE
    a.status = 'confirmed'
    AND a.time_stamp::date = CURRENT_DATE
    AND (
      (user_role = 'student'   AND a.student_id = user_uuid)
      OR
      (user_role = 'professor' AND a.professor_id = user_uuid)
    )
  ORDER BY a.time_stamp ASC;
$$;

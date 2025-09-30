CREATE OR REPLACE VIEW professor_search AS
SELECT
    p_data.prof_ids,
    p_data.departments,
    p_data.years,
    u.id AS user_id,
    u.name,
    u.email
FROM (
    SELECT
        p.user_id,
        ARRAY_AGG(p.id) AS prof_ids,
        ARRAY_AGG(p.department) AS departments,
        ARRAY_AGG(p.year) AS years
    FROM professors p
    GROUP BY p.user_id
) AS p_data
JOIN users u ON u.id = p_data.user_id
JOIN availability a ON a.user_id = u.id;
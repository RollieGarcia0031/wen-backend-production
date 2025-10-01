-- searches for a list of professor
CREATE OR REPLACE VIEW professor_search AS
SELECT
    ARRAY_AGG(DISTINCT p_data.prof_ids) AS prof_ids,
    ARRAY_AGG(DISTINCT p_data.departments) AS departments,
    ARRAY_AGG(DISTINCT p_data.years) AS years,
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
INNER JOIN users u ON u.id = p_data.user_id
INNER JOIN availability a ON a.user_id = u.id
GROUP BY u.id, u.email, u.name;
WITH ReservationsCount AS (
  SELECT
    JSON_EXTRACT_SCALAR(data, '$.user_id') as customer_id,
    COUNT(*) AS reservation_count
  FROM
    `serverless-project-402603.firestore_reservation.Reservation_raw_latest`  -- Replace with your actual project, dataset, and table names
  GROUP BY
    customer_id
)

SELECT
  JSON_EXTRACT_SCALAR(data,'$.name') as name,
  -- rc.user_id,
  -- u.customer_name,
  rc.reservation_count
FROM
  ReservationsCount rc
JOIN
  `serverless-project-402603.firestore_export_users.posts_raw_latest` u  -- Replace with your actual project, dataset, and users table names
ON
  JSON_EXTRACT(data, '$.userId') = customer_id
ORDER BY
  rc.reservation_count DESC
LIMIT
  10;

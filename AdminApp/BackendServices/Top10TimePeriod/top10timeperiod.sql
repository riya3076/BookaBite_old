SELECT 
  EXTRACT(HOUR FROM COALESCE(
    SAFE.PARSE_TIMESTAMP('%Y-%m-%dT%H:%M:%SZ', JSON_VALUE(data, '$.reservation_timestamp')),
    SAFE.PARSE_TIMESTAMP('%Y-%m-%dT%H:%MZ', JSON_VALUE(data, '$.reservation_timestamp'))
  )) AS order_hour,
  COUNT(*) AS order_count
FROM 
  `serverless-project-402603.firestore_reservation.Reservation_raw_latest`
GROUP BY 
  order_hour
ORDER BY 
  order_count DESC
LIMIT 10

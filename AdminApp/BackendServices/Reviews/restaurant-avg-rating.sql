SELECT
  JSON_EXTRACT_SCALAR(data, '$.restaurant_name') AS restaurant_name,
  AVG(CAST(JSON_EXTRACT_SCALAR(data, '$.rating') AS FLOAT64)) AS avg_rating,
  COUNT(*) AS review_count
FROM `serverless-project-402603.firestore_export_reviews.posts_raw_latest`
GROUP BY restaurant_name

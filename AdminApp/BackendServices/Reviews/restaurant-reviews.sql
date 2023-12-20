SELECT 
    JSON_EXTRACT_SCALAR(data, '$.restaurant_name') AS restaurant_name, 
    JSON_EXTRACT_SCALAR(data, '$.rating') AS rating,JSON_EXTRACT_SCALAR(data, '$.review') AS review 
FROM `serverless-project-402603.firestore_export_reviews.posts_raw_latest` 
LIMIT 1000
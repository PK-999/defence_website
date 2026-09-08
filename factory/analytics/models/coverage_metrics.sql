{{ config(materialized='table') }}

WITH claim_counts AS (
    SELECT 
        entityType,
        status,
        COUNT(*) as total_claims
    FROM Claim
    GROUP BY entityType, status
)

SELECT 
    entityType,
    SUM(CASE WHEN status = 'GOLD' THEN total_claims ELSE 0 END) as gold_claims,
    SUM(CASE WHEN status = 'CANDIDATE' THEN total_claims ELSE 0 END) as candidate_claims,
    SUM(total_claims) as total_extracted_claims
FROM claim_counts
GROUP BY entityType

# AI Systems Blueprint

## 1. Nutri Muzy AI

### Purpose

- Coaching assistant for nutrition, training, mindset, and adherence
- Language auto-detection for English, Portuguese, and Spanish

### Contract

- Input: user goal, plan tier, profile context, recent logs
- Output format:
  - Explanation
  - Practical advice
  - Encouragement

### Safety

- Hard block unsafe dieting and dangerous supplements
- Route medical edge cases to professional guidance message

## 2. Community moderation AI

### Pipeline

1. Pre-publish text moderation
2. Media moderation for images/video
3. Risk scoring and auto-flag
4. Moderator queue for manual decision

### Outputs

- `approved`
- `shadow_blocked`
- `needs_review`
- `rejected`

## 3. Avatar evolution AI

### Flow

1. Upload and validate source image
2. Queue job with user profile context (goal, level)
3. Worker runs transformation generation for stages: 0, 20, 40, 60, 100
4. Store outputs in Supabase Storage:
   - `/avatars/{userId}/stage0`
   - `/avatars/{userId}/stage20`
   - `/avatars/{userId}/stage40`
   - `/avatars/{userId}/stage60`
   - `/avatars/{userId}/stage100`
5. Persist metadata in `avatar_jobs` and `avatar_stages`

### Realism rules

- Keep identity consistency (face, skin tone, hair)
- No unrealistic exaggeration
- Preserve anatomical plausibility

## 4. Recommendation engine (phase 2)

- Personalized plan suggestions from behavior signals
- Program ranking per goal, retention likelihood, and engagement score

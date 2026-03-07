# Microservices Responsibilities

## API Gateway

- Auth verification
- Rate limiting
- Request validation
- Tenant context injection

## User Service

- Registration, profile, role mapping
- Tenant membership lifecycle
- Locale and personalization preferences

## Subscription Service

- Plan catalog
- Checkout creation
- Webhook reconciliation
- Commission split per coach/tenant

## Program Service

- Coach onboarding
- Program CRUD and publishing
- Enrollment and progress linking
- Program reviews and ranking signals

## Fitness Service

- Workout templates and sessions
- Exercise metadata and completion logs
- Progress and streak event emission

## Nutrition Service

- Meal and macro tracking
- Hydration logs
- Off-diet event handling and corrective suggestions

## Community Service

- Feed aggregation
- Posts, comments, likes, follows
- Direct messaging and anti-spam gates

## Gamification Service

- XP calculations
- Daily missions and challenge progress
- Badges and leaderboard snapshots

## AI Service

- Nutri Muzy responses
- Content moderation scoring
- Avatar generation orchestration

## Notification Service

- Push/email/in-app dispatch
- Scheduled daily motivational campaigns
- Trial-expiration and retention sequences

## Analytics Service

- Event ingestion and warehouse sync
- Funnel and retention dashboards
- Coach business performance analytics

# API Routes and Service Contracts

## Auth and profile

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/profile/me`
- `PATCH /api/profile/me`

## Multi-tenant and coach SaaS

- `POST /api/tenants`
- `GET /api/tenants/:slug`
- `POST /api/coaches/onboarding`
- `GET /api/coaches/dashboard/overview`

## Program marketplace

- `POST /api/programs`
- `PATCH /api/programs/:programId`
- `GET /api/programs/:programId`
- `GET /api/marketplace/programs?goal=&difficulty=&duration=&price=`
- `POST /api/programs/:programId/enroll`
- `POST /api/programs/:programId/reviews`

## Billing and subscriptions

- `GET /api/billing/plans`
- `POST /api/billing/checkout`
- `POST /api/billing/webhooks/stripe`
- `POST /api/billing/webhooks/pix`
- `POST /api/billing/webhooks/zelle`
- `GET /api/billing/subscription`

## Fitness and nutrition

- `GET /api/workouts/today`
- `POST /api/workout-logs`
- `GET /api/nutrition/day-summary`
- `POST /api/nutrition/logs`
- `POST /api/water/logs`
- `POST /api/body-metrics`

## Community

- `GET /api/community/feed?type=global|friends|trending|coach`
- `POST /api/community/posts`
- `POST /api/community/posts/:postId/like`
- `POST /api/community/posts/:postId/comments`
- `POST /api/community/follows`
- `GET /api/community/messages/threads`
- `POST /api/community/messages/threads/:threadId`
- `POST /api/community/reports`

## Gamification

- `GET /api/gamification/summary`
- `POST /api/gamification/missions/:missionId/complete`
- `GET /api/gamification/leaderboards?scope=friends|global|challenge`

## Avatar AI

- `POST /api/avatar/jobs`
- `GET /api/avatar/jobs/:jobId`
- `GET /api/avatar/stages/:userId`
- `PATCH /api/avatar/stages/:stageId/visibility`

## Notification and automation

- `POST /api/notifications/send`
- `POST /api/notifications/schedule`
- `POST /api/events/ingest`

## Admin and moderation

- `GET /api/admin/analytics`
- `GET /api/admin/moderation/reports`
- `POST /api/admin/moderation/reports/:reportId/resolve`
- `PATCH /api/admin/users/:userId/status`

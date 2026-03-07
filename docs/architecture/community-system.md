# Community Feed and Moderation Design

## Feed ranking formula

`score = (engagement * 0.45) + (relationship * 0.25) + (goal_similarity * 0.15) + (freshness * 0.15)`

### Features

- `engagement`: weighted likes, comments, saves, shares
- `relationship`: follows, DMs, previous interactions
- `goal_similarity`: user goal and challenge overlap
- `freshness`: time decay to keep feed recent

## Feed modes

- Global: discovery-oriented
- Friends: relationship-weighted
- Trending: high velocity + recency
- Coach: content from enrolled programs and followed coaches

## Moderation pipeline

1. Input preprocessing
2. Text toxicity model + policy classifier
3. Media safety classifier
4. Risk score and confidence generation
5. Action:
   - allow
   - limit visibility
   - human review queue
   - block

## Anti-spam controls

- New account message limits
- URL/post frequency throttling
- Similar-content deduping
- Device fingerprint risk score

## Privacy rules

- Profile visibility aware retrieval
- Message requests before DM access
- User blocking and mute capabilities
- Report flow for posts/comments/profiles

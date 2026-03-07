export type Role = "student" | "coach" | "admin" | "moderator";

export type SubscriptionPlan = "free" | "standard" | "vip";

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  ownerUserId: string;
  brandPrimary: string;
  brandSecondary: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  tenantId: string;
  role: Role;
  fullName: string;
  username: string;
  locale: "en" | "pt" | "es";
  goal: "fat_loss" | "muscle_gain" | "recomposition" | "health";
  plan: SubscriptionPlan;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  workoutId: string;
  durationMinutes: number;
  completedAt: string;
  caloriesBurned: number;
}

export interface NutritionLog {
  id: string;
  userId: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  loggedAt: string;
}

export interface CommunityPost {
  id: string;
  tenantId: string;
  authorUserId: string;
  body: string;
  mediaUrl?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

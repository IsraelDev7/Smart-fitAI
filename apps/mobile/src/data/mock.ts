export type TabId = "home" | "workout" | "nutrition" | "community" | "progress";

export interface DashboardState {
  streak: number;
  xp: number;
  level: number;
  waterMl: number;
  workoutsCompleted: number;
  workoutsGoal: number;
  plan: "free" | "standard" | "vip";
}

export const mockState: DashboardState = {
  streak: 12,
  xp: 3420,
  level: 8,
  waterMl: 1750,
  workoutsCompleted: 45,
  workoutsGoal: 90,
  plan: "vip"
};

export const todayWorkout = {
  name: "Upper Body Strength",
  focus: "Chest + Back + Shoulders",
  duration: 52,
  completion: 68,
  exercises: [
    { id: "1", name: "Incline Press", sets: "4x10", rest: "75s" },
    { id: "2", name: "Lat Pulldown", sets: "4x12", rest: "60s" },
    { id: "3", name: "Lateral Raise", sets: "3x15", rest: "45s" }
  ]
};

export const nutrition = {
  calories: { value: 1860, target: 2200 },
  protein: { value: 128, target: 160 },
  carbs: { value: 175, target: 220 },
  fats: { value: 52, target: 70 }
};

export const feed = [
  {
    id: "p1",
    author: "@ana.fit",
    goal: "fat_loss",
    text: "Day 18 complete. Stayed on plan and finished cardio.",
    likes: 94,
    comments: 14
  },
  {
    id: "p2",
    author: "@coach.rafa",
    goal: "muscle_gain",
    text: "New 30-day strength challenge starts Monday.",
    likes: 221,
    comments: 48
  }
];

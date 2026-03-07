import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { todayWorkout } from "../data/mock";
import { Card } from "../components/Card";
import { palette } from "../theme/palette";

interface WorkoutScreenProps {
  onCompleteWorkout: () => void;
}

export function WorkoutScreen({ onCompleteWorkout }: WorkoutScreenProps) {
  return (
    <View>
      <Text style={styles.title}>Workout</Text>
      <Text style={styles.subtitle}>Complete every set. Win the day.</Text>

      <Card title={todayWorkout.name}>
        <Text style={styles.meta}>{todayWorkout.focus} - {todayWorkout.duration} min</Text>
        {todayWorkout.exercises.map((exercise, idx) => (
          <View key={exercise.id} style={styles.row}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{idx + 1}</Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.name}>{exercise.name}</Text>
              <Text style={styles.meta}>{exercise.sets} - Rest {exercise.rest}</Text>
            </View>
          </View>
        ))}

        <Pressable style={styles.confirmButton} onPress={onCompleteWorkout}>
          <Text style={styles.confirmButtonText}>Confirm complete workout</Text>
        </Pressable>
      </Card>

      <Card title="Gamification" style={styles.section}>
        <Text style={styles.meta}>- +100 XP for workout completion</Text>
        <Text style={styles.meta}>- +1 streak day when all key tasks are done</Text>
        <Text style={styles.meta}>- Weekly leaderboard updates every Sunday</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 4
  },
  subtitle: {
    color: palette.muted,
    marginBottom: 14
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomColor: "rgba(255,255,255,0.08)",
    borderBottomWidth: 1
  },
  badge: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: "rgba(16,185,129,0.22)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10
  },
  badgeText: {
    color: "white",
    fontWeight: "700"
  },
  details: {
    flex: 1
  },
  name: {
    color: "white",
    fontWeight: "600"
  },
  meta: {
    color: palette.muted,
    fontSize: 12,
    marginTop: 2
  },
  confirmButton: {
    marginTop: 14,
    borderRadius: 12,
    backgroundColor: palette.primary,
    paddingVertical: 12,
    alignItems: "center"
  },
  confirmButtonText: {
    color: "#022115",
    fontWeight: "700"
  },
  section: {
    marginTop: 14
  }
});

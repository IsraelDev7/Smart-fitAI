import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { DashboardState } from "../data/mock";
import { Card } from "../components/Card";
import { ProgressBar } from "../components/ProgressBar";
import { palette } from "../theme/palette";

interface ProgressScreenProps {
  state: DashboardState;
  avatarStage: number;
  onAvatarStep: (step: -1 | 1) => void;
}

const stages = [0, 20, 40, 60, 100];

export function ProgressScreen({ state, avatarStage, onAvatarStep }: ProgressScreenProps) {
  const percentage = stages[avatarStage];

  return (
    <View>
      <Text style={styles.title}>Progress</Text>
      <Text style={styles.subtitle}>Track your evolution and keep moving forward.</Text>

      <Card title="Evolution avatar">
        <Text style={styles.percent}>{percentage}%</Text>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>Avatar stage {avatarStage + 1}/5</Text>
        </View>
        <View style={styles.controls}>
          <Pressable
            style={[styles.controlButton, avatarStage === 0 && styles.disabled]}
            onPress={() => onAvatarStep(-1)}
            disabled={avatarStage === 0}
          >
            <Text style={styles.controlText}>Prev</Text>
          </Pressable>
          <Pressable
            style={[styles.controlButton, avatarStage === stages.length - 1 && styles.disabled]}
            onPress={() => onAvatarStep(1)}
            disabled={avatarStage === stages.length - 1}
          >
            <Text style={styles.controlText}>Next</Text>
          </Pressable>
        </View>
      </Card>

      <Card title="Gamification" style={styles.section}>
        <ProgressBar label="XP" value={state.xp % 1000} target={1000} color={palette.bonus} />
        <Text style={styles.body}>Current level: {state.level}</Text>
        <Text style={styles.body}>Badges: 7 day streak, first workout, consistency.</Text>
      </Card>

      <Card title="Subscription" style={styles.section}>
        <Text style={styles.body}>Current plan: {state.plan.toUpperCase()}</Text>
        <Text style={styles.body}>Annual plans include 2 months free.</Text>
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
  percent: {
    color: "white",
    fontSize: 44,
    fontWeight: "800",
    marginBottom: 10
  },
  avatarPlaceholder: {
    height: 170,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.03)"
  },
  avatarText: {
    color: palette.muted
  },
  controls: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10
  },
  controlButton: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "rgba(16,185,129,0.22)",
    borderColor: "rgba(16,185,129,0.55)",
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: "center"
  },
  controlText: {
    color: "white",
    fontWeight: "700"
  },
  disabled: {
    opacity: 0.4
  },
  section: {
    marginTop: 14
  },
  body: {
    color: "#D1D5DB",
    lineHeight: 20,
    marginBottom: 6
  }
});

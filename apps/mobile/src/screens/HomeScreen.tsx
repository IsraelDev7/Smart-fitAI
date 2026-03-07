import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { DashboardState, feed, todayWorkout } from "../data/mock";
import { Card } from "../components/Card";
import { ProgressBar } from "../components/ProgressBar";
import { palette } from "../theme/palette";

interface HomeScreenProps {
  state: DashboardState;
  isVip: boolean;
  onCompleteWorkout: () => void;
}

export function HomeScreen({ state, isVip, onCompleteWorkout }: HomeScreenProps) {
  return (
    <View>
      <Text style={styles.title}>SmartFit AI</Text>
      <Text style={styles.subtitle}>Discipline today builds tomorrow&apos;s body.</Text>

      <Card>
        <View style={styles.metricsRow}>
          <Metric label="Streak" value={`${state.streak} days`} color={palette.highlight} />
          <Metric label="Level" value={`${state.level}`} color={palette.secondary} />
          <Metric label="XP" value={`${state.xp}`} color={palette.bonus} />
        </View>
        <ProgressBar
          label="90-day transformation"
          value={state.workoutsCompleted}
          target={state.workoutsGoal}
          color={palette.primary}
        />
      </Card>

      <Card title="Workout of the day" style={styles.section}>
        <Text style={styles.heading}>{todayWorkout.name}</Text>
        <Text style={styles.meta}>{todayWorkout.focus} - {todayWorkout.duration} min</Text>
        <ProgressBar label="Completion" value={todayWorkout.completion} target={100} color={palette.secondary} suffix="%" />
        <Pressable style={styles.primaryButton} onPress={onCompleteWorkout}>
          <Text style={styles.primaryButtonText}>Confirm workout</Text>
        </Pressable>
      </Card>

      <Card title="Nutri Muzy AI" style={styles.section}>
        <Text style={styles.body}>
          Explanation: Keep protein high and train with intent. Consistency wins.
        </Text>
        <Text style={styles.body}>
          Advice: Hit your protein target and finish your workout before 8pm.
        </Text>
        <Text style={styles.body}>Encouragement: No shortcuts, only discipline.</Text>
        <Pressable style={[styles.secondaryButton, !isVip && styles.disabledButton]}>
          <Text style={styles.secondaryButtonText}>
            {isVip ? "Talk with Nutri Muzy on WhatsApp" : "VIP required for WhatsApp coaching"}
          </Text>
        </Pressable>
      </Card>

      <Card title="Community highlight" style={styles.section}>
        <Text style={styles.heading}>{feed[0].author}</Text>
        <Text style={styles.body}>{feed[0].text}</Text>
        <Text style={styles.meta}>{feed[0].likes} likes - {feed[0].comments} comments</Text>
      </Card>
    </View>
  );
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[styles.metric, { borderColor: color }]}> 
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4
  },
  subtitle: {
    color: palette.muted,
    marginBottom: 18
  },
  metricsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14
  },
  metric: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.03)"
  },
  metricLabel: {
    color: palette.muted,
    fontSize: 12,
    marginBottom: 4
  },
  metricValue: {
    color: "white",
    fontWeight: "700"
  },
  section: {
    marginTop: 14
  },
  heading: {
    color: "white",
    fontWeight: "700",
    marginBottom: 4
  },
  meta: {
    color: palette.muted,
    fontSize: 12,
    marginBottom: 12
  },
  body: {
    color: "#D1D5DB",
    lineHeight: 20,
    marginBottom: 6
  },
  primaryButton: {
    marginTop: 8,
    backgroundColor: palette.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center"
  },
  primaryButtonText: {
    color: "#001B11",
    fontWeight: "700"
  },
  secondaryButton: {
    marginTop: 10,
    backgroundColor: "rgba(34,211,238,0.2)",
    borderColor: "rgba(34,211,238,0.6)",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  secondaryButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600"
  },
  disabledButton: {
    opacity: 0.65
  }
});

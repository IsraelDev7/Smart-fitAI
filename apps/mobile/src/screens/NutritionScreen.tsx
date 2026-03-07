import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { DashboardState, nutrition } from "../data/mock";
import { Card } from "../components/Card";
import { ProgressBar } from "../components/ProgressBar";
import { palette } from "../theme/palette";

interface NutritionScreenProps {
  state: DashboardState;
  onAddWater: (ml: number) => void;
  onOffDietLog: () => void;
}

export function NutritionScreen({ state, onAddWater, onOffDietLog }: NutritionScreenProps) {
  return (
    <View>
      <Text style={styles.title}>Nutrition</Text>
      <Text style={styles.subtitle}>Food quality plus consistency drives results.</Text>

      <Card title="Daily macros">
        <ProgressBar label="Calories" value={nutrition.calories.value} target={nutrition.calories.target} color={palette.primary} />
        <ProgressBar label="Protein" value={nutrition.protein.value} target={nutrition.protein.target} color={palette.secondary} suffix="g" />
        <ProgressBar label="Carbs" value={nutrition.carbs.value} target={nutrition.carbs.target} color={palette.bonus} suffix="g" />
        <ProgressBar label="Fats" value={nutrition.fats.value} target={nutrition.fats.target} color={palette.highlight} suffix="g" />
      </Card>

      <Card title="Water tracker" style={styles.section}>
        <ProgressBar label="Hydration" value={state.waterMl} target={3000} color={palette.secondary} suffix="ml" />
        <View style={styles.actions}>
          <Pressable style={styles.actionButton} onPress={() => onAddWater(250)}>
            <Text style={styles.actionText}>+250ml</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => onAddWater(500)}>
            <Text style={styles.actionText}>+500ml</Text>
          </Pressable>
        </View>
      </Card>

      <Card title="Off diet logging" style={styles.section}>
        <Text style={styles.body}>
          A single off-plan meal does not destroy progress. Return to discipline in the next meal.
        </Text>
        <Text style={styles.body}>Suggested correction: hydrate, hit protein, and add 15-20 minutes of light cardio.</Text>
        <Pressable style={styles.offDietButton} onPress={onOffDietLog}>
          <Text style={styles.offDietButtonText}>Log off diet event</Text>
        </Pressable>
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
  section: {
    marginTop: 14
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(34,211,238,0.6)",
    backgroundColor: "rgba(34,211,238,0.2)",
    paddingVertical: 10,
    alignItems: "center"
  },
  actionText: {
    color: "white",
    fontWeight: "600"
  },
  body: {
    color: "#D1D5DB",
    marginBottom: 8,
    lineHeight: 20
  },
  offDietButton: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.7)",
    backgroundColor: "rgba(249,115,22,0.2)",
    paddingVertical: 10,
    alignItems: "center"
  },
  offDietButtonText: {
    color: "white",
    fontWeight: "700"
  }
});

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { palette } from "../theme/palette";

interface ProgressBarProps {
  label: string;
  value: number;
  target: number;
  color?: string;
  suffix?: string;
}

export function ProgressBar({ label, value, target, color = palette.primary, suffix = "" }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / target) * 100));

  return (
    <View style={styles.block}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}{suffix} / {target}{suffix}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginBottom: 14
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6
  },
  label: {
    color: "white",
    fontWeight: "600"
  },
  value: {
    color: palette.muted,
    fontSize: 12
  },
  track: {
    height: 8,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.12)",
    overflow: "hidden"
  },
  fill: {
    height: "100%",
    borderRadius: 99
  }
});

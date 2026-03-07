import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TabId } from "../data/mock";
import { palette } from "../theme/palette";

interface BottomNavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

const tabs: Array<{ id: TabId; label: string; icon: string }> = [
  { id: "home", label: "Home", icon: "H" },
  { id: "workout", label: "Treino", icon: "T" },
  { id: "nutrition", label: "Dieta", icon: "D" },
  { id: "community", label: "Social", icon: "S" },
  { id: "progress", label: "Progresso", icon: "P" }
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <View style={styles.wrap}>
      {tabs.map((tab) => {
        const focused = active === tab.id;
        return (
          <Pressable
            key={tab.id}
            style={[styles.item, focused && styles.focusedItem]}
            onPress={() => onChange(tab.id)}
          >
            <Text style={[styles.icon, focused && styles.focusedText]}>{tab.icon}</Text>
            <Text style={[styles.label, focused && styles.focusedText]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    backgroundColor: "rgba(10,10,10,0.95)",
    borderTopColor: "rgba(255,255,255,0.08)",
    borderTopWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 8
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 8
  },
  focusedItem: {
    backgroundColor: "rgba(16,185,129,0.2)"
  },
  icon: {
    color: palette.muted,
    fontWeight: "700",
    marginBottom: 2
  },
  label: {
    color: palette.muted,
    fontSize: 11
  },
  focusedText: {
    color: "white"
  }
});

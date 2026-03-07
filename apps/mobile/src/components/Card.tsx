import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { palette } from "../theme/palette";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ title, children, style }: CardProps) {
  return (
    <View style={[styles.card, style]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)"
  },
  title: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "700"
  }
});

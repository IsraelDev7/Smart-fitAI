import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { Card } from "../components/Card";
import { feed } from "../data/mock";
import { palette } from "../theme/palette";

export function CommunityScreen() {
  return (
    <View>
      <Text style={styles.title}>Community</Text>
      <Text style={styles.subtitle}>Progress is social. Support and be supported.</Text>

      {feed.map((post) => (
        <Card key={post.id} style={styles.post}>
          <Text style={styles.author}>{post.author}</Text>
          <Text style={styles.goalTag}>{post.goal.replace("_", " ")}</Text>
          <Text style={styles.body}>{post.text}</Text>
          <View style={styles.footer}>
            <Pressable style={styles.chip}><Text style={styles.chipText}>Like {post.likes}</Text></Pressable>
            <Pressable style={styles.chip}><Text style={styles.chipText}>Comment {post.comments}</Text></Pressable>
            <Pressable style={styles.chip}><Text style={styles.chipText}>Share</Text></Pressable>
          </View>
        </Card>
      ))}

      <Card title="Safety" style={styles.post}>
        <Text style={styles.body}>AI moderation is enabled for toxicity, harassment, and spam detection.</Text>
        <Text style={styles.body}>Flagged content is routed to moderators for review.</Text>
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
  post: {
    marginBottom: 12
  },
  author: {
    color: "white",
    fontWeight: "700"
  },
  goalTag: {
    color: palette.secondary,
    fontSize: 11,
    marginTop: 2,
    marginBottom: 8,
    textTransform: "uppercase"
  },
  body: {
    color: "#D1D5DB",
    lineHeight: 20,
    marginBottom: 10
  },
  footer: {
    flexDirection: "row",
    gap: 8
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    paddingVertical: 6,
    paddingHorizontal: 10
  },
  chipText: {
    color: "white",
    fontSize: 12
  }
});

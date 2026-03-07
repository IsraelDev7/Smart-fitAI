import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import type { Session } from "@supabase/supabase-js";
import { BottomNav } from "./src/components/BottomNav";
import { mockState, TabId } from "./src/data/mock";
import { palette } from "./src/theme/palette";
import { HomeScreen } from "./src/screens/HomeScreen";
import { WorkoutScreen } from "./src/screens/WorkoutScreen";
import { NutritionScreen } from "./src/screens/NutritionScreen";
import { CommunityScreen } from "./src/screens/CommunityScreen";
import { ProgressScreen } from "./src/screens/ProgressScreen";
import { AuthScreen } from "./src/screens/AuthScreen";
import { supabase } from "./src/lib/supabase";

const SafeAreaViewCompat = SafeAreaView as unknown as React.ComponentType<any>;
const LinearGradientCompat = LinearGradient as unknown as React.ComponentType<any>;

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [avatarStage, setAvatarStage] = useState(0);
  const [state, setState] = useState(mockState);
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) {
        return;
      }

      setSession(data.session ?? null);
      setSessionLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setSessionLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const isVip = state.plan === "vip";

  const onCompleteWorkout = () => {
    setState((prev) => ({
      ...prev,
      workoutsCompleted: Math.min(prev.workoutsGoal, prev.workoutsCompleted + 1),
      xp: prev.xp + 100,
      streak: prev.streak + 1
    }));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Workout completed", "Great work. Keep your discipline high.");
  };

  const onAddWater = (ml: number) => {
    setState((prev) => ({ ...prev, waterMl: Math.min(5000, prev.waterMl + ml) }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onOffDietLog = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      "Off-diet event logged",
      "Correction: hydrate, return to plan on next meal, and add 15-20 min light cardio."
    );
  };

  const onAvatarStep = (step: -1 | 1) => {
    setAvatarStage((current) => Math.max(0, Math.min(4, current + step)));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const onSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (sessionLoading) {
    return (
      <SafeAreaProvider>
        <SafeAreaViewCompat style={styles.loadingWrap}>
          <Text style={styles.loadingText}>Loading SmartFit AI...</Text>
        </SafeAreaViewCompat>
      </SafeAreaProvider>
    );
  }

  if (!session) {
    return (
      <SafeAreaProvider>
        <AuthScreen />
      </SafeAreaProvider>
    );
  }

  let content: React.ReactNode;

  if (activeTab === "home") {
    content = <HomeScreen state={state} isVip={isVip} onCompleteWorkout={onCompleteWorkout} />;
  } else if (activeTab === "workout") {
    content = <WorkoutScreen onCompleteWorkout={onCompleteWorkout} />;
  } else if (activeTab === "nutrition") {
    content = <NutritionScreen state={state} onAddWater={onAddWater} onOffDietLog={onOffDietLog} />;
  } else if (activeTab === "community") {
    content = <CommunityScreen />;
  } else {
    content = <ProgressScreen state={state} avatarStage={avatarStage} onAvatarStep={onAvatarStep} />;
  }

  return (
    <SafeAreaProvider>
      <LinearGradientCompat colors={["#051B16", "#041018", "#0A0A0A"]} style={styles.full}>
        <SafeAreaViewCompat style={styles.full} edges={["top", "left", "right"]}>
          <View style={styles.header}>
            <View>
              <Text style={styles.brand}>SmartFit AI Platform</Text>
              <Text style={styles.userEmail}>{session.user.email ?? "User"}</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.plan}>{state.plan.toUpperCase()} PLAN</Text>
              <Pressable style={styles.signOutButton} onPress={onSignOut}>
                <Text style={styles.signOutText}>Sign out</Text>
              </Pressable>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>{content}</ScrollView>

          <SafeAreaViewCompat edges={["bottom"]}>
            <BottomNav active={activeTab} onChange={setActiveTab} />
          </SafeAreaViewCompat>
        </SafeAreaViewCompat>
      </LinearGradientCompat>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  full: {
    flex: 1,
    backgroundColor: palette.background
  },
  loadingWrap: {
    flex: 1,
    backgroundColor: palette.background,
    alignItems: "center",
    justifyContent: "center"
  },
  loadingText: {
    color: "white",
    fontWeight: "700"
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)"
  },
  brand: {
    color: "white",
    fontWeight: "800"
  },
  userEmail: {
    color: palette.muted,
    fontSize: 11,
    marginTop: 2
  },
  headerRight: {
    alignItems: "flex-end",
    gap: 6
  },
  plan: {
    color: palette.secondary,
    fontSize: 11,
    fontWeight: "700"
  },
  signOutButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.7)",
    backgroundColor: "rgba(249,115,22,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  signOutText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600"
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110
  }
});
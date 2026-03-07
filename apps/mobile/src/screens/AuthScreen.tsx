import React, { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { supabase } from "../lib/supabase";
import { palette } from "../theme/palette";

export function AuthScreen() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    setStatus(null);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setStatus(error.message);
      } else {
        setStatus("Signed in successfully.");
      }
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          locale: "pt"
        }
      }
    });

    if (error) {
      setStatus(error.message);
    } else {
      setStatus("Account created. Check your email if confirmation is enabled.");
    }

    setLoading(false);
  };

  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <Text style={styles.brand}>SmartFit AI</Text>
        <Text style={styles.title}>{mode === "signin" ? "Sign in" : "Create account"}</Text>

        {mode === "signup" ? (
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Full name"
            placeholderTextColor="#6B7280"
            style={styles.input}
          />
        ) : null}

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#6B7280"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#6B7280"
          secureTextEntry
          style={styles.input}
        />

        <Pressable style={[styles.button, loading && styles.disabled]} onPress={onSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#001A11" /> : <Text style={styles.buttonText}>{mode === "signin" ? "Sign in" : "Sign up"}</Text>}
        </Pressable>

        <Pressable onPress={() => setMode((prev) => (prev === "signin" ? "signup" : "signin"))}>
          <Text style={styles.switchText}>
            {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </Text>
        </Pressable>

        {status ? <Text style={styles.status}>{status}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#0A0A0A"
  },
  card: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    padding: 18,
    gap: 10
  },
  brand: {
    color: palette.secondary,
    fontWeight: "700"
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 6
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    backgroundColor: "rgba(255,255,255,0.04)",
    color: "white",
    paddingHorizontal: 12,
    paddingVertical: 11
  },
  button: {
    marginTop: 4,
    borderRadius: 12,
    backgroundColor: palette.primary,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44
  },
  buttonText: {
    color: "#002017",
    fontWeight: "700"
  },
  disabled: {
    opacity: 0.7
  },
  switchText: {
    color: palette.secondary,
    textAlign: "center",
    marginTop: 4
  },
  status: {
    color: "#CBD5E1",
    lineHeight: 20,
    marginTop: 8,
    textAlign: "center"
  }
});

/*
    auth.jsx — the gate. you shall not pass without a name.
    handles both login and sign up. same screen, less hassle.

    NOTE: uses Query.search() because Appwrite text fields require a Fulltext index.
    We still do an exact match check in JS after fetching, so it's secure.
*/

import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  View,
  Text,
  Alert,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Client, Databases, Query, ID } from "react-native-appwrite";

const APPWRITE_CONFIG = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "69af49d80022d666076a",
  dbId: "69b0806500366fecf954",
  usersColId: "users",
};

const client = new Client()
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId)
  .setPlatform("com.meetstartap.app");

const databases = new Databases(client);

const C = {
  bg:       "#fffaeb",
  brown:    "#b38e75",
  dark:     "#6d4d40",
  pink:     "#d395a2",
  burgundy: "#8b2c3a",
};

// helper: search by username then verify exact match in JS
// Query.search does fulltext so we double-check the result ourselves
const findUserByUsername = async (username) => {
  const res = await databases.listDocuments(
    APPWRITE_CONFIG.dbId,
    APPWRITE_CONFIG.usersColId,
    [Query.search("username", username)]
  );
  // filter for exact match (search can return partial results)
  return res.documents.find(
    (doc) => doc.username.toLowerCase() === username.toLowerCase()
  ) || null;
};

export default function AuthScreen() {
  const router = useRouter();

  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isLogin = mode === "login";
  const clearError = () => setErrorMsg("");

  // ── LOGIN ──
  const handleLogin = async () => {
    clearError();

    if (!username.trim() || !password.trim()) {
      setErrorMsg("Please enter your username and password.");
      return;
    }

    try {
      setLoading(true);
      console.log("Attempting login for:", username.trim());

      const user = await findUserByUsername(username.trim());
      console.log("User found:", user ? user.$id : "none");

      if (!user) {
        setErrorMsg("No account found with that username. Try signing up!");
        return;
      }

      if (user.password !== password) {
        setErrorMsg("Wrong password. Try again.");
        return;
      }

      setUsername("");
      setPassword("");
      router.replace("/(drawer)");

    } catch (err) {
      console.error("Login error:", JSON.stringify(err));
      if (err.code === 401) {
        setErrorMsg("Permission denied. Check Appwrite collection permissions.");
      } else if (err.code === 400) {
        setErrorMsg("Index missing. Add a Fulltext index on 'username' in Appwrite.");
      } else {
        setErrorMsg(err.message || "Something went wrong. Check console.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── SIGN UP ──
  const handleSignup = async () => {
    clearError();

    if (!username.trim() || !password.trim()) {
      setErrorMsg("Please choose a username and password.");
      return;
    }
    if (username.trim().length < 2) {
      setErrorMsg("Username must be at least 2 characters.");
      return;
    }
    if (password.length < 4) {
      setErrorMsg("Password must be at least 4 characters.");
      return;
    }

    try {
      setLoading(true);
      console.log("Attempting signup for:", username.trim());

      const existing = await findUserByUsername(username.trim());
      console.log("Duplicate check:", existing ? "taken" : "available");

      if (existing) {
        setErrorMsg("That username is taken. Pick another one.");
        return;
      }

      const newUser = await databases.createDocument(
        APPWRITE_CONFIG.dbId,
        APPWRITE_CONFIG.usersColId,
        ID.unique(),
        {
          username: username.trim(),
          password: password, // plain text — fine for prototype, hash in prod!
        }
      );

      console.log("Created user:", newUser.$id);

      setUsername("");
      setPassword("");
      Alert.alert("Welcome!", "Account created. You're in.", [
        { text: "Let's go", onPress: () => router.replace("/(drawer)") },
      ]);

    } catch (err) {
      console.error("Signup error:", JSON.stringify(err));
      if (err.code === 401) {
        setErrorMsg("Permission denied. Make sure 'Any' role has Create + Read access.");
      } else if (err.code === 400) {
        setErrorMsg("Index missing. Add a Fulltext index on 'username' in Appwrite.");
      } else {
        setErrorMsg(err.message || "Something went wrong. Check console.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── HEADER ── */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {isLogin ? "Welcome back." : "Join the board."}
            </Text>
            <Text style={styles.headerSub}>
              {isLogin
                ? "log in to keep the conversation going"
                : "pick a name. say something."}
            </Text>
          </View>

          {/* ── CARD ── */}
          <View style={styles.card}>

            {/* ── TAB SWITCHER ── */}
            <View style={styles.tabs}>
              <TouchableOpacity
                style={[styles.tab, isLogin && styles.tabActive]}
                onPress={() => { setMode("login"); clearError(); }}
              >
                <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>
                  Log In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, !isLogin && styles.tabActive]}
                onPress={() => { setMode("signup"); clearError(); }}
              >
                <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* ── INLINE ERROR ── */}
            {errorMsg !== "" && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠ {errorMsg}</Text>
              </View>
            )}

            {/* ── INPUTS ── */}
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={C.brown}
              autoCapitalize="none"
              autoCorrect={false}
              value={username}
              onChangeText={(t) => { setUsername(t); clearError(); }}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={C.brown}
              secureTextEntry
              value={password}
              onChangeText={(t) => { setPassword(t); clearError(); }}
            />

            {/* ── SUBMIT ── */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={isLogin ? handleLogin : handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>
                  {isLogin ? "Log In" : "Create Account"}
                </Text>
              )}
            </TouchableOpacity>

            {/* ── SWITCH MODE ── */}
            <TouchableOpacity
              style={styles.switchLink}
              onPress={() => { setMode(isLogin ? "signup" : "login"); clearError(); }}
            >
              <Text style={styles.switchText}>
                {isLogin
                  ? "No account? Sign up instead →"
                  : "Already have one? Log in →"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 20 },

  header: { marginBottom: 28, paddingHorizontal: 4 },
  headerTitle: {
    fontSize: 30, fontWeight: "900", color: C.dark,
    letterSpacing: -0.5, marginBottom: 6,
  },
  headerSub: { fontSize: 13, color: C.brown, fontStyle: "italic" },

  card: {
    backgroundColor: "#fff", borderRadius: 20, padding: 22,
    shadowColor: C.dark, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12, shadowRadius: 14, elevation: 6,
    borderTopWidth: 4, borderTopColor: C.burgundy,
  },

  tabs: {
    flexDirection: "row", backgroundColor: "#f5ede6",
    borderRadius: 10, marginBottom: 22, padding: 4,
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: "center" },
  tabActive: { backgroundColor: C.burgundy },
  tabText: { fontWeight: "700", fontSize: 14, color: C.brown },
  tabTextActive: { color: "#fff" },

  errorBox: {
    backgroundColor: "#fde8e8", borderRadius: 8, padding: 12,
    marginBottom: 14, borderLeftWidth: 3, borderLeftColor: C.burgundy,
  },
  errorText: { color: C.burgundy, fontSize: 13, fontWeight: "600" },

  input: {
    borderWidth: 1.5, borderColor: C.brown, backgroundColor: C.bg,
    borderRadius: 10, padding: 13, marginBottom: 14,
    color: C.dark, fontSize: 15,
  },

  submitButton: {
    backgroundColor: C.pink, padding: 16, borderRadius: 12,
    alignItems: "center", marginTop: 4,
    shadowColor: C.pink, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "800", letterSpacing: 0.3 },

  switchLink: { marginTop: 18, alignItems: "center" },
  switchText: { color: C.brown, fontSize: 13, fontStyle: "italic" },
});
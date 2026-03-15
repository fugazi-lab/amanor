/*
    home.jsx — the hub. the launchpad. the vibe setter.
    first thing you see after login. links to everything.
*/

import {
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  View,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const C = {
  bg:       "#fffaeb",
  brown:    "#b38e75",
  dark:     "#6d4d40",
  pink:     "#d395a2",
  burgundy: "#8b2c3a",
};

export default function HomeScreen() {
  const router = useRouter();
  const { username } = useLocalSearchParams();
  const user = username || "friend";

  const PAGES = [
    {
      id: "index",
      pathname: "/(drawer)/",
      params: {},
      emoji: "📌",
      title: "Support Board",
      desc: "post your thoughts, read others, and feel less alone.",
      accent: C.burgundy,
      iconBg: "#fde8e8",
    },
    {
      id: "explore",
      pathname: "/(drawer)/explore",
      params: {},
      emoji: "💬",
      title: "Discussion",
      desc: "dive into threads and join the conversation.",
      accent: C.pink,
      iconBg: "#fce4ef",
    },
    {
      id: "files",
      pathname: "/(drawer)/files",
      params: { username: user }, // pass username so files page knows whose files to show
      emoji: "🎧",
      title: "My Media",
      desc: "your private audio and video uploads. only you can see these.",
      accent: "#5b7fa6",
      iconBg: "#ddeeff",
    },
    {
      id: "donate",
      pathname: "/(drawer)/donate",
      params: {},
      emoji: "🙏",
      title: "Donate",
      desc: "help keep this space running. every bit counts.",
      accent: "#e6a817",
      iconBg: "#fff4d6",
    },
    {
      id: "legal",
      pathname: "/(drawer)/legal",
      params: {},
      emoji: "⚖️",
      title: "Legal & Rights",
      desc: "your rights, our terms, the fine print made readable.",
      accent: C.dark,
      iconBg: "#ede0d8",
    },
  ];

  return (
    <SafeAreaView style={styles.root}>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <Text style={styles.headerEyebrow}>you're in.</Text>
        <Text style={styles.headerTitle}>hey, {user} 👋</Text>
        <Text style={styles.headerSub}>
          this is your space. take it at your own pace.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        <Text style={styles.sectionLabel}>where do you want to go?</Text>

        {PAGES.map((page) => (
          <TouchableOpacity
            key={page.id}
            style={[styles.card, { borderLeftColor: page.accent }]}
            onPress={() =>
              router.push({ pathname: page.pathname, params: page.params })
            }
            activeOpacity={0.82}
          >
            <View style={[styles.iconBox, { backgroundColor: page.iconBg }]}>
              <Text style={styles.iconEmoji}>{page.emoji}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{page.title}</Text>
              <Text style={styles.cardDesc}>{page.desc}</Text>
            </View>
            <Text style={styles.cardArrow}>→</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            you can also use the menu (☰) to jump between pages anytime.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  header: {
    backgroundColor: C.dark,
    paddingVertical: 26,
    paddingHorizontal: 22,
    borderBottomWidth: 3,
    borderBottomColor: C.burgundy,
  },
  headerEyebrow: {
    fontSize: 11, color: C.brown, fontStyle: "italic",
    textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4,
  },
  headerTitle: {
    fontSize: 32, fontWeight: "900", color: C.bg,
    letterSpacing: -0.5, marginBottom: 6,
  },
  headerSub: { fontSize: 13, color: C.brown, fontStyle: "italic" },

  scroll: { padding: 20, paddingBottom: 48 },

  sectionLabel: {
    fontSize: 11, fontWeight: "700", color: C.brown,
    textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14,
  },

  card: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", borderRadius: 16,
    padding: 16, marginBottom: 12, borderLeftWidth: 4,
    shadowColor: C.dark, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  iconBox: {
    width: 50, height: 50, borderRadius: 13,
    alignItems: "center", justifyContent: "center", marginRight: 14,
  },
  iconEmoji: { fontSize: 24 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "800", color: C.dark, marginBottom: 3 },
  cardDesc: { fontSize: 12, color: C.brown, fontStyle: "italic", lineHeight: 17 },
  cardArrow: { fontSize: 18, color: C.brown, marginLeft: 8 },

  footerNote: {
    marginTop: 8, padding: 14,
    backgroundColor: "#fff8f0", borderRadius: 12,
    borderWidth: 1, borderColor: "#f0e0d0",
  },
  footerText: {
    fontSize: 12, color: C.brown, fontStyle: "italic",
    textAlign: "center", lineHeight: 18,
  },
});
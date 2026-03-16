import { useRouter } from "expo-router";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Theme ────────────────────────────────────────────────────────────────────
const COLORS = {
  cream: "#F5F0E4",
  maroon: "#8B1A2F",
  maroonDark: "#6B1424",
  maroonMid: "#7A1828",
  text: "#2C1810",
  textMuted: "#6B5B4E",
  textLight: "#9C8A7E",
  divider: "#C4B8A8",
  navBg: "#EDE8DC",
  white: "#FFFFFF",
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const LightbulbIcon = ({ size = 28, color = COLORS.maroon }) => (
  <View style={{ width: size, height: size + 8, alignItems: "center" }}>
    <View style={{ width: size * 0.62, height: size * 0.62, borderRadius: size * 0.31, borderWidth: 2.2, borderColor: color }} />
    <View style={{ width: size * 0.38, height: 5, backgroundColor: color, borderRadius: 2, marginTop: 1 }} />
    <View style={{ width: size * 0.28, height: 4, backgroundColor: color, borderRadius: 2, marginTop: 2 }} />
  </View>
);

const ArrowIcon = ({ color = "#C4A0A8" }) => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <View style={{ width: 18, height: 2, backgroundColor: color, borderRadius: 1 }} />
    <View style={{
      width: 0, height: 0,
      borderTopWidth: 5, borderBottomWidth: 5, borderLeftWidth: 7,
      borderTopColor: "transparent", borderBottomColor: "transparent", borderLeftColor: color,
      marginLeft: -1,
    }} />
  </View>
);

const HomeIcon = ({ color = COLORS.textMuted, size = 24 }) => (
  <View style={{ width: size, height: size, alignItems: "center", justifyContent: "flex-end" }}>
    <View style={{ width: 0, height: 0, borderLeftWidth: size * 0.5, borderRightWidth: size * 0.5, borderBottomWidth: size * 0.42, borderLeftColor: "transparent", borderRightColor: "transparent", borderBottomColor: color, position: "absolute", top: 0 }} />
    <View style={{ width: size * 0.66, height: size * 0.5, backgroundColor: color, borderBottomLeftRadius: 2, borderBottomRightRadius: 2, alignItems: "center", justifyContent: "flex-end", paddingBottom: 2 }}>
      <View style={{ width: size * 0.26, height: size * 0.34, backgroundColor: COLORS.navBg, borderRadius: 1 }} />
    </View>
  </View>
);

const PlusCircleIcon = ({ color = COLORS.maroon, size = 26 }) => (
  <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 2, borderColor: color, alignItems: "center", justifyContent: "center" }}>
    <View style={{ width: size * 0.5, height: 2, backgroundColor: color, position: "absolute" }} />
    <View style={{ width: 2, height: size * 0.5, backgroundColor: color, position: "absolute" }} />
  </View>
);

const SupportIcon = ({ color = COLORS.textMuted, size = 24 }) => (
  <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 2, borderColor: color, alignItems: "center", justifyContent: "center" }}>
    <Text style={{ fontSize: size * 0.44, color, fontWeight: "700", lineHeight: size * 0.5 }}>?</Text>
  </View>
);

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
function BottomNavBar({ active = "Report" }) {
  const router = useRouter();
  const tabs = [
    { key: "Home",    label: "Home",   route: "/(drawer)/home",    Icon: HomeIcon },
    { key: "Report",  label: "REPORT", route: "/(drawer)/report",  Icon: PlusCircleIcon },
    { key: "Support", label: "Support",route: "/(drawer)/index", Icon: SupportIcon },
  ];
  return (
    <View style={nav.bar}>
      {tabs.map(({ key, label, route, Icon }) => {
        const isReport = key === "Report";
        const color = isReport ? COLORS.maroon : active === key ? COLORS.maroon : COLORS.textMuted;
        return (
          <TouchableOpacity key={key} style={nav.tab} onPress={() => router.push(route)} activeOpacity={0.7}>
            <Icon color={color} size={isReport ? 26 : 24} />
            <Text style={[nav.label, { color }, isReport && nav.reportLabel]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const nav = StyleSheet.create({
  bar: { flexDirection: "row", backgroundColor: COLORS.navBg, borderTopWidth: 1, borderTopColor: COLORS.divider, paddingTop: 10, paddingBottom: Platform.OS === "ios" ? 24 : 12 },
  tab: { flex: 1, alignItems: "center", gap: 4 },
  label: { fontSize: 11, fontWeight: "500", marginTop: 2 },
  reportLabel: { fontWeight: "800", fontSize: 12, letterSpacing: 0.6 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ReportScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />

      {/* Lightbulb */}
      <View style={styles.topBulb}>
        <LightbulbIcon size={28} color={COLORS.maroon} />
      </View>

      <View style={styles.body}>
        {/* Title */}
        <Text style={styles.title}>Report Incident</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Report Workplace Harassment Safely-</Text>

        {/* Report Anonymously */}
        <TouchableOpacity
          style={styles.optionBtn}
          onPress={() => router.push("/(drawer)/report-anonymous")}
          activeOpacity={0.85}
        >
          <Text style={styles.optionText}>Report Anonymously</Text>
          <ArrowIcon />
        </TouchableOpacity>

        {/* Description */}
        <View style={styles.descBox}>
          <Text style={styles.descText}>*Report safely without revealing your identity</Text>
          <Text style={styles.descText}>*can be revealed later</Text>
        </View>

        {/* Report With Name */}
        <TouchableOpacity
          style={styles.optionBtn}
          onPress={() => router.push("/(drawer)/report-named")}
          activeOpacity={0.85}
        >
          <Text style={styles.optionText}>Report With Name</Text>
          <ArrowIcon />
        </TouchableOpacity>
      </View>

      <BottomNavBar active="Report" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.cream },
  topBulb: { paddingHorizontal: 28, paddingTop: 14, alignItems: "flex-start" },
  body: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.maroon,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    letterSpacing: 0.3,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 28,
    lineHeight: 20,
  },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.maroonMid,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 22,
    shadowColor: COLORS.maroonDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  optionText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.2,
    opacity: 0.9,
  },
  descBox: {
    marginVertical: 16,
    paddingHorizontal: 4,
    gap: 3,
  },
  descText: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    lineHeight: 19,
  },
});
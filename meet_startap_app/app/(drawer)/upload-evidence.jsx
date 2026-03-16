import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  Alert,
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
  btnVideo: "#A0606E",   // pinkish-maroon for Upload Video
  btnAudio: "#9E8570",   // warm taupe for Upload Audio
  btnSaved: "#B89080",   // lighter warm for Choose From Saved
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

// Video camera icon
const VideoIcon = ({ size = 22, color = COLORS.maroon }) => (
  <View style={{ width: size, height: size * 0.7, flexDirection: "row", alignItems: "center" }}>
    {/* Body */}
    <View style={{ width: size * 0.62, height: size * 0.7, borderRadius: 4, borderWidth: 2, borderColor: color }} />
    {/* Lens triangle */}
    <View style={{ width: 0, height: 0, borderTopWidth: size * 0.28, borderBottomWidth: size * 0.28, borderLeftWidth: size * 0.28, borderTopColor: "transparent", borderBottomColor: "transparent", borderLeftColor: color, marginLeft: 2 }} />
  </View>
);

// Mic icon
const MicIcon = ({ size = 22, color = COLORS.maroon }) => (
  <View style={{ width: size, height: size + 4, alignItems: "center" }}>
    <View style={{ width: size * 0.52, height: size * 0.6, borderRadius: size * 0.26, borderWidth: 2, borderColor: color }} />
    <View style={{ width: size * 0.78, height: size * 0.3, borderBottomLeftRadius: size * 0.39, borderBottomRightRadius: size * 0.39, borderWidth: 2, borderTopWidth: 0, borderColor: color, marginTop: -3 }} />
    <View style={{ width: 2, height: size * 0.16, backgroundColor: color, marginTop: 1 }} />
    <View style={{ width: size * 0.44, height: 2, backgroundColor: color, borderRadius: 1 }} />
  </View>
);

// Folder icon
const FolderIcon = ({ size = 22, color = COLORS.maroon }) => (
  <View style={{ width: size, height: size * 0.8, justifyContent: "flex-end" }}>
    <View style={{ position: "absolute", top: 0, left: 0, width: size * 0.42, height: size * 0.22, backgroundColor: color, borderTopLeftRadius: 3, borderTopRightRadius: 3 }} />
    <View style={{ width: size, height: size * 0.62, backgroundColor: color, borderRadius: 4, borderTopLeftRadius: 0 }} />
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

// ─── Upload option button ─────────────────────────────────────────────────────
function UploadOption({ icon: Icon, iconColor, label, bgColor, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.uploadBtn, { backgroundColor: bgColor }]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      {/* Icon circle */}
      <View style={[styles.iconCircle, { borderColor: iconColor }]}>
        <Icon size={20} color={iconColor} />
      </View>
      <Text style={styles.uploadBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function UploadEvidenceScreen() {
  const router = useRouter();

  const handleUploadVideo = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission required", "Please allow access to your photo library in Settings.");
    return;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    allowsEditing: false,
    quality: 1,
  });
  if (!result.canceled && result.assets?.length > 0) {
    const video = result.assets[0];
    Alert.alert("Video selected", `File: ${video.fileName ?? "video"}`);
    // TODO: pass video.uri to your evidence upload handler
  }
};
  const handleUploadAudio = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "audio/*",
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (!result.canceled && result.assets?.length > 0) {
      const audio = result.assets[0];
      Alert.alert("Audio selected", `File: ${audio.name}`);
      // TODO: pass audio.uri to your evidence upload handler
    }
  } catch (err) {
    Alert.alert("Error", "Could not open audio picker.");
  }
};
  const handleSavedEvidence = () => Alert.alert("Saved Evidence", "Browse your saved evidence files.");

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.cream} />

      {/* Lightbulb */}
      <View style={styles.topBulb}>
        <LightbulbIcon size={28} color={COLORS.maroon} />
      </View>

      <View style={styles.body}>
        {/* Title */}
        <Text style={styles.title}>Upload Evidence</Text>

        {/* Subtitle as link-style text */}
        <Text style={styles.subtitle}>
          How would you like to upload{"\n"}your evidence?
        </Text>

        {/* Upload buttons */}
        <View style={styles.btnStack}>
          <UploadOption
            icon={VideoIcon}
            iconColor={COLORS.maroon}
            label="Upload Video"
            bgColor={COLORS.btnVideo}
            onPress={handleUploadVideo}
          />
          <UploadOption
            icon={MicIcon}
            iconColor={COLORS.maroon}
            label="Upload Audio"
            bgColor={COLORS.btnAudio}
            onPress={handleUploadAudio}
          />
          <UploadOption
            icon={FolderIcon}
            iconColor={COLORS.maroon}
            label={"Choose From\nSaved Evidence"}
            bgColor={COLORS.btnSaved}
            onPress={handleSavedEvidence}
          />
        </View>
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
    paddingTop: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.maroon,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    letterSpacing: 0.3,
    marginBottom: 14,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 23,
    marginBottom: 36,
  },
  btnStack: {
    gap: 16,
  },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  uploadBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
    flexShrink: 1,
  },
});
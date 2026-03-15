/*
    donate.jsx — because running this costs money and kindness is free.
    links out to donation options. no pressure. but also, please.
*/

import {
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Linking,
  Alert,
} from "react-native";

const C = {
  bg:       "#fffaeb",
  brown:    "#b38e75",
  dark:     "#6d4d40",
  pink:     "#d395a2",
  burgundy: "#8b2c3a",
};

const DONATION_OPTIONS = [
  {
    id: "buymeacoffee",
    emoji: "☕",
    title: "Buy Me a Coffee",
    desc: "a one-time small donation. the price of a latte. means a lot.",
    url: "https://buymeacoffee.com/", // replace with your link
    color: "#FFDD00",
    textColor: "#6d4d40",
  },
  {
    id: "paypal",
    emoji: "💙",
    title: "PayPal",
    desc: "quick and easy. every bit helps keep the lights on.",
    url: "https://paypal.me/", // replace with your link
    color: "#003087",
    textColor: "#fff",
  },
  {
    id: "patreon",
    emoji: "🎗️",
    title: "Patreon",
    desc: "become a recurring supporter. join the inner circle.",
    url: "https://patreon.com/", // replace with your link
    color: "#FF424D",
    textColor: "#fff",
  },
];

const openLink = async (url, title) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Couldn't open link", `Please visit: ${url}`);
    }
  } catch (err) {
    Alert.alert("Error", "Couldn't open the link. Try again later.");
  }
};

export default function DonateScreen() {
  return (
    <SafeAreaView style={styles.root}>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Support Us 🙏</Text>
        <Text style={styles.headerSub}>
          this app is built with care and runs on donations.
          if it's helped you, consider giving back.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* ── WHY DONATE CARD ── */}
        <View style={styles.whyCard}>
          <Text style={styles.whyTitle}>Why donate?</Text>
          <Text style={styles.whyText}>
            This is a community-first platform — no ads, no data selling,
            no corporate backing. Just real people supporting each other.
            Donations go directly toward keeping the app running, improving
            features, and making this space better for everyone.
          </Text>
        </View>

        {/* ── DONATION OPTIONS ── */}
        <Text style={styles.sectionLabel}>Choose a way to help</Text>

        {DONATION_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.donateCard}
            onPress={() => openLink(option.url, option.title)}
            activeOpacity={0.82}
          >
            <View style={[styles.donateIconBox, { backgroundColor: option.color }]}>
              <Text style={styles.donateEmoji}>{option.emoji}</Text>
            </View>
            <View style={styles.donateBody}>
              <Text style={styles.donateTitle}>{option.title}</Text>
              <Text style={styles.donateDesc}>{option.desc}</Text>
            </View>
            <Text style={styles.donateArrow}>→</Text>
          </TouchableOpacity>
        ))}

        {/* ── THANK YOU NOTE ── */}
        <View style={styles.thankYouBox}>
          <Text style={styles.thankYouText}>
            Even if you can't donate — just being here and using the app
            means the world. thank you. genuinely. 💛
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
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    borderBottomColor: C.burgundy,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: C.bg,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  headerSub: {
    fontSize: 12,
    color: C.brown,
    fontStyle: "italic",
    lineHeight: 18,
  },

  scroll: {
    padding: 18,
    paddingBottom: 48,
  },

  // why donate
  whyCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: C.pink,
    shadowColor: C.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  whyTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: C.dark,
    marginBottom: 8,
  },
  whyText: {
    fontSize: 13,
    color: "#4a3530",
    lineHeight: 20,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: C.brown,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 12,
  },

  // donation option cards
  donateCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: C.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  donateIconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  donateEmoji: {
    fontSize: 24,
  },
  donateBody: {
    flex: 1,
  },
  donateTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: C.dark,
    marginBottom: 3,
  },
  donateDesc: {
    fontSize: 12,
    color: C.brown,
    fontStyle: "italic",
    lineHeight: 17,
  },
  donateArrow: {
    fontSize: 18,
    color: C.brown,
    marginLeft: 8,
  },

  // thank you
  thankYouBox: {
    marginTop: 10,
    backgroundColor: "#fff8f0",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f0e0d0",
  },
  thankYouText: {
    fontSize: 13,
    color: C.dark,
    fontStyle: "italic",
    lineHeight: 20,
    textAlign: "center",
  },
});
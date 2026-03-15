/*
    legal.jsx — the fine print. but make it readable.
    terms, privacy, rights. the stuff people scroll past but should read.
*/

import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";

const C = {
  bg:       "#fffaeb",
  brown:    "#b38e75",
  dark:     "#6d4d40",
  pink:     "#d395a2",
  burgundy: "#8b2c3a",
};

const SECTIONS = [
  {
    id: "terms",
    title: "Terms of Use",
    emoji: "📋",
    content: `By using this app, you agree to use it respectfully and in good faith.

You may not use this platform to harass, threaten, or harm other users. You may not post illegal content, spam, or anything that violates the rights of others.

We reserve the right to remove content or suspend access to users who violate these terms. We are not liable for content posted by users.

These terms may be updated at any time. Continued use of the app means you accept any updated terms.`,
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    emoji: "🔒",
    content: `We take your privacy seriously. Here's what we collect and why:

• Username and password — used to identify you and secure your account. Passwords are stored as-is for now (prototype stage).

• Posts and comments — public to all users of the app. Do not post anything you want kept private.

• We do not sell your data. We do not share it with third parties. We do not run ads.

Data is stored securely via Appwrite cloud infrastructure. You can request deletion of your account and all associated data by contacting us.`,
  },
  {
    id: "rights",
    title: "Your Rights",
    emoji: "⚖️",
    content: `You have the right to:

• Access the data we hold about you.
• Request correction of inaccurate data.
• Request deletion of your account and data.
• Withdraw consent at any time by stopping use of the app.

This app is designed as a safe, supportive space. If you feel your rights have been violated or you've experienced abuse on the platform, please reach out to us directly.

We are committed to protecting your dignity and your data.`,
  },
  {
    id: "content",
    title: "Content Ownership",
    emoji: "✍️",
    content: `You own what you post. By submitting content to this app, you grant us a non-exclusive, royalty-free licence to display that content within the app.

We do not claim ownership of your posts or comments. You are responsible for ensuring your content does not infringe on the rights of others.

If you believe content on the platform infringes your rights, contact us and we will review it promptly.`,
  },
  {
    id: "contact",
    title: "Contact Us",
    emoji: "✉️",
    content: `Have a question about these terms, your data, or anything else?

Reach out to us at:
support@meetstartap.com

We aim to respond within 48 hours. For urgent concerns regarding safety or abuse, please mark your message as urgent.`,
  },
];

// collapsible section component
function LegalSection({ section }) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setOpen(!open)}
        activeOpacity={0.75}
      >
        <Text style={styles.sectionEmoji}>{section.emoji}</Text>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <Text style={styles.sectionChevron}>{open ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.sectionBody}>
          <Text style={styles.sectionContent}>{section.content}</Text>
        </View>
      )}
    </View>
  );
}

export default function LegalScreen() {
  return (
    <SafeAreaView style={styles.root}>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Legal & Rights ⚖️</Text>
        <Text style={styles.headerSub}>
          the important stuff. tap each section to read more.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        <Text style={styles.lastUpdated}>Last updated: March 2026</Text>

        {SECTIONS.map((section) => (
          <LegalSection key={section.id} section={section} />
        ))}

        {/* ── FOOTER NOTE ── */}
        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            This app is a prototype and these terms are for informational
            purposes. For legal matters, please consult a qualified professional.
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
  },

  scroll: {
    padding: 18,
    paddingBottom: 48,
  },

  lastUpdated: {
    fontSize: 11,
    color: C.brown,
    fontStyle: "italic",
    marginBottom: 16,
    textAlign: "right",
  },

  // collapsible section
  section: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 10,
    overflow: "hidden",
    shadowColor: C.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  sectionEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: C.dark,
  },
  sectionChevron: {
    fontSize: 11,
    color: C.brown,
    marginLeft: 8,
  },
  sectionBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0e8df",
  },
  sectionContent: {
    fontSize: 13,
    color: "#4a3530",
    lineHeight: 21,
    marginTop: 12,
  },

  // footer
  footerNote: {
    marginTop: 12,
    padding: 14,
    backgroundColor: "#fff8f0",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f0e0d0",
  },
  footerText: {
    fontSize: 11,
    color: C.brown,
    fontStyle: "italic",
    lineHeight: 17,
    textAlign: "center",
  },
});
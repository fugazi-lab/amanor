/*
    files.jsx — your media locker.
    upload audio & video. it's yours, only you see it.

    web    → uses 'appwrite' web SDK for ALL operations
    native → uses 'react-native-appwrite' SDK for ALL operations
*/

import {
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { Audio, Video, ResizeMode } from "expo-av";

// ── NATIVE SDK ───────────────────────────────────────────────
import {
  Client     as NativeClient,
  Databases  as NativeDatabases,
  Storage    as NativeStorage,
  Query      as NativeQuery,
  ID         as NativeID,
} from "react-native-appwrite";

// ── WEB SDK ──────────────────────────────────────────────────
import {
  Client     as WebClient,
  Databases  as WebDatabases,
  Storage    as WebStorage,
  Query      as WebQuery,
  ID         as WebID,
} from "appwrite";

// ── CONFIG ───────────────────────────────────────────────────
const CFG = {
  endpoint:   "https://cloud.appwrite.io/v1",
  projectId:  "69af49d80022d666076a",
  dbId:       "69b0806500366fecf954",
  filesColId: "files",
  bucketId:   "69b5e659000ecd76ce30",
};

// ── BUILD THE RIGHT CLIENT FOR THE PLATFORM ──────────────────
let db, stor, Query, ID;

if (Platform.OS === "web") {
  const wc = new WebClient()
    .setEndpoint(CFG.endpoint)
    .setProject(CFG.projectId);
  db    = new WebDatabases(wc);
  stor  = new WebStorage(wc);
  Query = WebQuery;
  ID    = WebID;
} else {
  const nc = new NativeClient()
    .setEndpoint(CFG.endpoint)
    .setProject(CFG.projectId)
    .setPlatform("com.meetstartap.app");
  db    = new NativeDatabases(nc);
  stor  = new NativeStorage(nc);
  Query = NativeQuery;
  ID    = NativeID;
}

// ── COLOURS ──────────────────────────────────────────────────
const C = {
  bg:       "#fffaeb",
  brown:    "#b38e75",
  dark:     "#6d4d40",
  pink:     "#d395a2",
  burgundy: "#8b2c3a",
};

// ── HELPERS ──────────────────────────────────────────────────
const isAudio = (mime) => mime?.startsWith("audio/");
const isVideo = (mime) => mime?.startsWith("video/");

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
};

const getErrMsg = (err) => {
  if (!err) return "Unknown error.";
  if (typeof err === "string") return err;
  return err.message || err.response?.message || JSON.stringify(err) || "Unknown error.";
};

// build a public view URL without needing the SDK
const getFileViewURL = (fileId) =>
  `${CFG.endpoint}/storage/buckets/${CFG.bucketId}/files/${fileId}/view?project=${CFG.projectId}`;

// ── UPLOAD ───────────────────────────────────────────────────
const uploadFile = async (asset) => {
  const fileId = ID.unique();

  if (Platform.OS === "web") {
    if (!asset.file) throw new Error("No file object. Try re-selecting the file.");
    return await stor.createFile(CFG.bucketId, fileId, asset.file);
  } else {
    return await stor.createFile(CFG.bucketId, fileId, {
      uri:  asset.uri,
      name: asset.name,
      type: asset.mimeType || "application/octet-stream",
      size: asset.size || 0,
    });
  }
};

// ── AUDIO PLAYER ─────────────────────────────────────────────
function AudioRow({ file, url }) {
  const [sound, setSound]     = useState(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = async () => {
    try {
      if (sound) {
        if (playing) { await sound.pauseAsync(); setPlaying(false); }
        else         { await sound.playAsync();  setPlaying(true);  }
      } else {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound: s } = await Audio.Sound.createAsync(
          { uri: url }, { shouldPlay: true }
        );
        s.setOnPlaybackStatusUpdate((st) => { if (st.didJustFinish) setPlaying(false); });
        setSound(s);
        setPlaying(true);
      }
    } catch (err) {
      Alert.alert("Playback error", getErrMsg(err));
    }
  };

  return (
    <View style={styles.fileCard}>
      <View style={[styles.fileIconBox, { backgroundColor: "#e8f4fd" }]}>
        <Text style={styles.fileEmoji}>🎵</Text>
      </View>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1}>{file.fileName}</Text>
        <Text style={styles.fileMeta}>{formatDate(file.$createdAt)}</Text>
      </View>
      <TouchableOpacity style={styles.playButton} onPress={togglePlay}>
        <Text style={styles.playButtonText}>{playing ? "⏸" : "▶"}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── VIDEO PLAYER ─────────────────────────────────────────────
function VideoRow({ file, url }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.fileCard}>
      {expanded ? (
        <View style={{ width: "100%" }}>
          <Video
            source={{ uri: url }}
            style={styles.videoPlayer}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
          />
          <TouchableOpacity style={styles.collapseButton} onPress={() => setExpanded(false)}>
            <Text style={styles.collapseText}>▲ collapse</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={[styles.fileIconBox, { backgroundColor: "#f0e8ff" }]}>
            <Text style={styles.fileEmoji}>🎬</Text>
          </View>
          <View style={styles.fileInfo}>
            <Text style={styles.fileName} numberOfLines={1}>{file.fileName}</Text>
            <Text style={styles.fileMeta}>{formatDate(file.$createdAt)}</Text>
          </View>
          <TouchableOpacity style={styles.playButton} onPress={() => setExpanded(true)}>
            <Text style={styles.playButtonText}>▶</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

// ── MAIN SCREEN ──────────────────────────────────────────────
export default function FilesScreen() {
  const { username } = useLocalSearchParams();
  const user = username || "anon";

  const [files, setFiles]           = useState([]);
  const [fileURLs, setFileURLs]     = useState({});
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading]   = useState(false);

  // ── FETCH ─────────────────────────────────────────────────
  const fetchFiles = async () => {
    try {
      const res = await db.listDocuments(
        CFG.dbId,
        CFG.filesColId,
        [Query.search("username", user)]
      );

      const mine = res.documents.filter(
        (d) => d.username?.toLowerCase() === user.toLowerCase()
      );

      // build view URLs directly — works on both web and native
      const urls = {};
      for (const f of mine) {
        urls[f.fileId] = getFileViewURL(f.fileId);
      }

      console.log("Fetched", mine.length, "files for", user);
      setFiles(mine.reverse());
      setFileURLs(urls);
    } catch (err) {
      console.error("Fetch error:", getErrMsg(err));
      Alert.alert("Error", "Couldn't load your files.\n" + getErrMsg(err));
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFiles();
    setRefreshing(false);
  }, []);

  useEffect(() => { fetchFiles(); }, []);

  // ── UPLOAD ────────────────────────────────────────────────
  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["audio/*", "video/*"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      console.log("Picked:", asset.name, asset.mimeType, asset.size, "| platform:", Platform.OS);

      setUploading(true);

      const uploaded = await uploadFile(asset);
      console.log("Uploaded:", uploaded.$id);

      await db.createDocument(
        CFG.dbId,
        CFG.filesColId,
        ID.unique(),
        {
          fileId:   uploaded.$id,
          username: user,
          fileName: asset.name,
          mimeType: asset.mimeType || "application/octet-stream",
        }
      );

      Alert.alert("Uploaded!", `"${asset.name}" is ready.`);
      fetchFiles();

    } catch (err) {
      console.error("Upload error:", getErrMsg(err));
      Alert.alert("Upload failed", getErrMsg(err));
    } finally {
      setUploading(false);
    }
  };

  // ── RENDER ────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.root}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Media 🎧</Text>
        <Text style={styles.headerSub}>
          audio and video files — private to you, {user}.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.brown} />
        }
      >
        <TouchableOpacity
          style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
          onPress={handleUpload}
          disabled={uploading}
          activeOpacity={0.82}
        >
          {uploading ? (
            <View style={styles.uploadingRow}>
              <ActivityIndicator color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.uploadButtonText}>Uploading...</Text>
            </View>
          ) : (
            <Text style={styles.uploadButtonText}>＋ Upload Audio or Video</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>Your Files</Text>

        {loading ? (
          <ActivityIndicator size="large" color={C.brown} style={{ marginTop: 24 }} />
        ) : files.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyText}>no files yet. upload something!</Text>
          </View>
        ) : (
          files.map((file) => {
            const url = fileURLs[file.fileId];
            if (!url) return null;
            if (isAudio(file.mimeType)) return <AudioRow key={file.$id} file={file} url={url} />;
            if (isVideo(file.mimeType)) return <VideoRow key={file.$id} file={file} url={url} />;
            return (
              <View key={file.$id} style={styles.fileCard}>
                <View style={styles.fileIconBox}>
                  <Text style={styles.fileEmoji}>📁</Text>
                </View>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName}>{file.fileName}</Text>
                  <Text style={styles.fileMeta}>{formatDate(file.$createdAt)}</Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── STYLES ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  header: {
    backgroundColor: C.dark,
    paddingVertical: 22, paddingHorizontal: 20,
    borderBottomWidth: 3, borderBottomColor: C.burgundy,
  },
  headerTitle: {
    fontSize: 26, fontWeight: "900", color: C.bg,
    letterSpacing: -0.5, marginBottom: 6,
  },
  headerSub: { fontSize: 12, color: C.brown, fontStyle: "italic" },

  scroll: { padding: 18, paddingBottom: 48 },

  uploadButton: {
    backgroundColor: C.burgundy, padding: 18,
    borderRadius: 14, alignItems: "center", marginBottom: 26,
    shadowColor: C.dark, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  uploadButtonDisabled: { opacity: 0.6 },
  uploadButtonText: { color: "#fff", fontSize: 16, fontWeight: "900", letterSpacing: 0.3 },
  uploadingRow: { flexDirection: "row", alignItems: "center" },

  sectionLabel: {
    fontSize: 11, fontWeight: "700", color: C.brown,
    textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12,
  },

  emptyState: { alignItems: "center", marginTop: 32 },
  emptyEmoji: { fontSize: 40, marginBottom: 10 },
  emptyText: { color: C.brown, fontSize: 14, fontStyle: "italic" },

  fileCard: {
    flexDirection: "row", alignItems: "center", flexWrap: "wrap",
    backgroundColor: "#fff", borderRadius: 14, padding: 14, marginBottom: 10,
    borderLeftWidth: 4, borderLeftColor: C.pink,
    shadowColor: C.dark, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  fileIconBox: {
    width: 46, height: 46, borderRadius: 12,
    backgroundColor: "#f5ede6", alignItems: "center",
    justifyContent: "center", marginRight: 12,
  },
  fileEmoji: { fontSize: 22 },
  fileInfo: { flex: 1 },
  fileName: { fontSize: 14, fontWeight: "700", color: C.dark, marginBottom: 3 },
  fileMeta: { fontSize: 11, color: C.brown, fontStyle: "italic" },

  playButton: {
    backgroundColor: C.pink, width: 40, height: 40,
    borderRadius: 20, alignItems: "center", justifyContent: "center", marginLeft: 8,
  },
  playButtonText: { fontSize: 16, color: "#fff" },

  videoPlayer: {
    width: "100%", height: 200, borderRadius: 10,
    backgroundColor: "#000", marginTop: 8,
  },
  collapseButton: { marginTop: 8, alignItems: "center" },
  collapseText: { color: C.brown, fontSize: 12, fontStyle: "italic" },
});
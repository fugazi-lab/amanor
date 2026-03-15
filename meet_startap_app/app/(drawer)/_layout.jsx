/*
    This is the layout for the drawer navigation.
*/

import { Drawer } from "expo-router/drawer";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  initialRouteName: "home",
};

export default function DrawerLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: true,
        }}
      >
        <Drawer.Screen
          name="home"
          options={{
            drawerLabel: "Home",
            title: "Home",
            drawerIcon: ({ color }) => (
              <IconSymbol size={24} name="house.fill" color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Support Board",
            title: "Support Board",
            drawerIcon: ({ color }) => (
              <IconSymbol size={24} name="pin.fill" color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="explore"
          options={{
            drawerLabel: "Discussion",
            title: "Discussion",
            drawerIcon: ({ color }) => (
              <IconSymbol size={24} name="bubble.left.and.bubble.right.fill" color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="files"
          options={{
            drawerLabel: "My Media",
            title: "My Media",
            drawerIcon: ({ color }) => (
              <IconSymbol size={24} name="play.rectangle.fill" color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="donate"
          options={{
            drawerLabel: "Donate",
            title: "Donate",
            drawerIcon: ({ color }) => (
              <IconSymbol size={24} name="heart.fill" color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="legal"
          options={{
            drawerLabel: "Legal & Rights",
            title: "Legal & Rights",
            drawerIcon: ({ color }) => (
              <IconSymbol size={24} name="doc.text.fill" color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
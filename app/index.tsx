import WorkSansFonts from "@/types/Font";
import usePocketBase from "@/stores/usePocketBase";

import { Pressable, Text, ToastAndroid, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";

import "../global.css";

export default function Index() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { isLoggedIn, instance, user_record } = usePocketBase();

  useFocusEffect(
    useCallback(() => {
      const checkSession = async () => {
        if (instance && isLoggedIn) {
          router.replace("/(student)/dashboard");
        } else {
          setIsInitialized(true)
        }
      };

      checkSession();
    }, [])
  );

  if (isInitialized) {
    return (
      <SafeAreaView className="flex-1 justify-center gap-4 bg-white">
        <Text
          className="text-5xl text-[#242424] mx-8"
          style={{ fontFamily: WorkSansFonts.WorkSans_900Black }}
        >
          etudier
        </Text>
        <Text
          className="mx-8"
          style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
        >
          Your tasks, notes, and quizzes are waiting. Sign in to pick up where
          you left off—or join thousands of learners and doers who organize
          smarter every day.
        </Text>
        <View className="gap-4 mx-8 flex flex-row">
          <Pressable
            className="flex-1 p-4 bg-gray-100 border border-gray-300 shadow disabled:bg-green-500 rounded-3xl text-center"
            onPress={() => {
              router.push("/(auth)/login");
            }}
          >
            <Text
              style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
              className="text-center"
            >
              Login
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              router.push("/(auth)/register");
            }}
            className="flex-1 p-4 bg-gray-100 border border-gray-300 shadow disabled:bg-green-500 rounded-3xl text-center"
          >
            <Text
              style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
              className="text-center"
            >
              Register
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return <SafeAreaView className="flex-1 bg-white"></SafeAreaView>;
}

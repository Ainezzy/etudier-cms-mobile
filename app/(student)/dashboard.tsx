import usePocketBase from "@/stores/usePocketBase";
import WorkSansFonts from "@/types/Font";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { router } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Pressable } from "react-native";

export default function Page() {
  const { instance, user_record, isLoggedIn } = usePocketBase();

  const { data } = useQuery({
    queryKey: ["student"],
    queryFn: async () => {
      try {
        const modules_progress = await instance!
          .collection("users_modules_progress")
          .getList(1, 5, {
            filter: `user_id = '${user_record!.id}'`,
            expand: "module_id",
          });

        const quiz_progress = await instance!
          .collection("users_quiz_submissions")
          .getList(1, 5, {
            filter: `user_id = '${user_record!.id}'`,
            expand: "quiz_id",
          });

        return {
          modules_progress: modules_progress.items,
          quiz_progress: quiz_progress.items,
        };
      } catch (err) {}
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size={64} color={"#242424"} />
      </SafeAreaView>
    );
  }

  return (
    <ScrollView
      contentContainerClassName="bg-white p-8 gap-8"
      className="bg-white"
    >
      <View className="flex-row justify-between items-center p-4 bg-gray-100 rounded-3xl border border-gray-300 shadow">
        <View className="">
          <Text
            className="text-gray-400"
            style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
          >
            Welcome back,
          </Text>
          {user_record && (
            <Text
              className="text-[#484848] text-2xl"
              style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}
            >
              {user_record!.name}
            </Text>
          )}
        </View>
        <MaterialIcons
          name="account-circle"
          size={36}
          color={"#242424"}
          onPress={() => router.push("/(student)/profile")}
        />
      </View>
      <Text
        style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}
        className="text-[#242424] text-4xl"
      >
        Activities
      </Text>
      <View className="flex-row gap-4">
        <Pressable
          onPress={() => router.push("/(student)/modules")}
          className="flex-1 gap-4 p-4 bg-gray-100 rounded-3xl border border-gray-300 shadow items-center"
        >
          <MaterialIcons name="file-copy" size={96} color={"#242424"} />
          <Text
            className="text-lg"
            style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
          >
            Modules
          </Text>
        </Pressable>
        {/* */}
        <Pressable
          onPress={() => router.push("/(student)/quiz")}
          className="flex-1 gap-4 p-4 bg-gray-100 rounded-3xl border border-gray-300 shadow items-center"
        >
          <MaterialIcons name="quiz" size={96} color={"#242424"} />
          <Text
            className="text-lg"
            style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
          >
            Quizzes
          </Text>
        </Pressable>
      </View>
      <View className="flex-col gap-4">
        <Text
          style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}
          className="text-[#242424] text-4xl"
        >
          Recent modules accessed
        </Text>
        {data && data!.modules_progress.length == 0 && (
          <View className="bg-gray-100 rounded-3xl border border-gray-300 shadow items-center p-8">
            <Text style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}>
              No recent modules accessed.
            </Text>
          </View>
        )}
        {data && data!.modules_progress.length > 0 && (
          <View className="bg-gray-100 rounded-3xl border border-gray-300 shadow gap-2 p-4">
            {data!.modules_progress.map((module) => (
              <Pressable
                key={module.id}
                className="flex-row gap-4 items-center text-sm text-gray-700 bg-gray-50 rounded-3xl p-4"
              >
                <Text style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}>
                  {module.expand.module_id.title}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
      <View className="flex-col hidden gap-4">
        <Text
          style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}
          className="text-[#242424] text-4xl"
        >
          Recent quiz accessed
        </Text>
        {data && data!.quiz_progress.length == 0 && (
          <View className="bg-gray-100 rounded-3xl border border-gray-300 shadow items-center p-8">
            <Text style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}>
              No recent quiz accessed.
            </Text>
          </View>
        )}
        {data && data!.quiz_progress.length > 0 && (
          <View className="bg-gray-100 rounded-3xl border border-gray-300 shadow gap-2 p-4">
            {data!.quiz_progress.map((quiz) => (
              <Pressable
                key={quiz.id}
                className="flex-row gap-4 items-center text-sm text-gray-700 bg-gray-50 rounded-3xl p-4"
              >
                <Text style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}>
                  {quiz.expand.quiz_id.title}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

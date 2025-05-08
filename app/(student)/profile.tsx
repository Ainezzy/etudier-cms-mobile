import usePocketBase from "@/stores/usePocketBase";
import WorkSansFonts from "@/types/Font";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";

import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { user_record, instance, setUserRecord } = usePocketBase();

  const { data } = useQuery({
  queryKey: ["student_profile", user_record ? user_record.id : "user_id"],
  queryFn: async () => {
    if (!user_record) return { modules_progress: [], quiz_progress: [] };

    try {
      const modules_progress = await instance!
        .collection("users_modules_progress")
        .getList(1, 5, {
          filter: `user_id = '${user_record.id}'`,
          expand: "module_id",
        });

      const quiz_progress = await instance!
        .collection("users_quiz_submissions")
        .getList(1, 5, {
          filter: `user_id = '${user_record.id}'`,
          expand: "quiz_id",
        });

      return {
        modules_progress: modules_progress.items,
        quiz_progress: quiz_progress.items,
      };
    } catch (err) {
      console.error("Query error:", err);
      return {
        modules_progress: [],
        quiz_progress: [],
      }; // or you can `throw err` if you want to trigger React Query error states
    }
  },
  enabled: !!user_record, // prevents query from running with undefined user_record
  refetchOnWindowFocus: false,
});

  const handleLogout = async () => {
    await instance?.authStore.clear();
    setUserRecord(null);
    router.replace("/(auth)/login");
  };

  if (!user_record) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size={64} color={"#242424"} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-6 gap-10">
      <View className="flex-row items-center justify-between">
        <View className="flex-row gap-4 mt-8 p-6 items-center">
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={"#242424"}
            onPress={() => router.back()}
          />
          <Text
            style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}
            className="text-2xl"
          >
            Profile
          </Text>
        </View>
        <View className="flex flex-row gap-4 mt-8 p-6 items-center">
          <MaterialIcons
            name="edit"
            size={24}
            color={"#242424"}
            onPress={() => router.push("/(student)/edit")}
          />
          <MaterialIcons
            name="logout"
            size={24}
            color={"#242424"}
            onPress={handleLogout}
          />
          </View>
        </View>

      <View className="gap-4 p-6">
        <View className="flex flex-row gap-4 items-center">
          <MaterialIcons name="account-circle" size={48} color={"#242424"} />
          <View>
            {/* NAME */}
            <Text
              style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
              className="text-xl"
            >
              {user_record!.name}
            </Text>

            {/* SCHOOL */}
            <Text
              style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
              className="text-sm text-gray-400"
            >
              Studies at {user_record!.school}
              {user_record!.year_level
                ? ` / ${
                    user_record!.year_level == "1"
                      ? "1st Year"
                      : user_record!.year_level == "2"
                      ? "2nd Year"
                      : user_record!.year_level == "3"
                      ? "3rd Year"
                      : user_record!.year_level == "4"
                      ? "4th Year"
                      : null
                  }`
                : ""}
            </Text>
          </View>
        </View>
        <View>
          {/* ADDITIONAL DETAILS */}
          <Text className="text-sm mt-2">
            <Text style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}>
              Gender:{" "}
            </Text>
            <Text style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }} className="text-gray-600">
              {user_record!.gender}
            </Text>
          </Text>
          <Text className="text-sm mt-2">
            <Text style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}>
              Email:{" "}
            </Text>
            <Text style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }} className="text-gray-600">
              {user_record!.email}
            </Text>
          </Text>
          <Text className="text-sm mt-2">
            <Text style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}>
              Phone Number:{" "}
            </Text>
            <Text style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }} className="text-gray-600">
              +63 - {user_record!.phone_number}
            </Text>
          </Text>
          <Text className="text-sm mt-2">
            <Text style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}>
              Date Of Birth:{" "}
            </Text>
            <Text style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }} className="text-gray-600">
              {user_record!.date_of_birth}
            </Text>
          </Text>

          <Text className="text-sm mt-2">
            <Text style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}>
              Department:{" "}
            </Text>
            <Text style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }} className="text-gray-600">
              {user_record!.department}
            </Text>
          </Text>
          <Text className="text-sm mt-2">
            <Text style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}>
              Course:{" "}
            </Text>
            <Text style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }} className="text-gray-600">
              {user_record!.course}
            </Text>
          </Text>
        </View>
      </View>

      <Text
        style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}
        className="text-2xl p-6"
      >
        Recent activities
      </Text>
      {data &&
        data.modules_progress.length > 0 &&
        data.quiz_progress.length > 0 && (
          <View className="flex-col gap-4 bg-gray-100 rounded-3xl border border-gray-300 shadow p-4">
            {data &&
              data!.modules_progress.length > 0 &&
              data!.modules_progress.map((module: any) => (
                <Pressable
                  key={module.id}
                  className="flex-row gap-4 items-center text-sm text-gray-700 bg-gray-50 rounded-3xl p-4"
                >
                  <Text
                    style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
                  >
                    {module.expand.module_id.title}
                  </Text>
                </Pressable>
              ))}
            {data &&
              data!.quiz_progress.length > 0 &&
              data!.quiz_progress.map((quiz) => (
                <Pressable
                  key={quiz.id}
                  className="flex-row gap-4 items-center text-sm text-gray-700 bg-gray-50 rounded-3xl p-4"
                >
                  <Text
                    style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
                  >
                    {quiz.expand.quiz_id.title}
                  </Text>
                </Pressable>
              ))}
          </View>
        )}
      {data &&
        data.modules_progress.length == 0 &&
        data.quiz_progress.length == 0 && (
          <View className="flex-col gap-4 bg-gray-100 rounded-3xl border border-gray-300 shadow p-4">
            <Text style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}>
              No recent activities.
            </Text>
          </View>
        )}
    </SafeAreaView>
  );
}

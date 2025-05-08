import usePocketBase from "@/stores/usePocketBase";
import WorkSansFonts from "@/types/Font";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { instance } = usePocketBase();

  const { data } = useQuery({
    queryKey: ["quiz"],
    queryFn: async () => {
      try {
        const { items } = await instance!
          .collection("quiz")
          .getList(1, 50, { filter: "visible = 1" });

        return items;
      } catch (err) {
        ToastAndroid.show("Error fetching quiz.", ToastAndroid.SHORT);
        return err;
      }
    },
    staleTime: 300000,
  });

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size={64} color={"#242424"} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-4 gap-4">
      <View className="flex-row justify-between items-center">
        <View className="flex-row gap-4 items-center">
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={"#242424"}
            onPress={() => router.back()}
          />
          <Text
            className="text-3xl"
            style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}
          >
            Quizzes
          </Text>
        </View>
      </View>

      <ScrollView contentContainerClassName="gap-4">
        {data.map((quiz: any) => (
          <Pressable
            key={quiz.id}
            className="gap-2 p-4 bg-gray-100 rounded-3xl border border-gray-300 shadow"
            onPress={() =>
              router.push({
                pathname: "/(student)/quiz/[quiz]",
                params: { quiz: quiz.id },
              })
            }
          >
            {quiz.course && (
              <View className="px-6 py-2 bg-gray-200 rounded-3xl">
                <Text
                  className="text-gray-500 text-sm flex-1 text-center"
                  style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
                >
                  {quiz.course}
                </Text>
              </View>
            )}
            <Text
              className="text-xl flex-1"
              style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}
            >
              {quiz.title}
            </Text>
            <Text
              className="text-gray-400 flex-1"
              style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
            >
              {quiz.description}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

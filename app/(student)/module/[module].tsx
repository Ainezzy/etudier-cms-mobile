import usePocketBase from "@/stores/usePocketBase";
import WorkSansFonts from "@/types/Font";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Linking, Image } from "react-native";
import { ActivityIndicator, Pressable, Text, ToastAndroid, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { module } = useLocalSearchParams();
  const { instance, user_record } = usePocketBase();

  const { data } = useQuery({
    queryKey: [module],
    queryFn: async () => {
      try {
        const record = await instance!
          .collection("modules")
          .getOne(module.toString(), { expand: "teacher_id" });

        const temp = [];
        for (const file of record.contents) {
          const url = instance!.files.getURL(record, file);
          temp.push({ url: url, title: url.split("/").pop(), thumbnail: file.thumbnail }); // Assuming 'thumbnail' exists in the file object
        }

        return { ...record, files: temp };
      } catch (err) {
        ToastAndroid.show("Error accessing module.", ToastAndroid.SHORT);
        router.back();
      }
    },
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
      <MaterialIcons
        name="arrow-back"
        size={24}
        color={"#242424"}
        onPress={() => router.back()}
      />
      <View className="flex-row gap-2 items-center">
        <MaterialIcons name="account-circle" size={24} color={"#afafaf"} />
        <Text
          style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
          className="text-[#afafaf]"
        >
          {data!.expand!.teacher_id.name}
        </Text>
      </View>
      <View className="flex-1">
        <Text
          style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}
          className="text-[#242424] text-3xl"
        >
          {data.title}
        </Text>
        <Text
          style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
          className="text-gray-400"
        >
          {data.description}
        </Text>
      </View>
      {data.files.length > 0 && (
        <View className="mx-4 my-2 p-6 bg-gray-100 rounded-3xl border border-gray-300 shadow gap-2">
          <Text
            className="text-2xl"
            style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}
          >
            Resources
          </Text>
          {data.files.map((file) => (
            <Pressable
              key={file.url}
              onPress={async () => await Linking.openURL(file.url)}
              className="flex-row gap-4 items-center text-sm text-gray-700 bg-gray-50 rounded-3xl p-4"
            >
              {file.thumbnail && (
                <Image
                  source={{ uri: file.thumbnail }}
                  style={{ width: 40, height: 40, borderRadius: 8 }}
                />
              )}
              <MaterialIcons name="download" size={24} />
              <Text
                style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
                className="flex-1"
              >
                {file.title}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
      {data.files.length == 0 && (
        <View className="mx-4 my-2 p-6 bg-gray-100 rounded-3xl border border-gray-300 shadow gap-2">
          <Text
            className="text-2xl"
            style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}
          >
            No resources found.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

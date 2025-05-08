import usePocketBase from "@/stores/usePocketBase";
import WorkSansFonts from "@/types/Font";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  ToastAndroid,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Platform-safe toast/alert function
function showMessage(message: string) {
  if (Platform.OS === "android" && ToastAndroid) {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert("Notification", message);
  }
}

export default function Page() {
  const { instance } = usePocketBase();
  const { width } = useWindowDimensions();

  const { data } = useQuery({
    queryKey: ["modules"],
    queryFn: async () => {
      try {
        const { items } = await instance!
          .collection("modules")
          .getList(1, 50, { filter: "visible = 1" });

        return items;
      } catch (err) {
        showMessage("Error fetching modules.");
        throw err;
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
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-between items-center">
        <View className="flex-row p-6 gap-4 items-center">
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
            Modules
          </Text>
        </View>
      </View>

      <ScrollView contentContainerClassName="gap-10 p-6">
        {data.map((module: any) => (
          <View
            key={module.id}
            className="gap-4 p-4 bg-gray-100 rounded-3xl border border-gray-300 shadow"
          >
            {/* Thumbnail Image */}
            {module.thumbnail && (
              <Image
                source={{
                  uri: `${instance?.baseUrl}/api/files/modules/${module.id}/${module.thumbnail}`,
                }}
                style={{
                  width: "100%",
                  height: 180,
                  borderRadius: 20,
                }}
                resizeMode="cover"
              />
            )}

            {/* Course Tag */}
            {module.course && (
              <View className="px-6 py-2 bg-gray-200 rounded-3xl">
                <Text
                  className="text-gray-500 text-sm flex-1 text-center"
                  style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
                >
                  {module.course}
                </Text>
              </View>
            )}

            {/* Title */}
            <Text
              className="text-xl flex-1"
              style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}
            >
              {module.title}
            </Text>

            {/* Description */}
            <Text
              className="text-gray-400 flex-1"
              style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
            >
              {module.description}
            </Text>

            {/* Enroll Button */}
            <Pressable
  onPress={async () => {
    try {
      const studentId = instance?.authStore.model?.id;  // Get the logged-in student ID

      if (!studentId) {
        showMessage("You must be logged in to enroll.");
        return;
      }

      if (!module.id) {
        showMessage("Module not found.");
        return;
      }

      // Create the enrollment record
      await instance?.collection("module_enrollments").create({
        student: studentId,   // Use the logged-in student's ID
        module: module.id,    // Use the module's ID
        teacher: module.teacher_id,
      });

      showMessage("Enrolled successfully!");

      // Navigate to the module details page
      router.push({
        pathname: "/(student)/module/[module]",
        params: { module: module.id },
      });
    } catch (err) {
      console.error("Enrollment error:", err);
      showMessage("Enrollment failed.");
    }
  }}
  className="mx-4 my-2 p-4 rounded-xl items-center justify-center"
  style={{
    backgroundColor: "#242424",
    paddingVertical: 12,
    paddingHorizontal: 20,
  }}
>
  <Text
    style={{
      fontFamily: WorkSansFonts.WorkSans_700Bold,
      color: "white",
      fontSize: 18,
    }}
  >
    Enroll
  </Text>
</Pressable>


              
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

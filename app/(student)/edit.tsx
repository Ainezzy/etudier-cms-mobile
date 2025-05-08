import usePocketBase from "@/stores/usePocketBase";
import WorkSansFonts from "@/types/Font";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import {
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioLabel,
  RadioIcon,
} from "@/components/ui/radio";
import { router } from "expo-router";
import { useState } from "react";
import { ToastAndroid } from "react-native";
import { View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { instance, setUserRecord, user_record } = usePocketBase();

  const [name, setName] = useState(user_record ? user_record!.name : null);
  const [school, setSchool] = useState(user_record ? user_record!.school : null);
  const [department, setDepartment] = useState(user_record ? user_record!.department : null);
  const [yearLevel, setYearLevel] = useState(user_record ? user_record!.year_level : null);
  const [course, setCourse] = useState(user_record ? user_record!.course : null);
  const [gender, setGender] = useState(user_record ? user_record!.gender : null);
  const [phoneNumber, setPhoneNumber] = useState(user_record ? user_record!.phone_number : null);
  const [dateOfBirth, setDateOfBirth] = useState(user_record ? user_record!.date_of_birth : null);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      // Format dateOfBirth to exclude time
      const formattedDateOfBirth = dateOfBirth ? new Date(dateOfBirth).toISOString().split('T')[0] : null;

      const data = await instance?.collection("users").update(user_record!.id, {
        name,
        school,
        department,
        course,
        gender,
        phone_number: phoneNumber,
        year_level: yearLevel,
        date_of_birth: formattedDateOfBirth, // use formatted date without time
      });

      setUserRecord(data);
      ToastAndroid.show("Updated!", ToastAndroid.SHORT);
      router.back();
    } catch (err: any) {
      const errorMessage = err?.message || "Something went wrong while updating your profile.";
      ToastAndroid.show(`Error: ${errorMessage}`, ToastAndroid.SHORT);
    }
  };

  return (
    <SafeAreaView className="flex-1 gap-4 p-6 bg-white">
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
          Edit
        </Text>
      </View>

      <View className="gap-4 flex-1 p-6">
        {/* Name */}
        <View className="gap-1">
          <Text className="text-lg text-gray-400" style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}>
            Name
          </Text>
          <TextInput
            className="px-6 py-4 bg-gray-100 text-[#242424] rounded-2xl"
            style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Date of Birth */}
        <View className="gap-1">
          <Text className="text-lg text-gray-400" style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}>
            Date of Birth
          </Text>
          <TextInput
            className="px-6 py-4 bg-gray-100 text-[#242424] rounded-2xl"
            style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
            placeholder="YYYY-MM-DD"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            keyboardType="numeric"
          />
        </View>

        {/* School */}
        <View className="gap-1">
          <Text className="text-lg text-gray-400" style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}>
            School
          </Text>
          <TextInput
            className="px-6 py-4 bg-gray-100 text-[#242424] rounded-2xl"
            style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
            placeholder="School"
            value={school}
            onChangeText={setSchool}
          />
        </View>

        {/* Department */}
        <View className="gap-1">
          <Text className="text-lg text-gray-400" style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}>
            Department
          </Text>
          <TextInput
            className="px-6 py-4 bg-gray-100 text-[#242424] rounded-2xl"
            style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
            placeholder="Department"
            value={department}
            onChangeText={setDepartment}
          />
        </View>

        {/* Phone Number */}
        <View className="gap-1">
          <Text className="text-lg text-gray-400" style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}>
            Phone number
          </Text>
          <TextInput
            className="px-6 py-4 bg-gray-100 text-[#242424] rounded-2xl"
            style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
            placeholder="Phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        {/* Gender */}
        <View className="gap-1">
          <Text className="text-lg text-gray-400" style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}>
            Gender
          </Text>
          <RadioGroup value={gender} onChange={setGender} className="flex flex-row gap-4">
            <Radio value="Male" className="flex-1 p-4 bg-gray-100 rounded-3xl">
              <RadioIndicator><RadioIcon /></RadioIndicator>
              <RadioLabel>Male</RadioLabel>
            </Radio>
            <Radio value="Female" className="flex-1 p-4 bg-gray-100 rounded-3xl">
              <RadioIndicator><RadioIcon /></RadioIndicator>
              <RadioLabel>Female</RadioLabel>
            </Radio>
          </RadioGroup>
        </View>

        {/* Year Level */}
        <View className="gap-1">
          <Text className="text-lg text-gray-400" style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}>
            Year Level
          </Text>
          <RadioGroup value={yearLevel} onChange={setYearLevel} className="flex flex-row gap-4">
            <Radio value="1" className="flex-1 p-4 bg-gray-100 rounded-3xl">
              <RadioIndicator><RadioIcon /></RadioIndicator>
              <RadioLabel>1st</RadioLabel>
            </Radio>
            <Radio value="2" className="flex-1 p-4 bg-gray-100 rounded-3xl">
              <RadioIndicator><RadioIcon /></RadioIndicator>
              <RadioLabel>2nd</RadioLabel>
            </Radio>
            <Radio value="3" className="flex-1 p-4 bg-gray-100 rounded-3xl">
              <RadioIndicator><RadioIcon /></RadioIndicator>
              <RadioLabel>3rd</RadioLabel>
            </Radio>
            <Radio value="4" className="flex-1 p-4 bg-gray-100 rounded-3xl">
              <RadioIndicator><RadioIcon /></RadioIndicator>
              <RadioLabel>4th</RadioLabel>
            </Radio>
          </RadioGroup>
        </View>
      </View>

      <Pressable
        disabled={isSaving}
        onPress={handleSave}
        className="p-4 mb-10 m-6 bg-gray-100 border border-gray-300 shadow disabled:bg-green-300 rounded-3xl text-center"
      >
        <Text
          style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
          className="text-center"
        >
          {isSaving ? "Saving..." : "Save"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

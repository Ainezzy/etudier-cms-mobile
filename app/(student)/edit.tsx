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
  const [school, setSchool] = useState(
    user_record ? user_record!.school : null
  );
  const [department, setDepartment] = useState(
    user_record ? user_record!.department : null
  );
  const [yearLevel, setYearLevel] = useState(
    user_record ? user_record!.year_level : null
  );
  const [course, setCourse] = useState(
    user_record ? user_record!.course : null
  );
  const [gender, setGender] = useState(
    user_record ? user_record!.gender : null
  );
  const [phoneNumber, setPhoneNumber] = useState(
    user_record ? user_record!.phone_number : null
  );

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      const data = await instance?.collection("users").update(user_record!.id, {
        name: name,
        school: school,
        department: department,
        course: course,
        gender: gender,
        phone_number: phoneNumber,
        year_level: yearLevel,
      });

      setUserRecord(data);
      ToastAndroid.show("Updated!", ToastAndroid.SHORT);
      router.back();
    } catch (err) {
      ToastAndroid.show(
        `Error on updating profile: ${err}`,
        ToastAndroid.SHORT
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 gap-4 p-6 bg-white">
      <View className="flex-row gap-4 items-center">
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
      <View className="gap-2 flex-1">
        <View className="gap-1">
          <Text
            className="text-lg text-gray-400"
            style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
          >
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
        <View className="gap-1">
          <Text
            className="text-lg text-gray-400"
            style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
          >
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
        <View className="gap-1">
          <Text
            className="text-lg text-gray-400"
            style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
          >
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
        <View className="gap-1">
          <Text
            className="text-lg text-gray-400"
            style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
          >
            Phone number
          </Text>
          <TextInput
            className="px-6 py-4 bg-gray-100 text-[#242424] rounded-2xl"
            style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
            placeholder="Phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            maxLength={10}
          />
        </View>
        <View className="gap-1">
          <Text
            className="text-lg text-gray-400"
            style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
          >
            Gender
          </Text>
          <RadioGroup
            value={gender}
            onChange={(e) => {
              setGender(e);
            }}
            className="flex flex-row gap-4"
          >
            <Radio
              value="Male"
              size="md"
              isInvalid={false}
              isDisabled={false}
              className="flex-1 p-4 bg-gray-100 rounded-3xl"
            >
              <RadioIndicator>
                <RadioIcon />
              </RadioIndicator>
              <RadioLabel>Male</RadioLabel>
            </Radio>
            <Radio
              value="Female"
              size="md"
              isInvalid={false}
              isDisabled={false}
              className="flex-1 p-4 bg-gray-100 rounded-3xl"
            >
              <RadioIndicator>
                <RadioIcon />
              </RadioIndicator>
              <RadioLabel>Female</RadioLabel>
            </Radio>
          </RadioGroup>
        </View>
        <View className="gap-1">
          <Text
            className="text-lg text-gray-400"
            style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
          >
            Year Level
          </Text>
          <RadioGroup
            onChange={(e) => {
              setYearLevel(e);
            }}
            className="flex flex-row gap-4"
            value={yearLevel}
          >
            <Radio
              value="1"
              size="md"
              isInvalid={false}
              isDisabled={false}
              className="flex-1 p-4 bg-gray-100 rounded-3xl"
            >
              <RadioIndicator>
                <RadioIcon />
              </RadioIndicator>
              <RadioLabel>1st</RadioLabel>
            </Radio>
            <Radio
              value="2"
              size="md"
              isInvalid={false}
              isDisabled={false}
              className="flex-1 p-4 bg-gray-100 rounded-3xl"
            >
              <RadioIndicator>
                <RadioIcon />
              </RadioIndicator>
              <RadioLabel>2nd</RadioLabel>
            </Radio>
            <Radio
              value="3"
              size="md"
              isInvalid={false}
              isDisabled={false}
              className="flex-1 p-4 bg-gray-100 rounded-3xl"
            >
              <RadioIndicator>
                <RadioIcon />
              </RadioIndicator>
              <RadioLabel>3rd</RadioLabel>
            </Radio>
            <Radio
              value="4"
              size="md"
              isInvalid={false}
              isDisabled={false}
              className="flex-1 p-4 bg-gray-100 rounded-3xl"
            >
              <RadioIndicator>
                <RadioIcon />
              </RadioIndicator>
              <RadioLabel>4th</RadioLabel>
            </Radio>
          </RadioGroup>
        </View>
      </View>
      <Pressable
        disabled={isSaving}
        onPress={handleSave}
        className="p-4 bg-gray-100 border border-gray-300 shadow disabled:bg-green-300 rounded-3xl text-center"
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

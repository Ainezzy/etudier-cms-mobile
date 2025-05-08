import WorkSansFonts from "@/types/Font";
import Feather from "@expo/vector-icons/Feather";
import usePocketBase from "@/stores/usePocketBase";

import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { router } from "expo-router";

import "../../global.css";
import {
  RadioGroup,
  Radio,
  RadioIndicator,
  RadioIcon,
  RadioLabel,
} from "@/components/ui/radio";

export default function Index() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [gender, setGender] = useState("");
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const { instance, setIsLoggedIn, setUserRecord } = usePocketBase();

  const handleRegister = async () => {
    if (
      !email &&
      !name &&
      !school &&
      !email &&
      !password &&
      !yearLevel &&
      !gender &&
      !department &&
      !course
    ) {
      ToastAndroid.show("Fill all the fields.", ToastAndroid.SHORT);
      return;
    }

    setIsRegistering(true);
    try {
      await instance!.collection("users").create({
        name: name,
        school: school,
        course: course,
        department: department,
        gender: gender,
        year_level: yearLevel,
        phone_number: phoneNumber,
        account_type: "Student",
        email: email,
        password: password,
        passwordConfirm: password,
      });

      const { record, token } = await instance!
        .collection("users")
        .authWithPassword(email, password);

      const user = await instance!.collection("users").getOne(record.id);

      setIsLoggedIn(true);
      setUserRecord(user);
      router.replace("/(student)/dashboard");
    } catch (err) {
      setErrorMsg(`Error: ${err.message || err}`);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center gap-4 bg-white">
      <Feather
        name="arrow-left"
        size={24}
        color="#242424"
        className="mx-8 my-2"
        onPress={() => router.back()}
      />
      <Text
        className="text-5xl text-[#242424] mx-8"
        style={{ fontFamily: WorkSansFonts.WorkSans_900Black }}
      >
        etudier
      </Text>
      <ScrollView
        contentContainerClassName="gap-4 mx-8"
        className="bg-white"
        showsVerticalScrollIndicator={false}
      >
        <TextInput
          className="px-6 py-4 bg-gray-100 text-[#242424] rounded-2xl"
          style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          className="px-6 py-4 bg-gray-100 text-[#242424] rounded-2xl"
          style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
          placeholder="School"
          value={school}
          onChangeText={setSchool}
        />
        <TextInput
          className="px-6 py-4 bg-gray-100 text-[#242424] rounded-2xl"
          style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
          placeholder="Department"
          value={department}
          onChangeText={setDepartment}
        />
        <TextInput
          className="px-6 py-4 bg-gray-100 text-[#242424] rounded-2xl"
          style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
          placeholder="Phone Number (Don't include 0 or +63)"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <TextInput
          className="px-6 py-4 bg-gray-100 text-[#242424] rounded-2xl"
          style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
          placeholder="Course"
          value={course}
          onChangeText={setCourse}
        />
        <TextInput
          className="px-6 py-4 bg-gray-100 text-[#242424] rounded-2xl"
          style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          className="px-6 py-4 bg-gray-100 text-[#242424] rounded-2xl"
          style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
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
        {errorMsg && (
          <View className="flex-row gap-4 p-4 bg-red-400 rounded-3xl items-center">
            <Feather name="alert-circle" size={24} color="#fefefe" />
            <Text
              style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
              className="text-[#fefefe] flex-1"
            >
              {errorMsg}
            </Text>
          </View>
        )}
      </ScrollView>
      <Pressable
        disabled={isRegistering}
        onPress={handleRegister}
        className="p-4 m-4 bg-gray-100 border border-gray-300 shadow disabled:bg-green-300 rounded-3xl text-center"
      >
        <Text
          style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
          className="text-center"
        >
          {isRegistering ? "Registering" : "Register"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

import usePocketBase from "@/stores/usePocketBase";
import WorkSansFonts from "@/types/Font";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { quiz } = useLocalSearchParams();
  const { instance } = usePocketBase();

  const [answers, setAnswers] = useState<number[]>();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [percent, setPercent] = useState<number>(0);

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    const updated = [...answers];
    updated[questionIndex] = optionIndex;
    setAnswers(updated);
  };

  const checkProgress = async () => {
    try {
      const userId = await instance!.authStore.record!.id;
      const record = await instance!
        .collection("users_quiz_submissions")
        .getFirstListItem(`user_id = '${userId}' && quiz_id = '${data.id}'`);

      let correct = 0;
      data.quiz.forEach((q: any, i: number) => {
        if (answers![i] === q.answer) correct++;
      });

      const percentScore = Math.round((correct / data.quiz.length) * 100);

      await instance!.collection("users_quiz_submissions").update(record.id, {
        quiz_id: data.id,
        answers: answers,
        user_id: userId,
        score: correct,
        percent: percentScore,
      });
      setScore(correct);
      setPercent(percentScore);
      setSubmitted(true);

      return true;
    } catch (err) {
      return false;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrorMessage(null);

    const hasProgress = await checkProgress();
    if (hasProgress) {
      return;
    }

    try {
      const userId = instance!.authStore.record!.id;

      let correct = 0;
      data.quiz.forEach((q: any, i: number) => {
        if (answers![i] === q.answer) correct++;
      });

      const percentScore = Math.round((correct / data.quiz.length) * 100);

      await instance!.collection("users_quiz_submissions").create({
        quiz_id: data.id,
        answers: answers,
        user_id: userId,
        score: correct,
        percent: percentScore,
      });

      setScore(correct);
      setPercent(percentScore);
      setSubmitted(true);
    } catch (error: any) {
      setErrorMessage(error.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const { data, isFetching } = useQuery({
    queryKey: [quiz, "[quiz]"],
    queryFn: async () => {
      try {
        const record = await instance!
          .collection("quiz")
          .getOne(quiz.toString(), { expand: "teacher_id" });

        setAnswers(Array(record.quiz.length).fill(-1));

        return record;
      } catch (err) {
        console.log(err);
        console.error(err);
        router.back();
        return err;
      }
    },
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  const pages = [
    <>
      {!isFetching && (
        <>
          <MaterialIcons
            size={24}
            name="arrow-back"
            color={"#242424"}
            onPress={() => router.back()}
          />
          <View className="flex-1">
            <View className="flex-row gap-2 items-center mb-2">
              <MaterialIcons
                name="account-circle"
                size={24}
                color={"#afafaf"}
              />
              <Text
                style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
                className="text-[#afafaf]"
              >
                {data!.expand!.teacher_id.name}
              </Text>
            </View>
            <Text
              className="text-2xl"
              style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}
            >
              {data.title}
            </Text>
            <Text
              className="text-gray-400"
              style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
            >
              {data.description}
            </Text>
          </View>

          <Pressable
            className="flex-row gap-2 px-6 py-4 bg-green-500 self-end place-self-end rounded-3xl"
            onPress={() => setIndex(1)}
          >
            <MaterialIcons name="start" size={16} color={"#fefefe"} />
            <Text
              className="text-sm text-[#fefefe]"
              style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
            >
              Start
            </Text>
          </Pressable>
        </>
      )}
    </>,
    <>
      {!isFetching && (
        <>
          <MaterialIcons
            size={24}
            name="arrow-back"
            color={"#242424"}
            onPress={() => router.back()}
          />
          <Text
            className="text-4xl"
            style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}
          >
            Questions
          </Text>
          <ScrollView contentContainerClassName="gap-4">
            {data.quiz.map((q: any, qIndex: number) => (
              <View
                key={qIndex}
                className="mb-4 p-4 bg-gray-50 border border-gray-300 rounded-xl shadow"
              >
                <Text
                  className="font-bold mb-2"
                  style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}
                >
                  Question {qIndex + 1}
                </Text>
                <Text
                  className="mb-2"
                  style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
                >
                  {q.question}
                </Text>

                <View className="flex flex-col gap-2">
                  {answers &&
                    Array.from({ length: Math.ceil(q.options.length / 2) }).map(
                      (_, rowIndex) => {
                        const start = rowIndex * 2;
                        const rowOptions = q.options.slice(start, start + 2);

                        return (
                          <View key={rowIndex} className="flex flex-row gap-2">
                            {rowOptions.map((opt: string, oIndex: number) => {
                              const optionIndex = start + oIndex;
                              return (
                                <Pressable
                                  key={optionIndex}
                                  onPress={() =>
                                    handleSelect(qIndex, optionIndex)
                                  }
                                  disabled={submitted}
                                  className={`flex-1 px-4 py-2 rounded-3xl ${
                                    answers[qIndex] === optionIndex
                                      ? "bg-blue-500"
                                      : "bg-gray-100 border border-gray-300"
                                  }`}
                                >
                                  <Text
                                    className={`${
                                      answers[qIndex] === optionIndex
                                        ? "text-white"
                                        : "text-gray-800"
                                    }`}
                                    style={{
                                      fontFamily:
                                        WorkSansFonts.WorkSans_400Regular,
                                    }}
                                  >
                                    {opt}
                                  </Text>
                                </Pressable>
                              );
                            })}
                            {/* Fill empty space if only one item in row */}
                            {rowOptions.length === 1 && (
                              <View className="flex-1" />
                            )}
                          </View>
                        );
                      }
                    )}
                </View>
              </View>
            ))}
          </ScrollView>
          {!submitted ? (
            <Pressable
              onPress={handleSubmit}
              disabled={submitting}
              className="bg-green-500 p-4 rounded-2xl items-center"
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  className="text-white font-semibold"
                  style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}
                >
                  Submit Answers
                </Text>
              )}
            </Pressable>
          ) : (
            <View className="p-4 bg-gray-100 rounded-3xl ">
              <Text
                className="text-green-600 font-bold"
                style={{ fontFamily: WorkSansFonts.WorkSans_700Bold }}
              >
                Quiz submitted successfully!
              </Text>
              <Text
                className="text-lg"
                style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
              >
                Score: {score} / {data.quiz.length}
              </Text>
              <Text
                className="text-lg"
                style={{ fontFamily: WorkSansFonts.WorkSans_400Regular }}
              >
                Percentage: {percent}%
              </Text>
            </View>
          )}
        </>
      )}
    </>,
  ];

  const [index, setIndex] = useState(0);

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size={64} color={"#242424"} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white p-4 gap-4">
      {pages[index]}
      {errorMessage && (
        <View className="flex-row items-center gap-2 bg-red-500 text-white p-4 rounded-3xl mt-4">
          <MaterialIcons name="info" size={24} color="white" />
          <Text className="text-white">{errorMessage}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

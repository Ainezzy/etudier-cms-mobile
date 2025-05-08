import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="modules" />
      <Stack.Screen name="quiz" />
      <Stack.Screen name="edit" />
      <Stack.Screen name="module/[module]" />
      <Stack.Screen name="quiz/[quiz]" />
    </Stack>
  );
}

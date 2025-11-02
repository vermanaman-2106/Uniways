import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: '#FF6B35',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="reset-password"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="faculty"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="faculty/[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="parking"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="map"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="appointments/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="appointments/[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="appointments/book"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="complaints/index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="complaints/create"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="complaints/[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

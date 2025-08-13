import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";

export default function Index() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "customer">("customer");

  const credentials: Record<"admin" | "customer", { username: string; password: string }> = {
    admin: { username: "admin", password: "admin" },
    customer: { username: "customer", password: "1234" },
  };

  const handleLogin = () => {
    if (
      username.trim() === credentials[role].username &&
      password.trim() === credentials[role].password
    ) {
      Alert.alert(
        "Success",
        `Logged in as ${role}!`,
        [
          {
            text: "OK",
            onPress: () => {
              router.push(role === "admin" ? "/admin" : "/customer");
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert("Error", "Invalid username or password");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="flex-1 justify-center items-center bg-gray-100 p-4">
        <Text className="text-3xl font-bold mb-6">Login</Text>

        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          className="bg-white w-full p-3 rounded-lg mb-4 border"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          className="bg-white w-full p-3 rounded-lg mb-4 border"
        />

        {/* Inline Role Selector */}
        <View className="flex-row justify-center mb-4">
          <TouchableOpacity
            onPress={() => setRole("admin")}
            className={`px-4 py-2 rounded-l-lg border ${role === "admin" ? "bg-blue-500" : "bg-white"}`}
          >
            <Text className={role === "admin" ? "text-white" : "text-black"}>Admin</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setRole("customer")}
            className={`px-4 py-2 rounded-r-lg border ${role === "customer" ? "bg-blue-500" : "bg-white"}`}
          >
            <Text className={role === "customer" ? "text-white" : "text-black"}>Customer</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          className="bg-blue-500 p-3 rounded-lg w-full mb-4 mt-2"
        >
          <Text className="text-white text-center font-semibold">Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text className="text-blue-500">Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

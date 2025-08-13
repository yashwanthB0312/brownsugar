import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    Alert.alert("Success", "Account created successfully!");
    router.push("/");
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-4">
      <Text className="text-3xl font-bold mb-6">Sign Up</Text>

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

      <TouchableOpacity
        onPress={handleSignup}
        className="bg-green-500 p-3 rounded-lg w-full mb-4"
      >
        <Text className="text-white text-center font-semibold">Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/")}>
        <Text className="text-blue-500">Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

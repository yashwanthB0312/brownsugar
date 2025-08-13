import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

type Props = {
  role: "admin" | "customer";
  setRole: (role: "admin" | "customer") => void;
};

export default function RoleSelector({ role, setRole }: Props) {
  return (
    <View className="flex-row justify-center mb-6 space-x-4 w-full">
      {(["admin", "customer"] as const).map((r) => (
        <TouchableOpacity
          key={r}
          onPress={() => setRole(r)}
          className={`flex-1 p-3 rounded ${
            role === r ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <Text className={`text-center font-semibold ${role === r ? "text-white" : "text-black"}`}>
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

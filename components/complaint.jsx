import { View, Text, ScrollView } from 'react-native';

export default function Complaint({ navigation }) {
  return (
    <View className="flex-1 bg-gradient-to-b from-orange-50 to-white px-6">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="py-8">
          <Text className="text-3xl font-bold text-primary mb-4">Report an Issue</Text>
          <Text className="text-gray-600 text-base mb-8">
            Submit complaints, feedback, or report issues around campus.
          </Text>
          
          <View className="bg-white rounded-2xl p-6 shadow-lg">
            <Text className="text-lg font-semibold text-gray-800 mb-2">Coming Soon</Text>
            <Text className="text-gray-600">
              Issue reporting system is under development. You'll be able to submit 
              complaints, track their status, and get updates on resolution.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

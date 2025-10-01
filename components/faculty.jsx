import { View, Text, ScrollView } from 'react-native';

export default function Faculty({ navigation }) {
  return (
    <View className="flex-1 bg-gradient-to-b from-orange-50 to-white px-6">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="py-8">
          <Text className="text-3xl font-bold text-primary mb-4">Faculty Directory</Text>
          <Text className="text-gray-600 text-base mb-8">
            Find and connect with professors and faculty members.
          </Text>
          
          <View className="bg-white rounded-2xl p-6 shadow-lg">
            <Text className="text-lg font-semibold text-gray-800 mb-2">Coming Soon</Text>
            <Text className="text-gray-600">
              Faculty directory feature is under development. You'll be able to browse faculty profiles, 
              contact information, and office hours soon.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

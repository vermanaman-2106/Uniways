import { View, Text, ScrollView } from 'react-native';

export default function Map({ navigation }) {
  return (
    <View className="flex-1 bg-gradient-to-b from-orange-50 to-white px-6">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="py-8">
          <Text className="text-3xl font-bold text-primary mb-4">Campus Map</Text>
          <Text className="text-gray-600 text-base mb-8">
            Navigate around the university and find buildings, facilities, and points of interest.
          </Text>
          
          <View className="bg-white rounded-2xl p-6 shadow-lg">
            <Text className="text-lg font-semibold text-gray-800 mb-2">Coming Soon</Text>
            <Text className="text-gray-600">
              Interactive campus map will be available soon. You'll be able to search for 
              buildings, get directions, and explore campus facilities.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

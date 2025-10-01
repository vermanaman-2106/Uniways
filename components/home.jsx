import { View, Text, Animated, Pressable, ScrollView, FlatList, SafeAreaView } from 'react-native';
import { useEffect, useRef } from 'react';
import Button from './Button.jsx';
import { signOutUser } from '../firebase';

export default function Home({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  async function handleSignOut() {
    try {
      await signOutUser();
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
    } catch (e) {
      // noop: could show a toast here
    }
  }

  const FeatureCard = ({ title, description, icon, onPress, bgColor = 'bg-white' }) => (
    <Pressable
      onPress={onPress}
      className={`${bgColor} rounded-2xl p-6 shadow-lg`}
      style={{
        shadowColor: '#f97316',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <View className="flex-row items-center">
        <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center mr-4">
          <Text className="text-2xl">{icon}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">{title}</Text>
          <Text className="text-sm text-gray-600 mt-1">{description}</Text>
        </View>
        <Text className="text-primary text-2xl">›</Text>
      </View>
    </Pressable>
  );

  const featuresData = [
    {
      id: '1',
      title: 'Faculty Directory',
      description: 'Find and connect with professors',
      icon: '👨‍🏫',
      onPress: () => navigation.navigate('Faculty'),
      bgColor: 'bg-blue-50'
    },
    {
      id: '2',
      title: 'Parking Info',
      description: 'Check parking availability and locations',
      icon: '🚗',
      onPress: () => navigation.navigate('Parking'),
      bgColor: 'bg-green-50'
    },
    {
      id: '3',
      title: 'Report Issue',
      description: 'Submit complaints and feedback',
      icon: '📝',
      onPress: () => navigation.navigate('Complaint'),
      bgColor: 'bg-red-50'
    },
    {
      id: '4',
      title: 'Campus Map',
      description: 'Navigate around the university',
      icon: '🗺️',
      onPress: () => navigation.navigate('Map'),
      bgColor: 'bg-purple-50'
    }
  ];

  const renderFeatureCard = ({ item }) => (
    <FeatureCard
      title={item.title}
      description={item.description}
      icon={item.icon}
      onPress={item.onPress}
      bgColor={item.bgColor}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <Animated.View 
        className="flex-row justify-between items-center px-6 py-4"
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <Pressable
          onPress={handleSignOut}
          className="w-10 h-10 bg-primary rounded-full items-center justify-center"
        >
          <Text className="text-white text-lg font-bold">👤</Text>
        </Pressable>
        
        <View className="flex-1 items-center">
          <Text className="text-2xl font-bold text-primary">UniWays</Text>
        </View>
        
        <Pressable className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
          <Text className="text-gray-600 text-lg">🔔</Text>
        </Pressable>
      </Animated.View>

      {/* Main Content */}
      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Welcome Section */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-800 mb-2">Welcome back!</Text>
            <Text className="text-gray-600 text-base">
              Explore your university community and discover what's happening around campus.
            </Text>
          </View>

          {/* Features Grid */}
          <View className="mb-6">
            <Text className="text-xl font-semibold text-gray-800 mb-4">Quick Access</Text>
            
            <FlatList
              data={featuresData}
              renderItem={renderFeatureCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View className="h-4" />}
              showsVerticalScrollIndicator={false}
            />
          </View>

          {/* Sign Out Button */}
          
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}



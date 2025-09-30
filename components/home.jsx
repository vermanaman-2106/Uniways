import { View, Text, Animated } from 'react-native';
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

  return (
    <View className="flex-1 bg-gradient-to-b from-orange-50 to-white px-6">
      <View className="flex-1 items-center justify-center">
        <Animated.View 
          className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg items-center"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            shadowColor: '#f97316',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.12,
            shadowRadius: 14,
            elevation: 8,
          }}
        >
          <Text className="text-3xl font-extrabold text-primary">Welcome to Home</Text>
          <Text className="text-gray-600 mt-3 text-center">
            You are signed in. Explore UniWays and enjoy your stay!
          </Text>

          <Button 
            title="Sign Out" 
            onPress={handleSignOut} 
            variant="outline"
            className="mt-8 w-full"
          />
        </Animated.View>
      </View>
    </View>
  );
}



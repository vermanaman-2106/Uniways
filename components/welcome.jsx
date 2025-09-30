import { View, Text, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import Button from './Button.jsx';

export default function Welcome({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View className="flex-1 bg-gradient-to-b from-orange-50 to-white px-6">
      <Animated.View 
        className="flex-1 items-center justify-center"
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <View className="items-center mb-12">
          <Text className="text-6xl font-extrabold text-primary mb-4">UniWays</Text>
          <Text className="text-2xl text-gray-700 text-center leading-relaxed">
            Your University
            <Text className="text-primary font-semibold"> Community</Text>
          </Text>
          <Text className="text-lg text-gray-600 text-center mt-4 max-w-sm">
            Connect, collaborate, and grow with your fellow students
          </Text>
        </View>
      </Animated.View>
      
      <Animated.View 
        className="pb-8 w-full"
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <Button 
          title="Get Started" 
          onPress={() => navigation.navigate('Login')} 
          className="py-5 text-lg shadow-lg"
        />
      </Animated.View>
    </View>
  );
}

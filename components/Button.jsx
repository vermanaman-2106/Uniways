import { Pressable, Text, View, ActivityIndicator } from 'react-native';
import { useState } from 'react';

export default function Button({ title, onPress, disabled, loading, className, variant = 'primary' }) {
  const [isPressed, setIsPressed] = useState(false);
  const isDisabled = !!disabled || !!loading;

  const baseClasses = 'items-center justify-center rounded-lg px-6 py-4 flex-row';
  const variantClasses = {
    primary: isPressed ? 'bg-primary-600' : 'bg-primary',
    secondary: isPressed ? 'bg-gray-200' : 'bg-gray-100',
    outline: isPressed ? 'bg-primary-50 border-2 border-primary' : 'bg-transparent border-2 border-primary'
  };
  const textClasses = {
    primary: 'text-white',
    secondary: 'text-gray-700',
    outline: 'text-primary'
  };

  return (
    <Pressable
      accessibilityRole="button"
      className={`${baseClasses} ${variantClasses[variant]} ${
        isDisabled ? 'opacity-50' : 'opacity-100'
      } ${className || ''}`}
      onPress={onPress}
      disabled={isDisabled}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={({ pressed }) => [
        {
          transform: [{ scale: pressed ? 0.98 : 1 }],
          shadowColor: '#f97316',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: pressed ? 0.3 : 0.2,
          shadowRadius: 4,
          elevation: pressed ? 3 : 2,
        }
      ]}
    >
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? 'white' : '#f97316'} 
          className="mr-2"
        />
      )}
      <Text className={`font-semibold text-base ${textClasses[variant]}`}>
        {loading ? 'Please wait…' : title}
      </Text>
    </Pressable>
  );
}



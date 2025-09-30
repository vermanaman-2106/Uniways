import { useState } from 'react';
import { View, TextInput, Text, Pressable } from 'react-native';

export default function Input({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  error, 
  helperText, 
  secureTextEntry = false, 
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  showPasswordToggle = false,
  onTogglePassword,
  ...props 
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-2">
          {label}
        </Text>
      )}
      
      <View className="relative">
        <TextInput
          className={`border rounded-lg px-4 py-3 text-base ${
            error 
              ? 'border-red-500 bg-red-50' 
              : isFocused 
                ? 'border-primary bg-primary-50' 
                : 'border-gray-300 bg-white'
          }`}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          placeholderTextColor="#9CA3AF"
          {...props}
        />
        
        {showPasswordToggle && (
          <Pressable 
            className="absolute right-3 top-3"
            onPress={onTogglePassword}
          >
            <Text className="text-primary font-medium text-sm">
              {secureTextEntry ? 'Show' : 'Hide'}
            </Text>
          </Pressable>
        )}
      </View>
      
      {error && (
        <Text className="text-red-600 text-sm mt-1">
          {error}
        </Text>
      )}
      
      {helperText && !error && (
        <Text className="text-gray-500 text-sm mt-1">
          {helperText}
        </Text>
      )}
    </View>
  );
}

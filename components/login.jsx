import { useState } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import Button from './Button.jsx';
import Input from './Input.jsx';
import { signInWithEmailPassword } from '../firebase';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const allowedDomains = ['muj.manipal.edu', 'jaipur.manipal.edu'];
  function isAllowedEmail(inputEmail) {
    const normalized = String(inputEmail || '').trim().toLowerCase();
    const domain = normalized.split('@')[1];
    return !!domain && allowedDomains.includes(domain);
  }

  async function handleLogin() {
    setError('');
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    if (!isAllowedEmail(email)) {
      setError('Use @muj.manipal.edu or @jaipur.manipal.edu email');
      return;
    }
    try {
      setLoading(true);
      await signInWithEmailPassword(email.trim(), password);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (e) {
      setError(e?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  const emailValid = !!email && isAllowedEmail(email);
  const canSubmit = emailValid && !!password && !loading;

  return (
    <View className="flex-1 bg-gradient-to-b from-orange-50 to-white px-6">
      <View className="flex-1 items-center justify-center">
        <Animated.View 
          className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg"
          style={{
            shadowColor: '#f97316',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-primary mb-2">Welcome Back</Text>
            <Text className="text-gray-600 text-center">Sign in to your account</Text>
          </View>

          <Input
            label="University Email"
            placeholder="your.email@muj.manipal.edu"
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              if (error) setError('');
            }}
            error={email && !emailValid ? 'Use @muj.manipal.edu or @jaipur.manipal.edu' : ''}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              if (error) setError('');
            }}
            secureTextEntry={!showPassword}
            showPasswordToggle={true}
            onTogglePassword={() => setShowPassword(!showPassword)}
            error={error}
          />

          <Button 
            title="Sign In" 
            onPress={handleLogin} 
            disabled={!canSubmit} 
            loading={loading}
            className="mt-6"
          />

          <Pressable 
            className="mt-6 items-center py-2" 
            onPress={() => navigation.navigate('Signup')}
          >
            <Text className="text-gray-600">
              Don't have an account? <Text className="text-primary font-semibold">Sign up</Text>
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

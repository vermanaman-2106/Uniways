import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from './components/welcome.jsx';
import Login from './components/login.jsx';
import Signup from './components/signup.jsx';
import Home from './components/home.jsx';
import Faculty from './components/faculty.jsx';
import Parking from './components/parking.jsx';
import Complaint from './components/complaint.jsx';
import Map from './components/map.jsx';

import './global.css';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Faculty" component={Faculty} options={{ title: 'Faculty Directory' }} />
        <Stack.Screen name="Parking" component={Parking} options={{ title: 'Parking Info' }} />
        <Stack.Screen name="Complaint" component={Complaint} options={{ title: 'Report Issue' }} />
        <Stack.Screen name="Map" component={Map} options={{ title: 'Campus Map' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

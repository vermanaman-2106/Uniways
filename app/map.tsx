import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { GOOGLE_MAPS_API_KEY, MUJ_COORDINATES } from '@/constants/api';

export default function MapScreen() {

  // Create Google Maps HTML
  const createGoogleMapsHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 0; }
            #map { height: 100vh; width: 100%; }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places"></script>
          <script>
            const map = new google.maps.Map(document.getElementById('map'), {
              center: { lat: ${MUJ_COORDINATES.latitude}, lng: ${MUJ_COORDINATES.longitude} },
              zoom: 17,
              mapTypeId: 'satellite',
              tilt: 45,
              heading: 0
            });
          </script>
        </body>
      </html>
    `;
  };


  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>Manipal University Jaipur</ThemedText>
        <ThemedText style={styles.subtitle}>Google Maps - 3D Satellite View</ThemedText>
      </View>
      
      <View style={styles.googleMapContainer}>
        {GOOGLE_MAPS_API_KEY && 
         GOOGLE_MAPS_API_KEY.length > 10 && 
         !GOOGLE_MAPS_API_KEY.includes('YOUR_GOOGLE_MAPS_API_KEY') ? (
          <WebView
            source={{ html: createGoogleMapsHTML() }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
          />
        ) : (
          <View style={styles.apiKeyWarning}>
            <ThemedText style={styles.warningText}>
              ⚠️ Please add your Google Maps API key in{'\n'}
              constants/api.ts{'\n\n'}
              Replace 'YOUR_GOOGLE_MAPS_API_KEY_HERE' with your actual API key
            </ThemedText>
          </View>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: Spacing.xl * 2 + 20,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    color: Colors.white,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  subtitle: {
    color: Colors.white,
    opacity: 0.9,
    marginBottom: Spacing.sm,
  },
  googleMapContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  webview: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  apiKeyWarning: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.white,
  },
  warningText: {
    color: Colors.primary,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 22,
  },
});


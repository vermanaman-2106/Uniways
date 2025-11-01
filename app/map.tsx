import { StyleSheet, View, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function MapScreen() {
  const buildings = [
    { id: 1, name: 'Main Building', x: '30%', y: '25%', color: Colors.primary },
    { id: 2, name: 'Library', x: '20%', y: '50%', color: Colors.primaryDark },
    { id: 3, name: 'Science Lab', x: '60%', y: '30%', color: Colors.primary },
    { id: 4, name: 'Sports Complex', x: '70%', y: '65%', color: Colors.primaryDark },
    { id: 5, name: 'Cafeteria', x: '45%', y: '55%', color: Colors.primary },
    { id: 6, name: 'Administration', x: '25%', y: '15%', color: Colors.primaryDark },
  ];

  const parkingLots = [
    { id: 'P1', name: 'Lot A', x: '15%', y: '75%' },
    { id: 'P2', name: 'Lot B', x: '55%', y: '80%' },
    { id: 'P3', name: 'Lot C', x: '80%', y: '45%' },
  ];

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>College Map</ThemedText>
        <ThemedText style={styles.subtitle}>Campus layout and locations</ThemedText>
      </View>
      
      <View style={styles.mapContainer}>
        <View style={styles.map}>
          {/* Buildings */}
          {buildings.map((building) => (
            <View
              key={building.id}
              style={[
                styles.building,
                {
                  left: building.x,
                  top: building.y,
                  backgroundColor: building.color,
                },
              ]}>
              <ThemedText style={styles.buildingText}>{building.name}</ThemedText>
            </View>
          ))}
          
          {/* Parking Lots */}
          {parkingLots.map((lot) => (
            <View
              key={lot.id}
              style={[
                styles.parkingLot,
                {
                  left: lot.x,
                  top: lot.y,
                  backgroundColor: Colors.white,
                  borderColor: Colors.primary,
                },
              ]}>
              <ThemedText style={styles.parkingText}>{lot.name}</ThemedText>
            </View>
          ))}
        </View>
        
        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: Colors.primary }]} />
            <ThemedText style={styles.legendText}>Buildings</ThemedText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: Colors.white, borderColor: Colors.primary, borderWidth: 2 }]} />
            <ThemedText style={styles.legendText}>Parking</ThemedText>
          </View>
        </View>
      </View>
      
      {/* Quick Info */}
      <View style={styles.infoSection}>
        <ThemedText type="subtitle" style={styles.infoTitle}>Quick Links</ThemedText>
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <ThemedText type="defaultSemiBold" style={styles.infoCardTitle}>6</ThemedText>
            <ThemedText style={styles.infoCardLabel}>Buildings</ThemedText>
          </View>
          <View style={styles.infoCard}>
            <ThemedText type="defaultSemiBold" style={styles.infoCardTitle}>3</ThemedText>
            <ThemedText style={styles.infoCardLabel}>Parking Lots</ThemedText>
          </View>
        </View>
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
    paddingTop: 60,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.white,
    opacity: 0.9,
  },
  mapContainer: {
    flex: 1,
    padding: Spacing.lg,
  },
  map: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
    position: 'relative',
    minHeight: 400,
  },
  building: {
    position: 'absolute',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buildingText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  parkingLot: {
    position: 'absolute',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    borderWidth: 2,
    minWidth: 60,
    alignItems: 'center',
  },
  parkingText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.md,
    gap: Spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 14,
  },
  infoSection: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  infoTitle: {
    marginBottom: Spacing.md,
    color: Colors.primary,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
    padding: Spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  infoCardTitle: {
    fontSize: 32,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  infoCardLabel: {
    fontSize: 14,
    color: Colors.textLight,
  },
});


import { StyleSheet, ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';

export default function ParkingScreen() {
  const parkingLots = [
    { id: 1, name: 'Lot A', available: 45, total: 100, location: 'Main Entrance' },
    { id: 2, name: 'Lot B', available: 23, total: 80, location: 'South Side' },
    { id: 3, name: 'Lot C', available: 67, total: 120, location: 'East Wing' },
    { id: 4, name: 'Lot D', available: 12, total: 50, location: 'Library' },
    { id: 5, name: 'Lot E', available: 89, total: 150, location: 'Sports Complex' },
  ];

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return '#4CAF50'; // Green
    if (percentage > 20) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>Parking</ThemedText>
        <ThemedText style={styles.subtitle}>Real-time parking availability</ThemedText>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {parkingLots.map((lot) => {
          const percentage = Math.round((lot.available / lot.total) * 100);
          const availabilityColor = getAvailabilityColor(lot.available, lot.total);
          
          return (
            <View key={lot.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.lotInfo}>
                  <ThemedText type="defaultSemiBold" style={styles.lotName}>
                    {lot.name}
                  </ThemedText>
                  <ThemedText style={styles.location}>{lot.location}</ThemedText>
                </View>
                <View style={[styles.badge, { backgroundColor: availabilityColor }]}>
                  <ThemedText style={styles.badgeText}>{percentage}%</ThemedText>
                </View>
              </View>
              
              <View style={styles.stats}>
                <View style={styles.statItem}>
                  <ThemedText style={styles.statLabel}>Available</ThemedText>
                  <ThemedText type="defaultSemiBold" style={[styles.statValue, { color: Colors.primary }]}>
                    {lot.available}
                  </ThemedText>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <ThemedText style={styles.statLabel}>Total</ThemedText>
                  <ThemedText type="defaultSemiBold" style={styles.statValue}>
                    {lot.total}
                  </ThemedText>
                </View>
              </View>
              
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${percentage}%`, 
                        backgroundColor: availabilityColor 
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
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
  scrollView: {
    flex: 1,
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  lotInfo: {
    flex: 1,
  },
  lotName: {
    fontSize: 20,
    marginBottom: 4,
  },
  location: {
    color: Colors.textLight,
    fontSize: 14,
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  stats: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    color: Colors.textLight,
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: Spacing.md,
  },
  progressBarContainer: {
    marginTop: Spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});


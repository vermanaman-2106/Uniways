import { StyleSheet, ScrollView, View, ActivityIndicator, RefreshControl, TouchableOpacity, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';

interface FacultyMember {
  _id: string;
  id?: number;
  name: string;
  department: string;
  email: string;
  designation?: string;
  phone?: string;
  office?: string;
  image?: string;
  bio?: string;
  address?: string;
}

export default function FacultyScreen() {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [filteredFaculty, setFilteredFaculty] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchFaculty = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.faculty}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        const facultyData = data.data || [];
        setFaculty(facultyData);
        setFilteredFaculty(facultyData);
      } else {
        throw new Error(data.message || 'Failed to fetch faculty data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load faculty data';
      setError(errorMessage);
      console.error('Error fetching faculty:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFaculty(faculty);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = faculty.filter((member) => {
        const name = member.name.toLowerCase();
        const department = member.department.toLowerCase();
        const email = member.email.toLowerCase();
        const designation = member.designation?.toLowerCase() || '';
        
        return (
          name.includes(query) ||
          department.includes(query) ||
          email.includes(query) ||
          designation.includes(query)
        );
      });
      setFilteredFaculty(filtered);
    }
  }, [searchQuery, faculty]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFaculty();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>Faculty</ThemedText>
        <ThemedText style={styles.subtitle}>
          {searchQuery.trim() === '' 
            ? (faculty.length > 0 ? `${faculty.length} faculty members` : 'Meet our faculty members')
            : `Found ${filteredFaculty.length} result${filteredFaculty.length !== 1 ? 's' : ''}`
          }
        </ThemedText>
      </View>

      {/* Search Bar */}
      {!loading && faculty.length > 0 && (
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <ThemedText style={styles.searchIcon}>🔍</ThemedText>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, department, email..."
              placeholderTextColor={Colors.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <ThemedText style={styles.clearButtonText}>✕</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
      
      {loading && !refreshing ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <ThemedText style={styles.loadingText}>Loading faculty...</ThemedText>
        </View>
      ) : error ? (
        <View style={styles.centerContent}>
          <ThemedText style={styles.errorText}>⚠️ {error}</ThemedText>
          <ThemedText 
            style={styles.retryText}
            onPress={fetchFaculty}
          >
            Tap to retry
          </ThemedText>
        </View>
      ) : faculty.length === 0 ? (
        <View style={styles.centerContent}>
          <ThemedText style={styles.emptyText}>No faculty members found</ThemedText>
        </View>
      ) : filteredFaculty.length === 0 ? (
        <View style={styles.centerContent}>
          <ThemedText style={styles.emptyText}>No results found for "{searchQuery}"</ThemedText>
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchButton}>
            <ThemedText style={styles.clearSearchButtonText}>Clear Search</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
            />
          }
        >
          {filteredFaculty.map((member) => (
            <Link key={member._id} href={`/faculty/${member._id}`} asChild>
              <TouchableOpacity activeOpacity={0.7} style={styles.card}>
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <View style={styles.avatar}>
                      <ThemedText style={styles.avatarText}>
                        {getInitials(member.name)}
                      </ThemedText>
                    </View>
                    <View style={styles.cardInfo}>
                      <ThemedText type="defaultSemiBold" style={styles.name}>
                        {member.name}
                      </ThemedText>
                      {member.designation && (
                        <ThemedText style={styles.designation}>{member.designation}</ThemedText>
                      )}
                    </View>
                  </View>
                  
                  <View style={styles.departmentBadge}>
                    <ThemedText style={styles.departmentBadgeText}>{member.department}</ThemedText>
                  </View>

                  <View style={styles.contactRow}>
                    <View style={styles.contactItemSmall}>
                      <ThemedText style={styles.contactIconSmall}>✉️</ThemedText>
                      <ThemedText style={styles.contactTextSmall} numberOfLines={1}>
                        {member.email}
                      </ThemedText>
                    </View>
                    {member.phone && (
                      <View style={styles.contactItemSmall}>
                        <ThemedText style={styles.contactIconSmall}>📞</ThemedText>
                        <ThemedText style={styles.contactTextSmall}>{member.phone}</ThemedText>
                      </View>
                    )}
                  </View>

                  {member.office && (
                    <View style={styles.officeContainer}>
                      <ThemedText style={styles.officeIcon}>🏢</ThemedText>
                      <ThemedText style={styles.officeText}>{member.office}</ThemedText>
                    </View>
                  )}

                  <View style={styles.viewMoreContainer}>
                    <ThemedText style={styles.viewMoreText}>View Full Profile</ThemedText>
                    <ThemedText style={styles.arrowIcon}>→</ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          ))}
        </ScrollView>
      )}
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
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
    color: Colors.textLight,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 0,
  },
  clearButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  clearButtonText: {
    fontSize: 18,
    color: Colors.textLight,
    fontWeight: 'bold',
  },
  clearSearchButton: {
    marginTop: Spacing.md,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 8,
  },
  clearSearchButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    padding: Spacing.lg,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.textLight,
  },
  errorText: {
    color: Colors.primary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  retryText: {
    color: Colors.primary,
    fontSize: 14,
    textDecorationLine: 'underline',
    marginTop: Spacing.sm,
  },
  emptyText: {
    color: Colors.textLight,
    fontSize: 16,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: Spacing.md,
    marginHorizontal: Spacing.md,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
  },
  cardContent: {
    padding: Spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 22,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    marginBottom: 4,
    color: Colors.text,
  },
  designation: {
    color: Colors.textLight,
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: Spacing.xs,
  },
  departmentBadge: {
    backgroundColor: Colors.backgroundAlt,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  departmentBadgeText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.sm,
  },
  contactItemSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: '48%',
    marginBottom: Spacing.xs,
    marginRight: Spacing.sm,
  },
  contactIconSmall: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },
  contactTextSmall: {
    color: Colors.textLight,
    fontSize: 13,
    flex: 1,
  },
  officeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundAlt,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  officeIcon: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },
  officeText: {
    color: Colors.text,
    fontSize: 13,
    flex: 1,
  },
  viewMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  viewMoreText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginRight: Spacing.xs,
  },
  arrowIcon: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

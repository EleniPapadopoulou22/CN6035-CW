//Αρχικ΄΄η οθόνη μετά τη σ΄ύνδεση/εγγραφή, εμφανίζει όλα τα θεάτρα και έχει λειτουργία αναζήτησης. Από εδώ ο χρήστης μπορεί να μεταβεί στην οθόνη του προφίλ του ή να αποσυνδεθεί.
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import ScreenBackground from '../components/ScreenBackground';
import { useAuth } from '../context/AuthContext';
import { theatreApi } from '../services/api';
import { colors } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();

  const [theatres, setTheatres] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTheatres(search);
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  async function loadTheatres(searchText = '') {
    try {
      if (!isRefreshing) setIsLoading(true);

      const response = searchText.trim()
        ? await theatreApi.search(searchText.trim())
        : await theatreApi.getAll();

      setTheatres(response.data.data);
    } catch (error) {
      Alert.alert('Σφάλμα', 'Δεν μπόρεσαν να φορτωθούν οι θεάτρα.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  async function handleRefresh() {
    setIsRefreshing(true);
    await loadTheatres(search);
  }

  function renderTheatre({ item }) {
    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() =>
          navigation.navigate('Shows', {
            theatreId: item.theatre_id,
            theatreName: item.name,
          })
        }
      >
        <View style={styles.cardAccent} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.location}>{item.location}</Text>
          {!!item.description && (
            <Text style={styles.description} numberOfLines={3}>
              {item.description}
            </Text>
          )}
        </View>
      </Pressable>
    );
  }

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Καλώς ήρθες</Text>
            <Text style={styles.title}>{user?.name || 'Guest'}</Text>
          </View>

          <View style={styles.headerActions}>
            <Pressable onPress={() => navigation.navigate('Profile')} style={styles.profileButton}>
              <Text style={styles.profileText}>Κρατήσεις</Text>
            </Pressable>

            <Pressable onPress={logout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
        </View>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search by theatre or location"
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Θεάτρα</Text>
          <Text style={styles.count}>{theatres.length}</Text>
        </View>

        {isLoading && !isRefreshing ? (
          <ActivityIndicator color={colors.primaryLight} style={styles.loader} />
        ) : (
          <FlatList
            data={theatres}
            keyExtractor={(item) => String(item.theatre_id)}
            renderItem={renderTheatre}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Δεν βρέθηκαν θεάτρα.</Text>
            }
          />
        )}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: colors.primaryLight,
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 4,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
  },
  logoutText: {
    color: colors.primaryLight,
    fontWeight: '800',
  },
  searchInput: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
  },
  sectionHeader: {
    marginTop: 18,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  count: {
    color: colors.textMuted,
    fontWeight: '700',
  },
  loader: {
    marginTop: 40,
  },
  list: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardAccent: {
    width: 5,
    backgroundColor: colors.primary,
  },
  cardContent: {
    flex: 1,
    padding: 14,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  location: {
    color: colors.primaryLight,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 5,
  },
  description: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  profileButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
  },
  profileText: {
    color: colors.text,
    fontWeight: '800',
  },
});
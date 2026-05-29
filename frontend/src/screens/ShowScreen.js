//Οθόνη που εμφανίζει τις παραστάσεις ενός θεάτρου, με δυνατότητα αναζήτησης και ανανέωσης της λίστας.
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
import { showApi } from '../services/api';
import { colors } from '../theme/colors';

export default function ShowScreen({ navigation, route }) {
  const { theatreId, theatreName } = route.params;

  const [shows, setShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    navigation.setOptions({ title: theatreName });
    loadShows();
  }, []);

  const filteredShows = shows.filter((show) => {
  const query = search.trim().toLowerCase();

  if (!query) return true;

  return (
    show.title.toLowerCase().includes(query) ||
    show.description?.toLowerCase().includes(query)
  );
});

  async function loadShows() {
    try {
      if (!isRefreshing) setIsLoading(true);

      const response = await showApi.getAll({ theatreId });
      setShows(response.data.data);
    } catch (error) {
      Alert.alert('Σφάλμα', 'δεν μπόρεσαν να φορτωθούν οι παραστάσεις.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  async function handleRefresh() {
    setIsRefreshing(true);
    await loadShows();
  }

  function getRatingStyle(rating) {
    if (rating === '15+' || rating === '16+' || rating === '18+') {
      return styles.ratingStrong;
    }

    return styles.ratingSoft;
  }

  function renderShow({ item }) {
    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() =>
          navigation.navigate('Showtimes', {
            showId: item.show_id,
            showTitle: item.title,
          })
        }
      >
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={[styles.rating, getRatingStyle(item.age_rating)]}>
            <Text style={styles.ratingText}>{item.age_rating}</Text>
          </View>
        </View>

        <Text style={styles.meta}>{item.duration_minutes} minutes</Text>

        {!!item.description && (
          <Text style={styles.description} numberOfLines={4}>
            {item.description}
          </Text>
        )}
      </Pressable>
    );
  }

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <Text style={styles.heading}>Παραστάσεις</Text>
        <Text style={styles.subheading}>{theatreName}</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Αναζήτηση παράστασης"
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
        />

        {isLoading && !isRefreshing ? (
          <ActivityIndicator color={colors.primaryLight} style={styles.loader} />
        ) : (
          <FlatList
            data={filteredShows}
            keyExtractor={(item) => String(item.show_id)}
            renderItem={renderShow}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Δεν βρέθηκαν παραστάσεις.</Text>
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
  heading: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 8,
  },
  subheading: {
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: 18,
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
    padding: 15,
    marginBottom: 12,
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  rating: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  ratingSoft: {
    backgroundColor: colors.surfaceLight,
  },
  ratingStrong: {
    backgroundColor: colors.primary,
  },
  ratingText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  meta: {
    color: colors.primaryLight,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
  },
  description: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
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
  marginBottom: 14,
},
});
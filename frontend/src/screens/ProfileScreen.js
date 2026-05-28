import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import ScreenBackground from '../components/ScreenBackground';
import { reservationApi } from '../services/api';
import { colors } from '../theme/colors';

function formatDateTime(value) {
  return new Date(value).toLocaleString('el-GR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPrice(value) {
  return `${Number(value).toFixed(2)} EUR`;
}

function isPast(value) {
  return new Date(value) <= new Date();
}

export default function ProfileScreen({ navigation }) {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadReservations();
    }, [])
  );

  async function loadReservations() {
    try {
      if (!isRefreshing) setIsLoading(true);

      const response = await reservationApi.getMine();
      setReservations(response.data.data);
    } catch (error) {
      Alert.alert('Σφάλμα', 'Δεν μπόρεσαν να φορτωθούν οι κρατήσεις.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  async function handleRefresh() {
    setIsRefreshing(true);
    await loadReservations();
  }

  function confirmCancel(reservation) {
    if (isPast(reservation.start_datetime)) {
      Alert.alert('Μη επιτρεπτή', 'Παλαιές κρατήσεις δεν μπορούν να ακυρωθούν.');
      return;
    }

    Alert.alert(
      'Ακύρωση κράτησης',
      `Ακυρώστε την κράτησή σας για "${reservation.show_title}"?`,
      [
        { text: 'Όχι', style: 'cancel' },
        {
          text: 'Ακύρωση',
          style: 'destructive',
          onPress: async () => {
            try {
              await reservationApi.delete(reservation.reservation_id);
              await loadReservations();

              Alert.alert('Επιτυχία', 'Η κράτηση ακυρώθηκε επιτυχώς.', [
                {
                  text: 'OK',
                  onPress: () =>
                    navigation.reset({
                      index: 1,
                      routes: [
                        { name: 'Home' },
                        { name: 'Profile' },
                      ],
                    }),
                },
              ]);
            } catch (error) {
              const message = error.response?.data?.message || 'Cancellation failed.';
              Alert.alert('Σφάλμα', message);
            }
          },
        },
      ]
    );
  }

  const sortedReservations = [...reservations].sort((a, b) => {
    const aPast = isPast(a.start_datetime);
    const bPast = isPast(b.start_datetime);

    if (aPast !== bPast) return aPast ? 1 : -1;
    return new Date(a.start_datetime) - new Date(b.start_datetime);
  });

  function renderReservation({ item }) {
    const past = isPast(item.start_datetime);

    return (
      <View style={[styles.card, past && styles.cardPast]}>
        <View style={styles.cardHeader}>
          <Text style={styles.showTitle}>{item.show_title}</Text>
          {past && <Text style={styles.pastBadge}>Προηγμένες</Text>}
        </View>

        <Text style={styles.theatre}>{item.theatre_name}</Text>
        <Text style={styles.muted}>{item.theatre_location}</Text>

        <View style={styles.divider} />

        <Text style={styles.detail}>{formatDateTime(item.start_datetime)}</Text>
        <Text style={styles.detail}>{item.hall}</Text>
        <Text style={styles.detail}>
          Σειρά {item.row_label}, Θέση {item.seat_number}
        </Text>

        <Text style={styles.price}>{formatPrice(item.price)}</Text>

        {!past && (
          <Pressable style={styles.cancelButton} onPress={() => confirmCancel(item)}>
            <Text style={styles.cancelButtonText}>Ακύρωση κράτησης
            </Text>
          </Pressable>
        )}
      </View>
    );
  }

  if (isLoading) {
    return (
      <ScreenBackground center>
        <ActivityIndicator size="large" color={colors.primaryLight} />
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <Text style={styles.heading}>Οι κρατήσεις μου</Text>
        <Text style={styles.subheading}>{reservations.length} Όλες οι κρατήσεις μου:</Text>

        <FlatList
          data={sortedReservations}
          keyExtractor={(item) => String(item.reservation_id)}
          renderItem={renderReservation}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Δεν έχετε κρατήσεις ακόμη.</Text>
              <Text style={styles.emptyText}>Επιλέξτε μια παράσταση και κρατήστε την πρώτη σας θέση.</Text>
              <Pressable style={styles.browseButton} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.browseButtonText}>Περιήγηση θεάτρων</Text>
              </Pressable>
            </View>
          }
        />
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
    fontWeight: '900',
    marginTop: 8,
  },
  subheading: {
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: 18,
  },
  list: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
  },
  cardPast: {
    opacity: 0.62,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  showTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  pastBadge: {
    backgroundColor: colors.surfaceLight,
    color: colors.textMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '800',
  },
  theatre: {
    color: colors.primaryLight,
    fontWeight: '800',
    marginTop: 8,
  },
  muted: {
    color: colors.textMuted,
    marginTop: 3,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  detail: {
    color: colors.text,
    marginBottom: 5,
    fontWeight: '600',
  },
  price: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'right',
    marginTop: 8,
  },
  cancelButton: {
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.text,
    fontWeight: '900',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 18,
  },
  browseButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  browseButtonText: {
    color: colors.text,
    fontWeight: '900',
  },
});
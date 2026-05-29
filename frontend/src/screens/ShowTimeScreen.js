//Οθόνη που εμφανίζει τις διαθέσιμες παραστάσεις για ένα συγκεκριμένο θέατρο,με δυνατότητα επιλογής παράστασης για κράτηση.
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ScreenBackground from '../components/ScreenBackground';
import { showtimeApi } from '../services/api';
import { colors } from '../theme/colors';

function formatDate(value) {
  return new Date(value).toLocaleDateString('el-GR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(value) {
  return new Date(value).toLocaleTimeString('el-GR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPrice(value) {
  return `${Number(value).toFixed(2)} EUR`;
}

export default function ShowTimeScreen({ navigation, route }) {
  const { showId, showTitle } = route.params;

  const [showtimes, setShowtimes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: showTitle });
    loadShowtimes();
  }, []);

  async function loadShowtimes() {
    try {
      if (!isRefreshing) setIsLoading(true);

      const response = await showtimeApi.getByShow(showId);
      setShowtimes(response.data.data);
    } catch (error) {
      Alert.alert('Σφάλμα', 'Δεν μπόρεσαν να φορτωθούν οι παραστάσεις.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  async function handleRefresh() {
    setIsRefreshing(true);
    await loadShowtimes();
  }

  function renderShowtime({ item }) {
    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() =>
          navigation.navigate('Seats', {
            showtimeId: item.showtime_id,
            showTitle,
            startDatetime: item.start_datetime,
            hall: item.hall,
            price: item.price,
          })
        }
      >
        <View>
          <Text style={styles.date}>{formatDate(item.start_datetime)}</Text>
          <Text style={styles.time}>{formatTime(item.start_datetime)}</Text>
          <Text style={styles.hall}>{item.hall}</Text>
        </View>

        <View style={styles.priceBox}>
          <Text style={styles.priceLabel}>Τιμή</Text>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <Text style={styles.heading}>Επέλεξε ημερομηνία</Text>
        <Text style={styles.subheading}>{showTitle}</Text>

        {isLoading && !isRefreshing ? (
          <ActivityIndicator color={colors.primaryLight} style={styles.loader} />
        ) : (
          <FlatList
            data={showtimes}
            keyExtractor={(item) => String(item.showtime_id)}
            renderItem={renderShowtime}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  cardPressed: {
    opacity: 0.85,
  },
  date: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  time: {
    color: colors.primaryLight,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 5,
  },
  hall: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 5,
  },
  priceBox: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  priceLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  price: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 4,
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
  },
});
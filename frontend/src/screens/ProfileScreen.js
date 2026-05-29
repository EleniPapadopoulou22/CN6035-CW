/**Οθόνη προφίλ χρήστη με τις κρατήσεις του, μπορεί να δεί το κωδικό QR κάθε κράτησης και να ακυρώσει κράτηση παράστασης που δεν έχει ολοκληρωθεί ακόμα **/
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
import QRCode from 'react-native-qrcode-svg';
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
  const [openQrId, setOpenQrId] = useState(null);

  const activeReservations = reservations.filter(
    (reservation) => !isPast(reservation.start_datetime)
  ).length;

  const pastReservations = reservations.length - activeReservations;

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
      `Θέλεις σίγουρα να ακυρώσεις την κράτηση για "${reservation.show_title}";`,
      [
        {
          text: 'Όχι, κράτησέ την',
          style: 'cancel',
          onPress: () => {
            console.log('Reservation cancellation dismissed');
          },
        },
        {
          text: 'Ναι, ακύρωση κράτησης',
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
                      routes: [{ name: 'Home' }, { name: 'Profile' }],
                    }),
                },
              ]);
            } catch (error) {
              const message = error.response?.data?.message || 'Η ακύρωση απέτυχε.';
              Alert.alert('Σφάλμα', message);
            }
          },
        },
      ],
      { cancelable: true }
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
    const qrValue = JSON.stringify({
      reservationId: item.reservation_id,
      showTitle: item.show_title,
      startDatetime: item.start_datetime,
      theatre: item.theatre_name,
      hall: item.hall,
      row: item.row_label,
      seat: item.seat_number,
      price: item.price,
    });

    return (
      <View style={[styles.card, past && styles.cardPast]}>
        <View style={styles.cardHeader}>
          <Text style={styles.showTitle}>{item.show_title}</Text>
          {past && <Text style={styles.pastBadge}>Προηγούμενες</Text>}
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

        <Pressable
          style={styles.qrToggleButton}
          onPress={() =>
            setOpenQrId((currentId) =>
              currentId === item.reservation_id ? null : item.reservation_id
            )
          }
        >
          <Text style={styles.qrToggleText}>
            {openQrId === item.reservation_id ? 'Απόκρυψη QR' : 'Εμφάνιση QR'}
          </Text>
        </Pressable>

        {openQrId === item.reservation_id && (
          <View style={styles.qrBox}>
            <QRCode
              value={qrValue}
              size={145}
              backgroundColor={colors.text}
              color={colors.background}
            />
            <Text style={styles.qrHint}>
              QR εισιτήριο για την κράτηση #{item.reservation_id}
            </Text>
          </View>
        )}

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
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{reservations.length}</Text>
          <Text style={styles.summaryLabel}>Σύνολο</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{activeReservations}</Text>
          <Text style={styles.summaryLabel}>Ενεργές</Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{pastReservations}</Text>
          <Text style={styles.summaryLabel}>Παλαιές</Text>
        </View>
      </View>

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
            <Text style={styles.emptyText}>
              Επιλέξτε μια παράσταση και κρατήστε την πρώτη σας θέση.
            </Text>
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
  summaryRow: {
  flexDirection: 'row',
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 8,
  marginTop: 15,
  marginBottom: 40,
  paddingVertical: 14,
},

summaryItem: {
  flex: 1,
  alignItems: 'center',
},

summaryNumber: {
  color: colors.primaryLight,
  fontSize: 24,
  fontWeight: '900',
},

summaryLabel: {
  color: colors.textMuted,
  fontSize: 12,
  fontWeight: '800',
  marginTop: 4,
},

summaryDivider: {
  width: 1,
  backgroundColor: colors.border,
},
  qrToggleButton: {
  marginTop: 12,
  borderWidth: 1,
  borderColor: colors.primary,
  borderRadius: 8,
  paddingVertical: 11,
  alignItems: 'center',
},
qrToggleText: {
  color: colors.primaryLight,
  fontWeight: '900',
},
qrBox: {
  marginTop: 12,
  backgroundColor: colors.text,
  borderRadius: 10,
  padding: 14,
  alignItems: 'center',
},
qrHint: {
  color: colors.background,
  fontSize: 12,
  fontWeight: '700',
  textAlign: 'center',
  marginTop: 10,
},
  
});
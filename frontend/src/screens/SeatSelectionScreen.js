import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ScreenBackground from '../components/ScreenBackground';
import { reservationApi, seatApi } from '../services/api';
import { colors } from '../theme/colors';

function formatDateTime(value) {
  return new Date(value).toLocaleString('el-GR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPrice(value) {
  return `${Number(value).toFixed(2)} EUR`;
}

export default function SeatSelectionScreen({ navigation, route }) {
  const { showtimeId, showTitle, startDatetime, hall, price } = route.params;

  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: 'Select seat' });
    loadSeats();
  }, []);

  async function loadSeats() {
    try {
      setIsLoading(true);
      const response = await seatApi.getByShowtime(showtimeId);
      setSeats(response.data.data);
    } catch (error) {
      Alert.alert('Σφάλμα', 'Δεν μπόρεσαν να φορτωθούν οι διαθέσιμες θέσεις.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleBook() {
    if (!selectedSeat) {
      Alert.alert('Επέλεξε θέση', 'Παρακαλώ επέλεξε μια διαθέσιμη θέση πρώτα.');
      return;
    }

    setIsBooking(true);

    try {
      const response = await reservationApi.create(selectedSeat.seat_id);

      navigation.reset({
        index: 1,
        routes: [
          { name: 'Home' },
          {
            name: 'Confirmation',
            params: {
              reservation: response.data.data,
              showTitle,
              startDatetime,
              hall,
              price,
              seat: selectedSeat,
            },
          },
        ],
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Reservation failed.';
      Alert.alert('Σφάλμα κράτησης', message);
      await loadSeats();
    } finally {
      setIsBooking(false);
    }
  }

  const seatsByRow = useMemo(() => {
    return seats.reduce((rows, seat) => {
      if (!rows[seat.row_label]) rows[seat.row_label] = [];
      rows[seat.row_label].push(seat);
      return rows;
    }, {});
  }, [seats]);

  const rowLabels = Object.keys(seatsByRow).sort();
  const availableCount = seats.filter((seat) => Boolean(seat.is_available)).length;

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
        <View style={styles.summary}>
          <Text style={styles.showTitle}>{showTitle}</Text>
          <Text style={styles.meta}>
            {formatDateTime(startDatetime)} · {hall} · {formatPrice(price)}
          </Text>
          <Text style={styles.available}>{availableCount} διαθέσιμες θέσεις</Text>
        </View>

        <View style={styles.stage}>
          <Text style={styles.stageText}>Σκηνή</Text>
        </View>

        <ScrollView contentContainerStyle={styles.seatMap}>
          {rowLabels.map((row) => (
            <View key={row} style={styles.row}>
              <Text style={styles.rowLabel}>{row}</Text>

              <View style={styles.seats}>
                {seatsByRow[row].map((seat) => {
                  const isAvailable = Boolean(seat.is_available);
                  const isSelected = selectedSeat?.seat_id === seat.seat_id;

                  return (
                    <Pressable
                      key={seat.seat_id}
                      disabled={!isAvailable}
                      onPress={() => setSelectedSeat(seat)}
                      style={[
                        styles.seat,
                        isSelected && styles.seatSelected,
                        !isAvailable && styles.seatReserved,
                      ]}
                    >
                      <Text
                        style={[
                          styles.seatText,
                          isSelected && styles.seatSelectedText,
                          !isAvailable && styles.seatReservedText,
                        ]}
                      >
                        {seat.seat_number}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, styles.legendAvailable]} />
              <Text style={styles.legendText}>Διαθέσιμη</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={[styles.legendBox, styles.legendSelected]} />
              <Text style={styles.legendText}>Επιλεγμένη</Text>
            </View>

            <View style={styles.legendItem}>
              <View style={[styles.legendBox, styles.legendReserved]} />
              <Text style={styles.legendText}>Μη διαθέσιμη</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.selectedText}>
            {selectedSeat
              ? `Σειρά ${selectedSeat.row_label}, Θέση ${selectedSeat.seat_number}`
              : 'Δεν εχει επιλεγεί θέση'}
          </Text>

          <Pressable
            onPress={handleBook}
            disabled={!selectedSeat || isBooking}
            style={[
              styles.bookButton,
              (!selectedSeat || isBooking) && styles.bookButtonDisabled,
            ]}
          >
            {isBooking ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <Text style={styles.bookButtonText}>Ολοκλήρωση κράτησης</Text>
            )}
          </Pressable>
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summary: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: 'rgba(21, 21, 24, 0.78)',
  },
  showTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '900',
  },
  meta: {
    color: colors.textMuted,
    marginTop: 6,
  },
  available: {
    color: colors.primaryLight,
    fontWeight: '800',
    marginTop: 8,
  },
  stage: {
    marginHorizontal: 42,
    marginTop: 18,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
  },
  stageText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
  },
  seatMap: {
    padding: 18,
    paddingBottom: 110,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rowLabel: {
    width: 24,
    color: colors.textMuted,
    fontWeight: '900',
  },
  seats: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  seat: {
    width: 38,
    height: 38,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.seatAvailable,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatSelected: {
    backgroundColor: colors.seatSelected,
    borderColor: colors.primaryLight,
  },
  seatReserved: {
    backgroundColor: colors.seatReserved,
    opacity: 0.55,
  },
  seatText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  seatSelectedText: {
    color: colors.text,
  },
  seatReservedText: {
    color: colors.textMuted,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  legendAvailable: {
    backgroundColor: colors.seatAvailable,
    borderWidth: 1,
    borderColor: colors.border,
  },
  legendSelected: {
    backgroundColor: colors.seatSelected,
  },
  legendReserved: {
    backgroundColor: colors.seatReserved,
  },
  legendText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  selectedText: {
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '700',
  },
  bookButton: {
    minHeight: 50,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonDisabled: {
    opacity: 0.5,
  },
  bookButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
});
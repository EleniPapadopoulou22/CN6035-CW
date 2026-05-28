import { Pressable, StyleSheet, Text, View } from 'react-native';

import ScreenBackground from '../components/ScreenBackground';
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

export default function ConfirmationScreen({ navigation, route }) {
  const { reservation, showTitle, startDatetime, hall, price, seat } = route.params;

  return (
    <ScreenBackground center>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>CONFIRMED</Text>
        <Text style={styles.title}>Η κράτησή σας επιβεβαιώθηκε</Text>

        <View style={styles.ticket}>
          <Text style={styles.showTitle}>{showTitle}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{formatDateTime(startDatetime)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Hall</Text>
            <Text style={styles.value}>{hall}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Seat</Text>
            <Text style={styles.value}>
              Row {seat.row_label}, Seat {seat.seat_number}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Price</Text>
            <Text style={styles.value}>{formatPrice(price)}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.reservationId}>
            Reservation #{reservation.reservation_id}
          </Text>
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          })}
        >
          <Text style={styles.primaryButtonText}>Πίσω στα θέατρα</Text>
        </Pressable>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: 22,
  },
  eyebrow: {
    color: colors.primaryLight,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 22,
  },
  ticket: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 18,
    marginBottom: 18,
  },
  showTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 16,
  },
  row: {
    marginBottom: 12,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 3,
  },
  value: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  reservationId: {
    color: colors.primaryLight,
    fontWeight: '900',
    textAlign: 'center',
  },
  primaryButton: {
    minHeight: 50,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
});
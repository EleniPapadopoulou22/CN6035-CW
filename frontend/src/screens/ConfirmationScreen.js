/** ConfirmationScreen.js δείχνει τα στοιχεία της κράτησης μετά την ολοκλήρωση της διαδικασίας. 
 * Περιλαμβάνει ένα κουμπί για εμφάνιση/απόκρυψη του QR code που περιέχει τα βασικά στοιχεία της κράτησης σε μορφή JSON. **/
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
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
  const [showQr, setShowQr] = useState(false);

const qrValue = JSON.stringify({
  reservationId: reservation.reservation_id,
  showTitle,
  startDatetime,
  hall,
  row: seat.row_label,
  seat: seat.seat_number,
  price,
});

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.status}>Η ΚΡΑΤΗΣΗ ΟΛΟΚΛΗΡΩΘΗΚΕ</Text>
          <Text style={styles.title}>Το εισιτήριό σου</Text>
          <Text style={styles.subtitle}>
            Η θέση σου έχει δεσμευτεί επιτυχώς.
          </Text>
        </View>

        <View style={styles.ticket}>
          <View style={styles.ticketTop}>
            <Text style={styles.showTitle}>{showTitle}</Text>
            <Text style={styles.reservationId}>
              #{reservation.reservation_id}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Ημερομηνία / Ώρα</Text>
            <Text style={styles.value}>{formatDateTime(startDatetime)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Αίθουσα</Text>
            <Text style={styles.value}>{hall}</Text>
          </View>

          <View style={styles.seatBox}>
            <View>
              <Text style={styles.label}>Σειρά</Text>
              <Text style={styles.bigValue}>{seat.row_label}</Text>
            </View>

            <View style={styles.seatDivider} />

            <View>
              <Text style={styles.label}>Θέση</Text>
              <Text style={styles.bigValue}>{seat.seat_number}</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.label}>Τιμή</Text>
            <Text style={styles.price}>{formatPrice(price)}</Text>
          </View>

          <View style={styles.footerNote}>
            <Text style={styles.footerText}>
              Κράτησε αυτό το εισιτήριο για την είσοδό σου στην παράσταση. Εκεί θα ολοκληρώθεί η πληρωμή.
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.qrToggleButton}
          onPress={() => setShowQr((current) => !current)}
        >
          <Text style={styles.qrToggleText}>
            {showQr ? 'Απόκρυψη QR εισιτηρίου' : 'Εμφάνιση QR εισιτηρίου'}
          </Text>
        </Pressable>

        {showQr && (
          <View style={styles.qrBox}>
            <QRCode
              value={qrValue}
              size={160}
              backgroundColor={colors.text}
              color={colors.background}
            />
            <Text style={styles.qrHint}>
              Το QR περιέχει τα βασικά στοιχεία της κράτησης.
            </Text>
  </View>
)}

        <Pressable
          style={styles.primaryButton}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            })
          }
        >
          <Text style={styles.primaryButtonText}>Επιστροφή στα θέατρα</Text>
        </Pressable>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 22,
  },
  status: {
    color: colors.primaryLight,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  ticket: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 18,
    marginBottom: 18,
  },
  ticketTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
  },
  showTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 21,
    fontWeight: '900',
  },
  reservationId: {
    color: colors.primaryLight,
    fontWeight: '900',
  },
  divider: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    marginVertical: 16,
  },
  infoRow: {
    marginBottom: 14,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  value: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  seatBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    paddingVertical: 16,
    marginVertical: 8,
  },
  seatDivider: {
    width: 1,
    height: 44,
    backgroundColor: colors.border,
  },
  bigValue: {
    color: colors.primaryLight,
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
  },
  priceRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  footerNote: {
    marginTop: 16,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: 12,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  primaryButton: {
    minHeight: 52,
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
  qrToggleButton: {
  marginTop: 14,
  marginBottom: 8,
  borderWidth: 1,
  borderColor: colors.primary,
  borderRadius: 8,
  paddingVertical: 12,
  alignItems: 'center',
},
qrToggleText: {
  color: colors.primaryLight,
  fontWeight: '900',
},
qrBox: {
  marginTop: 14,
  marginBottom: 100,
  backgroundColor: colors.text,
  borderRadius: 10,
  padding: 16,
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
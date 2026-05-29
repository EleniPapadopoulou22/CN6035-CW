USE theatre_reservations;
--Καθαρισμός πινάκων για νέα δεδομένα
DELETE FROM reservations;
DELETE FROM seats;
DELETE FROM showtimes;
DELETE FROM shows;
DELETE FROM theatres;
DELETE FROM users;

ALTER TABLE reservations AUTO_INCREMENT = 1;
ALTER TABLE seats AUTO_INCREMENT = 1;
ALTER TABLE showtimes AUTO_INCREMENT = 1;
ALTER TABLE shows AUTO_INCREMENT = 1;
ALTER TABLE theatres AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;

--Θέατρα
INSERT INTO theatres (name, location, description) VALUES
('Βασιλικό Θέατρο', 'Θεσσαλονίκη', 'Το Βασιλικό Θέατρο βρίσκεται κοντά στον Λευκό Πύργο και αποτελεί έναν από τους σημαντικούς θεατρικούς χώρους της Θεσσαλονίκης. Φιλοξενεί παραστάσεις κλασικού και σύγχρονου ρεπερτορίου.'),
('Θέατρο Αριστοτέλειον', 'Θεσσαλονίκη', 'Το Θέατρο Αριστοτέλειον βρίσκεται στο κέντρο της Θεσσαλονίκης και φιλοξενεί θεατρικές παραστάσεις, μουσικές εκδηλώσεις και άλλες πολιτιστικές δράσεις.'),
('Θέατρο Δάσους', 'Θεσσαλονίκη', 'Το Θέατρο Δάσους είναι ανοιχτό θέατρο της Θεσσαλονίκης και χρησιμοποιείται κυρίως για καλοκαιρινές παραστάσεις και πολιτιστικές εκδηλώσεις.'),
('Ωδείο Ηρώδου Αττικού - Ηρώδειο', 'Αθήνα', 'Το Ηρώδειο βρίσκεται κάτω από την Ακρόπολη και αποτελεί έναν από τους πιο εμβληματικούς χώρους πολιτισμού στην Ελλάδα. Φιλοξενεί θεατρικές και μουσικές παραστάσεις.'),
('Εθνικό Θέατρο', 'Αθήνα', 'Το Εθνικό Θέατρο είναι ένας από τους σημαντικότερους θεατρικούς οργανισμούς της Ελλάδας, με παραστάσεις κλασικού και σύγχρονου ρεπερτορίου.'),
('Θέατρο Πορεία', 'Αθήνα', 'Το Θέατρο Πορεία είναι σύγχρονος θεατρικός χώρος στην Αθήνα και παρουσιάζει παραστάσεις με έμφαση στο ελληνικό και διεθνές ρεπερτόριο.');

--Παραστάσεις
INSERT INTO shows (theatre_id, title, description, duration_minutes, age_rating) VALUES
(1, 'Η φάρμα των ζώων', 'Σατιρική αλληγορία του Τζορτζ Όργουελ για την εξουσία, την κοινωνία και τη διαφθορά των ιδανικών.', 80, '12+'),
(1, 'Μήδεια', 'Τραγωδία του Ευριπίδη για την προδοσία, την εκδίκηση και τα όρια της ανθρώπινης οργής.', 110, '15+'),

(2, 'Ο Κατά Φαντασίαν Ασθενής', 'Κωμωδία του Μολιέρου για έναν πλούσιο άνδρα που πιστεύει ότι είναι συνεχώς άρρωστος.', 90, '12+'),
(2, 'Ο Εχθρός του Λαού', 'Έργο του Ίψεν για έναν γιατρό που αποκαλύπτει ένα δημόσιο πρόβλημα και συγκρούεται με την κοινωνία.', 100, '15+'),

(3, 'Ο Γλάρος', 'Έργο του Τσέχωφ για την τέχνη, την αγάπη, τη φιλοδοξία και την απογοήτευση.', 95, '12+'),
(3, 'Ο Βυσσινόκηπος', 'Έργο του Τσέχωφ για μια οικογένεια που αντιμετωπίζει την απώλεια του σπιτιού και του κτήματός της.', 105, '12+'),

(4, 'Φουέντε Οβεχούνα', 'Κλασικό έργο του Λόπε δε Βέγα για την αντίσταση μιας κοινότητας απέναντι στην καταπίεση και την αδικία.', 120, '12+'),
(4, 'Μάκμπεθ', 'Τραγωδία του Σαίξπηρ για τη φιλοδοξία, την εξουσία, την ενοχή και την πτώση ενός ηγεμόνα.', 130, '15+'),

(5, 'Λεωφορείον ο Πόθος', 'Έργο του Τενεσί Ουίλιαμς για την επιθυμία, την ψευδαίσθηση και τις συγκρούσεις μέσα στις ανθρώπινες σχέσεις.', 125, '15+'),
(5, 'Έγκλημα και Τιμωρία', 'Θεατρική διασκευή του έργου του Ντοστογιέφσκι για την ενοχή, την ηθική σύγκρουση και την αναζήτηση λύτρωσης.', 140, '16+'),

(6, 'Ο Κουρέας της Σεβίλλης', 'Κωμική παράσταση βασισμένη στο γνωστό έργο με γρήγορους ρυθμούς, παρεξηγήσεις και έντονο χιούμορ.', 115, 'ALL'),
(6, 'Calvero', 'Παράσταση με επίκεντρο έναν καλλιτέχνη της σκηνής, τη μνήμη, την επιμονή και τη δύναμη της τέχνης.', 100, '12+');

--Ημερομηνίες και ώρες παραστάσεων
INSERT INTO showtimes (show_id, start_datetime, hall, price) VALUES
(1, '2026-10-01 20:00:00', 'Κεντρική Σκηνή', 15.00),
(2, '2026-10-03 20:30:00', 'Κεντρική Σκηνή', 18.00),

(3, '2026-10-05 19:30:00', 'Μικρή Σκηνή', 12.00),
(4, '2026-10-07 20:30:00', 'Κεντρική Σκηνή', 16.00),

(5, '2026-10-09 21:00:00', 'Υπαίθρια Σκηνή', 14.00),
(6, '2026-10-11 20:00:00', 'Υπαίθρια Σκηνή', 14.00),

(7, '2026-10-13 20:30:00', 'Ηρώδειο', 25.00),
(8, '2026-10-15 21:00:00', 'Ηρώδειο', 28.00),

(9, '2026-10-17 20:00:00', 'Κεντρική Σκηνή', 22.00),
(10, '2026-10-19 20:30:00', 'Νέα Σκηνή', 20.00),

(11, '2026-10-21 19:30:00', 'Κεντρική Σκηνή', 18.00),
(12, '2026-10-23 21:00:00', 'Κεντρική Σκηνή', 17.00);

--Δοκιμαστικοί χρήστες
--Κωδικοί δοκιμαστικών χρηστών: password123
INSERT INTO users (name, email, password_hash) VALUES
('Demo User', 'test@example.com', '$2b$10$QnPmXGlSccrHzUteC0zJxOKg9X1R727UlF5lduKogDg0MVvR9iBwa'),
('Maria Demo', 'maria@example.com', '$2b$10$25V9KIO.IHz9aO1nqT6yXOLnD9l0UE7Y9C4j2AFU/3e/VVnpQCGPK');

--Θέσεις για τις παραστάσεις
--A και B είναι premium, C και D είναι standard
DELIMITER $$

CREATE PROCEDURE generate_seats()
BEGIN
  DECLARE current_showtime INT DEFAULT 1;
  DECLARE max_showtime INT;
  DECLARE row_index INT;
  DECLARE seat_index INT;

  SELECT MAX(showtime_id) INTO max_showtime FROM showtimes;

  WHILE current_showtime <= max_showtime DO
    SET row_index = 1;

    WHILE row_index <= 5 DO
      SET seat_index = 1;

      WHILE seat_index <= 6 DO
        INSERT INTO seats (showtime_id, row_label, seat_number, category)
        VALUES (
          current_showtime,
          CHAR(64 + row_index),
          seat_index,
          CASE WHEN row_index <= 2 THEN 'premium' ELSE 'standard' END
        );

        SET seat_index = seat_index + 1;
      END WHILE;

      SET row_index = row_index + 1;
    END WHILE;

    SET current_showtime = current_showtime + 1;
  END WHILE;
END$$

DELIMITER ;

CALL generate_seats();
DROP PROCEDURE generate_seats;

SELECT 'Seed data loaded successfully!' AS status;
SELECT COUNT(*) AS total_theatres FROM theatres;
SELECT COUNT(*) AS total_shows FROM shows;
SELECT COUNT(*) AS total_showtimes FROM showtimes;
SELECT COUNT(*) AS total_seats FROM seats;
SELECT COUNT(*) AS total_users FROM users;
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
('Βασιλικό Θέατρο', 'Θεσσαλονίκη','Το Βασιλικό Θέατρο στην πλατεία Λευκού Πύργου (30ης Οκτωβρίου 2), κτίστηκε το 1940, σύμφωνα με σχέδια του αρχιτέκτονα – πολεοδόμου Κωνσταντίνου Δοξιάδη, ως παράρτημα του Εθνικού (τότε Βασιλικού) Θεάτρου.Αποτελεί μόνιμη έδρα του Κρατικού Θεάτρου Βορείου Ελλάδος.')
,('Θέατρο Αριστοτέλειον', 'Θεσσαλονίκη','Το Θέατρο Αριστοτέλειον βρίσκεται στην οδό Εθνικής Αμύνης 2, στο κέντρο της Θεσσαλονίκης. Είναι ένα από τα πιο γνωστά θέατρα της πόλης και φιλοξενεί μια μεγάλη ποικιλία παραστάσεων, από θεατρικά έργα μέχρι μουσικές συναυλίες και χορευτικές παραστάσεις.')
,('Θέατρο Δάσους', 'Θεσσαλονίκη','Το Θέατρο Δάσους είναι ένα από τα ανοικτά θέατρα της Θεσσαλονίκης, χτισμένο στην πλαγιά του Κεδρηνού Λόφου (Σέιχ Σου). Με θέα σε ολόκληρη την πόλη και το λιμάνι της, το θέατρο λειτουργεί αδιάλειπτα από τη δεκαετία του 1970.Αποτελεί τον τόπο συνάντησης των Θεσσαλονικέων αλλά και των επισκεπτών της πόλης μιας και είναι χώρος διεξαγωγής του Φεστιβάλ Δάσους, της κορυφαίας τοπικής πολιτιστικής διοργάνωσης κατά τους θερινούς μήνες.');

--Παραστάσεις
INSERT INTO shows (theatre_id, title, description, duration_minutes, age_rating) VALUES
(1, 'Οιδίπους Τύραννος', 'Αρχαία ελληνική τραγωδία του Σοφοκλή για την αναζήτηση της αλήθειας και τις συνέπειες της μοίρας.', 120, '12+'),
(1, 'Μήδεια', 'Τραγωδία του Ευριπίδη για την προδοσία, την εκδίκηση και τα όρια της ανθρώπινης οργής.', 110, '15+'),
(2, 'Ο Κατά Φαντασίαν Ασθενής', 'Κωμωδία του Μολιέρου για έναν πλούσιο άνδρα που πιστεύει ότι είναι συνεχώς άρρωστος.', 90, '12+'),
(2, 'Ο Εχθρός του Λαού', 'Έργo του Ίψεν για έναν γιατρό που αποκαλύπτει ένα δημόσιο πρόβλημα και συγκρούεται με την κοινωνία.', 100, '15+'),
(3, 'Ο Γλάρος', 'Έργo του Τσέχωφ για την τέχνη, την αγάπη, τη φιλοδοξία και την απογοήτευση.', 95, '12+'),
(3, 'Ο Βυσσινόκηπος', 'Έργo του Τσέχωφ για μια οικογένεια που αντιμετωπίζει την απώλεια του σπιτιού και του κτήματός της.', 105, '12+');

--Ημερομηνίες και ώρες παραστάσεων
INSERT INTO showtimes (show_id, start_datetime, hall, price) VALUES
(1, '2026-10-01 20:00:00', 'Κεντρική Σκηνή', 15.00),
(1, '2026-10-02 20:00:00', 'Κεντρική Σκηνή', 15.00),
(2, '2026-10-03 20:00:00', 'Κεντρική Σκηνή', 15.00),
(2, '2026-10-04 20:00:00', 'Υπαίθρια Σκηνή', 15.00),
(3, '2026-10-01 19:00:00', 'Μικρή Σκηνή', 12.00),
(3, '2026-10-02 19:00:00', 'Μικρή Σκηνή', 12.00);

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
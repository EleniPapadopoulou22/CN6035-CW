/** Schema για Theatre Reservations Database **/
DROP DATABASE IF EXISTS theatre_reservations;
CREATE DATABASE theatre_reservations
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

  USE theatre_reservations;

/**Table για τους χρήστες**/

  CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/**Table για τα θέατρα**/

CREATE TABLE theatres (
  theatre_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  location VARCHAR(200) NOT NULL,
  description TEXT
);

/**Table για τις παραστάσεις**/

CREATE TABLE shows (
  show_id INT AUTO_INCREMENT PRIMARY KEY,
  theatre_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  duration_minutes INT NOT NULL,
  age_rating VARCHAR(20) DEFAULT 'ALL',
  FOREIGN KEY (theatre_id)
    REFERENCES theatres(theatre_id)
    ON DELETE CASCADE
);

/**Table για ημερομηνίες και ώρες παραστάσεων**/

CREATE TABLE showtimes (
  showtime_id INT AUTO_INCREMENT PRIMARY KEY,
  show_id INT NOT NULL,
  start_datetime DATETIME NOT NULL,
  hall VARCHAR(80) NOT NULL,
  price DECIMAL(8,2) NOT NULL,
  FOREIGN KEY (show_id)
    REFERENCES shows(show_id)
    ON DELETE CASCADE
);

/**Table για θέσεις συγκεκριμένων παραστάσεων**/
/**Το unique key σιγουρεύει ότι δεν μπορεί να υπάρξει διπλή θέση
*για την ίδια παράσταση: (showtime_id, row_label, seat_number)**/
CREATE TABLE seats (
  seat_id INT AUTO_INCREMENT PRIMARY KEY,
  showtime_id INT NOT NULL,
  row_label VARCHAR(5) NOT NULL,
  seat_number INT NOT NULL,
  category VARCHAR(30) DEFAULT 'standard',
  FOREIGN KEY (showtime_id)
    REFERENCES showtimes(showtime_id)
    ON DELETE CASCADE,
  UNIQUE KEY unique_seat_per_showtime (showtime_id, row_label, seat_number)
);

/**Table για τις θέσεις που έχουν κρατηθεί από τους χρήστες**/
/**Το unique key σιγουρεύει ότι δεν μπορεί να υπάρξει διπλή κράτηση
*για την ίδια θέση: (seat_id)**/
CREATE TABLE reservations (
  reservation_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  seat_id INT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE,
  FOREIGN KEY (seat_id)
    REFERENCES seats(seat_id)
    ON DELETE CASCADE
);
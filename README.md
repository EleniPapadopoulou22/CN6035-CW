# CN6035 Theatre ticket reservations

Εργασία μαθήματος CN6035- Mobile & Distributed Systems

Η εφαρμογή είναι ένα σύστημα κράτησης θέσεων για θεατρικές παραστάσεις μέσω κινητής συσκευής

# Τεχνολογίες εφαρμογής

-React Native / Expo
-Node.js
-Express
-MariaDB
-JWT Authentication
-bcryptjs
-Axios
-Expo Secure Store

# Δομή

CN6035-CW
├── backend
│   ├── db
│   │   ├── schema.sql
│   │   └── seed.sql
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── routes
│   │   └── services
│   └── server.js
└── frontend
    ├── src
    │   ├── components
    │   ├── context
    │   ├── navigation
    │   ├── screens
    │   ├── services
    │   └── theme
    └── App.js

# Ρύθμιση βάσης δεδομένων - MariaDB
# Για τη δημιουργία της βάσης και των πινάκων

cd backend
cmd /c "mysql -u root -p1234 < db\schema.sql"

# Για εισαγωγή δοκιμαστικών δεδομένων

cmd /c "mysql -u root -p1234 < db\seed.sql"

# Το seed.sql φτιάχνει τα εξής:

-θέατρα
-παραστάσεις
-ώρες παραστάσεων
-θέσεις
-δοκιμαστικούς χρήστες

# Δοκιμαστικός λογαριασμός χρήστη

Email: test@example.com
Password: password123

# Ρύθμιση Backend
# 1-Μετάβαση στο φάκελο backend

cd backend

# 2- Εγκατάσταση των dependencies

npm install

# 3- Δημιουργία αρχείου .env μέσα στον φάκελο backend

PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=1234
DB_NAME=theatre_reservations

JWT_ACCESS_SECRET=cn6035_access_secret_change_me
JWT_REFRESH_SECRET=cn6035_refresh_secret_change_me
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# 4- Εκκίνηση Backend Server 

npm start

# 5- Το backend τρέχει στο:

http://localhost:3000

# Ρύθμιση Frontend
# 1- Μετάβαση στον φάκελο frontend

cd frontend

# 2- Εγκατάσταση των dependencies

npm install

# 3- Εκκίνηση Expo

npx expo start -c

# Η εφαρμογή λειτουργεί μέσω QR code της εφαρμογής Expo Go.

# Βασικά API endpoints 

# 1- Authentication

POST /auth/register
POST /auth/login
POST /auth/refresh

# 2- Θέατρα και Παραστάσεις

GET /theatres
GET /theatres?search=...
GET /shows
GET /shows?theatreId=...
GET /showtimes?showId=...
GET /seats?showtimeId=...

# 3- Κρατήσεις
# Απαιτούν JWT access token

POST /reservations
DELETE /reservations/:id
GET /user/reservations

# Λειτουργίες εφαρμογής

-Εγγραφή χρήστη
-Σύνδεση χρήστη
-JWT Authentication
-Ασφαλής αποθήκευση token στη συσκευή
-Προβολή λίστας θεάτρων
-Αναζήτηση θεάτρων βάση ονόματος ή τοποθεσίας
-Προβολή παραστάσεων ανά θέατρο 
-Αναζήτηση παραστάσεων
-Προβολή διαθεσιμότητας θέσεων
-Κράτηση θέσης
-Προβολή ιστορικού κρατήσεων του χρήστη
-Ακύρωση κράτησης

# Συνέπεια δεδομένων 

Για τη δημιουργία μιας κράτησης χρησιμοποιείται transaction στο Backend. Η ίδια θέση δε μπορεί να κρατηθεί 2 φορές, μέσω ελέγχου διαθεσιμότητας και η κράτηση συνδέεται με ένα μοναδικό seat_id.

# Σχεδιασμός UI

Η εφαρμογή χρησιμοποιεί σκοτεινό θέμα με κόκκινες λεπτομέρειες δίνοντας την αίσθηση σκηνής θεάτρου με τις κλάσσικές κόκκινες κουρτίνες.

# Εκτέλεση Demo

Login
-Προβολή θεάτρου
-Επιλογή θεάτρου 
-Προβολή παραστάσεων
-Επιλογή παράστασης
-Επιλογή ώρας 
-Επιλογή θέσης
-Κράτηση
-Προβολή κρατήσεων
-Ακύρωση κράτησης
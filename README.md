# CN6035 Theatre ticket reservations

Εργασία μαθήματος CN6035- Mobile & Distributed Systems

Η εφαρμογή είναι ένα σύστημα κράτησης θέσεων για θεατρικές παραστάσεις μέσω κινητής συσκευής

# Τεχνολογίες εφαρμογής
```text
-React Native / Expo
-Node.js
-Express
-MariaDB
-JWT Authentication
-bcryptjs
-Axios
-Expo Secure Store
```
# Δομή
```text
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
```

# Ρύθμιση βάσης δεδομένων - MariaDB
# Για τη δημιουργία της βάσης και των πινάκων

```text
cd backend
cmd /c "mysql -u root -p1234 < db\schema.sql"
```
# Για εισαγωγή δοκιμαστικών δεδομένων
```text
cmd /c "mysql -u root -p1234 < db\seed.sql"
```
# Το seed.sql φτιάχνει τα εξής:
```text
-θέατρα
-παραστάσεις
-ώρες παραστάσεων
-θέσεις
-δοκιμαστικούς χρήστες
```
# Δοκιμαστικός λογαριασμός χρήστη
```text
Email: test@example.com
Password: password123
```
# Ρύθμιση Backend
## 1-Μετάβαση στο φάκελο backend
```text
cd backend
```
## 2- Εγκατάσταση των dependencies
```text
npm install
```
## 3- Δημιουργία αρχείου .env μέσα στον φάκελο backend
```text
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
```
## 4- Εκκίνηση Backend Server 
```text
npm start
```
## 5- Το backend τρέχει στο:
```text
http://localhost:3000
```
# Ρύθμιση Frontend
## 1- Μετάβαση στον φάκελο frontend
```text
cd frontend
```
## 2- Εγκατάσταση των dependencies
```text
npm install
```
## 3- Εκκίνηση Expo
```text
npx expo start -c
```
 Η εφαρμογή λειτουργεί μέσω QR code της εφαρμογής Expo Go.

# Βασικά API endpoints 

## 1- Authentication
```text
POST /auth/register
POST /auth/login
POST /auth/refresh
```
## 2- Θέατρα και Παραστάσεις
```text
GET /theatres
GET /theatres?search=...
GET /shows
GET /shows?theatreId=...
GET /showtimes?showId=...
GET /seats?showtimeId=...
```
## 3- Κρατήσεις
# Απαιτούν JWT access token
```text
POST /reservations
DELETE /reservations/:id
GET /user/reservations
```
# Λειτουργίες εφαρμογής
```text
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
```
# Συνέπεια δεδομένων 

Για τη δημιουργία μιας κράτησης χρησιμοποιείται transaction στο Backend. Η ίδια θέση δε μπορεί να κρατηθεί 2 φορές, μέσω ελέγχου διαθεσιμότητας και η κράτηση συνδέεται με ένα μοναδικό seat_id.

# Σχεδιασμός UI

Η εφαρμογή χρησιμοποιεί σκοτεινό θέμα με κόκκινες λεπτομέρειες δίνοντας την αίσθηση σκηνής θεάτρου με τις κλάσσικές κόκκινες κουρτίνες.

<img width="595" height="294" alt="Screenshot 2026-05-29 201618" src="https://github.com/user-attachments/assets/d8ca7e46-0103-442f-92cd-3fc07bf279c7" />
<img width="571" height="288" alt="Screenshot 2026-05-29 201635" src="https://github.com/user-attachments/assets/1c087e81-da23-4cbc-a90e-91ceb3757f1c" />
<img width="553" height="290" alt="Screenshot 2026-05-29 201648" src="https://github.com/user-attachments/assets/f0a31664-246c-49a0-9852-f8ea3b6ac77d" />

# Εκτέλεση Demo
```text
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
```

const express = require('express');
const session = require('express-session');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const twilio = require('twilio');
const app = express();
const port = 3000;

// Twilio credentials
const accountSid = 'AC2594fba7b43786ddd4f7ea62e0b3db0e';
const authToken = '7da3c011dec7e22deaff385a0737f758';
const twilioPhoneNumber = '+14354146280';
const twilioClient = new twilio(accountSid, authToken);

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'JareD6470',
  database: 'school_Management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});



// Create the new_transcribers table if not exists
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS new_transcribers (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
  )
`;

// Create the otps table if not exists
const createOtpTableQuery = `
  CREATE TABLE IF NOT EXISTS otps (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    username VARCHAR(255) NOT NULL,
    otp INT NOT NULL,
    expiry_time DATETIME NOT NULL
  )
`;
// Use pool.promise() to get a promise-based API for cleaner code
pool.promise().query(createTableQuery)
  .then(([rows, fields]) => {
    console.log('Table created or already exists');

    // Serve static files from the 'public' directory
    app.use(express.static(path.join(__dirname, 'public')));

    
    // Serve the registration form
    app.get('/success_verification', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'success_verification.html'));
    });


    // Serve the registration form
    app.get('/register', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'register.html'));
    });

     // Serve the registration form
    app.get('/account', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'account.html'));
    });

    // Serve the start file
    app.get('/start', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'start.html'));
    });

    // Serve the login form
    app.get('/login', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'login.html'));
    });

    // Handle registration form submission and insert data into the database
app.post('/register', express.urlencoded({ extended: true }), async (req, res) => {
  const { username, email, phone_number, password, confirm_password } = req.body;

  // Check if the username already exists
  const checkUsernameQuery = `SELECT * FROM new_transcribers WHERE username = ?`;
  const [usernameResults] = await pool.promise().execute(checkUsernameQuery, [username]);

  if (usernameResults.length > 0) {
    //res.send('Username already exists. Please choose a different username.');
    res.redirect('/register?error=qjrfapps_gdfajsd_yrkwaqtefd_hdfreaujerw');
    return;
  }

  // Check if the email already exists
  const checkEmailQuery = `SELECT * FROM new_transcribers WHERE email = ?`;
  const [emailResults] = await pool.promise().execute(checkEmailQuery, [email]);

  if (emailResults.length > 0) {
    //res.send('Email already exists. Please choose a different email address.');
    res.redirect('/register?error=pdr_hdfwqsfat_jftgsre_urtoyrsg');
    return;
  }

  // Check if the phone number already exists
  const checkPhoneQuery = `SELECT * FROM new_transcribers WHERE phone_number = ?`;
  const [phoneResults] = await pool.promise().execute(checkPhoneQuery, [phone_number]);

  if (phoneResults.length > 0) {
   // res.send('Phone number already exists. Please choose a different phone number.');
    res.redirect('/register?error=hfryts_knfekg_kqwasy_opvrw');
    return;
  }

  // Check if passwords match
  if (password !== confirm_password) {
    res.send('Passwords do not match.');
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert data into the new_transcribers table
  const insertQuery = `
    INSERT INTO new_transcribers (username, email, phone_number, password)
    VALUES (?, ?, ?, ?)
  `;
  try {
    const [insertResults] = await pool.promise().execute(insertQuery, [username, email, phone_number, hashedPassword]);
    console.log('User registered successfully:', insertResults);
    // res.send('User registered successfully.');
    // Generate and send OTP
        const otp = generateOtp();
        sendOtp(phone_number, otp);
        storeOtp(username, otp);

        res.redirect('/otp?username=' + username);
    //res.redirect('/login');
  } catch (error) {
    console.error('Error inserting data:', error);
    //res.send('Error registering user.');
    res.redirect('/register?error=squyta_kiyvcmcs_ytsdwqzp_lmorodr');
  }
});

 // Serve the OTP verification form
    app.get('/otp', (req, res) => {
      const username = req.query.username;
      res.sendFile(path.join(__dirname, 'public', 'otp.html'));
    });

     // Handle OTP verification form submission
    app.post('/otp', express.urlencoded({ extended: true }), async (req, res) => {
      const username = req.body.username;
      const otp = req.body.otp;

      // Check if the provided OTP is valid
      const otpResults = await verifyOtp(username, otp);

      if (otpResults) {
        res.redirect('/success_verification');
      } else {
        res.redirect('?error=invalid_otp&username=' + username);
      }
    });


    // Generate a secure random key
const generateRandomKey = (length) => {
  return crypto.randomBytes(length).toString('hex');
};

const secretKey = generateRandomKey(32);

app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true,
  // Other configurations...
}));


    // Handle login form submission and validate user credentials
app.post('/login', express.urlencoded({ extended: true }), async (req, res) => {
  const { username, password } = req.body;

  // Query the database for the user
  const getUserQuery = `
    SELECT * FROM new_transcribers
    WHERE username = ? 
  `;

  try {
    const [results, fields] = await pool.promise().execute(getUserQuery, [username]);

    if (results.length === 0) {
      res.redirect('/login?error=user_not_found');
    } else {
      const user = results[0];

      // Check if the provided password matches the stored hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Set the session and redirect to the account page
        req.session.username = user.username;
        res.redirect('/account');
      } else {
        res.redirect('/login?error=incorrect_password');
      }
    }
  } catch (error) {
    console.error('Error checking user:', error);
    res.redirect('/login?error=server_error');
  }
});
// Endpoint to fetch the username
app.get('/get-username', (req, res) => {
  const username = req.session.username;

  // Check if the user is logged in
  if (username) {
    // Return the username as JSON
    res.json({ username });
  } else {
    // If the user is not logged in, return an error status (e.g., 401 Unauthorized)
    res.status(401).json({ error: 'User not logged in' });
  }
});

    // Start the server after the table has been created
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error creating table:', err);
  });

  // Function to generate a 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Function to send OTP via Twilio
function sendOtp(phoneNumber, otp) {
  twilioClient.messages.create({
    body: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    from: twilioPhoneNumber,
    to: phoneNumber
  })
  .then(message => console.log('OTP sent:', message.sid))
  .catch(error => console.error('Error sending OTP:', error));
}

// Function to store OTP in the database
async function verifyOtp(username, otp) {
  const checkOtpQuery = 'SELECT * FROM otps WHERE username = ? AND otp = ? AND expiry_time > ?';

  try {
    const currentDate = new Date();
    console.log('Current Date:', currentDate);

    const [otpResults] = await pool.promise().execute(checkOtpQuery, [username, otp, currentDate || null]);
    console.log('OTP Results:', otpResults);

    if (otpResults.length > 0) {
      // Clear the used OTP from the database
      const clearOtpQuery = 'DELETE FROM otps WHERE username = ?';
      await pool.promise().execute(clearOtpQuery, [username]);

      return true;
    }

    return false;
  } catch (error) {
    console.error('Error verifying OTP:', error);

    // Log the parameters to help identify the issue
    console.log('Query Parameters:', [username, otp, currentDate || null]);

    return false;
  }
}



const express = require('express');
const app = express();
const port = 3000;
const session = require('express-session');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const uuid = require('uuid');

const twilio = require('twilio');

const time = require('node-time');
const cron = require('node-cron');

app.use(bodyParser.json());


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

function isAuthenticated(req, res, next) {
  if (req.session.username) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
}

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

// Create the management table if not exists
const createmTableQuery = `
  CREATE TABLE IF NOT EXISTS gmanagement (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
  )
`;
// Using pool.promise() to get a promise-based API for cleaner code
pool.promise().query(createTableQuery)
  .then(([rows, fields]) => {
    //console.log('Table created or already exists');

    
    // Serving static files from the 'public' directory
    app.use(express.static(path.join(__dirname, 'public')));

    // Serving the payments file file
    app.get('/payments', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'payments.html'));
    });
    // Serving the mregister2 file file
    app.get('/mregister2', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'mregister2.html'));
    });

    // Serving the mregister2 file file
    app.get('/maccount2', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'maccount2.html'));
    });

    // Serving the workdashboard file file
    app.get('/workdashboard', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'workdashboard.html'));
    });


    // Serving the mlogin2 file
    app.get('/mlogin3', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'mlogin3.html'));
    });

    // Serving the mlogin2 file
    app.get('/mlogin2', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'mlogin2.html'));
    });

    // Serving the success verification file
    app.get('/success_verification', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'success_verification.html'));
    });
    
    // Serving the account creation file
    app.get('/accountcreated', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'accountcreated.html'));
    });
    
    // Serving the registration form
    app.get('/register', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'register.html'));
    });

     // Serving the account file
    app.get('/account', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'account.html'));
    });

    // Serving the workdashboard file
    app.get('/workdashboard', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'workdashboard.html'));
    });

    // Serving the start file
    app.get('/start', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'start.html'));
    });

    // Serving the login form
    app.get('/login', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'login.html'));
    });

    // Serving the passwordreset form
    app.get('/passwordreset', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'passwordreset.html'));
    });
    
//tasks section

// Schedule the task to run every day at midnight (00:00)
cron.schedule('46 17 * * *', async () => {
  try {
    // Fetch questions from the server
    const response = await fetch('http://localhost:3000/generate-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log(data);

     // Update the "adverts" table, set status = pending
     const updateAdvertsQuery = 'UPDATE adverts SET status = ?';
     await pool.promise().execute(updateAdvertsQuery, ['Done']);

  } catch (error) {
    console.error('Error scheduling task:', error);
  }
});

app.post('/generate-questions', async (req, res) => {
  try {
    // Generate 10 random questions (replace this with your logic)
    const generatedQuestions = generateRandomQuestions();

    // Insert the questions into the tasks table in the database
    const insertQuestionsQuery = 'INSERT INTO tasks (questions) VALUES (?)';
    await pool.promise().execute(insertQuestionsQuery, [JSON.stringify(generatedQuestions)]);

    
    res.json({ success: true, message: 'Questions generated and inserted successfully.' });
  } 
  catch (error) {
    console.error('Error generating and inserting questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Example array of questions
const allQuestions = [
  'Bitcoin (BTC): The pioneer of cryptocurrency, Bitcoin - secure, decentralized, and changing the future of finance.',
  'Ethereum (ETH): Smart contracts, decentralized apps, and a vibrant community – Ethereum powers the next generation of the internet.',
  'Binance Coin (BNB): Fuel your transactions and save on fees with BNB, the native cryptocurrency of the Binance exchange.',
  'Cardano (ADA): Built for sustainability, Cardano aims to bring blockchain to the masses with a focus on scalability and security.',
  'Ripple (XRP): Transforming cross-border payments, Ripple connects banks globally for faster and more efficient transactions.',
  'Litecoin (LTC): Silver to Bitcoin\'s gold, Litecoin offers fast and low-cost transactions, perfect for everyday use.',
  'Polkadot (DOT): Interoperability at its core – Polkadot connects multiple blockchains, creating a web where our digital assets can move seamlessly.',
  'Chainlink (LINK): Bridging the gap between smart contracts and real-world data, Chainlink ensures smart contracts are reliable and secure.',
  'Stellar (XLM): Fast, secure, and low-cost transactions worldwide – Stellar empowers financial inclusion for everyone.',
  'Uniswap (UNI): Be your own liquidity provider! Uniswap revolutionizes decentralized trading on the Ethereum blockchain.',
  'Dogecoin (DOGE): The fun and friendly cryptocurrency – Dogecoin started as a joke and became a beloved digital currency.',
  'Tezos (XTZ): With a focus on smart contracts and on-chain governance, Tezos offers a self-amending blockchain for the community.',
  'Aave (AAVE): DeFi made easy – Aave is a decentralized lending platform that lets you earn interest on your crypto holdings.',
  'VeChain (VET): Ensuring transparency in supply chains, VeChain uses blockchain to trace and verify products.',
  'Tron (TRX): Decentralizing the internet and content creation, Tron aims to give control back to the users.',
  'EOS (EOS): Scaling decentralized applications with speed and efficiency – EOS is changing the way we interact with the blockchain.',
  'Monero (XMR): Privacy is key – Monero offers anonymous and untraceable transactions for those who value financial confidentiality.',
  'NEO (NEO): Digitizing assets and automating management – NEO brings smart economy to the blockchain.',
  'Theta (THETA): Revolutionizing video streaming and content delivery – Theta rewards users for sharing their bandwidth.',
  'Cosmos (ATOM): Connecting blockchains with the power of interoperability – Cosmos creates a united ecosystem of diverse blockchains.',
  'Dash (DASH): Swift and private transactions – Dash focuses on user experience, making crypto payments accessible to all.',
  'Maker (MKR): Empowering decentralized finance – MakerDAO provides a stablecoin (DAI) backed by collateral.',
  'Filecoin (FIL): Decentralized storage for the digital age – Filecoin rewards users for sharing their excess storage space.',
  'Compound (COMP): Yield farming made simple – Compound lets you earn interest by lending and borrowing crypto assets.',
  'IOTA (MIOTA): Revolutionizing the Internet of Things – IOTA provides feeless microtransactions for connected devices.',
  'Zcash (ZEC): Privacy-focused transactions on the blockchain – Zcash ensures your financial transactions remain confidential.',
  'Synthetix (SNX): Tokenizing real-world assets – Synthetix brings traditional assets to the blockchain, allowing for diverse investments.',
  'Kusama (KSM): The canary network for Polkadot – Kusama allows developers to test and deploy their projects before going live on Polkadot.',
  'Algorand (ALGO): Speed and scalability at its core – Algorand is redefining blockchain for the future of finance.',
  'Waves (WAVES): Empowering creators and developers – Waves simplifies blockchain development and token creation.',
  'Qtum (QTUM): Merging Bitcoin\'s reliability with Ethereum\'s smart contract capabilities – Qtum is the best of both worlds.',
  'Augur (REP): Decentralized predictions and forecasting – Augur enables users to make predictions on real-world events.',
  'Nano (NANO): Feeless and instant transactions – Nano is perfect for everyday transactions without the hassle of fees.',
  'ICON (ICX): Bridging blockchains and connecting communities – ICON aims for a truly interconnected world.',
  'SushiSwap (SUSHI): Join the decentralized exchange revolution – SushiSwap provides liquidity pools and yield farming on Ethereum.',
  'Dai (DAI): A stablecoin you can trust – Dai maintains a 1:1 peg with the US dollar, providing stability in the volatile crypto market.',
  'Decred (DCR): Community-driven governance and sustainability – Decred empowers its community to make decisions for the future.',
  'Horizen (ZEN): Privacy, security, and scalability – Horizen focuses on a multifunctional blockchain platform.',
  'OMG Network (OMG): Fast, secure, and scalable transactions – OMG Network enhances Ethereum\'s capabilities for mainstream adoption.',
  'Golem (GLM): The decentralized supercomputer – Golem allows users to rent out their computing power for a global network.',
  'Aragon (ANT): Building decentralized organizations – Aragon makes it easy to create and manage DAOs.',
  'Ren (REN): Bringing interoperability to DeFi – Ren bridges liquidity between different blockchains.',
  'Celo (CELO): Financial inclusion through mobile technology – Celo enables easy and secure mobile transactions.',
  'Hedera Hashgraph (HBAR): Fast, fair, and secure consensus – Hedera Hashgraph provides a stable and efficient platform for building decentralized applications.',
  'Loopring (LRC): Revolutionizing decentralized exchanges – Loopring enhances the scalability and liquidity of DEXs.',
  'Horizon Blockchain Games (SKALE): Gaming on the blockchain – SKALE enhances scalability for blockchain games and applications.',
  'Kyber Network (KNC): Decentralized liquidity protocol – Kyber Network enables instant token swaps and diverse liquidity sources.',
  'Balancer (BAL): Automated portfolio management – Balancer allows users to create and manage token portfolios with ease.',
  '1inch (1INCH): Decentralized exchange aggregator – 1inch finds the best prices across multiple DEXs for your trades.',
  'Terra (LUNA): Stablecoins for the new world – Terra provides stablecoins pegged to various fiat currencies, enhancing financial stability.',
  'Ontology (ONT): Bridging the gap between blockchain and business – Ontology offers a high-performance platform for building decentralized applications.',
  'Polygon (MATIC): Scaling Ethereum to new heights – Polygon enhances Ethereum\'s capabilities for faster and cheaper transactions.',
  'Civic (CVC): Securing digital identities on the blockchain – Civic provides a decentralized identity verification solution.',
  'Matic Network (MATIC): Powering decentralized applications with speed and scalability – Matic Network enhances the user experience on Ethereum.',
  'Kava (KAVA): Unlock the value of your assets – Kava allows users to collateralize their crypto assets and borrow stablecoins.',
  'Band Protocol (BAND): Decentralized data oracle – Band Protocol ensures reliable and secure data feeds for smart contracts.',
  'Swipe (SXP): The ultimate cryptocurrency wallet – Swipe provides a seamless and secure way to manage your digital assets.',
  'Perlin (PERL): A scalable and efficient blockchain – Perlin focuses on high-throughput decentralized applications.',
  'REN (REN): The privacy layer for DeFi – RenVM brings privacy to decentralized finance transactions.',
  'Ocean Protocol (OCEAN): Unlocking data for AI – Ocean Protocol enables secure and privacy-preserving data sharing on the blockchain.',
  'Gnosis (GNO): Decentralized prediction markets – Gnosis allows users to speculate on future events with decentralized and transparent markets.',
  'Balancer (BAL): Optimizing liquidity and creating liquidity pools – Balancer continues to innovate in the decentralized finance space.',
  'Anchor Protocol (ANC): Stable yields on Terra – Anchor Protocol offers stable interest rates through algorithmic adjustments.',
  'Trust Wallet Token (TWT): Powering the Trust Wallet ecosystem – TWT is the native utility token for Trust Wallet, a secure and user-friendly wallet.',
  'Arweave (AR): Permanently storing data on the blockchain – Arweave ensures the longevity and immutability of information.',
  'TomoChain (TOMO): Scalable blockchain solutions – TomoChain focuses on high-performance and low-latency transactions.',
  'Elrond (EGLD): Reimagining blockchain architecture – Elrond introduces a sharded architecture for speed and scalability.',
  'Ardor (ARDR): Blockchain-as-a-service – Ardor enables businesses to build their own blockchain solutions with ease.',
  'Quant (QNT): Bridging different blockchains – Quant connects disparate blockchain networks to facilitate interoperability.',
  'Livepeer (LPT): Decentralized video infrastructure – Livepeer provides a platform for decentralized video streaming.',
  'Energy Web Token (EWT): Blockchain for the energy sector – Energy Web Token focuses on decentralized energy solutions.',
  'Numeraire (NMR): Crowdsourced hedge fund on the blockchain – Numeraire incentivizes data scientists to create predictive models for financial markets.',
  'BandSwap (BAND): Cross-chain decentralized exchange – BandSwap enables users to trade assets across different blockchain networks.',
  'NKN (NKN): Decentralized data transmission network – NKN creates a secure and efficient network for data communication.',
  'Celo Dollar (cUSD): Stablecoin for financial inclusion – Celo Dollar provides a stable and accessible digital currency.',
  'Injective Protocol (INJ): Decentralized derivatives trading – Injective Protocol allows users to trade a variety of decentralized derivatives.',
  'Voyager Token (VGX): The gateway to your digital assets – Voyager Token powers the Voyager crypto brokerage platform.',
  'Lisk (LSK): Blockchain applications made easy – Lisk simplifies the process of building decentralized applications.',
  'Polymath (POLY): Security tokens on the blockchain – Polymath enables the creation and management of security tokens.',
  'NEM (XEM): Smart assets for a smarter world – NEM introduces a blockchain platform for creating customizable smart assets.',
  'Ampleforth (AMPL): Adaptive money with a unique monetary policy – Ampleforth adjusts its supply based on demand to maintain stability.',
  'Civic (CVC): Decentralized identity verification – Civic ensures secure and privacy-focused identity verification.',
  'Celo Euro (cEUR): Stablecoin for borderless transactions – Celo Euro provides a stable and efficient digital currency pegged to the Euro.',
  'OceanEX Token (OCE): Powering the OceanEX exchange – OCE is the native utility token for the OceanEX cryptocurrency exchange.',
  'Fetch.ai (FET): Decentralized machine learning – Fetch.ai brings machine learning capabilities to the decentralized world.',
  'Kleros (PNK): Decentralized dispute resolution – Kleros enables a transparent and efficient way to resolve disputes on the blockchain.',
  'Origin Protocol (OGN): Decentralized e-commerce solutions – Origin Protocol allows for the creation of decentralized marketplaces.',
  'Utrust (UTK): Bridging cryptocurrency and traditional payments – Utrust facilitates secure cryptocurrency payments for businesses.',
  'Keep3rV1 (KP3R): Decentralized job marketplace – Keep3rV1 enables users to participate in decentralized tasks and jobs.',
  'Rarible (RARI): Decentralized NFT marketplace – Rarible allows creators to tokenize and sell their digital assets.',
  'Gnosis (GNO): Crowd wisdom on the blockchain – Gnosis aggregates information from a decentralized network to make predictions.',
  'Bancor (BNT): Liquidity solutions for DeFi – Bancor provides decentralized liquidity pools for various tokens.',
  'District0x (DNT): Building decentralized communities – District0x allows users to create and govern decentralized communities.',
  'OceanEX Token (OCE): Fueling the OceanEX exchange – OCE serves as the native utility token for the OceanEX cryptocurrency exchange.',
  'Aavegotchi (GHST): NFT-based gaming on the blockchain – Aavegotchi combines decentralized finance and blockchain-based gaming.',
  'SwissBorg (CHSB): Decentralized wealth management – SwissBorg provides a platform for decentralized investment strategies.',
  'Cream Finance (CREAM): Decentralized lending and borrowing – Cream Finance offers lending and borrowing solutions on the blockchain.',
  'Indexed Finance (NDX): Autonomous indexing for DeFi – Indexed Finance provides decentralized index funds for the crypto market.',
  'Keep Network (KEEP): Privacy for public blockchains – Keep Network ensures the privacy and security of blockchain transactions.',
  'Serum (SRM): Decentralized exchange on the Solana blockchain – Serum provides fast and low-cost trading solutions.',
];

// Function to generate random questions without repetition in a week
function generateRandomQuestions() {
  const questionsCopy = [...allQuestions]; // Create a copy to avoid modifying the original array
  const selectedQuestions = [];

  // Shuffle the questions to randomize the order
  for (let i = questionsCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questionsCopy[i], questionsCopy[j]] = [questionsCopy[j], questionsCopy[i]];
  }

  // Select the first 10 questions (assuming the array has at least 10 questions)
  for (let i = 0; i < Math.min(11, questionsCopy.length); i++) {
    selectedQuestions.push(questionsCopy[i]);
  }

  return selectedQuestions;
}

// Example usage
const randomQuestions = generateRandomQuestions();
//console.log(randomQuestions);


app.get('/get-latest-questions', async (req, res) => {
  try {
    // Fetch the latest set of questions from the database
    const getLatestQuestionsQuery = 'SELECT questions FROM tasks ORDER BY id DESC LIMIT 1';
    const [results] = await pool.promise().execute(getLatestQuestionsQuery);

    if (results.length > 0) {
      const latestQuestions = JSON.parse(results[0].questions);
      res.json({ latestQuestions });
    } else {
      res.status(404).json({ error: 'No questions found.' });
    }
  } catch (error) {
    console.error('Error fetching latest questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//deposit update
    app.post('/maccount2', express.urlencoded({ extended: true }), async (req, res) => {
  const { transactionid, transactionammount } = req.body;

  // Validate transactionid
  if (!transactionid) {
    res.status(400).send('Transaction ID is required.');
    return;
  }

  // Check if the username already exists
  const checkTransactionIdQuery = `SELECT * FROM deposits WHERE transactionid = ?`;
  const [usernameResults] = await pool.promise().execute(checkTransactionIdQuery, [transactionid]);

  if (usernameResults.length > 0) {
    res.redirect('/maccount2?error=qjrfapps_gdfajsd_yrkwaqtefd_hdfreaujerw');
    return;
  }

  // Insert data into the new_transcribers table
  const timestamp = new Date();
  const insertQuery = `
    INSERT INTO deposits (transactionid, amount, date, status, username, status2)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  try {
    const [insertResults] = await pool.promise().execute(insertQuery, [transactionid, transactionammount, timestamp, 'unused', '', '']);
    console.log('Success:', insertResults);
    res.redirect('/maccount2?error=hdjhhwjs8748-uuey-7376ghgdsg-nncb');
   // res.redirect('/maccount2');
  } catch (error) {
    console.error('Error inserting data:', error);
    res.redirect('/maccount2?error=squyta_kiyvcmcs_ytsdwqzp_lmorodr');
  }
});


app.post('/account-update', express.urlencoded({ extended: true }), async (req, res) => {
  const { phonenumber, fullaccountname } = req.body;

  // Validate transactionid
  if (!phonenumber) {
    res.status(400).send('Phone is required ID is required.');
    return;
  }

  
  const insertQuery = `
  UPDATE accounts SET phonenumber = ?, fullname = ? WHERE account = "current"
  `;
  try {
    const [insertResults] = await pool.promise().execute(insertQuery, [phonenumber, fullaccountname]);
    console.log('Success:', insertResults);
    res.redirect('/maccount2?error=uidhagert-6tydfa-hhgjhdgh');
   // res.redirect('/maccount2');
  } catch (error) {
    console.error('Error inserting data:', error);
    res.redirect('/maccount2?error=squyta_kiyvcmcs_ytsdwqzp_lmorodr');
  }
});


 app.post('/maccount2', express.urlencoded({ extended: true }), async (req, res) => {
  const { transactionid, transactionammount } = req.body;

  // Validate transactionid
  if (!transactionid) {
    res.status(400).send('Transaction ID is required.');
    return;
  }

  // Check if the username already exists
  const checkTransactionIdQuery = `SELECT * FROM deposits WHERE transactionid = ?`;
  const [usernameResults] = await pool.promise().execute(checkTransactionIdQuery, [transactionid]);

  if (usernameResults.length > 0) {
    res.redirect('/maccount2?error=qjrfapps_gdfajsd_yrkwaqtefd_hdfreaujerw');
    return;
  }

  // Insert data into the new_transcribers table
  const timestamp = new Date();
  const insertQuery = `
    INSERT INTO deposits (transactionid, amount, date, status, username, status2)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  try {
    const [insertResults] = await pool.promise().execute(insertQuery, [transactionid, transactionammount, timestamp, 'unused', '', '']);
    console.log('Success:', insertResults);
    res.redirect('/maccount2?error=hdjhhwjs8748-uuey-7376ghgdsg-nncb');
   // res.redirect('/maccount2');
  } catch (error) {
    console.error('Error inserting data:', error);
    res.redirect('/maccount2?error=squyta_kiyvcmcs_ytsdwqzp_lmorodr');
  }
});

    // Handle registration form submission and insert data into the database
app.post('/register', express.urlencoded({ extended: true }), async (req, res) => {
  const { username, email, phone_number, password, confirm_password, invitation_code } = req.body;

  // Check if the username already exists
  const checkUsernameQuery = `SELECT * FROM new_transcribers WHERE username = ?`;
  const [usernameResults] = await pool.promise().execute(checkUsernameQuery, [username]);

  if (usernameResults.length > 0) {
    //res.send('Username already exists. Please choose a different username.');
    res.redirect('/register?wr=qjrfapps_gdfajsd_yrkwaqtefd_hdfreaujerw');
    return;
  }

  // Check if the email already exists
  const checkEmailQuery = `SELECT * FROM new_transcribers WHERE email = ?`;
  const [emailResults] = await pool.promise().execute(checkEmailQuery, [email]);

  if (emailResults.length > 0) {
    //res.send('Email already exists. Please choose a different email address.');
    res.redirect('/register?wr=pdr_hdfwqsfat_jftgsre_urtoyrsg');
    return;
  }

  // Check if the phone number already exists
  const checkPhoneQuery = `SELECT * FROM new_transcribers WHERE phone_number = ?`;
  const [phoneResults] = await pool.promise().execute(checkPhoneQuery, [phone_number]);

  if (phoneResults.length > 0) {
   // res.send('Phone number already exists. Please choose a different phone number.');
    res.redirect('/register?wr=hfryts_knfekg_kqwasy_opvrw');
    return;
  }

  // Check if the invitor exists
  const checkInvitorQuery = `SELECT * FROM new_transcribers WHERE username = ?`;
  const [invitorResults] = await pool.promise().execute(checkInvitorQuery, [invitation_code]);

  if (invitorResults.length === 0) {
   // res.send('Phone number already exists. Please choose a different phone number.');
    res.redirect('/register?wr=pphhds-gdgayrtw-uhfgd');
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

    const insertInvitesQuery = `
      INSERT INTO invites (invited, inviter, firstrecharge, status, todays_total, status2, last_updated)
      VALUES (?, ?, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT)
    `;
    await pool.promise().execute(insertInvitesQuery, [username, invitation_code]);
    
    res.redirect('/accountcreated');
  } catch (error) {
    console.error('Error inserting data:', error);
    //res.send('Error registering user.');
    res.redirect('/register?error=squyta_kiyvcmcs_ytsdwqzp_lmorodr');
  }
});

// Handle mregister2 form submission and insert data into the database
app.post('/mregister2', express.urlencoded({ extended: true }), async (req, res) => {
  const { username, email, phone_number, password, confirm_password } = req.body;

  // Check if the username already exists
  const checkUsernameQuery = `SELECT * FROM gmanagement WHERE username = ?`;
  const [usernameResults] = await pool.promise().execute(checkUsernameQuery, [username]);

  if (usernameResults.length > 0) {
    //res.send('Username already exists. Please choose a different username.');
    res.redirect('/mregister2?error=qjrfapps_gdfajsd_yrkwaqtefd_hdfreaujerw');
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
    INSERT INTO gmanagement (username, password)
    VALUES (?, ?)
  `;
  try {
    const [insertResults] = await pool.promise().execute(insertQuery, [username, hashedPassword]);
    console.log('Success:', insertResults);
    
    res.redirect('/accountcreated');
  } catch (error) {
    console.error('Error inserting data:', error);
    //res.send('Error registering user.');
    res.redirect('/register?error=squyta_kiyvcmcs_ytsdwqzp_lmorodr');
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
  const inviterLink = `http://localhost:3000/register?inviter=${username}`;
  

  // Query the database for the user
  const getUserQuery = `
    SELECT * FROM new_transcribers
    WHERE username = ? 
  `;

  try {
    const [results, fields] = await pool.promise().execute(getUserQuery, [username]);

    pool.query('UPDATE new_transcribers SET inviter_link = ? WHERE username = ?', [inviterLink, username], (err) => {
      if (err) {
        console.error('Error updating ivitation link:', err);
        res.status(500).json({ error: 'There was an error. Please try again' });
      }
    })

          
    if (results.length === 0) {
      res.redirect('/login?error=user_not_found');
    } else {
      const user = results[0];
      
      // Check if the account is verified
     const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          
          req.session.username = user.username;
          res.redirect('/workdashboard');
        } else {
          res.redirect('/login?error=incorrect_password');
        }
      
      }
   
  } catch (error) {
    console.error('Error checking user:', error);
    res.redirect('/login?error=server_error');
  }
});

// Handle password reset form submission
app.post('/reset-password', express.urlencoded({ extended: true }), async (req, res) => {
  const { passwordresetEmail, passwordresetPhone, passwordresetPassword} = req.body;
 // passwordresetEmail, passwordresetPhone, passwordresetPassword

  // Check if the email and phone_number match a user in the database
  const checkUserQuery = `SELECT * FROM new_transcribers WHERE email = ? AND phone_number = ?`;
  const [userResults] = await pool.promise().execute(checkUserQuery, [passwordresetEmail, passwordresetPhone]);

  if (userResults.length === 0) {
    res.json({ error: 'Invalid email or phone number. Please provide correct information.' });
    return;
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(passwordresetPassword, 10);

  // Update the user's password
  const updatePasswordQuery = `UPDATE new_transcribers SET password = ? WHERE email = ? AND phone_number = ?`;
  try {
    await pool.promise().execute(updatePasswordQuery, [hashedPassword, passwordresetEmail, passwordresetPhone]);
   res.json({ success: 'Password reset successfully. You can now log in with your new password.' });
   return;
    //res.redirect('/login');
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Handle mlogin2 form submission and validate user credentials
app.post('/mlogin2', express.urlencoded({ extended: true }), async (req, res) => {
  const { username, password } = req.body;

  // Query the database for the user
  const getUserQuery = `
    SELECT * FROM gmanagement
    WHERE username = ? 
  `;

  try {
    const [results, fields] = await pool.promise().execute(getUserQuery, [username]);

    if (results.length === 0) {
      res.redirect('/mlogin2?error=user_not_found');
    } else {
      const user = results[0];

      
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          
          req.session.username = user.username;
          res.redirect('/maccount2');
        } else {
          res.redirect('/mlogin2?error=incorrect_password');
        }
     
      }
    
  } catch (error) {
    console.error('Error checking user:', error);
    res.redirect('/mlogin2?error=server_error');
  }
});

// Handle mlogin3 form submission and validate user credentials
app.post('/mlogin3', express.urlencoded({ extended: true }), async (req, res) => {
  const { username, password } = req.body;

  // Query the database for the user
  const getUserQuery = `
    SELECT * FROM gmanagement
    WHERE username = ? 
  `;

  try {
    const [results, fields] = await pool.promise().execute(getUserQuery, [username]);

    if (results.length === 0) {
      res.redirect('/mlogin3?error=user_not_found');
    } else {
      const user = results[0];

      
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          
          req.session.username = user.username;
          res.redirect('/payments');
        } else {
          res.redirect('/mlogin3?error=incorrect_password');
        }
     
      }
    
  } catch (error) {
    console.error('Error checking user:', error);
    res.redirect('/mlogin3?error=server_error');
  }
});

// Handle POST request for /verifyPayment
app.post('/verifyPayment', (req, res) => {
  const transactionId = req.body.transactionId;

  // Check if the transactionId exists in the deposits table
  pool.query('SELECT * FROM deposits WHERE transactionid = ?', [transactionId], (err, results) => {
    if (err) {
      console.error('Error querying deposits table:', err);
      res.status(500).json({ error: 'There was an error. Please try again' });
    } else if (results.length === 0) {
      // TransactionId not found
      res.status(400).json({
        error1: 'No payment found with that ID. If you just made a deposit now, please try again after 5 minutes or check the code and try again'
      });
    } else {
      const deposit = results[0];
      if (deposit.status === 'used') {
        // TransactionId already used
        res.status(400).json({ error2: 'This M-pesa Code has already been used' });
      } else {
        // Update the status to 'used'
        const username = req.session.username;

        // Begin a transaction to ensure consistency
        pool.getConnection((connErr, connection) => {
          if (connErr) {
            console.error('Error connecting to the database:', connErr);
            res.status(500).json({ error: 'There was an error. Please try again' });
            return;
          }

          connection.beginTransaction((beginTransactionErr) => {
            if (beginTransactionErr) {
              console.error('Error starting database transaction:', beginTransactionErr);
              res.status(500).json({ error: 'There was an error. Please try again' });
              connection.release();
              return;
            }

            // Update balance in new-transcribers table
            connection.query(
              'UPDATE new_transcribers SET ballance = ballance + ? WHERE username = ?',
              [deposit.amount, username],
              (updateBalanceErr) => {
                if (updateBalanceErr) {
                  console.error('Error updating balance in new_transcribers table:', updateBalanceErr);
                  // Rollback the transaction in case of an error
                  connection.rollback(() => {
                    res.status(500).json({ error: 'There was an error. Please try again' });
                    connection.release();
                  });
                  return;
                }

                // Update status and username in deposits table
                connection.query(
                  'UPDATE deposits SET status = ?, username = ?, status2 = ? WHERE transactionid = ?',
                  ['used', username, 'Success', transactionId],
                  (updateDepositErr) => {
                    if (updateDepositErr) {
                      console.error('Error updating status in deposits table:', updateDepositErr);
                      // Rollback the transaction in case of an error
                      connection.rollback(() => {
                        res.status(500).json({ error: 'There was an error. Please try again' });
                        connection.release();
                      });
                      return;
                    }

                    // Check if the invited user exists and has not been paid
                    connection.query(
                      'SELECT * FROM invites WHERE invited = ? AND status = "notpaid"',
                      [username],
                      (selectInvitedErr, invitedResults) => {
                        if (selectInvitedErr) {
                          console.error('Error querying invites table:', selectInvitedErr);
                          // Rollback the transaction in case of an error
                          connection.rollback(() => {
                            res.status(500).json({ error: 'There was an error. Please try again' });
                            connection.release();
                          });
                          return;
                        }

                        if (invitedResults.length > 0) {
                          // The invited user exists and has not been paid
                          const inviter = invitedResults[0].inviter;
                          const earned = deposit.amount * 0.1;

                          // Update invites table
                          connection.query(
                            'UPDATE invites SET firstrecharge = ?, earned = ?, status = "Paid" WHERE invited = ? AND status = "notpaid"',
                            [deposit.amount, earned, username],
                            (updateInvitesErr) => {
                              if (updateInvitesErr) {
                                console.error('Error updating invites table:', updateInvitesErr);
                                // Rollback the transaction in case of an error
                                connection.rollback(() => {
                                  res.status(500).json({ error: 'There was an error. Please try again' });
                                  connection.release();
                                });
                                return;
                              }

                              // Update balance in new-transcribers table (again)
                              connection.query(
                                'UPDATE new_transcribers SET ballance = ballance + ? WHERE username = ?',
                                [earned, inviter],
                                (updateBalanceAgainErr) => {
                                  if (updateBalanceAgainErr) {
                                    console.error('Error updating balance in new_transcribers table:', updateBalanceAgainErr);
                                    // Rollback the transaction in case of an error
                                    connection.rollback(() => {
                                      res.status(500).json({ error: 'There was an error. Please try again' });
                                      connection.release();
                                    });
                                    return;
                                  }

                                  // Commit the transaction if all queries succeed
                                  connection.commit((commitErr) => {
                                    if (commitErr) {
                                      console.error('Error committing database transaction:', commitErr);
                                      res.status(500).json({ error: 'There was an error. Please try again' });
                                    } else {
                                      // Success
                                      res.json({ success: true });
                                    }
                                    connection.release();
                                  });
                                }
                              );
                            }
                          );
                        } else {
                          // The invited user does not exist or has already been paid
                          // Commit the transaction if there are no issues with the invited user
                          connection.commit((commitErr) => {
                            if (commitErr) {
                              console.error('Error committing database transaction:', commitErr);
                              res.status(500).json({ error: 'There was an error. Please try again' });
                            } else {
                              // Success
                              res.json({ success: true });
                            }
                            connection.release();
                          });
                        }
                      }
                    );
                  }
                );
              }
            );
          });
        });
      }
    }
  });
});

// Update new_transcribers table
app.post('/update-freelevel', isAuthenticated, async (req, res) => {
   const username = req.session.username;

  try {
    // Check if the user has already done the task today
    const checkTaskQuery = 'SELECT status2 FROM invites WHERE inviter = ? AND DATE(last_updated) = CURDATE()';
    const [statusResult] = await pool.promise().execute(checkTaskQuery, [username]);

    if (statusResult.length > 0 && statusResult[0].status === 'Done') {
      return res.status(400).json({
        error: 'You have already done your task today. Please promote again tomorrow'
      });
    }

    // Retrieve balance from new_transcribers table
    const getBalanceQuery = 'SELECT ballance FROM new_transcribers WHERE username = ?';
    const [balanceResult] = await pool.promise().execute(getBalanceQuery, [username]);

    if (balanceResult.length === 0) {
      console.log("No user found");
      return res.status(400).json({ error: 'User not found in new_transcribers table' });
    }

    const ballance = balanceResult;

    // Define the update query based on the level
    const updateQuery = `
      UPDATE invites
      SET
        status2 = 'Done',
        todays_total = ?,
        last_updated = NOW()
      WHERE
        invited = ? AND
        status2 = 'Pending'
    `;
  
    const todaysTotal = 13;
    const [result] = await pool.promise().execute(updateQuery, [todaysTotal, username]);

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: 'Failed. You can promote crypto once per day.' });
    }

    const updateBalanceQuery = `
    UPDATE new_transcribers
    SET
      ballance = ballance + ?
    WHERE
      username = ?
    `;
    
    await pool.promise().execute(updateBalanceQuery, [todaysTotal, username]);
    
    // Update percentage_profit column in invites table
    const updatePercentageProfitQuery = `
      UPDATE invites
      SET
        percentage_profit = ?
      WHERE
        invited = ? AND
        status2 = 'Done' AND
        DATE(last_updated) = CURDATE()
    `;
    const percentageProfit = 0.03 * todaysTotal; // 3% of todaysTotal
    await pool.promise().execute(updatePercentageProfitQuery, [percentageProfit, username]);

    const getpercentageQuery = 'SELECT inviter, percentage_profit FROM invites WHERE invited = ?';
    const [percentageResult] = await pool.promise().execute(getpercentageQuery, [username]);
     const ivitor = percentageResult[0].inviter;
     const percentage = percentageResult[0].percentage_profit;
 
    
    // Update new_transcribers table
    const updateBalanceQuery2 = `
      UPDATE new_transcribers
      SET
        ballance = ballance + ?
        
      WHERE
        username = ?
    `;
    await pool.promise().execute(updateBalanceQuery2, [percentage, ivitor]);

    // Send response only after successful updates
    res.json({ success: 'You have successfully promoted crypto today' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




app.post('/update-level/:level', isAuthenticated, async (req, res) => {
  const { level } = req.params;
  const username = req.session.username;

  try {
    // Check if the user has already done the task today
    const checkTaskQuery = 'SELECT status2 FROM invites WHERE inviter = ? AND DATE(last_updated) = CURDATE()';
    const [statusResult] = await pool.promise().execute(checkTaskQuery, [username]);

    if (statusResult.length > 0 && statusResult[0].status === 'Done') {
      return res.status(400).json({
        error: 'You have already done your task today. Please promote again tomorrow'
      });
    }

    // Retrieve balance from new_transcribers table
    const getBalanceQuery = 'SELECT ballance FROM new_transcribers WHERE username = ?';
    const [balanceResult] = await pool.promise().execute(getBalanceQuery, [username]);

    if (balanceResult.length === 0) {
      console.log("No user found");
      return res.status(400).json({ error: 'User not found in new_transcribers table' });
    }

    const ballance = balanceResult[0].ballance;

    // Define the update query based on the level
    const updateQuery = `
      UPDATE invites
      SET
        status2 = 'Done',
        todays_total = ?,
        last_updated = NOW()
      WHERE
        invited = ? AND
        status2 = 'Pending'
    `;
  
    const todaysTotal = calculateTodaysTotal(level, ballance);
    const [result] = await pool.promise().execute(updateQuery, [todaysTotal, username]);

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: 'Failed. You can promote crypto once per day.' });
    }

    const updateBalanceQuery = `
    UPDATE new_transcribers
    SET
      ballance = ballance + ?
    WHERE
      username = ?
    `;
    await pool.promise().execute(updateBalanceQuery, [calculateTodaysTotal(level, ballance), username]);
    
    // Update percentage_profit column in invites table
    const updatePercentageProfitQuery = `
      UPDATE invites
      SET
        percentage_profit = ?
      WHERE
        invited = ? AND
        status2 = 'Done' AND
        DATE(last_updated) = CURDATE()
    `;
    const percentageProfit = 0.03 * todaysTotal; // 3% of todaysTotal
    await pool.promise().execute(updatePercentageProfitQuery, [percentageProfit, username]);

    const getpercentageQuery = 'SELECT inviter, percentage_profit FROM invites WHERE invited = ?';
    const [percentageResult] = await pool.promise().execute(getpercentageQuery, [username]);
     const ivitor = percentageResult[0].inviter;
     const percentage = percentageResult[0].percentage_profit;
 
    
    // Update new_transcribers table
    const updateBalanceQuery2 = `
      UPDATE new_transcribers
      SET
        ballance = ballance + ?
        
      WHERE
        username = ?
    `;
    await pool.promise().execute(updateBalanceQuery2, [percentage, ivitor]);

    // Send response only after successful updates
    res.json({ success: 'You have successfully promoted crypto today' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function calculateTodaysTotal(level, ballance) {
  const percentage = getPercentageForLevel(level);
  return (percentage / 100) * ballance;
}

function getPercentageForLevel(level) {
  // Define the percentage for each level
  const percentageMap = {
    level1: 2.5,
    level2: 2.7,
    level3: 2.9,
    level4: 3,
    level5: 3.2,
    level6: 3.3,
    level7: 3.5,
    level8: 3.6,
    level9: 3.7,
    level10: 3.8,
  };

  return percentageMap[level] || 0;
}


cron.schedule('59 18 08 * * *', async () => {
  try {
    // Update invites table
    const resetInvitesQuery = `
      UPDATE invites
      SET
        todays_total = 0.00,
        percentage_profit = 0.00,
        status2 = 'Pending'
    `;
    
    await pool.promise().execute(resetInvitesQuery);

    console.log('Invites table updated successfully at 11:59:59');
  } catch (error) {
    console.error('Error updating invites table:', error);
  }
});




// Endpoint for updating withdrawal status
app.post('/update-withdrawal-status', (req, res) => {
  const withdrawalid = req.body.withdrawalid;
  const status = req.body.status;

  // Check if the withdrawal record exists
  const checkWithdrawalQuery = 'SELECT * FROM withdrawals WHERE withdrawalid = ? AND status = "Pending"';
  pool.promise().execute(checkWithdrawalQuery, [withdrawalid])
    .then(([withdrawalResults, withdrawalFields]) => {
      if (withdrawalResults.length === 0) {
        // Withdrawal record not found or status is not Pending
        res.status(400).json({ error: 'Invalid withdrawal record or status.' });
      } else {
        const withdrawalRecord = withdrawalResults[0];
        const { status: currentStatus, username, amount } = withdrawalRecord;

        // Update withdrawal status
        const updateStatusQuery = 'UPDATE withdrawals SET status = ? WHERE withdrawalid = ?';
        pool.promise().execute(updateStatusQuery, [status, withdrawalid])
          .then(([updateResults, updateFields]) => {
            // Handle the update success if needed
            //console.log(`Withdrawal status updated to ${status}.`);

            // Check if new_transcribers table needs to be updated
            if ((status === 'Failed (Refunded)' || status === 'Rejected (Refunded)') && currentStatus === 'Pending') {
              // Update new_transcribers table
              const updateBalanceQuery = 'UPDATE new_transcribers SET ballance = ballance + ? WHERE username = ?';
              pool.promise().execute(updateBalanceQuery, [amount, username])
                .then(([updateResults, updateFields]) => {
                  // Handle the update success if needed
                 // console.log(`New_transcribers table updated.`);
                  res.json({ success: true, message: `You have marked this payment as ${status}.` });
                })
                .catch(updateError => {
                  console.error('Error updating balance in new_transcribers table:', updateError);
                  res.status(500).json({ error: 'Internal server error' });
                });
            } else {
              // No need to update new_transcribers table
              res.json({ success: true, message: `You have marked this payment as ${status}.` });
            }
          })
          .catch(updateError => {
            console.error('Error updating withdrawal status:', updateError);
            res.status(500).json({ error: 'Internal server error' });
          });
      }
    })
    .catch(checkError => {
      console.error('Error checking withdrawal record:', checkError);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.post('/withdraw', (req, res) => {
  const username = req.session.username;
  const withdrawalatammount = req.body.withdrawalatammount;
  const phonenumbertext = req.body.phonenumbertext;

   // Check if phonenumbertext is not undefined
  if (phonenumbertext === undefined || phonenumbertext.trim() === '') {
    res.status(400).json({ success: false, error: 'Phonenumber is required' });
    return;
  }

  // Start a transaction to ensure consistency
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      res.json({ success: false });
      return;
    }
    
    connection.beginTransaction((beginTransactionErr) => {
      if (beginTransactionErr) {
        console.error('Error starting database transaction:', beginTransactionErr);
        res.json({ success: false });
        connection.release();
        return;
      }

      // Insert withdrawal data into the withdrawals table
      const insertWithdrawalQuery = 'INSERT INTO withdrawals (username, amount, contact, date, status, withdrawalid) VALUES (?, ?, ?, NOW(), "Pending", ?)';
      const withdrawalid = uuid.v4(); // Generate a new UUID


      connection.query(insertWithdrawalQuery, [username, withdrawalatammount, phonenumbertext, withdrawalid ], (insertWithdrawalQueryErr) => {
        if (insertWithdrawalQueryErr) {
          console.error('Error during withdrawal insertion:', insertWithdrawalQueryErr);
          // Rollback the transaction in case of an error
          connection.rollback(() => {
            res.json({ success: false });
            connection.release();
          });
          return;
        }

        // Update balance in new_transcribers table
        const updateBalanceQuery = 'UPDATE new_transcribers SET ballance = ballance - ? WHERE username = ?';

        connection.query(updateBalanceQuery, [withdrawalatammount, username], (updateBalanceQueryErr) => {
          if (updateBalanceQueryErr) {
            console.error('Error updating balance in new_transcribers table:', updateBalanceQueryErr);
            // Rollback the transaction in case of an error
            connection.rollback(() => {
              res.json({ success: false });
              connection.release();
            });
            return;
          }

          // Commit the transaction if all queries succeed
          connection.commit((commitErr) => {
            if (commitErr) {
              console.error('Error committing database transaction:', commitErr);
              res.json({ success: false });
            } else {
              res.json({ success: true });
            }
            connection.release();
          });
        });
      });
    });
  });
});

// Endpoint to fetch the username and account type
app.get('/get-username', (req, res) => {
  const username = req.session.username;
  const getUserInfoQuery = 'SELECT username, current_account, ballance, phone_number, email, inviter_link FROM new_transcribers WHERE username = ?';

  pool.promise().execute(getUserInfoQuery, [username])
    .then(([results, fields]) => {
      if (results.length > 0) {
        const userInfo = {
          username: results[0].username,
          currentAccount: results[0].current_account,
          accountBallance: results[0].ballance,
          accountPhonenumber: results[0].phone_number,
          accountEmail: results[0].email,
          invitationLink: results[0].inviter_link,
          
        };
        res.json(userInfo);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(error => {
      console.error('Error fetching user info:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Endpoint to fetch the username and account type
app.get('/get-profit-today', (req, res) => {
  const invited = req.session.username;
  const getUserInfoQuery = 'SELECT todays_total FROM invites WHERE invited = ?';

  pool.promise().execute(getUserInfoQuery, [invited])
    .then(([results, fields]) => {
      if (results.length > 0) {
        const userInfo = {
          invited: results[0].invited,
          profit: results[0].todays_total,
          
          
        };
        res.json(userInfo);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(error => {
      console.error('Error fetching user info:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});


// Endpoint to fetch the username and account type
app.get('/get-payment-accounts', (req, res) => {
 const getUserInfoQuery = 'SELECT phonenumber, fullname FROM accounts WHERE account = "current"';

  pool.promise().execute(getUserInfoQuery)
    .then(([results, fields]) => {
      if (results.length > 0) {
        const userInfo = {
          phonenumber: results[0].phonenumber,
          fullname: results[0].fullname,
                   
        };
        res.json(userInfo);
      } else {
        res.status(404).json({ error: 'Account not found' });
      }
    })
    .catch(error => {
      console.error('Error fetching user info:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});


// Endpoint to fetch user transactions
app.get('/get-user-transactions', (req, res) => {
  const username = req.session.username;
  const getUserInfoQuery = 'SELECT username, amount, date, status2 FROM deposits WHERE username = ? ORDER BY date DESC';

  pool.promise().execute(getUserInfoQuery, [username])
    .then(([results, fields]) => {
      if (results.length > 0) {
        // Map the results to an array of transactions
        const transactions = results.map(result => ({
          username: result.username,
          depositAmount: result.amount,
          depositDate: result.date,
          depositStatus: result.status2,
        }));
        res.json({ transactions });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(error => {
      console.error('Error fetching user info:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});


// Endpoint to fetch user transactions
app.get('/get-user-withdrawals', (req, res) => {
  const username = req.session.username;
  const getUserInfoQuery = 'SELECT username, amount, date, status FROM withdrawals WHERE username = ? ORDER BY date DESC';

  pool.promise().execute(getUserInfoQuery, [username])
    .then(([results, fields]) => {
      if (results.length > 0) {
        // Map the results to an array of transactions
        const transactions = results.map(result => ({
          username: result.username,
          withdrawalAmount: result.amount,
          withdrawalDate: result.date,
          withdrawalStatus: result.status,
        }));
        res.json({ transactions });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(error => {
      console.error('Error fetching user info:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Endpoint to fetch user transactions
app.get('/get-level1-plans', (req, res) => {
 const getUserInfoQuery = 'SELECT day, capital, promotions, percentage, profit, total FROM plans WHERE level = "1"';

  pool.promise().execute(getUserInfoQuery)
    .then(([results, fields]) => {
      if (results.length > 0) {
        // Map the results to an array of transactions
        const transactions = results.map(result => ({
          day: result.day,
          capital: result.capital,
          promotion: result.promotions,
          percentage: result.percentage,
          profit: result.profit,
          total: result.total,
        }));
        res.json({ transactions });
      } else {
        res.status(404).json({ error: 'No plans found' });
      }
    })
    .catch(error => {
      console.error('Error fetching plans:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});


// Endpoint to fetch user transactions
app.get('/get-level2-plans', (req, res) => {
  const getUserInfoQuery = 'SELECT day, capital, promotions, percentage, profit, total FROM plans WHERE level = "2"';
 
   pool.promise().execute(getUserInfoQuery)
     .then(([results, fields]) => {
       if (results.length > 0) {
         // Map the results to an array of transactions
         const transactions = results.map(result => ({
           day: result.day,
           capital: result.capital,
           promotion: result.promotions,
           percentage: result.percentage,
           profit: result.profit,
           total: result.total,
         }));
         res.json({ transactions });
       } else {
         res.status(404).json({ error: 'No plans found' });
       }
     })
     .catch(error => {
       console.error('Error fetching plans:', error);
       res.status(500).json({ error: 'Internal server error' });
     });
 });

 // Endpoint to fetch user transactions
app.get('/get-level3-plans', (req, res) => {
  const getUserInfoQuery = 'SELECT day, capital, promotions, percentage, profit, total FROM plans WHERE level = "3"';
 
   pool.promise().execute(getUserInfoQuery)
     .then(([results, fields]) => {
       if (results.length > 0) {
         // Map the results to an array of transactions
         const transactions = results.map(result => ({
           day: result.day,
           capital: result.capital,
           promotion: result.promotions,
           percentage: result.percentage,
           profit: result.profit,
           total: result.total,
         }));
         res.json({ transactions });
       } else {
         res.status(404).json({ error: 'No plans found' });
       }
     })
     .catch(error => {
       console.error('Error fetching plans:', error);
       res.status(500).json({ error: 'Internal server error' });
     });
 });


 // Endpoint to fetch user transactions
app.get('/get-level4-plans', (req, res) => {
  const getUserInfoQuery = 'SELECT day, capital, promotions, percentage, profit, total FROM plans WHERE level = "4"';
 
   pool.promise().execute(getUserInfoQuery)
     .then(([results, fields]) => {
       if (results.length > 0) {
         // Map the results to an array of transactions
         const transactions = results.map(result => ({
           day: result.day,
           capital: result.capital,
           promotion: result.promotions,
           percentage: result.percentage,
           profit: result.profit,
           total: result.total,
         }));
         res.json({ transactions });
       } else {
         res.status(404).json({ error: 'No plans found' });
       }
     })
     .catch(error => {
       console.error('Error fetching plans:', error);
       res.status(500).json({ error: 'Internal server error' });
     });
 });

 // Endpoint to fetch user transactions
app.get('/get-level5-plans', (req, res) => {
  const getUserInfoQuery = 'SELECT day, capital, promotions, percentage, profit, total FROM plans WHERE level = "5"';
 
   pool.promise().execute(getUserInfoQuery)
     .then(([results, fields]) => {
       if (results.length > 0) {
         // Map the results to an array of transactions
         const transactions = results.map(result => ({
           day: result.day,
           capital: result.capital,
           promotion: result.promotions,
           percentage: result.percentage,
           profit: result.profit,
           total: result.total,
         }));
         res.json({ transactions });
       } else {
         res.status(404).json({ error: 'No plans found' });
       }
     })
     .catch(error => {
       console.error('Error fetching plans:', error);
       res.status(500).json({ error: 'Internal server error' });
     });
 });

// Endpoint to fetch user transactions
app.get('/get-level6-plans', (req, res) => {
  const getUserInfoQuery = 'SELECT day, capital, promotions, percentage, profit, total FROM plans WHERE level = "6"';
 
   pool.promise().execute(getUserInfoQuery)
     .then(([results, fields]) => {
       if (results.length > 0) {
         // Map the results to an array of transactions
         const transactions = results.map(result => ({
           day: result.day,
           capital: result.capital,
           promotion: result.promotions,
           percentage: result.percentage,
           profit: result.profit,
           total: result.total,
         }));
         res.json({ transactions });
       } else {
         res.status(404).json({ error: 'No plans found' });
       }
     })
     .catch(error => {
       console.error('Error fetching plans:', error);
       res.status(500).json({ error: 'Internal server error' });
     });
 });

 // Endpoint to fetch user transactions
app.get('/get-level7-plans', (req, res) => {
  const getUserInfoQuery = 'SELECT day, capital, promotions, percentage, profit, total FROM plans WHERE level = "7"';
 
   pool.promise().execute(getUserInfoQuery)
     .then(([results, fields]) => {
       if (results.length > 0) {
         // Map the results to an array of transactions
         const transactions = results.map(result => ({
           day: result.day,
           capital: result.capital,
           promotion: result.promotions,
           percentage: result.percentage,
           profit: result.profit,
           total: result.total,
         }));
         res.json({ transactions });
       } else {
         res.status(404).json({ error: 'No plans found' });
       }
     })
     .catch(error => {
       console.error('Error fetching plans:', error);
       res.status(500).json({ error: 'Internal server error' });
     });
 });


 // Endpoint to fetch user transactions
app.get('/get-level8-plans', (req, res) => {
  const getUserInfoQuery = 'SELECT day, capital, promotions, percentage, profit, total FROM plans WHERE level = "8"';
 
   pool.promise().execute(getUserInfoQuery)
     .then(([results, fields]) => {
       if (results.length > 0) {
         // Map the results to an array of transactions
         const transactions = results.map(result => ({
           day: result.day,
           capital: result.capital,
           promotion: result.promotions,
           percentage: result.percentage,
           profit: result.profit,
           total: result.total,
         }));
         res.json({ transactions });
       } else {
         res.status(404).json({ error: 'No plans found' });
       }
     })
     .catch(error => {
       console.error('Error fetching plans:', error);
       res.status(500).json({ error: 'Internal server error' });
     });
 });

 // Endpoint to fetch user transactions
app.get('/get-level9-plans', (req, res) => {
  const getUserInfoQuery = 'SELECT day, capital, promotions, percentage, profit, total FROM plans WHERE level = "9"';
 
   pool.promise().execute(getUserInfoQuery)
     .then(([results, fields]) => {
       if (results.length > 0) {
         // Map the results to an array of transactions
         const transactions = results.map(result => ({
           day: result.day,
           capital: result.capital,
           promotion: result.promotions,
           percentage: result.percentage,
           profit: result.profit,
           total: result.total,
         }));
         res.json({ transactions });
       } else {
         res.status(404).json({ error: 'No plans found' });
       }
     })
     .catch(error => {
       console.error('Error fetching plans:', error);
       res.status(500).json({ error: 'Internal server error' });
     });
 });

 // Endpoint to fetch user transactions
app.get('/get-level10-plans', (req, res) => {
  const getUserInfoQuery = 'SELECT day, capital, promotions, percentage, profit, total FROM plans WHERE level = "10"';
 
   pool.promise().execute(getUserInfoQuery)
     .then(([results, fields]) => {
       if (results.length > 0) {
         // Map the results to an array of transactions
         const transactions = results.map(result => ({
           day: result.day,
           capital: result.capital,
           promotion: result.promotions,
           percentage: result.percentage,
           profit: result.profit,
           total: result.total,
         }));
         res.json({ transactions });
       } else {
         res.status(404).json({ error: 'No plans found' });
       }
     })
     .catch(error => {
       console.error('Error fetching plans:', error);
       res.status(500).json({ error: 'Internal server error' });
     });
 });


// Endpoint to fetch user invites
app.get('/get-user-invites', (req, res) => {
  const invited = req.session.username;
  const getUserInfoQuery = 'SELECT invited, firstrecharge, earned, todays_total FROM invites WHERE inviter = ?';

  pool.promise().execute(getUserInfoQuery, [invited])
    .then(([results, fields]) => {
      if (results.length > 0) {
        // Map the results to an array of transactions
        const team = results.map(result => ({
          invited: result.invited,
          inviter: result.inviter,
          firstrecharge: result.firstrecharge,
          earned: result.earned,
          profit: result.todays_total,
        }));
        res.json({ team });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(error => {
      console.error('Error fetching user info:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});


// Endpoint for yesterday's pending payments
app.get('/get-yesterday-pending-payments', (req, res) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const getYesterdayPaymentsQuery = 'SELECT  amount, contact, status, withdrawalid FROM withdrawals WHERE DATE(date) < ? AND status = "Pending"';

  pool.promise().execute(getYesterdayPaymentsQuery, [formatDate(today)])
    .then(([results, fields]) => {
      res.json({ yesterdayPayments: results });
    })
    .catch(error => {
      console.error('Error fetching yesterday\'s pending payments:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Endpoint for today's pending payments
app.get('/get-today-pending-payments', (req, res) => {
  const today = new Date();

  const getTodayPaymentsQuery = 'SELECT  amount, contact, status, withdrawalid FROM withdrawals WHERE DATE(date) = ? AND status = "Pending"';

  pool.promise().execute(getTodayPaymentsQuery, [formatDate(today)])
    .then(([results, fields]) => {
      res.json({ todayPayments: results });
    })
    .catch(error => {
      console.error('Error fetching today\'s pending payments:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Function to format date as "YYYY-MM-DD"
function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Endpoint to fetch the musername and account type
app.get('/get-musername', (req, res) => {
  const username = req.session.username;
  const getUserInfoQuery = 'SELECT username  FROM gmanagement WHERE username = ?';

  pool.promise().execute(getUserInfoQuery, [username])
    .then(([results, fields]) => {
      if (results.length > 0) {
        const userInfo = {
          username: results[0].username,
          
        };
        res.json(userInfo);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(error => {
      console.error('Error fetching user info:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Add this route after the other routes
app.get('/logout', (req, res) => {
  // Destroy the user's session to log them out
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      // Handle the error as needed
    } else {
      // Redirect the user to the login page after logout
      res.redirect('/login');
    }
  });
});

    // Start the server after the table has been created
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error creating table:', err);
  });
  
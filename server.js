const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Text file path
const DATA_FILE = path.join(__dirname, 'data.txt');

// Health check
app.get('/', (req, res) => {
  res.send('API is running! Use POST /submit to save data');
});

// Main API - Data save karega
app.post('/submit', (req, res) => {
  try {
    const data = req.body;

    // Agar koi data nahi aaya
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No data received' 
      });
    }

    // Timestamp ke saath data ready karo
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const entry = `
==============================
Time: ${timestamp}
${JSON.stringify(data, null, 2)}
==============================
`;

    // File me append karo
    fs.appendFileSync(DATA_FILE, entry, 'utf8');

    console.log('Data saved:', data);

    res.json({
      success: true,
      message: 'Data successfully saved to text file',
      savedData: data
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save data',
      error: error.message
    });
  }
});

// Optional: File ka content dekhne ke liye
app.get('/view', (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return res.send('No data yet');
    }
    const content = fs.readFileSync(DATA_FILE, 'utf8');
    res.type('text/plain').send(content);
  } catch (error) {
    res.status(500).send('Error reading file');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

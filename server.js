const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch-cache');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Proxy to fetch TLE data from Celestrak
app.get('/api/tle', async (req, res) => {
  try {
    const response = await fetch('https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=tle');
    const data = await response.text();
    res.send(data);
  } catch (error) {
    res.status(500).send('Error fetching TLE data');
  }
});

app.use(express.static('public', {
    setHeaders: (res, path) => {
      if (path.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
    }
  }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
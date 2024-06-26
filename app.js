const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const exchangeRoutes = require('./routes/exchange');

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/api/exchange', exchangeRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

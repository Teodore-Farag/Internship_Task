const express = require('express'); //middelware
const axios = require('axios'); //for calling
const router = express.Router();
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 });

router.post('/', async (req, res) => {
  let { base, target, amount } = req.body;
  if (!base) {
    return res.status(400).json({ error: 'Please provide currency you want to convert from' });
  }
  if (!target) {
    return res.status(400).json({ error: 'Please provide currency you want to convert to' });
  }
  const cacheKey = `${base}_${target}`;
  const cachedRate = cache.get(cacheKey);
  if (cachedRate) {
    if(!amount){
        return res.json({ base, target, rate: cachedRate});
    }
    const convertedAmount = cachedRate * amount;
    return res.json({ base, target, rate: cachedRate, amount, convertedAmount });
  }
  try {
    const response = await axios.get(`${process.env.EXCHANGE_API_URL}/${base}`); //Call
    const rate = response.data.rates[target];
    cache.set(cacheKey, rate);
    if (!rate) {
      return res.status(400).json({ error: 'Check the currencies for any misspelling or try another one' }); //something is wrong
    }
    let convertedAmount=rate;
    if(!amount){
         convertedAmount = rate;
    }else{
         convertedAmount = rate * amount;
    }
    res.json({ base, target, rate, amount, convertedAmount });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching exchange rate' });
  }
});

module.exports = router;
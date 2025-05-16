const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

let entries = [];

app.get('/entries', (req, res) => {
  res.json(entries);
});

app.post('/entries', (req, res) => {
  const { date, answers } = req.body;
  entries.push({ date, answers });
  res.json({ message: 'Entry saved.' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

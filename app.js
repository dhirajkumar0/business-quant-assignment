const express = require('express');
const mysql = require('mysql');

// Create a MySQL connection

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: 'root', 
  database: 'sample_stock_db'
});

// Connect to MySQL

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});


const app = express();  // Create Express app

app.use(express.json());    // Middleware to parse JSON bodies

// Start the Express server

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.get('/sample_data_historic/:ticker', (res, req) => {
  const { ticker } = req.params;
  const { column, period } = req.query;

  // Check if all required parameters are provided
  if (!ticker || !column || !period) {
      res.status(400).json({ error: 'Missing required parameters: column or period' });
      return;
  }

  const columns = column.split(',');

  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear() - parseInt(period), currentDate.getMonth(), currentDate.getDate());


  let sql = `SELECT ticker, ${columns.join(',')} FROM sample_data_historic WHERE ticker = ? AND STR_TO_DATE(date, '%m/%d/%Y') >= ?`;

  db.query({
      sql,
      values: [ticker, startDate]
  }, (err, result) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      if (result.length === 0) {
          res.status(404).json({ error: 'Data not found for the provided parameters' });
          return;
      }
      res.json(result);
  });
})

// Add stocks 

app.post('/sample_data_historic', (req, res) => {
  const { ticker } = req.body;
  connection.query(`INSERT INTO users (ticker, date, gp, fcf, capex) VALUES ('${ticker}', '${date}', '${gp}', '${fcf}', '${capex}')`, (err, result) => {
    if (err) {
      console.error('Error creating user:', err);
      res.status(500);
      res.send('Error creating user');
      return;
    }
    res.status(201);
    res.send('User created successfully');
  });
});

// update the stocks

app.put('/sample_data_historic/:ticker', (req, res) => {
  const stockId = req.params.ticker;
  const { ticker, date, gp,  fcf, capex} = req.body;
  let sql = 'UPDATE sample_data_historic SET ticker = ?, date = ?, gp = ? , fcf = ?, capex = ? WHERE ticker = ?';
  db.query(sql, [ticker, date, gp, fcf, capex], (err, result) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      res.json({ message: 'Stock updated successfully' });
  });
});


// Delete a stock

app.delete('/sample_data_historic/:ticker', (req, res) => {
  const stockId = req.params.ticker;
  let sql = 'DELETE FROM sample_data_historic WHERE ticker = ?';
  db.query(sql, [stockId], (err, result) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      res.json({ message: 'Stock deleted successfully' });
  });
});
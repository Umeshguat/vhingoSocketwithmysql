// db.js
import mysql from 'mysql';

const db = mysql.createConnection({
  host: '51.79.204.225',
  port : 3306,
  user: 'corecad_vhingo',
  password: '123@Vhingo',
  database: 'corecad_vhingo'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

export default db;

// // db.js
// import mysql from 'mysql';

// const db = mysql.createConnection({
//   host: '51.79.204.225',
//   port : 3306,
//   user: 'corecad_vhingo',
//   password: '123@Vhingo',
//   database: 'corecad_vhingo'
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL database:', err);
//     return;
//   }
//   console.log('Connected to MySQL database');
// });

// export default db;


import mysql from 'mysql';

const db = mysql.createConnection({
  host: '127.0.0.1',
  port : 3306,
  user: 'root',
  password: '',
  database: 'prime_hill'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Wrap the query method with a promise
export const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (error, results, fields) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
};

export default db;

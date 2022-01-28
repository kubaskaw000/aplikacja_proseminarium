import mysql from 'mysql'
import config from './config.js'

const con = mysql.createConnection(config);

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

export default con;
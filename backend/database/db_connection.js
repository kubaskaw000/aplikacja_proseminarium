import mysql from "mysql";
import knex from "knex";
import config from "./config.js";

const con = mysql.createConnection(config);

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

const qb = knex({
  client: "mysql",
  connection: config,
});

export default con;
export { qb };

//Node Express API to manage PostgreSQL database of routes, users, and feedback.
"use strict";

const express = require("express");
const multer = require("multer");
const app = express();

//Creates a new database pool connection to the bus_db database.
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'bus_db',
  password: 'pwd',
  port: 5432,
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

const DEFAULT_PORT = 3000;
const SERVER_ERR = "Sorry, something went wrong. Please try again later.";
const PARAM_ERR = "Missing required parameters.";
const SUCCESS = "Query completed correctly!";

/**
 * Post endpoint to add a new user to the database. Username for user must be unique.
 * Does not return any data.
 * query params: body {
 *               name: name of the user being added (string)
 *               username: username of the user being added (string, required)
 *               password: password of the user being added (string, required)
 *               fav_routes: id numbers of the users favorite routes (array)
 *               walking_speed: coefficient of the user's walking speed (number)
 *             }
 */
app.post("/newUser", async (req, res) => {
  try {
    let username = req.body.username;
    let name = req.body.name;
    let password = req.body.password;
    let fav_routes = req.body.fav_routes;
    let walking_speed = req.body.walking_speed;
    if (!username || !password) {
      res.status(400).type("text");
      res.send("Missing required parameters.");
    } else if (!(await isUnique(username))) {
      res.status(400).type("text");
      res.send("Username is already taken");
    } else {
      //inserts the new user into the database
      if (!fav_routes) {
        fav_routes = [];
      }
      let db = await pool.connect();
      let sql = "INSERT INTO users(full_name, username, password, fav_routes, walking_speed) VALUES ($1, $2, $3, $4, $5)";
      await db.query(sql, [name, username, password, fav_routes, walking_speed]);
      db.release();
      res.type("text").status(200);
      res.send(SUCCESS);
    }
  } catch (err) {
    res.status(500).type("text");
    res.send("Sorry, something went wrong. Please try again later.");
  }
});

/**
 * Post endpoint to log in a user. Currently returns the user.
 * query params: body {
 *               username: username of the user being added (string, required)
 *               password: password of the user being added (string, required)
 *             }
 */
app.post("/login", async (req, res) => {
  try {
    let username = req.body.username;
    let password = req.body.password;
    if (!username) {
      res.status(400).type("text");
      res.send("Missing required parameters.");
    } else {
      //finds the user with given username
      let db = await pool.connect();
      let sql = "SELECT * FROM users WHERE (username = $1)";
      let result = await db.query(sql, [username]);
      if (result.rows[0].password != password) {
        res.status(400).type("text");
        res.send("Incorrect password");
      } else {
        //formats the response
        result = {
          "response": result.rows[0]
        };
        db.release();
        res.type("JSON");
        res.send(result);
      }
    }
  } catch (err) {
    res.status(500).type("text");
    res.send("Sorry, something went wrong. Please try again later.");
  }
});

/**
 * Post endpoint to add a new route to the database. Returns the id of the route
 * just added to the database. Username for user must be unique.
 * query params: body {
 *               source: Departure location of the route.
 *               dest: Arrival location of the route.
 *             }
 */
app.post("/newRoute", async (req, res) => {
  try {
    let source = req.body.source;
    let dest = req.body.destination;
      let db = await pool.connect();
      let sql = "INSERT INTO routes(departure, arrival) VALUES ($1, $2);";
      await db.query(sql, [source, dest]);
      sql = "SELECT id FROM routes ORDER BY id DESC LIMIT 1;";
      let result = await db.query(sql);
      //formats the response
      result = {
        "response": result.rows[0]
      };
      db.release();
      res.status(200).type("json");
      res.send(result);
  } catch (err) {
    res.status(500).type("text");
    res.send("Sorry, something went wrong. Please try again later.");
  }
});

/**
 * Get endpoint to retrieve all routes in the database. Returns the contents of
 * the routes table.
 */
app.get("/getRoute", async (req, res) => {
  try {
      //gets routes
      let db = await pool.connect();
      let sql = "SELECT * FROM routes;";
      let result = await db.query(sql);
      // //formats the response
      result = {
        "response": result.rows
      };
      db.release();
      res.type("JSON");
      res.send(result)
  } catch (err) {
    res.status(500).type("text");
    res.send("Sorry, something went wrong. Please try again later.");
  }
});

/**
 * Post endpoint to update data for a user. Takes a username and any combination of
 * information to be changed. Returns a text message.
 * query params: body {
 *               username: username of the user (string, required)
 *               full_name: new name of the user being changed (string, optional)
 *               password: new password of the user being changed (string, optional)
 *               fav_routes: new favorite routes of the user being changed (Array, optional)
 *               walking_speed: new walking speed of the user being changed (number, optional)
 *             }
 */
 app.post("/updateUser", async (req, res) => {
  try {
    let username = req.body.username;
    if (username) {
      let fields = {
        full_name: req.body.name,
        password: req.body.password,
        fav_routes: req.body.fav_routes,
        walking_speed: req.body.walking_speed
      };
      await updateUser(fields, username);
      res.status(200).type("text");
      res.send(SUCCESS);
    } else {
      res.status(400).type("text");
      res.send("Missing required parameters");
    }
  } catch (err) {
    res.status(500).type("text");
    res.send(SERVER_ERR);
  }
});

/**
 * Post endpoint to add feedback. Returns text message.
 * query params: body {
 *               username: username of the user adding feedback (string, optional)
 *               message: new feedback message (string, required)
 *               time: time of the feedback submission (time, optional)
 *             }
 */
app.post("/feedback", async (req, res) => {
  try {
    let message = req.body.message;
    let time = req.body.time;
    let read = false;
    if (!message) {
      res.status(400).type("text");
      res.send(PARAM_ERR);
    } else {
      let sql = "INSERT INTO feedback(message, time, read) VALUES ($1, $2, $3);";
      let db = await pool.connect();
      await db.query(sql, [message, time, read]);
      db.release();
      res.status(200).type("text");
      res.send(SUCCESS);
    }
  } catch (err) {
    res.status(500).type('text');
    res.send(SERVER_ERR);
  }
});

/**
 * Get endpoint to retrieve a user's favorite routes. Requires the username as a
 * request parameter. Returns the full list of the user's favorite routes.
 * request params: username = the username of the user being queried (String, required).
 */
app.get("/favorites/full/:username", async (req, res) => {
  try {
    let username = req.params.username;
    if (!username) {
      res.status(400).type("text");
      res.send(PARAM_ERR);
    } else {
      let routeArr = await getFavArray(username);
      routeArr = routeArr.fav_routes;
      let routes = await getFavRoutes(routeArr);
      let resp = {
        "response": routes
      };
      res.status(200).type('json');
      res.send(resp);
    }
  } catch (err) {
    res.status(500).type("text");
    res.send(SERVER_ERR);
  }
});

/**
 * Get endpoint to retrieve a user's favorite routes. Requires the username as a
 * request parameter. Returns the id list of the user's favorite routes.
 * request params: username = the username of the user being queried (String, required).
 */
app.get("/favorites/ids/:username", async (req, res) => {
  try {
    let username = req.params.username;
    if (!username) {
      res.status(400),type("text");
      res.send(PARAM_ERR);
    } else {
      let routeArr = await getFavArray(username);
      res.status(200).type('json');
      res.send(routeArr);
    }
  } catch (err) {
    res.status(500).type("text");
    res.send(SERVER_ERR);
  }
});

/**
 * Checks if a given username is unique within the database.
 * @param {String} username Proposed username to be added.
 * @returns {Boolean} True if username is unique, false otherwise.
 */
async function isUnique(username) {
  let db = await pool.connect();
  let sql = "SELECT * FROM users WHERE (username = $1)";
  let res = await db.query(sql, [username]);
  db.release();
  res = res.rows[0];
  return (!res);
}


/**
 * Changes the values for a given user using a passed request object.
 * @param {Object} fields All of the fields of the request.
 * @param {String} username username of the user being changed.
 */
async function updateUser(fields, username) {
  try {
    let sql = "UPDATE users SET ";
    let loopRan = false;
    for (let field in fields) {
      if (fields[field] != undefined) {
        if (field === "fav_routes") {
          sql += field + " = '{" + fields[field] + "}', ";
        } else {
          sql += field + " = '" + fields[field] + "', ";
        }
        loopRan = true;
      }
    }
    if (loopRan) {
      sql = sql.substring(0, (sql.length - 2));
      sql += " WHERE username = '" + username + "';";
      let db = await pool.connect();
      await db.query(sql);
      db.release();
    }
  } catch (err) {
    return err;
  }
}

/**
 * Retrieves the ids of a user's favorite routes.
 * @param {String} username Username of the user being queried.
 * @returns {Array} Favorite route ids of the user.
 */
async function getFavArray(username) {
  try {
    let sql = "SELECT fav_routes FROM users WHERE username = $1;";
    let db = await pool.connect();
    let resp = await db.query(sql, [username]);
    resp = resp.rows[0];
    db.release();
    return resp;
  } catch (err) {
    return err;
  }
}

/**
 * Retrieves the full information for a set of route ids.
 * @param {Array} routeArr Array containing the ids of the user's favorite routes.
 * @returns {Array} Array containing the user's favorite routes
 */
async function getFavRoutes(routeArr) {
  try {
    let routes = [];
    let db = await pool.connect();
    let sql = "SELECT * FROM routes WHERE id = $1;";
    for (let i = 0; i < routeArr.length; i++) {
      let routeID = routeArr[i];
      let resp = await db.query(sql, [routeID]);
      routes[i] = resp.rows[0];
    }
    db.release();
    return routes;
  } catch (err) {
    return err;
  }
 }

app.use(express.static("public"));
const PORT = process.env.PORT || DEFAULT_PORT;
app.listen(PORT);
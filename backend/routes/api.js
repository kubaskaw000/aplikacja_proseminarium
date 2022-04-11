import express, { application, json } from "express";
import games from "../models/games.js";
import jwt from "jsonwebtoken";
import { qb } from "../database/db_connection.js";
import dotenv from "dotenv";
import apiErrorHandler from "../middlewares/apiErrorHandler.js";
import validationException from "../exceptions/validationException.js";
import notFoundException from "../exceptions/notFoundException.js";

dotenv.config();

const router = express.Router();

//zwraca liste partii przyjmując FEN jako parametr
router.get("/lichess-games", authenticate, async (req, res) => {
  let fen = req.query.fen;

  fen = fen.split(" ")[0] + " " + fen.split(" ")[1];

  const response = {};

  if (fen) {
    response.success = true;
    response.data = await games.allFen(fen);
  } else {
    response.success = false;
    response.error_message = "fen parameter is required";
  }

  res.set("Content-Type", "application/json");

  res.send(JSON.stringify(response));
});

//autoryzacja
function authenticate(req, res, next) {
  const token = req.cookies.token;

  if (!token) return res.sendStatus(403);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
}

// refresh token
router.post("/refresh", async (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  // TODO: Check if refreshToken exists in DB

  try {
    await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    return res.sendStatus(403);
  }

  const accessToken = generateAccessToken({ id: 1 });

  res.send({ accessToken });
});

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: 86400 }); // 86400
}

//logowanie
router.post("/login", async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log(email, password);

  try {
    let [user] = await qb.select("*").from("users").where({
      email,
      password,
    });

    if (!user) throw new notFoundException("Brak użytkownika");

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.TOKEN_SECRET,
      {
        expiresIn: 60,
      }
    );

    // const refreshToken = jwt.sign(user.id, process.env.REFRESH_TOKEN_SECRET, {
    //   expiresIn: 525600,
    // });
    res.cookie("token", accessToken, {
      maxAge: 86400,
      httpOnly: true,
    });
    res.send({ status: "success", accessToken });
  } catch (err) {
    next(err);
  }
});

//rejestracja
router.post("/register", async (req, res, next) => {
  console.log(req.body);

  const email = req.body.email;
  const password = req.body.password;
  const rePassword = req.body.rePassword;

  try {
    //Czy uzytkownik istnieje w bazie
    let userCount = await qb("users").count("id as count").where({
      email,
    });

    if (userCount[0].count)
      throw new validationException("Takie konto juz istnieje");

    //Dodanie uzytkownika do bazy
    await qb("users").insert({
      id: null,
      email,
      password,
    });

    res.send({ status: "success" });
  } catch (err) {
    next(err);
  }
});

router.use(apiErrorHandler);

export default router;

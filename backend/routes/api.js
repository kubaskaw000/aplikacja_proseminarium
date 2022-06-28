import express, { application, json } from "express";
import games from "../models/games.js";
import jwt from "jsonwebtoken";
import { qb } from "../database/db_connection.js";
import dotenv from "dotenv";
import apiErrorHandler from "../middlewares/apiErrorHandler.js";
import validationException from "../exceptions/validationException.js";
import notFoundException from "../exceptions/notFoundException.js";
import bcrypt, { hash } from "bcrypt";

dotenv.config();

const router = express.Router();

//zwraca liste partii przyjmując FEN jako parametr
router.get("/lichess-games", async (req, res) => {
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

router.get("/tree-initial-moves", async (req, res) => {
  const response = {};

  response.success = true;
  response.data = await games.initialMoves();

  res.set("Content-Type", "application/json");

  res.send(JSON.stringify(response));

  //console.log(response);
});

router.get("/tree-moves", async (req, res) => {
  let moveId = req.query.moveId;
  let path = req.query.path;

  const groupedMoves = {};
  const response = {};

  //console.log(moveId, path);

  const results = await games.getNextMoveInfo(moveId, path);

  //console.log(results);

  res.set("Content-Type", "application/json");

  //res.send(JSON.stringify(response));

  for (let result of results) {
    const groupedMove = groupedMoves[result.move];

    if (!groupedMove) {
      const ratio = {
        white: 0,
        black: 0,
        draw: 0,
      };

      ratio[result.winner] = result.count;

      groupedMoves[result.move] = {
        move: result.move,
        ratio,
        count: result.count,
        fen: result.fen,
      };

      continue;
    }
    groupedMove.count += result.count;
    groupedMove.ratio[result.winner] += result.count;
  }

  res.json({ status: "success", data: Object.values(groupedMoves) });
});

// {
// [
//   {
//     move:"nf3"
// black_ratio:50%
// white_ratio:45%
// count:sumacount
// fen: fen
//   },

//   {
//     move:"f4"
// black_ratio:50%
// white_ratio:45%
// count:sumacount
//   }
// ]
// }

//autoryzacja
function authenticate(req, res, next) {
  const token = req.cookies.token;

  if (!token) return res.sendStatus(403);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    console.log(user);
    next();
  });
}

// refresh token
router.get("/refresh", authenticate, async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  console.log("refresh token:" + refreshToken);

  try {
    const [user] = await qb.select("*").from("users").where({
      refreshToken,
    });

    if (!user) {
      return res.sendStatus(401);
    }

    console.log(user);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const accessToken = generateAccessToken({ userId: user.id }, "10m");
    console.log(accessToken);

    res.cookie("token", accessToken, {
      maxAge: 6000, //10m
      httpOnly: true,
    });

    res.send({ accessToken });
  } catch (err) {
    return res.sendStatus(401);
  }
});

function generateAccessToken(payload, expireTime) {
  return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: expireTime });
}
function generateRefreshToken(payload, expireTime) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: expireTime,
  }); // 86400
}

//logowanie
router.post("/login", async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const [user] = await qb.select("*").from("users").where({
      email,
    });

    if (!user) throw new notFoundException("Brak użytkownika");

    const match = await bcrypt.compare(password, user.password);

    if (!match) throw new notFoundException("Zle dane logowania");

    const accessToken = generateAccessToken({ userId: user.id }, "1m");
    const refreshToken = generateRefreshToken({ userId: user.id }, "7d");

    await qb("users").update({ refreshToken }).where({ id: user.id });

    res.cookie("token", accessToken, {
      maxAge: 60000, //10m
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 250000, //10m
      httpOnly: true,
    });

    res.send({ status: "success", accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
});

router.get("/user", authenticate, (req, res) => {
  res.send(req.user);
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

    //Wygenerowanie salt, zaszyfrowanie hasla i dodanie uzytkownika do bazy

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        await qb("users").insert({
          id: null,
          email,
          password: hash,
        });
      });
    });

    res.send({ status: "success" });
  } catch (err) {
    next(err);
  }
});

router.use(apiErrorHandler);

export default router;

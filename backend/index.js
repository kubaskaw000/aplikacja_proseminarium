import fetch from "node-fetch";
import games from "./models/games.js";
import { Chess } from "chess.js";
import fens from "./models/fens.js";
import express from "express";
import api from "./routes/api.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import x from "./x.js";

const port = 5000;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use("/api", api);

app.listen(port, () => "Listening on port" + port);

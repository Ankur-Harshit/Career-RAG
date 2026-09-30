// trying to make the signup dynamic by sending data from the server //
import "dotenv/config";
import express from "express";
import connectDB from "./config/database.js";
const app = express();
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import cors from "cors";
import http from "node:http";
// express has the middleware json to covert the incoming json to use it.
// this use will be handled for all the routes as we are not providing any specific route.
app.use(cookieParser());
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use("/", authRouter);

const server = http.createServer(app);

connectDB()
  .then(() => {
    console.log("Connection Established Done");
    server.listen(3000, () => {
      console.log("Server is sucessfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.error("Cannot Connect due to an Error + " + err);
  });

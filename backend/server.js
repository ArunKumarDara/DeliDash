import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConfig } from "./config/dbConfig.js";
import userRouter from "./router/userRouter.js";
import restaurantRouter from "./router/restaurantRouter.js";
import menuRouter from "./router/menu.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

(async () => {
  await dbConfig();

  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/restaurants", restaurantRouter);
  app.use("/api/v1/menu", menuRouter);

  app.get("/", (req, res) => {
    res.send("Hello, world!");
  });

  app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
})();

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConfig } from "./config/dbConfig.js";
import userRouter from "./router/userRouter.js";
import restaurantRouter from "./router/restaurantRouter.js";
import menuRouter from "./router/menu.js";
import addressRouter from "./router/addressRouter.js";
import orderRouter from "./router/orderRouter.js";
import paymentRouter from "./router/paymentRouter.js";
// import serverless from "serverless-http";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

(async () => {
  await dbConfig();

  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      // origin: "http://localhost:5173",
      origin: "https://dinexpress-ts2k.onrender.com",
      // origin: "*",
      credentials: true,
      // httpOnly: true,
    })
  );
  // app.use(cors());
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/restaurants", restaurantRouter);
  app.use("/api/v1/menu", menuRouter);
  app.use("/api/v1/address", addressRouter);
  app.use("/api/v1/orders", orderRouter);
  app.use("/api/v1/payment", paymentRouter);

  app.get("/", (req, res) => {
    res.send("Hello, world!");
  });

  app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
})();

// export default handler = serverless(app);

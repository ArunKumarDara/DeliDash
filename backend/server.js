import express from "express";
import dotenv from "dotenv";

import userRouter from "./router/userRouter.js";

dotenv.config();

const app = express();

const port = process.env.PORT;

app.use(express.json());

app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});

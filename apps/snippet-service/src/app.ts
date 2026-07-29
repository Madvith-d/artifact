import express from "express";
import morgan from "morgan";
import snippetRoute from "./routes/snippet.route";
const app = express();
app.use(express.json());

app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({
    service: "snippet-service",
    status: "OK",
  });
});

app.use("/snippet", snippetRoute);

export default {
  port: 3003,
  fetch: app,
};

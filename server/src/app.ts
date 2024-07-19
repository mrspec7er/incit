import express from "express";
import routerConfig from "./router";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const port = 8080;

app.use(cors("*"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.get("/", (req, res) => {
  res.send("Hello There!");
});

routerConfig(app);

app.listen(port, () => {
  return console.log(
    `Express server is listening at http://localhost:${port} 🚀`
  );
});

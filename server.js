import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { connectDB } from "./config/database.js";

config({
  path: "./config/config.env",
});

const app = express();

connectDB();

// Middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: "http://localhost:3000",
    // credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Route Imports
import employeeRoutes from "./routes/employeeRoute.js";
import studentRoutes from "./routes/studentRoute.js";
import resultRoutes from "./routes/resultsRoute.js";

app.use("/api/employee", employeeRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/results", resultRoutes);

// app.get("/", (req, res) =>
//   res.send(
//     `<h1>Server is working click <a href=${process.env.FRONTEND_URL}>here</a></h1>`
//   )
// );

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT} `);
});

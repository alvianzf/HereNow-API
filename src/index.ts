import express from "express";
import cors from "cors";
import adminRoutes from "./routes/createUser";
import authRoutes from "./routes/auth";
import attendanceRoutes from "./routes/attandance";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 3000;
app.use(cookieParser());

app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api", authRoutes);
app.use("/api/attendance", attendanceRoutes);

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});

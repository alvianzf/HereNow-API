import express from "express";
import cors from "cors";
import adminRoutes from "./routes/createUser";
import authRoutes from "./routes/auth";
import attendanceRoutes from "./routes/attandance";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api", authRoutes);
app.use("/api/attendance", attendanceRoutes);

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});

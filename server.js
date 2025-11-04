import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/users", userRoutes);
app.use(cors({
  origin: ["http://localhost:5173", "https://legendfrontend-yourname.sevalla.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


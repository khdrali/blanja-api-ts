import express from "express";
import cors from "cors";
import userRoutes from "./routes/user/user";
import authRoutes from "./routes/auth/auth";
import recipeRotes from "./routes/recipe/recipe";
import categoryRoutes from "./routes/category/category";
import path from "path";
import multer from "multer";
import dotenv from "dotenv";
import LikeRoutes from "./routes/likeRecipe/likeRecipe";
import SavedRoutes from "./routes/savedRecipe/savedRecipe";
import CommentRoutes from "./routes/comment/comment";

// configures dotenv to work in your application
dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.URL_DEV,
    credentials: true, // kalau pakai cookie / auth token
  })
);

const PORT = process.env.PORT;

app.use("/uploads", express.static(path.resolve("uploads")));

app.use(express.json());
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/recipe", recipeRotes);
app.use("/category", categoryRoutes);
app.use("/like", LikeRoutes);
app.use("/saved", SavedRoutes);
app.use("/comment", CommentRoutes);
app.get("/", (req, res) => {
  res.send("Hello World");
});

app
  .listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT} `);
  })
  .on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
  });

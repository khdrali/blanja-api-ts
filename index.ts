import express from "express";
import userRoutes from "./routes/user";
import authRoutes from "./routes/auth";
import recipeRotes from "./routes/recipe";
import categoryRoutes from "./routes/category";
import multer from "multer";
import dotenv from "dotenv";

// configures dotenv to work in your application
dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/recipe", recipeRotes);
app.use("/category", categoryRoutes);

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
  });

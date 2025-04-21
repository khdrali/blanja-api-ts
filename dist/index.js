"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user/user"));
const auth_1 = __importDefault(require("./routes/auth/auth"));
const recipe_1 = __importDefault(require("./routes/recipe/recipe"));
const category_1 = __importDefault(require("./routes/category/category"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const likeRecipe_1 = __importDefault(require("./routes/likeRecipe/likeRecipe"));
const savedRecipe_1 = __importDefault(require("./routes/savedRecipe/savedRecipe"));
const comment_1 = __importDefault(require("./routes/comment/comment"));
// configures dotenv to work in your application
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.URL_DEV,
    credentials: true, // kalau pakai cookie / auth token
}));
const PORT = process.env.PORT;
app.use("/uploads", express_1.default.static(path_1.default.resolve("uploads")));
app.use(express_1.default.json());
app.use("/users", user_1.default);
app.use("/auth", auth_1.default);
app.use("/recipe", recipe_1.default);
app.use("/category", category_1.default);
app.use("/like", likeRecipe_1.default);
app.use("/saved", savedRecipe_1.default);
app.use("/comment", comment_1.default);
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

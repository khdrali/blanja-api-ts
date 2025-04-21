"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_token_1 = require("../../middlewares/validate-token");
const comment_1 = require("../../controllers/comment/comment");
const CommentRoutes = express_1.default.Router();
CommentRoutes.post("/comment-recipe", validate_token_1.validateToken, comment_1.CreateCommentRecipeController);
CommentRoutes.get("/get-comment-recipe/:id", validate_token_1.validateToken, comment_1.GetCommentRecipeController);
CommentRoutes.delete("/delete-comment-recipe/:id", validate_token_1.validateToken, comment_1.DeleteCommentRecipeController);
exports.default = CommentRoutes;

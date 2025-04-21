"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCommentsByRecipeIdModels = exports.DeleteCommentRecipeModels = exports.CreateCommentRecipeModels = void 0;
const db_1 = __importDefault(require("../../db"));
const CreateCommentRecipeModels = (params) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.default) `INSERT INTO public.comments (comment,recipe_id,user_id,created_at) VALUES (${params === null || params === void 0 ? void 0 : params.comment},${params === null || params === void 0 ? void 0 : params.recipe_id},${params === null || params === void 0 ? void 0 : params.user_id},${params === null || params === void 0 ? void 0 : params.created_at})`;
});
exports.CreateCommentRecipeModels = CreateCommentRecipeModels;
const DeleteCommentRecipeModels = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, db_1.default) `DELETE FROM public.comments WHERE id=${params === null || params === void 0 ? void 0 : params.id} AND user_id=${params === null || params === void 0 ? void 0 : params.user_id} RETURNING *`;
    return result;
});
exports.DeleteCommentRecipeModels = DeleteCommentRecipeModels;
const GetCommentsByRecipeIdModels = (recipeId, limit, offset) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const comments = yield (0, db_1.default) `
    SELECT 
      c.id AS comment_id,
      c.comment,
      c.recipe_id,
      c.user_id,
      c.created_at,
      u.id AS user_id,
      u.username AS user_username,
      u.photo AS user_photo
    FROM 
      public.comments c
    JOIN 
      public.user u ON c.user_id = u.id
    WHERE 
      c.recipe_id = ${recipeId}
    ORDER BY 
      c.created_at DESC
    LIMIT ${limit} OFFSET ${offset};
  `;
    const count = yield (0, db_1.default) `
    SELECT COUNT(*) AS total
    FROM public.comments
    WHERE recipe_id = ${recipeId}
  `;
    return {
        total_rows: Number((_a = count[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
        rows: comments,
    };
});
exports.GetCommentsByRecipeIdModels = GetCommentsByRecipeIdModels;

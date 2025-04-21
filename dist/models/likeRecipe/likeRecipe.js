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
exports.DeleteLikeRecipeByRecipeModels = exports.GetLikeRecipeByUserModels = exports.CreateOrToggleLikeModels = void 0;
const db_1 = __importDefault(require("../../db"));
const CreateOrToggleLikeModels = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield (0, db_1.default) `
    SELECT is_like FROM public.like_recipe
    WHERE user_id = ${params.user_id} AND recipe_id = ${params.recipe_id}
  `;
    if (existing.length > 0) {
        const currentLike = existing[0].is_like;
        const newLike = !currentLike; // toggle
        yield (0, db_1.default) `
      UPDATE public.like_recipe
      SET is_like = ${newLike}
      WHERE user_id = ${params.user_id} AND recipe_id = ${params.recipe_id}
    `;
        return {
            is_like: newLike,
        };
    }
    else {
        // insert baru
        yield (0, db_1.default) `
      INSERT INTO public.like_recipe (is_like, recipe_id, user_id)
      VALUES (true, ${params.recipe_id}, ${params.user_id})
    `;
        return {
            is_like: true,
        };
    }
});
exports.CreateOrToggleLikeModels = CreateOrToggleLikeModels;
const GetLikeRecipeByUserModels = (params, user_id, search) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const recipes = yield (0, db_1.default) `
  SELECT 
    r.id AS recipe_id,
    r.title,
    r.ingredients,
    r.image_recipe,
    r.category_id,
    r.user_id,
    r.created_at,
    COALESCE(like_count.count, 0) AS like_count
  FROM 
    public.like_recipe lr
  JOIN 
    public.recipe r ON lr.recipe_id = r.id
  LEFT JOIN (
    SELECT recipe_id, COUNT(*) AS count
    FROM public.like_recipe
    WHERE is_like = true
    GROUP BY recipe_id
  ) like_count ON r.id = like_count.recipe_id
  WHERE 
    lr.user_id = ${user_id}
    AND lr.is_like = true
    AND r.title ILIKE ${`%${search !== null && search !== void 0 ? search : ""}%`}
  GROUP BY 
    r.id,
    r.title,
    r.ingredients,
    r.image_recipe,
    r.category_id,
    r.user_id,
    r.created_at,
    like_count.count
  ORDER BY r.created_at DESC
  LIMIT ${params === null || params === void 0 ? void 0 : params.limit}
  OFFSET ${params === null || params === void 0 ? void 0 : params.offset};
`;
    const total = yield (0, db_1.default) `
  SELECT COUNT(*) FROM public.like_recipe lr
  JOIN public.recipe r ON lr.recipe_id = r.id
  WHERE lr.user_id = ${user_id} 
    AND lr.is_like = true 
    AND r.title ILIKE ${"%" + search + "%"}
`;
    return {
        total_rows: Number(((_a = total[0]) === null || _a === void 0 ? void 0 : _a.count) || 0),
        rows: recipes,
    };
});
exports.GetLikeRecipeByUserModels = GetLikeRecipeByUserModels;
const DeleteLikeRecipeByRecipeModels = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.default) `DELETE FROM public.like_recipe WHERE recipe_id=${id}`;
});
exports.DeleteLikeRecipeByRecipeModels = DeleteLikeRecipeByRecipeModels;

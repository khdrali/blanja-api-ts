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
exports.DeleteRecipeModels = exports.UpdateRecipeModels = exports.GetRecipeByUserIdModels = exports.GetRecipeByIdModels = exports.GetAllRecipeModels = exports.CreateRecipeModels = void 0;
const db_1 = __importDefault(require("../../db"));
const CreateRecipeModels = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, db_1.default) `
    INSERT INTO public.recipe (title, ingredients, image_recipe, user_id, created_at, category_id)
    VALUES (${params.title}, ${params.ingredients}, ${params.image_recipe}, ${params.user_id}, ${params.created_at},${params === null || params === void 0 ? void 0 : params.category_id})
    RETURNING *`;
    return result[0];
});
exports.CreateRecipeModels = CreateRecipeModels;
const GetAllRecipeModels = (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const conditions = [];
    const values = [];
    if (data.search) {
        conditions.push(`r.title ILIKE $${values.length + 1}`);
        values.push(`%${data.search}%`);
    }
    if (data.categoryId) {
        conditions.push(`r.category_id = $${values.length + 1}`);
        values.push(data.categoryId);
    }
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const query = `${data.sort || "r.created_at DESC"}`;
    const result = yield db_1.default.unsafe(`
    SELECT 
      r.id AS recipe_id,
      r.title,
      r.ingredients,
      r.image_recipe,
      r.category_id,
      r.user_id,
      r.created_at,
      COALESCE(json_agg(DISTINCT jsonb_build_object('video_id', v.id, 'video_url', v.video_url)) 
        FILTER (WHERE v.video_url IS NOT NULL), '[]') AS videos,
      COALESCE(l.like_count, 0) AS like_count,
      CASE 
        WHEN ul.user_id IS NOT NULL THEN true 
        ELSE false 
      END AS is_liked
    FROM 
      public.recipe r
    LEFT JOIN 
      public.video v ON r.id = v.recipe_id
    LEFT JOIN (
      SELECT recipe_id, COUNT(*) AS like_count
      FROM public.like_recipe
      WHERE is_like = TRUE
      GROUP BY recipe_id
    ) l ON r.id = l.recipe_id
    LEFT JOIN (
      SELECT recipe_id, user_id
      FROM public.like_recipe
      WHERE user_id = ${userId !== null && userId !== void 0 ? userId : null} AND is_like = TRUE
    ) ul ON r.id = ul.recipe_id
    ${whereClause}
    GROUP BY 
      r.id, r.title, r.ingredients, r.image_recipe, r.category_id, r.user_id, r.created_at, l.like_count, ul.user_id
    ORDER BY ${query}
    LIMIT ${data.limit} OFFSET ${data.offset};
  `, values);
    const countResult = yield db_1.default.unsafe(`
    SELECT COUNT(*) AS total_rows 
    FROM public.recipe r
    ${whereClause};
  `, values);
    return {
        total_rows: Number(((_a = countResult[0]) === null || _a === void 0 ? void 0 : _a.total_rows) || 0),
        rows: result,
    };
});
exports.GetAllRecipeModels = GetAllRecipeModels;
const GetRecipeByIdModels = (params) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, db_1.default) `
SELECT 
  r.id AS recipe_id,
  r.title,
  r.ingredients,
  r.image_recipe,
  r.category_id,
  r.user_id,
  r.created_at,
  COALESCE(json_agg(DISTINCT jsonb_build_object('video_id', v.id, 'video_url', v.video_url)) 
    FILTER (WHERE v.video_url IS NOT NULL), '[]') AS videos,
  COALESCE(l.like_count, 0) AS like_count,
  CASE 
    WHEN ul.user_id IS NOT NULL THEN true 
    ELSE false 
  END AS is_liked
FROM 
  public.recipe r
LEFT JOIN 
  public.video v ON r.id = v.recipe_id
LEFT JOIN (
  SELECT recipe_id, COUNT(*) AS like_count
  FROM public.like_recipe
  WHERE is_like = TRUE
  GROUP BY recipe_id
) l ON r.id = l.recipe_id
LEFT JOIN (
  SELECT recipe_id, user_id
  FROM public.like_recipe
  WHERE user_id = ${params === null || params === void 0 ? void 0 : params.userId} AND is_like = TRUE
) ul ON r.id = ul.recipe_id
WHERE 
  r.id = ${params === null || params === void 0 ? void 0 : params.recipeId}
GROUP BY 
  r.id, r.title, r.ingredients, r.image_recipe, r.user_id, r.category_id, r.created_at, l.like_count, ul.user_id;

  `;
});
exports.GetRecipeByIdModels = GetRecipeByIdModels;
const GetRecipeByUserIdModels = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, db_1.default) `
    SELECT 
      r.id AS recipe_id,
      r.title,
      r.ingredients,
      r.image_recipe,
      r.category_id,
      r.user_id,
      r.created_at,
      COALESCE(json_agg(DISTINCT v.video_url) FILTER (WHERE v.video_url IS NOT NULL), '[]') AS videos,
      COALESCE(l.like_count, 0) AS like_count
    FROM 
      public.recipe r
    LEFT JOIN 
      public.video v ON r.id = v.recipe_id
    LEFT JOIN (
      SELECT recipe_id, COUNT(*) AS like_count
      FROM public.like_recipe
      WHERE is_like = TRUE
      GROUP BY recipe_id
    ) l ON r.id = l.recipe_id
    WHERE 
      r.user_id = ${id}
    GROUP BY 
      r.id, r.title, r.ingredients, r.image_recipe, r.category_id, r.user_id, r.created_at, l.like_count;
  `;
});
exports.GetRecipeByUserIdModels = GetRecipeByUserIdModels;
const UpdateRecipeModels = (params) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    return yield (0, db_1.default) `
      UPDATE public.recipe
      SET title = ${params === null || params === void 0 ? void 0 : params.title},
      ingredients = ${params === null || params === void 0 ? void 0 : params.ingredients},
      image_recipe = ${params === null || params === void 0 ? void 0 : params.image_recipe},
      category_id = ${params === null || params === void 0 ? void 0 : params.category_id}
      WHERE id = ${(_a = params === null || params === void 0 ? void 0 : params.id) !== null && _a !== void 0 ? _a : 0}
      RETURNING *;
    `;
});
exports.UpdateRecipeModels = UpdateRecipeModels;
const DeleteRecipeModels = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.default) `DELETE FROM public.recipe WHERE id=${id}`;
});
exports.DeleteRecipeModels = DeleteRecipeModels;

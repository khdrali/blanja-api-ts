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
exports.GetRecipeByUserIdModels = exports.GetRecipeByIdModels = exports.GetAllRecipeModels = exports.CreateVideoModels = exports.CreateRecipeModels = void 0;
const db_1 = __importDefault(require("../db"));
const CreateRecipeModels = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, db_1.default) `
    INSERT INTO public.recipe (title, ingredients, image_recipe, user_id, created_at, category_id)
    VALUES (${params.title}, ${params.ingredients}, ${params.image_recipe}, ${params.user_id}, ${params.created_at},${params === null || params === void 0 ? void 0 : params.category_id})
    RETURNING *`;
    return result[0];
});
exports.CreateRecipeModels = CreateRecipeModels;
const CreateVideoModels = (params) => __awaiter(void 0, void 0, void 0, function* () {
    if (Array.isArray(params.video_url)) {
        // Jika ada banyak video
        const videoValues = params.video_url.map((url) => [
            url,
            params.recipe_id,
        ]);
        // Menggunakan template literal postgres dengan benar
        const result = yield (0, db_1.default) `
      INSERT INTO public.video (video_url, recipe_id)
      VALUES ${(0, db_1.default)(videoValues)}
    `;
        return result;
    }
    else {
        // Jika hanya ada satu video
        const result = yield (0, db_1.default) `
      INSERT INTO public.video (video_url, recipe_id)
      VALUES (${params.video_url}, ${params.recipe_id})
    `;
        return result;
    }
});
exports.CreateVideoModels = CreateVideoModels;
const GetAllRecipeModels = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const query = `${data.sort} LIMIT ${data === null || data === void 0 ? void 0 : data.limit} OFFSET ${data === null || data === void 0 ? void 0 : data.offset}`;
    const result = yield (0, db_1.default) `
    SELECT 
      r.id AS recipe_id,
      r.title,
      r.ingredients,
      r.image_recipe,
      r.user_id,
      r.created_at,
      COALESCE(json_agg(v.video_url), '[]') AS videos
    FROM 
      public.recipe r
    LEFT JOIN 
      public.video v 
    ON 
      r.id = v.recipe_id
    GROUP BY 
      r.id, r.title, r.ingredients, r.image_recipe, r.user_id, r.created_at
    ORDER BY ${query}
      `;
    const countResult = yield (0, db_1.default) `SELECT COUNT(*) AS total_rows FROM public.recipe `;
    return {
        total_rows: ((_a = countResult[0]) === null || _a === void 0 ? void 0 : _a.total_rows) || 0,
        rows: result,
    };
});
exports.GetAllRecipeModels = GetAllRecipeModels;
const GetRecipeByIdModels = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, db_1.default) `SELECT 
  r.id AS recipe_id,
  r.title,
  r.ingredients,
  r.image_recipe,
  r.user_id,
  r.created_at,
  COALESCE(json_agg(v.video_url), '[]') AS videos
FROM 
  public.recipe r
LEFT JOIN 
  public.video v 
ON 
  r.id = v.recipe_id
WHERE 
  r.id = ${id}
GROUP BY 
  r.id, r.title, r.ingredients, r.image_recipe, r.user_id, r.created_at;
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
    r.user_id,
    r.created_at,
    COALESCE(json_agg(v.video_url), '[]') AS videos
  FROM 
    public.recipe r
  LEFT JOIN 
    public.video v 
  ON 
    r.id = v.recipe_id
  WHERE 
    r.user_id = ${id}
  GROUP BY 
    r.id, r.title, r.ingredients, r.image_recipe, r.user_id, r.created_at;
  `;
});
exports.GetRecipeByUserIdModels = GetRecipeByUserIdModels;

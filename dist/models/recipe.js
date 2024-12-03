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
exports.CreateVideoModels = exports.CreateRecipeModels = void 0;
const db_1 = __importDefault(require("../db"));
// export const CreateRecipeModels = async (params: CreateRecipeType) => {
//   return await db`
//     INSERT INTO public.recipe (title, ingredients, image_recipe, user_id, created_at)
//     VALUES (${params?.title}, ${params?.ingredients}, ${params?.image_recipe}, ${params?.user_id}, ${params?.created_at})`;
// };
const CreateRecipeModels = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, db_1.default) `
    INSERT INTO public.recipe (title, ingredients, image_recipe, user_id, created_at)
    VALUES (${params.title}, ${params.ingredients}, ${params.image_recipe}, ${params.user_id}, ${params.created_at})
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

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
exports.DeleteVideoByRecipeIdModels = exports.DeleteVideoModels = exports.CreateVideoModels = exports.UpdateVideosModels = exports.GetVideosByRecipeId = void 0;
const db_1 = __importDefault(require("../../db"));
const GetVideosByRecipeId = (recipe_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, db_1.default) `
    SELECT id, video_url 
    FROM public.video 
    WHERE recipe_id = ${recipe_id};
  `;
});
exports.GetVideosByRecipeId = GetVideosByRecipeId;
const UpdateVideosModels = (params) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, db_1.default) `
          UPDATE public.video
          SET video_url = ${params === null || params === void 0 ? void 0 : params.video_url}
          WHERE id = ${params === null || params === void 0 ? void 0 : params.id}
          RETURNING *;
        `;
});
exports.UpdateVideosModels = UpdateVideosModels;
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
const DeleteVideoModels = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (id.length === 0)
        return [];
    return yield (0, db_1.default) ` DELETE FROM public.video
    WHERE id IN ${(0, db_1.default)(id)}
    RETURNING *;`;
});
exports.DeleteVideoModels = DeleteVideoModels;
const DeleteVideoByRecipeIdModels = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.default) `DELETE FROM public.video WHERE recipe_id=${id}`;
});
exports.DeleteVideoByRecipeIdModels = DeleteVideoByRecipeIdModels;

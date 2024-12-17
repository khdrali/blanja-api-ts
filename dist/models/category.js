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
exports.getCategoryModels = exports.addCategoryModels = void 0;
const db_1 = __importDefault(require("../db"));
const addCategoryModels = (category) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, db_1.default) `INSERT INTO public.recipe_categories (categories_name) VALUES (${category})`;
});
exports.addCategoryModels = addCategoryModels;
const getCategoryModels = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, db_1.default) `SELECT * FROM public.recipe_categories`;
});
exports.getCategoryModels = getCategoryModels;

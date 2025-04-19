"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductKeywordSearchParam = void 0;
const class_validator_1 = require("class-validator");
/**
 * 商品キーワード検索パラメータ
 * @author Fullness,Inc.
 * @date 2025-03-16
 * @version 1.0.0
 */
class ProductKeywordSearchParam {
}
exports.ProductKeywordSearchParam = ProductKeywordSearchParam;
__decorate([
    (0, class_validator_1.IsString)({ message: 'キーワードは文字列である必要があります。' })
    // 空白でないことを検証
    ,
    (0, class_validator_1.IsNotEmpty)({ message: 'キーワードは必須です。' })
    // 最大30文字以内であることを検証
    ,
    (0, class_validator_1.MaxLength)(30, { message: 'キーワードは30文字以内にしてください。' }),
    __metadata("design:type", String)
], ProductKeywordSearchParam.prototype, "keyword", void 0);

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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var KeywordSearchProductRESTController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeywordSearchProductRESTController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ProductKeywordSearchParam_1 = require("../param/ProductKeywordSearchParam");
const ProductDTO_1 = require("../../../application/in/dto/ProductDTO");
/**
 * 商品キーワード検索RESTAPIコントローラ
 * @author Fullness,Inc.
 * @date 2025-03-16
 * @version 1.0.0
 */
let KeywordSearchProductRESTController = KeywordSearchProductRESTController_1 = class KeywordSearchProductRESTController {
    /**
     * コンストラクタ
     * @param usecase 商品検索ユースケース
     */
    constructor(usecase) {
        this.usecase = usecase;
        this.logger = new common_1.Logger(KeywordSearchProductRESTController_1.name);
    }
    /**
     * 商品キーワード検索リクエストハンドラ
     * @param keyword 商品キーワード
     */
    async searchByKeyword(param) {
        this.logger.log(`受信した商品キーワード:${param.keyword} 開始`);
        // 受信したキーワードで商品検索する
        return await this.usecase.getByKeyword(param.keyword);
    }
};
exports.KeywordSearchProductRESTController = KeywordSearchProductRESTController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "商品キーワード検索", description: "キーワードを含む商品を検索します。" }),
    (0, swagger_1.ApiQuery)({ name: "keyword", required: true, description: "検索する商品キーワード" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "成功", type: [ProductDTO_1.ProductDTO] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "商品が見つからない" }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProductKeywordSearchParam_1.ProductKeywordSearchParam]),
    __metadata("design:returntype", Promise)
], KeywordSearchProductRESTController.prototype, "searchByKeyword", null);
exports.KeywordSearchProductRESTController = KeywordSearchProductRESTController = KeywordSearchProductRESTController_1 = __decorate([
    (0, swagger_1.ApiTags)("商品キーワード検索") // Swagger UIでカテゴリ表示
    ,
    (0, common_1.Controller)('products/search'),
    __param(0, (0, common_1.Inject)('SearchProductUsecase')),
    __metadata("design:paramtypes", [Object])
], KeywordSearchProductRESTController);

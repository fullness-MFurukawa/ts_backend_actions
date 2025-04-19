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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchProductInteractor = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ProductName_1 = require("../../domain/model/product/ProductName");
const NotFoundException_1 = require("../../../shared/exception/NotFoundException");
const InternalException_1 = require("../../../shared/exception/InternalException");
/**
 * 商品検索ユースケースインターフェイスの実装
 * @author Fullness,Inc.
 * @date 2025-03-15
 * @version 1.0.0
 */
let SearchProductInteractor = class SearchProductInteractor {
    /**
     * コンストラクタ
     * @param manager TypeORMのEntityManager
     * @param productConverter ProductエンティティをProductDTOに変換する
     * @param repository ProductRepositoryインターフェイス
     */
    constructor(manager, productConverter, repository) {
        this.manager = manager;
        this.productConverter = productConverter;
        this.repository = repository;
        this.logger = new common_1.Logger('SearchProductInteractor');
    }
    /**
     * 指定されたキーワードを含む商品の取得結果を返す
     * @param keyword 商品キーワード
     * @returns ProductDTOの配列
     * @throws NotFoundException 商品が存在しない
     * @throws InternalException 内部エラー
     */
    async getByKeyword(keyword) {
        try {
            const results = await this.repository.findByKeyword(ProductName_1.ProductName.fromString(keyword), this.manager);
            if (!results || results.length === 0) {
                throw new NotFoundException_1.NotFoundException(`キーワード:(${keyword})を含む商品は見つかりませんでした。`);
            }
            return await this.productConverter.convertAll(results);
        }
        catch (error) {
            if (error instanceof NotFoundException_1.NotFoundException)
                throw error;
            this.logger.error(`getByKeyword() 失敗: ${error}`, error);
            throw new InternalException_1.InternalException(`商品キーワード(${keyword})の検索に失敗しました。`);
        }
    }
};
exports.SearchProductInteractor = SearchProductInteractor;
exports.SearchProductInteractor = SearchProductInteractor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectEntityManager)()),
    __param(1, (0, common_1.Inject)('ProductDTOConverter')),
    __param(2, (0, common_1.Inject)('ProductRepository')),
    __metadata("design:paramtypes", [typeorm_2.EntityManager, Object, Object])
], SearchProductInteractor);

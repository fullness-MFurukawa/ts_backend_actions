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
exports.UpdateProductInteractor = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ProductId_1 = require("../../domain/model/product/ProductId");
const NotFoundException_1 = require("../../../shared/exception/NotFoundException");
const InternalException_1 = require("../../../shared/exception/InternalException");
/**
 * 商品更新ユースケースインターフェイス
 * @author Fullness,Inc.
 * @date 2025-03-15
 * @version 1.0.0
 */
let UpdateProductInteractor = class UpdateProductInteractor {
    /**
     * コンストラクタ
     * @param manager TypeORMのEntityManager
     * @param productConverter ProductエンティティをProductDTOに変換する
     * @param productRestorer ProductDTOからProductエンティティを復元する
     * @param repository ProductRepositoryインターフェイス
     */
    constructor(manager, productConverter, productRestorer, repository) {
        this.manager = manager;
        this.productConverter = productConverter;
        this.productRestorer = productRestorer;
        this.repository = repository;
        this.logger = new common_1.Logger('UpdateProductInteractor');
    }
    /**
     * 指定された商品Idのエンティティを取得する
     * @param id 商品Id
     * @returns ProductDTO
     * @throws NotFoundException 商品が存在しない
     * @throws InternalException 内部エラー
     */
    async getByProductId(id) {
        try {
            var result = await this.repository.findById(ProductId_1.ProductId.fromString(id), this.manager);
            if (!result) {
                throw new NotFoundException_1.NotFoundException(`商品Id:(${id})の商品は存在しません。`);
            }
            return await this.productConverter.convert(result);
        }
        catch (error) {
            if (error instanceof NotFoundException_1.NotFoundException)
                throw error;
            this.logger.error(`getByProductId() 失敗: ${error}`, error);
            throw new InternalException_1.InternalException(`商品Id(${id})の検索に失敗しました。`);
        }
    }
    /**
     * 商品名または単価を変更する
     * @param product ProductDTO
     * @throws NotFoundException 商品が存在しない
     * @throws InternalError 内部エラー
     */
    async change(product) {
        await this.manager.transaction(async (manager) => {
            try {
                var updateProduct = await this.productRestorer.restore(product);
                var result = await this.repository.updateById(updateProduct, manager);
                if (!result) {
                    throw new NotFoundException_1.NotFoundException(`商品Id:(${product.id})の商品は存在しないため変更できませんでした。`);
                }
            }
            catch (error) {
                if (error instanceof NotFoundException_1.NotFoundException)
                    throw error;
                this.logger.error(`modify() 失敗: ${error}`, error);
                throw new InternalException_1.InternalException(`商品Id(${product.id})の変更に失敗しました。`);
            }
        });
    }
};
exports.UpdateProductInteractor = UpdateProductInteractor;
exports.UpdateProductInteractor = UpdateProductInteractor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectEntityManager)()),
    __param(1, (0, common_1.Inject)('ProductDTOConverter')),
    __param(2, (0, common_1.Inject)('ProductDTORestorer')),
    __param(3, (0, common_1.Inject)('ProductRepository')),
    __metadata("design:paramtypes", [typeorm_2.EntityManager, Object, Object, Object])
], UpdateProductInteractor);

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
exports.RegisterProductInteractor = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const InternalException_1 = require("../../../shared/exception/InternalException");
const CategoryId_1 = require("../../domain/model/category/CategoryId");
const NotFoundException_1 = require("../../../shared/exception/NotFoundException");
const ProductName_1 = require("../../domain/model/product/ProductName");
const ExistsException_1 = require("../../../shared/exception/ExistsException");
/**
 * 商品登録ユースケースインターフェイスの実装
 * @author Fullness,Inc.
 * @date 2025-03-15
 * @version 1.0.0
 */
let RegisterProductInteractor = class RegisterProductInteractor {
    /**
     * コンストラクタ
     * @param manager TypeORMのEntityManager
     * @param categoryConverter CategoryエンティティをCategoryDTOに変換する
     * @param categoryRepository CategoryRepositoryインターフェイス
     * @param productRestorer ProductDTOからProductエンティティを復元する
     * @param productRepository ProductRepositoryインターフェイス
     */
    constructor(manager, categoryConverter, categoryRepository, productRestorer, productRepository) {
        this.manager = manager;
        this.categoryConverter = categoryConverter;
        this.categoryRepository = categoryRepository;
        this.productRestorer = productRestorer;
        this.productRepository = productRepository;
        this.logger = new common_1.Logger('RegisterProductInteractor');
    }
    /**
     * すべての商品カテゴリを取得する
     * @returns CategoryDTOの配列
     * @throws InternalException
     */
    async getCategories() {
        try {
            var results = await this.categoryRepository.findAll(this.manager);
            return await this.categoryConverter.convertAll(results);
        }
        catch (error) {
            this.logger.error(`getAll() 失敗: ${error}`, error);
            throw new InternalException_1.InternalException('すべての商品カテゴリの取得に失敗しました。');
        }
    }
    /**
     * 指定された商品カテゴリIdの商品カテゴリを取得する
     * @param id 商品カテゴリId
     * @returns CategoryDTO
     * @throws NotFoundException
     * @throws InternalException
     */
    async getCategoryById(id) {
        try {
            const result = await this.categoryRepository.findById(CategoryId_1.CategoryId.fromString(id), this.manager);
            if (!result) {
                throw new NotFoundException_1.NotFoundException(`商品カテゴリId:(${id})の商品カテゴリは存在しません。`);
            }
            return await this.categoryConverter.convert(result);
        }
        catch (error) {
            if (error instanceof NotFoundException_1.NotFoundException)
                throw error;
            this.logger.error(`getById() 失敗: ${error}`, error);
            throw new InternalException_1.InternalException(`商品カテゴリId(${id})の取得に失敗しました。`);
        }
    }
    /**
     * 指定された商品の存在有無を調べる
     * @param name 商品名
     * @throws InternalError 内部エラー
     * @throws ExistsError 指定された商品が存在する
     */
    async exists(name) {
        try {
            var result = await this.productRepository.exists(ProductName_1.ProductName.fromString(name), this.manager);
            if (result) {
                throw new ExistsException_1.ExistsException(`商品名:(${name})は既に登録済みです。`);
            }
        }
        catch (error) {
            if (error instanceof ExistsException_1.ExistsException)
                throw error;
            this.logger.error(`exists() 失敗: ${error}`, error);
            throw new InternalException_1.InternalException(`商品名(${name})の存在有無チェックに失敗しました。`);
        }
    }
    /**
     * 新商品を登録する
     * @param product 登録対象のProductDTO
     * @throws InternalError 内部エラー
     */
    async register(product) {
        await this.manager.transaction(async (manager) => {
            try {
                const newProduct = await this.productRestorer.restore(product);
                await this.productRepository.create(newProduct, manager);
            }
            catch (error) {
                this.logger.error(`register() 失敗: ${error}`, error);
                throw new InternalException_1.InternalException(`商品(${product.name})の登録に失敗しました。`);
            }
        });
    }
};
exports.RegisterProductInteractor = RegisterProductInteractor;
exports.RegisterProductInteractor = RegisterProductInteractor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectEntityManager)()),
    __param(1, (0, common_1.Inject)('CategoryDTOConverter')),
    __param(2, (0, common_1.Inject)('CategoryRepository')),
    __param(3, (0, common_1.Inject)('ProductDTORestorer')),
    __param(4, (0, common_1.Inject)('ProductRepository')),
    __metadata("design:paramtypes", [typeorm_2.EntityManager, Object, Object, Object, Object])
], RegisterProductInteractor);

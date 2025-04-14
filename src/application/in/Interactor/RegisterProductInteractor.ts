import { Inject, Injectable, Logger } from "@nestjs/common";
import { CategoryDTO } from "../dto/CategoryDTO";
import { ProductDTO } from "../dto/ProductDTO";
import { RegisterProductUsecase } from "../usecase/RegisterProductUsecase";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import type { Converter } from "@src/shared/adapter/Converter";
import { Category } from "@src/application/domain/model/category/Category";
import type { CategoryRepository } from "@src/application/out/repository/CategoryRepository";
import type { ProductRepository } from "@src/application/out/repository/ProductRepository";
import { Product } from "@src/application/domain/model/product/Product";
import type { Restorer } from "@src/shared/adapter/Restorer";
import { InternalException } from "@src/shared/exception/InternalException";
import { CategoryId } from "@src/application/domain/model/category/CategoryId";
import { NotFoundException } from "@src/shared/exception/NotFoundException";
import { ProductName } from "@src/application/domain/model/product/ProductName";
import { ExistsException } from "@src/shared/exception/ExistsException";

/**
 * 商品登録ユースケースインターフェイスの実装
 * @author Fullness,Inc.
 * @date 2025-03-15
 * @version 1.0.0
 */
@Injectable()
export class RegisterProductInteractor implements RegisterProductUsecase{
    private readonly logger = new Logger('RegisterProductInteractor');
    /**
     * コンストラクタ
     * @param manager TypeORMのEntityManager
     * @param categoryConverter CategoryエンティティをCategoryDTOに変換する
     * @param categoryRepository CategoryRepositoryインターフェイス
     * @param productRestorer ProductDTOからProductエンティティを復元する
     * @param productRepository ProductRepositoryインターフェイス
     */
    constructor(
        @InjectEntityManager()
        private readonly manager: EntityManager,
        @Inject('CategoryDTOConverter')
        private readonly categoryConverter: Converter<Category , CategoryDTO>,
        @Inject('CategoryRepository')
        private readonly categoryRepository: CategoryRepository<EntityManager>,
        @Inject('ProductDTORestorer')
        private readonly productRestorer: Restorer<ProductDTO , Product>,
        @Inject('ProductRepository')
        private readonly productRepository: ProductRepository<EntityManager>,
    ){}

    /**
     * すべての商品カテゴリを取得する
     * @returns CategoryDTOの配列
     * @throws InternalException
     */
    async getCategories(): Promise<CategoryDTO[]> {
        try{
            var results = await this.categoryRepository.findAll(this.manager);
            return await this.categoryConverter.convertAll(results);
        }catch(error){
            this.logger.error(`getAll() 失敗: ${error}` , error);
            throw new InternalException('すべての商品カテゴリの取得に失敗しました。');
        }
    }
    /**
     * 指定された商品カテゴリIdの商品カテゴリを取得する
     * @param id 商品カテゴリId
     * @returns CategoryDTO
     * @throws NotFoundException
     * @throws InternalException
     */
    async getCategoryById(id: string): Promise<CategoryDTO> {
        try{
            const result = await this.categoryRepository.findById(
                CategoryId.fromString(id) , this.manager);
            if (!result){
                throw new NotFoundException(
                `商品カテゴリId:(${id})の商品カテゴリは存在しません。`);
            }
            return await this.categoryConverter.convert(result);
        }catch(error){
            if (error instanceof NotFoundException) throw error;
            this.logger.error(`getById() 失敗: ${error}` , error);
            throw new InternalException(
                `商品カテゴリId(${id})の取得に失敗しました。`);
        }
    }
    /**
     * 指定された商品の存在有無を調べる
     * @param name 商品名
     * @throws InternalError 内部エラー
     * @throws ExistsError 指定された商品が存在する
     */
    async exists(name: string): Promise<void> {
        try{
            var result = 
            await this.productRepository.exists(ProductName.fromString(name) , this.manager);
            if (result){
                throw new ExistsException(
                `商品名:(${name})は既に登録済みです。`);
            }
        }catch(error){
            if (error instanceof ExistsException) throw error;
            this.logger.error(`exists() 失敗: ${error}` , error);
            throw new InternalException(
                    `商品名(${name})の存在有無チェックに失敗しました。`);
        }
    }
    /**
     * 新商品を登録する
     * @param product 登録対象のProductDTO
     * @throws InternalError 内部エラー
     */
    async register(product: ProductDTO): Promise<void> {
        await this.manager.transaction(async (manager) => {  
            try{
                const newProduct = await this.productRestorer.restore(product);
                await this.productRepository.create(newProduct , manager);
            }catch(error){
                this.logger.error(`register() 失敗: ${error}` , error);
                throw new InternalException(
                        `商品(${product.name})の登録に失敗しました。`);
            }
        });
    }
}
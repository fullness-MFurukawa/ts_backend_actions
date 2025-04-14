import { Inject, Injectable, Logger } from "@nestjs/common";
import { UpdateProductUsecase } from "../usecase/UpdateProductUsecase";
import { ProductDTO } from "../dto/ProductDTO";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import type { Converter } from "@src/shared/adapter/Converter";
import { Product } from "@src/application/domain/model/product/Product";
import type { Restorer } from "@src/shared/adapter/Restorer";
import type { ProductRepository } from "@src/application/out/repository/ProductRepository";
import { ProductId } from "@src/application/domain/model/product/ProductId";
import { NotFoundException } from "@src/shared/exception/NotFoundException";
import { InternalException } from "@src/shared/exception/InternalException";

/**
 * 商品更新ユースケースインターフェイス
 * @author Fullness,Inc.
 * @date 2025-03-15
 * @version 1.0.0
 */
@Injectable()
export class UpdateProductInteractor implements UpdateProductUsecase {

    private readonly logger = new Logger('UpdateProductInteractor');
    /**
     * コンストラクタ
     * @param manager TypeORMのEntityManager
     * @param productConverter ProductエンティティをProductDTOに変換する
     * @param productRestorer ProductDTOからProductエンティティを復元する
     * @param repository ProductRepositoryインターフェイス
     */
    constructor(
        @InjectEntityManager()
        private readonly manager: EntityManager,
        @Inject('ProductDTOConverter')
        private readonly productConverter: Converter<Product , ProductDTO>,
        @Inject('ProductDTORestorer')
        private readonly productRestorer: Restorer<ProductDTO , Product>,
        @Inject('ProductRepository')
        private readonly repository: ProductRepository<EntityManager>,
    ) {}

    /**
     * 指定された商品Idのエンティティを取得する
     * @param id 商品Id
     * @returns ProductDTO
     * @throws NotFoundException 商品が存在しない
     * @throws InternalException 内部エラー
     */
    async getByProductId(id: string): Promise<ProductDTO> {
        try{
            var result = 
            await this.repository.findById(ProductId.fromString(id) , this.manager);
            if (!result){
                throw new NotFoundException(
                `商品Id:(${id})の商品は存在しません。`);
            }
            return await this.productConverter.convert(result);
        }catch(error){
            if (error instanceof NotFoundException) throw error;
            this.logger.error(`getByProductId() 失敗: ${error}` , error);
            throw new InternalException(
                    `商品Id(${id})の検索に失敗しました。`);
        }
    }

    /**
     * 商品名または単価を変更する
     * @param product ProductDTO
     * @throws NotFoundException 商品が存在しない
     * @throws InternalError 内部エラー
     */
    async change(product: ProductDTO): Promise<void> {
        await this.manager.transaction(async (manager) => { 
            try{
                var updateProduct = await this.productRestorer.restore(product);
                var result = await this.repository.updateById(updateProduct,manager);
                if (!result){
                    throw new NotFoundException(
                        `商品Id:(${product.id})の商品は存在しないため変更できませんでした。`);
                }
            }catch(error){
                if (error instanceof NotFoundException) throw error;
                this.logger.error(`modify() 失敗: ${error}` , error);
                throw new InternalException(
                        `商品Id(${product.id})の変更に失敗しました。`);
            }
        });
    }
}
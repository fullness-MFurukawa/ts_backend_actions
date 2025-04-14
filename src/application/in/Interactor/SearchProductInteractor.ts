import { Inject, Injectable, Logger } from "@nestjs/common";
import { SearchProductUsecase } from "../usecase/SearchProductUsecase";
import { ProductDTO } from "../dto/ProductDTO";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import type { Converter } from "@src/shared/adapter/Converter";
import { Product } from "@src/application/domain/model/product/Product";
import type { ProductRepository } from "@src/application/out/repository/ProductRepository";
import { ProductName } from "@src/application/domain/model/product/ProductName";
import { NotFoundException } from "@src/shared/exception/NotFoundException";
import { InternalException } from "@src/shared/exception/InternalException";


/**
 * 商品検索ユースケースインターフェイスの実装
 * @author Fullness,Inc.
 * @date 2025-03-15
 * @version 1.0.0
 */
@Injectable()
export class SearchProductInteractor implements SearchProductUsecase{

    private readonly logger = new Logger('SearchProductInteractor');
    /**
     * コンストラクタ
     * @param manager TypeORMのEntityManager
     * @param productConverter ProductエンティティをProductDTOに変換する
     * @param repository ProductRepositoryインターフェイス
     */
    constructor(
        @InjectEntityManager()
        private readonly manager: EntityManager,
        @Inject('ProductDTOConverter')
        private readonly productConverter: Converter<Product , ProductDTO>,
        @Inject('ProductRepository')
        private readonly repository: ProductRepository<EntityManager>,
    ){}
    /**
     * 指定されたキーワードを含む商品の取得結果を返す
     * @param keyword 商品キーワード
     * @returns ProductDTOの配列
     * @throws NotFoundException 商品が存在しない
     * @throws InternalException 内部エラー
     */
    async getByKeyword(keyword: string):Promise<ProductDTO[]>{
        try{
            const results = 
            await this.repository.findByKeyword(ProductName.fromString(keyword), this.manager);
            if (!results || results.length === 0){
                throw new NotFoundException(
                `キーワード:(${keyword})を含む商品は見つかりませんでした。`);
            }
            return await this.productConverter.convertAll(results); 
        }catch(error){
            if (error instanceof NotFoundException) throw error;
            this.logger.error(`getByKeyword() 失敗: ${error}` , error);
            throw new InternalException(
                    `商品キーワード(${keyword})の検索に失敗しました。`);
        }
    }
}
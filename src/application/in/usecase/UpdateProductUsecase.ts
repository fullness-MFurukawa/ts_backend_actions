import { ProductDTO } from "../dto/ProductDTO";

/**
 * 商品更新ユースケースインターフェイス
 * @author Fullness,Inc.
 * @date 2025-03-15
 * @version 1.0.0
 */
export interface UpdateProductUsecase {
    /**
     * 指定された商品Idのエンティティを取得する
     * @param id 商品Id
     * @returns ProductDTO
     * @throws NotFoundException 商品が存在しない
     * @throws InternalException 内部エラー
     */
    getByProductId(id: string): Promise<ProductDTO>;

    /**
     * 商品名または単価を変更する
     * @param product ProductDTO
     * @throws NotFoundException 商品が存在しない
     * @throws InternalError 内部エラー
     */
    change(product: ProductDTO): Promise<void>; 
}
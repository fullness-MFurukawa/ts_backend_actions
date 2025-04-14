import { ProductDTO } from "../dto/ProductDTO";

/**
 * 商品検索ユースケースインターフェイス
 * @author Fullness,Inc.
 * @date 2025-03-15
 * @version 1.0.0
 */
export interface SearchProductUsecase {
    /**
     * 指定されたキーワードを含む商品の取得結果を返す
     * @param keyword 商品キーワード
     * @returns ProductDTOの配列
     * @throws NotFoundException 商品が存在しない
     * @throws InternalException 内部エラー
     */
    getByKeyword(keyword: string):Promise<ProductDTO[]>;
}
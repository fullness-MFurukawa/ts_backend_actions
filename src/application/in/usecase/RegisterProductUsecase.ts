import { CategoryDTO } from "../dto/CategoryDTO";
import { ProductDTO } from "../dto/ProductDTO";

/**
 * 商品登録ユースケースインターフェイス
 * @author Fullness,Inc.
 * @date 2025-03-15
 * @version 1.0.0
 */
export interface RegisterProductUsecase {
    /**
     * すべての商品カテゴリを取得する
     * @returns CategoryOutputの配列
     * @throws InternalException 内部エラー
     */
    getCategories(): Promise<CategoryDTO[]>;

    /**
     * 指定された商品カテゴリIdの商品カテゴリを取得する
     * @param id 商品カテゴリId
     * @returns CategoryDTO
     * @throws NotFoundException 商品カテゴリが存在しない
     * @throws InternalException 内部エラー
     */
    getCategoryById(id: string): Promise<CategoryDTO>;

    /**
     * 指定された商品の存在有無を調べる
     * @param name 商品名
     * @throws InternalError 内部エラー
     * @throws ExistsError 指定された商品が存在する
     */
    exists(name: string): Promise<void>;

    /**
     * 新商品を登録する
     * @param product 登録対象のProductDTO
     * @throws InternalError 内部エラー
     */
    register(product: ProductDTO): Promise<void>;
}
import { Injectable } from "@nestjs/common";
import { ProductDTO } from "@src/application/in/dto/ProductDTO";
import { Converter } from "@src/shared/adapter/Converter";
import { UpdateProductParam } from "../param/UpdateProductParam";

/**
 * ModifyProductParamからProductDTOへの変換クラス
 * @author Fullness,Inc.
 * @date 2025-03-20
 * @version 1.0.0
 */
@Injectable()
export class UpdateProductParamConverter implements Converter<UpdateProductParam , ProductDTO> {

    /**
     * UpdateProductParam型の値をProductDTO型に変換する
     * @param source 変換対象
     * @returns 変換結果
     */
    async convert(source: UpdateProductParam): Promise<ProductDTO> {
        const product: ProductDTO = {
            id: source.productId,
            name: source.name,
            price: source.price,
            category: null
        };
        return product;
    }
    /**
     * 使用しないため実装
     * @param sources 
     */
    convertAll(sources: UpdateProductParam[]): Promise<ProductDTO[]> {
        throw new Error("Method not implemented.");
    }
}
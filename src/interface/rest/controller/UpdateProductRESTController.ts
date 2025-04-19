import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Logger, Param, Put } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import type { Converter } from "@src/shared/adapter/Converter";
import { UpdateProductParam } from "../param/UpdateProductParam";
import { ProductDTO } from "@src/application/in/dto/ProductDTO";
import type { UpdateProductUsecase } from "@src/application/in/usecase/UpdateProductUsecase";
import { ProductIdSearchParam } from "../param/ProductIdSearchParam";

/**
 * 既存商品の変更RESTAPIコントローラ
 * @author Fullness,Inc.
 * @date 2025-03-20
 * @version 1.0.0
 */
@ApiTags("商品変更(商品名、単価)") // Swaggerのカテゴリ設定
@Controller('products/update')
export class UpdateProductRESTController {
    private readonly logger = new Logger(UpdateProductRESTController.name);
    /**
     * コンストラクタ
     * @param productUsecase 商品ユースケース
     * @param converter UpdateProductParamからProductDTOへの変換クラス
     */
    constructor(
        @Inject('ProductUsecase')
        private readonly usecase: UpdateProductUsecase,   // 商品変更ユースケース
        @Inject('UpdateProductParamConverter')
        private readonly converter: Converter<UpdateProductParam , ProductDTO>
    ){}

    /**
     * 指定された商品Idの商品を取得するリクエストハンドラ
     * @url http://xxx/api/products/modify/{productId}
     * @returns ProductResult
     */
    @ApiOperation({ summary: "商品Idで商品情報を取得", description: "指定された商品Idの商品を取得" })
    @ApiParam({ name: "productId", description: "取得する商品のId", example: "550e8400-e29b-41d4-a716-446655440000" })
    @ApiResponse({ status: 200, description: "成功", type: ProductDTO })
    @ApiResponse({ status: 404, description: "商品が見つからない" })
    @Get(':productId')
    async getProduct(@Param() param: ProductIdSearchParam): Promise<ProductDTO> {
        this.logger.log(`受信した商品Id: ${param.productId} 開始`);
        return await this.usecase.getByProductId(param.productId);
    }

    /** 
     * 商品を変更するリクエストハンドラ
     * @url http://xxx/api/products/modify
     * @param ModifyProductParam 変更する商品のパラメータ
     * @returns 変更成功メッセージ
     */
    @ApiOperation({ summary: "商品情報を変更", description: "指定された商品の情報を更新" })
    @ApiBody({
        description: "変更する商品情報",
        type: UpdateProductParam,
        examples: {
            example1: {
                summary: "正常なリクエスト",
                value: {
                    productId: "550e8400-e29b-41d4-a716-446655440000",
                    name: "ゲルインクボールペン(青)",
                    price: 300
                },
            },
        },
    })
    @ApiResponse({ status: 200, description: "変更成功" })
    @ApiResponse({ status: 400, description: "バリデーションエラー" })
    @Put()
    @HttpCode(HttpStatus.OK) // ステータスコードを200に設定
    async modifyProduct(
        @Body() param: UpdateProductParam): Promise<{ message: string }> {
        this.logger.log(`受信した変更商品: ${param.name}`);
        // UpdateProductParamをProductDTOに変換する
        const product = await this.converter.convert(param);
        // 商品を変更する
        await this.usecase.change(product);
        const message = 
        `商品Id:${param.productId}の商品名を${param.name},単価を${param.price}に変更しました。`;
        return { message: message};  
    }
}
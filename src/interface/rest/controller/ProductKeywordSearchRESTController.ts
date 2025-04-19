import { Controller, Get, Inject, Logger, Query, ValidationPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import type { SearchProductUsecase } from "@src/application/in/usecase/SearchProductUsecase";
import { ProductKeywordSearchParam } from "../param/ProductKeywordSearchParam";
import { ProductDTO } from "@src/application/in/dto/ProductDTO";
/**
 * 商品キーワード検索RESTAPIコントローラ
 * @author Fullness,Inc.
 * @date 2025-03-16
 * @version 1.0.0
 */
@ApiTags("商品キーワード検索")      // Swagger UIでカテゴリ表示
@Controller('products/search')
export class ProductKeywordSearchRESTController {

    private readonly logger = new Logger(ProductKeywordSearchRESTController.name);
    /**
     * コンストラクタ
     * @param usecase 商品検索ユースケース
     */
    constructor(
        @Inject('SearchProductUsecase')
        private readonly usecase: SearchProductUsecase)
    {}

    /**
     * 商品キーワード検索リクエストハンドラ
     * @param keyword 商品キーワード
     */
    @ApiOperation({ summary: "商品キーワード検索", description: "キーワードを含む商品を検索します。" })
    @ApiQuery({ name: "keyword", required: true, description: "検索する商品キーワード" })
    @ApiResponse({ status: 200, description: "成功", type: [ProductDTO] })
    @ApiResponse({ status: 404, description: "商品が見つからない" })
    @Get()
    async searchByKeyword(
    @Query(new ValidationPipe({ transform: true })) param: ProductKeywordSearchParam): Promise<ProductDTO[]> {
        this.logger.log(`受信した商品キーワード:${param.keyword} 開始`);
        // 受信したキーワードで商品検索する
        return await this.usecase.getByKeyword(param.keyword);
    }
}
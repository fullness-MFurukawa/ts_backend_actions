import { Module } from "@nestjs/common";
import { ApplicationModule } from "@src/application/ApplicationModule";
import { ProductKeywordSearchRESTController } from "./rest/controller/ProductKeywordSearchRESTController";
import { RegisterProductParamConverter } from "./rest/adapter/RegisterProductParamConverter";
import { ProductRegisterRESTController } from "./rest/controller/ProductRegisterRESTController";

/**
 * インターフェイス層のモジュール定義
 * - 商品カテゴリサービス、商品サービスを登録
 * - リクエストに応答するControllerと、リクエストパラメータを変換するAdapterを提供
 * @author Fullness
 * @date 2025-03-16
 * @version 1.0.0
 */
@Module({
    imports: [
        ApplicationModule   ,  // サービス層のモジュール定義
    ],
    controllers:[
        ProductKeywordSearchRESTController, // 商品キーワード検索RESTAPIコントローラ
        ProductRegisterRESTController, // 商品登録RESTAPIコントローラ
    ],
    providers:[
        // RegisterProductParamからProductDTOへの変換
        {
            provide:    'RegisterProductParamConverter' ,
            useClass:   RegisterProductParamConverter,
        },
    ],
    exports:[
        'RegisterProductParamConverter' ,
    ]
})
export class InterfaceModule {}
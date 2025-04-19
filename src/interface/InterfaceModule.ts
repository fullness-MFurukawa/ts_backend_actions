import { Module } from "@nestjs/common";
import { ApplicationModule } from "@src/application/ApplicationModule";
import { KeywordSearchProductRESTController} from "./rest/controller/KeywordSearchProductRESTController";
import { RegisterProductParamConverter } from "./rest/adapter/RegisterProductParamConverter";
import { RegisterProductRESTController } from "./rest/controller/RegisterProductRESTController";
import { UpdateProductParamConverter } from "./rest/adapter/UpdateProductParamConverter";
import { UpdateProductRESTController } from "./rest/controller/UpdateProductRESTController";

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
        KeywordSearchProductRESTController  , // 商品キーワード検索RESTAPIコントローラ
        RegisterProductRESTController       , // 商品登録RESTAPIコントローラ
        UpdateProductRESTController         , // 商品変更RESTAPIコントローラ
    ],
    providers:[
        // RegisterProductParamからProductDTOへの変換
        {
            provide:    'RegisterProductParamConverter' ,
            useClass:   RegisterProductParamConverter,
        },
        // UpdateProductParamからProductDTOへの変換
        {
            provide:    'UpdateProductParamConverter',
            useClass:   UpdateProductParamConverter ,
        },
    ],
    exports:[
        'RegisterProductParamConverter' ,
        'UpdateProductParamConverter'   ,
    ]
})
export class InterfaceModule {}
import { Module } from "@nestjs/common";
import { ApplicationModule } from "@src/application/ApplicationModule";

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
    providers:[
    ],
    exports:[
    ]
})
export class InterfaceModule {}
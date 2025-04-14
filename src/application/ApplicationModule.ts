import { Module } from "@nestjs/common";
import { InfrastructureModule } from "@src/infrastructure/InfrastructureModule";
import { CategoryDTOConverter } from "./in/adapter/CategoryDTOConverter";
import { ProductDTOConverter } from "./in/adapter/ProductDTOConverter";
import { ProductDTORestorer } from "./in/adapter/ProductDTORestorer";
import { SearchProductInteractor } from "./in/Interactor/SearchProductInteractor";
import { RegisterProductInteractor } from "./in/Interactor/RegisterProductInteractor";

/**
 * サービス層のモジュール定義
 * - 商品カテゴリサービス、商品サービスを登録
 * - ユースケース層から呼び出されるビジネスロジックを提供
 * - ドメインモデルやリポジトリと連携して具体的な操作を実行
 * @author Fullness
 * @date 2025-03-14
 * @version 1.0.0
 */
@Module({
    imports: [
        InfrastructureModule, // インフラストラクチャ層のモジュールをインポート
    ],
    providers: [
        // CategoryエンティティからCategoryDTOへ変換する
        {
            provide:    'CategoryDTOConverter',  
            useClass:   CategoryDTOConverter,      
        },
        // ProductエンティティからProductDTOへ変換する
        {
            provide:    'ProductDTOConverter',  
            useClass:   ProductDTOConverter,   
        },
        // ProductDTOからProductエンティティを復元する
        {
            provide:    'ProductDTORestorer',    
            useClass:   ProductDTORestorer,     
        },
        // 商品検索ユースケースインターフェイスの実装
        {
            provide:    'SearchProductUsecase' ,
            useClass:   SearchProductInteractor ,
        },
        // 商品登録ユースケースインターフェイスの実装
        {
            provide:    'RegisterProductUsecase' ,
            useClass:   RegisterProductInteractor ,
        },
    ],
    exports: [
        'CategoryDTOConverter'      ,  
        'ProductDTOConverter'       , 
        'ProductDTORestorer'        ,  
        'SearchProductUsecase'      ,
        'RegisterProductUsecase'    ,
    ]
})
export class ApplicationModule {}
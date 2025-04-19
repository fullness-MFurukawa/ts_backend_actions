"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationModule = void 0;
const common_1 = require("@nestjs/common");
const InfrastructureModule_1 = require("../infrastructure/InfrastructureModule");
const CategoryDTOConverter_1 = require("./in/adapter/CategoryDTOConverter");
const ProductDTOConverter_1 = require("./in/adapter/ProductDTOConverter");
const ProductDTORestorer_1 = require("./in/adapter/ProductDTORestorer");
const SearchProductInteractor_1 = require("./in/Interactor/SearchProductInteractor");
const RegisterProductInteractor_1 = require("./in/Interactor/RegisterProductInteractor");
const UpdateProductInteractor_1 = require("./in/Interactor/UpdateProductInteractor");
/**
 * サービス層のモジュール定義
 * - 商品カテゴリサービス、商品サービスを登録
 * - ユースケース層から呼び出されるビジネスロジックを提供
 * - ドメインモデルやリポジトリと連携して具体的な操作を実行
 * @author Fullness
 * @date 2025-03-14
 * @version 1.0.0
 */
let ApplicationModule = class ApplicationModule {
};
exports.ApplicationModule = ApplicationModule;
exports.ApplicationModule = ApplicationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            InfrastructureModule_1.InfrastructureModule, // インフラストラクチャ層のモジュールをインポート
        ],
        providers: [
            // CategoryエンティティからCategoryDTOへ変換する
            {
                provide: 'CategoryDTOConverter',
                useClass: CategoryDTOConverter_1.CategoryDTOConverter,
            },
            // ProductエンティティからProductDTOへ変換する
            {
                provide: 'ProductDTOConverter',
                useClass: ProductDTOConverter_1.ProductDTOConverter,
            },
            // ProductDTOからProductエンティティを復元する
            {
                provide: 'ProductDTORestorer',
                useClass: ProductDTORestorer_1.ProductDTORestorer,
            },
            // 商品検索ユースケースインターフェイスの実装
            {
                provide: 'SearchProductUsecase',
                useClass: SearchProductInteractor_1.SearchProductInteractor,
            },
            // 商品登録ユースケースインターフェイスの実装
            {
                provide: 'RegisterProductUsecase',
                useClass: RegisterProductInteractor_1.RegisterProductInteractor,
            },
            // 商品更新ユースケースインターフェイスの実装
            {
                provide: 'UpdateProductUsecase',
                useClass: UpdateProductInteractor_1.UpdateProductInteractor,
            },
        ],
        exports: [
            'CategoryDTOConverter',
            'ProductDTOConverter',
            'ProductDTORestorer',
            'SearchProductUsecase',
            'RegisterProductUsecase',
            'UpdateProductUsecase',
        ]
    })
], ApplicationModule);

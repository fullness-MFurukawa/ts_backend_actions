"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterfaceModule = void 0;
const common_1 = require("@nestjs/common");
const ApplicationModule_1 = require("../application/ApplicationModule");
const KeywordSearchProductRESTController_1 = require("./rest/controller/KeywordSearchProductRESTController");
const RegisterProductParamConverter_1 = require("./rest/adapter/RegisterProductParamConverter");
const ProductRegisterRESTController_1 = require("./rest/controller/ProductRegisterRESTController");
const UpdateProductParamConverter_1 = require("./rest/adapter/UpdateProductParamConverter");
const UpdateProductRESTController_1 = require("./rest/controller/UpdateProductRESTController");
/**
 * インターフェイス層のモジュール定義
 * - 商品カテゴリサービス、商品サービスを登録
 * - リクエストに応答するControllerと、リクエストパラメータを変換するAdapterを提供
 * @author Fullness
 * @date 2025-03-16
 * @version 1.0.0
 */
let InterfaceModule = class InterfaceModule {
};
exports.InterfaceModule = InterfaceModule;
exports.InterfaceModule = InterfaceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            ApplicationModule_1.ApplicationModule, // サービス層のモジュール定義
        ],
        controllers: [
            KeywordSearchProductRESTController_1.KeywordSearchProductRESTController, // 商品キーワード検索RESTAPIコントローラ
            ProductRegisterRESTController_1.ProductRegisterRESTController, // 商品登録RESTAPIコントローラ
            UpdateProductRESTController_1.UpdateProductRESTController, // 商品変更RESTAPIコントローラ
        ],
        providers: [
            // RegisterProductParamからProductDTOへの変換
            {
                provide: 'RegisterProductParamConverter',
                useClass: RegisterProductParamConverter_1.RegisterProductParamConverter,
            },
            // UpdateProductParamからProductDTOへの変換
            {
                provide: 'UpdateProductParamConverter',
                useClass: UpdateProductParamConverter_1.UpdateProductParamConverter,
            },
        ],
        exports: [
            'RegisterProductParamConverter',
            'UpdateProductParamConverter',
        ]
    })
], InterfaceModule);

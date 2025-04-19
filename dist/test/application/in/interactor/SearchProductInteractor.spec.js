"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@nestjs/testing/test");
const AppModule_1 = require("../../../../src/AppModule");
const NotFoundException_1 = require("../../../../src/shared/exception/NotFoundException");
/**
 * ProductInteractorのテストドライバ
 * [テスト実行コマンド]
 * npx jest test/application/in/interactor/SearchProductInteractor.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-15
 * @version 1.0.0
 */
describe('SearchProductInteractorの単体テスト', () => {
    let app; // NestJSアプリケーションインスタンス
    let usecase; // 商品検索ユースケース
    /**
     * すべてのテストの前処理
     * - AppModuleを基にテスト用のNestJSアプリケーションを作成
     * - ProductUsecaseをDIコンテナから取得
     */
    beforeAll(async () => {
        // テストモジュールの準備
        const moduleRef = await test_1.Test.createTestingModule({
            imports: [AppModule_1.AppModule], // 実際のモジュールを使用
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        // ユースケースを取得
        usecase = app.get('SearchProductUsecase');
    });
    /**
     * すべてのテストの後処理
     */
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });
    it('キーワードボールペンで検索した場合、対応する商品を取得できる', async () => {
        // キーワード検索を実行する
        const products = await usecase.getByKeyword('ボールペン');
        // 取得した結果の検証
        expect(products).toBeInstanceOf(Array);
        expect(products.length).toBeGreaterThan(0);
        const productNames = products.map((product) => product.name);
        expect(productNames).toContain('水性ボールペン(赤)');
        expect(productNames).toContain('水性ボールペン(黒)');
        expect(productNames).toContain('水性ボールペン(青)');
        expect(productNames).toContain('油性ボールペン(赤)');
        expect(productNames).toContain('油性ボールペン(黒)');
        expect(productNames).toContain('油性ボールペン(青)');
    });
    it("キーワードを含む商品が存在しない場合、NotFoundExceptionがスローされる", async () => {
        await expect(usecase.getByKeyword('存在しない商品名')).rejects.toThrow(NotFoundException_1.NotFoundException);
        await expect(usecase.getByKeyword('存在しない商品名')).rejects.toThrow(`キーワード:(存在しない商品名)を含む商品は見つかりませんでした`);
    });
});

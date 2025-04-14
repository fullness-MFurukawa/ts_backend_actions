import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing/test";
import { RegisterProductUsecase } from "@src/application/in/usecase/RegisterProductUsecase";
import { AppModule } from "@src/AppModule";

/**
 * RegisterProductInteractorのテストドライバ
 * [テスト実行コマンド]
 * npx jest test/application/in/interactor/RegisterProductInteractor.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-15
 * @version 1.0.0
 */
describe('RegisterProductInteractorの単体テスト', () => {
    let app: INestApplication;// NestJSアプリケーションインスタンス
    let usecase: RegisterProductUsecase; // 商品登録ユースケース
     /**
     * すべてのテストの前処理
     * - AppModuleを基にテスト用のNestJSアプリケーションを作成
     * - ProductUsecaseをDIコンテナから取得
     */
     beforeAll(async () => {
        // テストモジュールの準備
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule], // 実際のモジュールを使用
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        // ユースケースを取得
        usecase = app.get<RegisterProductUsecase>('RegisterProductUsecase');
    });
    /**
     * すべてのテストの後処理
     */
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });
    describe('getCategories()メソッド', () => {
        it('すべての商品カテゴリを取得できる', async () => {
            // すべての商品カテゴリを取得する
            const categories = await usecase.getCategories();
            // 取得結果を検証する
            expect(categories).toHaveLength(3);
            const categoryNames = categories.map((category) => category.name);
            expect(categoryNames).toContain('文房具');
            expect(categoryNames).toContain('雑貨');
            expect(categoryNames).toContain('パソコン周辺機器');
        });
    });
});
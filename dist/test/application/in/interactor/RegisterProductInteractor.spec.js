"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@nestjs/testing/test");
const ProductName_1 = require("../../../../src/application/domain/model/product/ProductName");
const AppModule_1 = require("../../../../src/AppModule");
const ExistsException_1 = require("../../../../src/shared/exception/ExistsException");
const NotFoundException_1 = require("../../../../src/shared/exception/NotFoundException");
const typeorm_1 = require("typeorm");
/**
 * RegisterProductInteractorのテストドライバ
 * [テスト実行コマンド]
 * npx jest test/application/in/interactor/RegisterProductInteractor.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-15
 * @version 1.0.0
 */
describe('RegisterProductInteractorの単体テスト', () => {
    let app; // NestJSアプリケーションインスタンス
    let usecase; // 商品登録ユースケース
    let repository; // 商品リポジトリ
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
        usecase = app.get('RegisterProductUsecase');
        // リポジトリを取得
        repository = app.get('ProductRepository');
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
    describe('getCategoryById()メソッド', () => {
        it('存在する商品カテゴリIdの商品カテゴリを取得できる', async () => {
            // 商品カテゴリを取得する
            const category = await usecase
                .getCategoryById('b1524011-b6af-417e-8bf2-f449dd58b5c0');
            // 取得した結果の検証
            expect(category.id).toBe('b1524011-b6af-417e-8bf2-f449dd58b5c0');
            expect(category.name).toBe('文房具');
        });
        it('商品カテゴリが存在しない場合、NotFoundExceptionがスローされる', async () => {
            const id = 'b1524011-b6af-417e-8bf2-f449dd58b5c1';
            // 結果の検証
            await expect(usecase.getCategoryById(id)).rejects.toThrow(NotFoundException_1.NotFoundException);
            await expect(usecase.getCategoryById(id)).rejects.toThrow(`商品カテゴリId:(b1524011-b6af-417e-8bf2-f449dd58b5c1)の商品カテゴリは存在しません。`);
        });
    });
    describe('exists()メソッドのテスト', () => {
        it('商品が存在しない場合、ExistsExceptionをスローしない', async () => {
            await expect(usecase.exists('消しゴム')).resolves.not.toThrow();
        });
        it('商品が存在する場合、ExistsExceptionをスローする', async () => {
            const name = '水性ボールペン(赤)';
            // テスト対象メソッドの実行と例外の検証
            await expect(usecase.exists(name)).rejects.toThrow(ExistsException_1.ExistsException);
            await expect(usecase.exists(name)).rejects.toThrow(`商品名:(水性ボールペン(赤))は既に登録済みです。`);
        });
    });
    describe('register()メソッド', () => {
        it('正常に商品が登録できる', async () => {
            const newProduct = {
                id: null, // 新規作成
                name: "ノート",
                price: 500,
                category: {
                    id: "b1524011-b6af-417e-8bf2-f449dd58b5c0",
                    name: "文房具",
                },
            };
            await usecase.register(newProduct);
            // 登録結果を検証
            const resulrts = await repository.findByKeyword(ProductName_1.ProductName.fromString('ノート'), app.get(typeorm_1.EntityManager));
            expect(resulrts).toHaveLength(1);
            expect(resulrts[0].getName().getValue()).toBe('ノート');
            expect(resulrts[0].getPrice().getValue()).toBe(500);
            expect(resulrts[0].getCategory().getId().getValue())
                .toBe('b1524011-b6af-417e-8bf2-f449dd58b5c0');
        });
    });
});

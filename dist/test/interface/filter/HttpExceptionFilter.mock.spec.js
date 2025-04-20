"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const DomainException_1 = require("../../../src/application/domain/exception/DomainException");
const HttpExceptionFilter_1 = require("../../../src/interface/filter/HttpExceptionFilter");
/**
 * HttpExceptionFilterの単体テスト
 * - ArgumentsHostをモック化し、RESTフィルタとしての振る舞いを検証
 * [テスト実行コマンド]
 * npx jest test/interface/filter/HttpExceptionFilter.mock.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-16
 * @version 1.0.0
 */
describe('HttpExceptionFilterのテスト', () => {
    let filter; // テスト対象のフィルタ
    let mockResponse; // モック化されたレスポンスオブジェクト
    let mockRequest; // モック化されたリクエストオブジェクト
    let mockContext; // モック化されたNestJSの実行コンテキスト
    /**
     * 各テストケース前に共通のモックを準備
     */
    beforeEach(() => {
        filter = new HttpExceptionFilter_1.HttpExceptionFilter();
        // モックのリクエストオブジェクト（パスを固定）
        mockRequest = { url: '/test-endpoint' };
        // モックのレスポンスオブジェクト（status().json()の呼び出しを追跡）
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        // switchToHttp() が返すオブジェクトを定義
        const mockSwitchToHttp = () => ({
            getRequest: () => mockRequest,
            getResponse: () => mockResponse,
        });
        // ArgumentsHostのモックを作成
        mockContext = {
            switchToHttp: mockSwitchToHttp,
        };
    });
    /**
     * ドメイン層の例外（DomainException）を処理し、400が返ることを検証
     */
    it('DomainExceptionを処理してステータス400を返す', () => {
        const exception = new DomainException_1.DomainException('ドメインエラー発生');
        filter.catch(exception, mockContext);
        expect(mockResponse.status).toHaveBeenCalledWith(common_1.HttpStatus.BAD_REQUEST);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 400,
            message: 'ドメインエラー発生',
            path: '/test-endpoint',
            timestamp: expect.any(String),
        }));
    });
});

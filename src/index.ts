import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

/*
  build:
    npm run bundle

  example(expect 200):
    curl -X POST http://localhost:3000/compiler \
      -H "Content-Type: application/json" \
      -d '{"syntax": "@@ { C D E }"}'

  example(expect 200):
      curl -X POST http://localhost:3000/compiler?conduct=true \
      -H "Content-Type: application/json" \
      -d '{"syntax": "@@ { C D E }"}'
*/

// axentax-compilerパッケージのインポート
import { Conductor } from 'axentax-compiler/dist/conductor.js';

const app = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// リクエストボディ/クエリの型定義
interface CompilerRequest {
  syntax: string;
}

interface CompilerQuery {
  conduct?: string;
  syntax?: string | string[];
}

// レスポンスの型定義
interface CompilerResponse {
  response?: string;
  message?: string;
  compiledData?: any;
  error?: any;
}

// ミドルウェアの設定
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // ヘルスチェックエンドポイント
// app.get('/health', (req: Request, res: Response): void => {
//   res.status(200).json({ 
//     status: 'OK', 
//     message: 'Axentax Compiler Server is running' 
//   });
// });

// コンパイルエンドポイント
app.post('/compiler', (req: Request<{}, {}, CompilerRequest, CompilerQuery>, res: Response<CompilerResponse>): void => {
  try {
    const { syntax } = req.body;
    
    // syntaxが提供されていない場合のエラーハンドリング
    if (!syntax || typeof syntax !== 'string') {
      res.status(400).json({
        error: 'syntax parameter is required and must be a string'
      });
      return;
    }

    // axentax-compilerを使用してコンパイル実行
    // MIDIは作成しない（false）、スタイルは適用する（true）
    const compiled = Conductor.convertToObj(
      true,  // スタイル（奏法）を適用するか
      false, // MIDIを作成するか（falseでMIDIは作成しない）
      syntax, // シンタックス
      [],     // 許可するアノテーション文字列
      new Map(), // データキャッシュ用オブジェクト
      {}      // マップ用オブジェクト
    );

    // エラーがある場合は400エラーで返却
    if (compiled.error) {
      res.status(400).json({
        error: compiled.error
      });
      return;
    }

    // conduct=true が指定されている場合のみ200でJSON返却
    if (req.query.conduct === 'true') {
      res.status(200).json({
        message: 'Compilation successful',
        compiledData: compiled.response
      });
      return;
    }

    // conductが指定されていない場合は200で検証成功メッセージを返却
    res.status(200).json({
      response: 'success compile',
      message: 'The syntax has been verified to compile successfully.'
    });

  } catch (error) {
    console.error('Compilation error:', error);
    res.status(500).json({
      error: 'Internal server error during compilation'
    });
  }
});

// GETでもクエリでsyntaxを受け取れるように対応
app.get('/compiler', (req: Request<{}, {}, {}, CompilerQuery>, res: Response<CompilerResponse>): void => {
  try {
    const q = req.query.syntax;
    const syntax = Array.isArray(q) ? q.join(' ') : q;

    if (!syntax || typeof syntax !== 'string') {
      res.status(400).json({
        error: 'syntax query parameter is required and must be a string'
      });
      return;
    }

    const compiled = Conductor.convertToObj(
      true,
      false,
      syntax,
      [],
      new Map(),
      {}
    );

    if (compiled.error) {
      res.status(400).json({
        error: compiled.error
      });
      return;
    }

    if (req.query.conduct === 'true') {
      res.status(200).json({
        message: 'Compilation successful',
        compiledData: compiled.response
      });
      return;
    }

    // conductが指定されていない場合は200で検証成功メッセージを返却
    res.status(200).json({
      response: 'success compile',
      message: 'The syntax has been verified to compile successfully.'
    });

  } catch (error) {
    console.error('Compilation error:', error);
    res.status(500).json({
      error: 'Internal server error during compilation'
    });
  }
});

// 404ハンドラー
app.use('*', (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Endpoint not found'
  });
});

// エラーハンドラーミドルウェア
app.use((error: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error'
  });
});

// サーバー起動
app.listen(PORT, (): void => {
  console.log(`🚀 Axentax Compiler Server is running on port ${PORT}`);
  console.log(`📝 Compiler endpoint: POST http://localhost:${PORT}/compiler`);
  console.log(`🏥 Health check: GET http://localhost:${PORT}/health`);
});

export default app;

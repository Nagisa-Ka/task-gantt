# Gantt Chart App

Flaskで作成した、タスク管理とガントチャート表示ができるWebアプリ。 
タスクの登録・編集・削除と、スケジュールのガントチャート表示が一画面で行える。 
ガントバーをドラッグすることで、タスク期間を直感的に変更できる。

## デモ

![ガントチャートアプリのメイン画面](screenshots/main.png)

## 主な機能

- タスクの追加
- タスクの編集
- タスクの削除
- 入力内容のバリデーション
- フラッシュメッセージ表示
- 削除前の確認
- ガントチャート表示
- 月・日付ヘッダー表示
- 土日の色分け
- 今日の日付を示す縦線
- 横スクロール
- 今日の位置への自動スクロール
- ガントバーのドラッグ移動
- ドラッグ後の日付を非同期でDBへ保存

## 使用技術

- Python
- Flask
- Flask-SQLAlchemy
- SQLite
- HTML
- CSS
- JavaScript
- Jinja2

## メモ

初めて完成させたWebアプリケーション。 
仮想環境の構築方法や、flask・SQLiteを用いたCRUD機能の実装方法、READMEの書き方やpytestの扱い方などを学んだ。 
しかし、フラッシュメッセージやJavaScriptを用いた追加機能の実装などは、生成AIを利用しすぎて「自分の手を離れてしまった感じ」が否めない。

## セットアップ

### ソースコードから実行する場合

```powershell
git clone https://github.com/Nagisa-Ka/task-gantt.git
cd task-gantt
python -m venv .venv
.\.venv\Scripts\Activate
pip install -r requirements.txt
python app.py
```

起動後、既定のブラウザでアプリケーションが自動的に開く。

## テスト

pytestを使用して、主要機能の自動テストを実装。

- トップページの表示
- タスクの追加
- タスクの編集
- タスクの削除
- ドラッグ操作による日付更新

```bash
python -m pytest -v
```
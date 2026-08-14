# Task-Gantt App

　FlaskとSQLiteで作成した、Webアプリケーションです。<br/>  
　タスクの登録・編集・削除と、スケジュールのガントチャート表示が一画面で行えるようにしました。

## デモンストレーション

![ガントチャートアプリのメイン画面](screenshots/main.png)

## 主な機能

- タスクの追加・編集・削除
- フラッシュメッセージ表示
- ガントチャート表示
- ガントバーのドラッグ移動(ドラッグ後の日付をDBへ保存)
- ガントチャートは「今日」の位置への自動スクロール

## 使用技術

- Python
- Flask
- Flask-SQLAlchemy
- SQLite
- HTML
- CSS
- JavaScript
- Jinja2

## 学んだこと・今後の課題

### 開発を通して新しく学んだこと

- Pythonのための仮想環境の構築方法
- flask、Flask-SQLAlchemy、SQLiteを用いたCRUD機能の実装方法
- READMEの書き方
- pytestの扱い方

### 生成AIを利用しすぎてしまったこと

- フラッシュメッセージの実装
- JavaScriptを用いた追加機能の実装

### 今後の課題

　最も大きな課題は「実際に使いたいか」だと思います。<br/>
　現状、普通のスケジュール帳と差別化されていません。<br/>
　今後は「実際に誰かに使ってもらえるか」を想定したいです。

## セットアップ

Windowsにおいて、以下の手順でアプリケーションをローカル環境で実行できます。

1. GitHubからリポジトリをローカル環境にコピーします。

```bash
git clone https://github.com/Nagisa-Ka/task-gantt.git
```

2. プロジェクトフォルダに移動します。

```bash
cd task-gantt
```

3. 仮想環境を作成・有効化します。

```bash
python -m venv .venv
.venv\Scripts\Activate
```

5. requirements.txt に記載されているライブラリをインストールします。

```bash
pip install -r requirements.txt
```

6. アプリケーションを起動します。

```bash
python app.py
```

起動後、既定のブラウザでアプリケーションが自動的に開きます。

## テスト方法

pytestを使用して、以下の主要機能の自動テストを実装しました。

- トップページの表示
- タスクの追加
- タスクの編集
- タスクの削除
- ドラッグ操作による日付更新

```bash
python -m pytest -v
```
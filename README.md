### FileSystem
オンライン学習サイトrecursionにおけるコースproject6の課題2

## Project概要
ブラウザで動かすCLI版の仮想ファイルシステムです。
CS上級で学習した木構造や連結リストなどのデータ構造を利用して、ファイルシステムを作りました。

使用可能なコマンドは、
touch、mkdir、ls、cd、pwd、print、setContent、rm、move、copy、help

特徴として
・上矢印と下矢印を使った、以前の CLI 入力を参照できる「履歴」機能
・絶対パス、相対パスに対応したmove、copyコマンド
・lsのオプション(-r, -a)　ただ-raや-arには対応していません　
・rm を使用した場合に are you sure? yes/no という確認メッセージが出力される　


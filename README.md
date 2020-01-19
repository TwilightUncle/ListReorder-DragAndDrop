# ListReorder-DragAndDrop
## Overview
ListReorder-DragAndDrop is a list sorting function that can be operated by drag and drop with JavaScript.
## Demo
![demo](./demo.gif)
## Constructor arguments
|Property|type|default|Required|Details|
|:---|:---|:---|:---|:---|
|target|string|None|true|Specify the class name of the list to which you want to apply the sorting function.|
|direction|string|'vertical'|false|Specifies whether the list is arranged vertically or horizontally. Default is vertical, 'horizontal' specifies horizontal.|
|margin|number|8|false|The space between list elements, specified in pixels.|
|callbackMouseMove|()=>void|()=>{}|false|Pass the process you want to fire when dragging the list element as a callback function.|
|callbackMouseUp|()=>void|()=>{}|false|Pass the process you want to fire when you drop the list element as a callback function.|
|callbackReOrder|(element:Element, index:number) => void|()=>{}|false|Fired when the position of the element is determined. You can receive the list element being processed and the current order of the elements as arguments.|
## The object returned by the constructor
Properties are all functions.
|Property|Details|
|:---|:---|
|setFuncMouseMove|Same as optional 'callbackMouseMove'|
|setFuncMouseUp|Same as optional 'callbackMouseUp'|
|setFuncReOrder|Same as optional 'callbackReOrder'|
|elemInit|Specify the newly added list element and give the sorting function.|
|removeElem|Removes the sorting function from the specified element and makes it invisible.|
|setOptions|You can change the options after running the constructor.|
|count|Returns the number of elements in the target list that can be sorted.|
___
## 日本語
### 概要
練習がてらリスト要素の並べ替え機能をJavaScriptで作りました。
drag and dropで操作できます。
使い方はindex.htmlを参照願います。
### コンストラクタの引数について
下記テーブル内容のオブジェクトを渡します。
|プロパティ|型|デフォルト値|詳細|
|:---|:---|:---|:---|
|target|string|なし|必須項目です。並び替え機能を適用したいリストのクラス名を指定します。|
|direction|string|'vertical'|リストを縦方向に並べるか横方向に並べます。デフォルトは縦方向、'horizontal'を指定すると横方向に並べます|
|margin|number|8|ピクセル単位で指定する、リスト要素間の余白です。"position:absolute"の上で内部で位置を算出し指定しているため、並び位置の指定はcssではなく、こちらで指定してください|
|callbackMouseMove|()=>void|()=>{}|リスト要素をドラッグしている時に発火させたい処理をコールバック関数として渡します|
|callbackMouseUp|()=>void|()=>{}|リスト要素をドロップした時に発火させたい処理をコールバック関数として渡します|
|callbackReOrder|(element:Element, index:number) => void|()=>{}|要素の位置を決定するタイミングで発火します。処理中のリスト要素と、その要素の現在の並び順を引数として受け取ることができます。|
### コンストラクタが返すオブジェクトについて
下記テーブル内容のオブジェクトを返します。
プロパティは全て関数です。<br>
なお、作成した機能において要素の作成および削除は行いません。removeElemは要素を不可視にするだけ、elemInitは並び替えできるようにする初期化だけです。
|プロパティ|機能|
|:---|:---|
|setFuncMouseMove|オプションのcallbackMouseMoveと同様です|
|setFuncMouseUp|オプションのcallbackMouseUpと同様です|
|setFuncReOrder|オプションのcallbackReOrderと同様です|
|elemInit|新たに追加したリスト要素を指定し、並び替え機能を付与します。|
|removeElem|指定した要素から並び替えの機能を外し、不可視状態にします。|
|setOptions|コンストラクタ実行後にオプションを変更することができます。targetプロパティ以外について、コンストラクタと同様にオブジェクトを渡します。|
|count|並び替えできる対象リストの要素数を返します|
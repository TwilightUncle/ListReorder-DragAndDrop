


/**
 * @typedef {object} ReorderOptions
 * @prop {string} target 並び替え機能を付与するul等のクラス名
 * @prop {string} direction 'horizontal': 水平方向, 'vertical': 鉛直方向
 * @prop {number} margin 位置はcssではなくReorderListDragAndDropが引き受ける想定。要素間の間隔指定
 * @prop {()=>void} callbackMouseMove 要素移動時のイベントに差し込む処理
 * @prop {()=>void} callbackMouseUp マウスを離した時に差し込む処理
 * @prop {(element:Element, index:number) => void} callbackReOrder 要素の位置の並び替え時に差し込む処理
 */

/**
 * 
 * @param {ReorderOptions} options 
 * @constructor
 */
function ReorderListDragAndDrop(options) {

    /**
     * mousemove時に差し込みたい処理
     */
    let funcMouseMove   = ()=>{};

    /**
     * mouseup時に差し込みたい処理
     */
    let funcMouseUp     = ()=>{};

    /**
     * 並び替えのタイミングで差し込みたい処理
     * @param {Element} element
     * @param {number} index
     */
    let funcReOrder     = (element, index)=>{};

    // 並び替え機能を付与するul等のクラス名
    let target          = '';

    // 整列する方向を保持
    let direction       = 'vertical';

    // プロパティを動的に扱うための文字列
    let offset          = 'offsetTop';

    // プロパティを動的に扱うための文字列
    let offset2         = 'offsetLeft';
    
    // プロパティを動的に扱うための文字列
    let style           = 'top';
    
    // プロパティを動的に扱うための文字列
    let style2          = 'left';
    
    // プロパティを動的に扱うための文字列
    let get_size        = 'offsetHeight';
    
    // 位置制御のため、position: abusoluteを付与する
    let margin          = 8;

    // ul等
    let parent_elem     = null;

    // リストの中身
    let list_elements   = [];
    
    // dragしている要素
    let drag_element    = null;
    
    // 要素がクリックされた位置
    let click_x         = 0;
    
    // 要素がクリックされた位置
    let click_y         = 0;

    // クリックされた時点での要素の位置
    let elem_position   = {
        offsetTop       : 0,
        offsetLeft      : 0
    };
    
    // そろえ位置
    let position_line   = 0;
    
    // 先頭位置
    let position_head   = 0;



    /* init -------------------------------------------------------- */

    target = options.target;
    setOptions(options);

    // DOM構造の構築完了後に実行
    window.addEventListener('DOMContentLoaded', function () {
        let list_parents = document.getElementsByClassName(target);
        parent_elem                 = list_parents[0];
        parent_elem.style.display   = 'block';
        let elems                   = parent_elem.children;

        // 個々のリスト要素毎
        for(var i = 0; i < elems.length; i++) {
            elemInit(elems[i]);
        }
        itemsInit();
    });


    /* func ---------------------------------------------------------- */


    /**
     * optionsをセット
     * 適用対象クラスの変更は不可
     * @param {ReorderOptions} options
     */
    function setOptions(options) {
        if (typeof options !== 'object') return;

        if (options.direction === 'horizontal' || options.direction === 'vertical' || options.direction === false) {
            direction = options.direction;
            
            switch (direction) {
                case false:
                    direction   = 'vertical';
                    break;
                case 'vertical':
                    offset      = 'offsetTop';
                    offset2     = 'offsetLeft';
                    style       = 'top';
                    style2      = 'left';
                    get_size    = 'offsetHeight';
                    break;
                case 'horizontal':
                    offset      = 'offsetLeft';
                    offset2     = 'offsetTop';
                    style       = 'left';
                    style2      = 'top';
                    get_size    = 'offsetWidth';
                    break;
            }
        }
                
        if (typeof options.margin === 'number' && options.margin > 0) {
            margin = options.margin;
        }

        setFuncMouseMove(   options.callbackMouseMove);
        setFuncMouseUp(     options.callbackMouseUp);
        setFuncReOrder(     options.callbackReOrder);
    }



    /**
     * 各リスト要素に対する初期化
     * @param {Element} element
     */
    function elemInit(element) {
        element.style.position = 'absolute';
        element.addEventListener('mousedown'    , mouseDown);
        element.addEventListener('touchstart'   , mouseDown);

        // 登録した要素を一覧として保存します
        list_elements.push(element);
    }



    /**
     * リスト全体に対する初期化
     */
    function itemsInit() {
        // そろえ位置を取得する要素
        let element   = (list_elements[0]) ? list_elements[0] : parent_elem;
        position_head = element[offset];
        position_line = element[offset2];
        if (list_elements.length > 0) {
            reOrderForMoveItems();
        }
    }



    /**
     * 指定した要素を管理対象から除外します
     * @param {Element} element
     */
    function removeElem(element) {
        // 配列からの除外
        for(var i = 0; i < list_elements.length; i++) {
            if (list_elements[i] === element) {
                list_elements.splice(i, 1);
                break;
            }
        }
        // 要素本体の削除は考えない
        element.style.display = 'none';
        reOrderForMoveItems();
    }



    /**
     * マウスが押されたときに発火するイベント
     * @param {Event} e
     */
    function mouseDown(e) {
        
        // dragしている要素を取得
        drag_element = this;
        if(e.type === "mousedown") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        // 要素がクリックされた座標を保持
        click_x                 = event.pageX - drag_element.offsetLeft;
        click_y                 = event.pageY - drag_element.offsetTop;
        elem_position[offset]   = drag_element[offset];

        document.body.addEventListener("mousemove", mouseMove, false);
        document.body.addEventListener("touchmove", mouseMove, false);
    }



    /**
     * ドラッグ時のイベントで発火します。
     * マウスが動いた位置に要素を動かします
     * @param {Event} e
     */
    function mouseMove(e) {

        let event = null;
        if(e.type === "mousemove") {
            event = e;
        } else {
            event = e.changedTouches[0];
        }

        //デフォルト動作を抑制
        e.preventDefault();

        //マウスの場所に要素を動かす
        drag_element.style.top     = event.pageY - click_y + "px";
        drag_element.style.left    = event.pageX - click_x + "px";

        exchangeElement();

        // 任意処理挿入
        funcMouseMove();

        drag_element.addEventListener("mouseup", mouseUp, false);
        document.body.addEventListener("mouseleave", mouseUp, false);
        drag_element.addEventListener("touchend", mouseUp, false);
        document.body.addEventListener("touchleave", mouseUp, false);
    }



    /**
     * ドラッグ後、マウスを離した時の処理です
     */
    function mouseUp() {

        // イベントを解除します
        document.body.removeEventListener('mousemove', mouseMove);
        document.body.removeEventListener('touchmove', mouseMove);
        drag_element.removeEventListener('mouseup', mouseUp);
        document.body.removeEventListener('mouseleave', mouseUp);
        drag_element.removeEventListener('touchend', mouseUp);
        document.body.removeEventListener('touchleave', mouseUp);

        exchangeElement();
        // 任意処理挿入
        funcMouseUp();
        
        // 操作できないように変数を外す
        drag_element = null;
        
        // 実際の表示への反映処理
        reOrderForMoveItems();
    }



    /**
     * mousemove用のコールバックセット。
     * @param {()=>void} callback コールバック関数
     */
    function setFuncMouseMove(callback = null) {
        if (typeof callback == 'function') {
            funcMouseMove = callback;
        }
    }



    /**
     * mouseup用のコールバックセット
     * @param {()=>void} callback コールバック関数
     */
    function setFuncMouseUp(callback = null) {
        if (typeof callback == 'function') {
            funcMouseUp = callback;
        } 
    }
    


    /**
     * reOrderForMoveItems関数内のループ毎に呼び出される
     * @param {(element:Element, index:number) => void} callback コールバック関数
     */
    function setFuncReOrder(callback = null) {
        if (typeof callback == 'function') {
            funcReOrder = callback;
        }
    }



    /**
     * マウスを離したときの要素の並び処理です。
     * directionの値によって挙動が変わります
     */
    function exchangeElement() { 

        // 入れ替える対象の要素番号保存用
        let replace_index = 0;

        // 入れ替えたい要素番号を取得
        if (elem_position[offset] < drag_element[offset]) {
            // リストの後ろの方向へドラッグしたとき
            for(var i = list_elements.length - 1; i >= 0; i--) {
                if (list_elements[i][offset] <= drag_element[offset]) {
                    replace_index = i;
                    break;
                }
            }
        }
        else if (elem_position[offset] > drag_element[offset]) {
            // リストの前の方向へドラッグしたとき
            for(var i = 0; i < list_elements.length; i++) {
                if (list_elements[i][offset] >= drag_element[offset]) {
                    replace_index = i;
                    break;
                }
            }
        }
        else return;    // replace_index = 0の初期化により変な挙動するときがあるため
        // 余計にreOrderForMoveItemsを発動させないように
        if (replace_index === drag_element.array_index) return;    

        // 配列の２要素を入れ替えます
        replace(list_elements, replace_index, drag_element.array_index);
        reOrderForMoveItems();
        // ドラッグの移動方向特定のため保持
        elem_position[offset] = drag_element[offset];              
    }


    /**
     * 配列の要素を交換します
     * @param {Array} a 操作したい配列
     * @param {number} index1 入れ替えたい要素番号
     * @param {number} index2 入れ替えたい要素番号
     * @return true: 完了, false: 失敗
     */
    function replace(a, index1, index2) {
        if (Array.isArray(a) && (typeof index1 === 'number' || typeof index1 === 'string') && (typeof index2 === 'number' || typeof index2 === 'string')) {
            a[index1] = [a[index2], a[index2] = a[index1]][0];
            return true;
        }
        return false;
    }



    /**
     * 並び替え処理の核
     */
    function reOrderForMoveItems() {
        // 要素の左か上の位置
        let base_top        = position_head;
        let parent = {
            height          : 0,
            width           : 0
        };
        let direct1         = (direction === 'vertical') ? 'height'         : 'width';
        let direct2         = (direction !== 'vertical') ? 'height'         : 'width';
        let get_size2       = (direction !== 'vertical') ? 'offsetHeight'   : 'offsetWidth';

        for(var i = 0; i < list_elements.length; i++) {
            // array_indexは動かしている要素を特定するために利用
            list_elements[i].array_index = i;                 
            // 要素の属性にも番号を記録             
            list_elements[i].setAttribute('order', String(i));

            // ドラッグ中の要素は位置の調整を行わない
            // 各リスト要素のを指定
            if (list_elements[i] !== drag_element) {
                list_elements[i].style[style]      = base_top + 'px';
                list_elements[i].style[style2]     = position_line + 'px';
            }

            // 子要素の幅に合わせて親要素の幅が決まる
            if (parent[direct2] < list_elements[i][get_size2]) {
                parent[direct2] = list_elements[i][get_size2];
            }

            // 蓄積する位置の指定
            parent[direct1] += list_elements[i][get_size] + margin;
            base_top = position_head + parent[direct1];           

            // 任意処理挿入
            funcReOrder(list_elements[i], i);
        }

        parent_elem.style.width     = parent.width  + 'px';
        parent_elem.style.height    = parent.height + 'px';
    }



    /**
     * 管理している要素の数をカウント
     */
    function count() {
        return list_elements.length;
    }



    // 適用後の操作用オブジェクト
    return {
        setFuncMouseMove:   setFuncMouseMove,
        setFuncMouseUp:     setFuncMouseUp,
        setFuncReOrder:     setFuncReOrder,

        elemInit:           function(element) {
            elemInit(element);
            itemsInit();
        },

        removeElem:         removeElem,
        setOptions:         setOptions,
        count:              count
    };
}
// APIキーの設定とSDK初期化
// API key.
var applicationKey = "4d9d122337ca0de373857821e96b10ad1952a9133ffea44e66bcee94c282fccf";
var clientKey = "00902e576a265322a217a2b2706056ca26048d4bd4f9096744fdd7e565d0f377";
// SDK initialization.
var ncmb = new NCMB(applicationKey, clientKey);
var reader = new FileReader();
var resultName = []; // 名前を保持する
var resultObject = []; // 商品のID
var suji = [];
var g_imgs = []; // 商品の画像
var t_imgs = []; // 商品の画像
var cnt = 0;
var cntSwitch = 1;
var reloadSwitch = 0;
var image_id;

// 処理を一時停止する
const wait = (sec) => { // タイマ
    return new Promise((resolve, reject) => {
        setTimeout(resolve, sec * 1000);
        //setTimeout(() => {reject(new Error("エラー！"))}, sec*1000);
    });
};

// 画像を配置する
function setImage(i, flg) {
    reader.onload = function (e) {
        var dataUrl = reader.result;
        if (flg == 0) {
            console.log("flg_g");
            image_id = "g_image" + (i + 1);
        } else if (flg == 1) {
            console.log("flg_t");
            image_id = "t_image" + (i + 1);
        }
        console.log(image_id);
        document.getElementById(image_id).src = dataUrl;
    }
}

// 画像を読み込む
function downloadImage(fileName) {
    // ダウンロード（データ形式をblobを指定）
    ncmb.File.download(fileName, "blob")
        .then(function (blob) {
            // ファイルリーダーにデータを渡す
            reader.readAsDataURL(blob);
        })
        .catch(function (err) {
            console.error(err);
        })
}

// サムネイル画像を上から順に表示する
async function setImg(flg) {
    if (flg == 0) {
        // 一覧画面(リロード)
        for (var j = g_imgs.length - g_cntSwitch - (cnt * 4); j > g_imgs.length - 4 * (cnt + 1); j--) {
            if (j <= -1) {
                break;
            }
            console.log("ダウンロードする画像の位置 " + j);
            downloadImage(g_imgs[j]);
            await wait(0.1);
            setImage(j, flg);
            await wait(1.5);
        }
    } else if (flg == 1) {
        for (var j = t_imgs.length - t_cntSwitch - (cnt * 4); j > t_imgs.length - 4 * (cnt + 1); j--) {
            if (j <= -1) {
                break;
            }
            downloadImage(t_imgs[j]);
            await wait(0.1);
            setImage(j, flg);
            await wait(1.5);
        }
    }
}

// 商品のリストを追加で読み込む
function giveaddload() {
    count();
    give_lists();
}
// 商品のリストを追加で読み込む
function tradeaddload() {
    count();
    trade_lists();
}

function count() {
    cnt = cnt + 1;
    cntSwitch = 0;
}

// 画像を再読み込みする
function reload() {
    reloadSwitch = 1;
    setImg();
    reloadSwitch = 0;
}


// 取引一覧
// 個別の定義が必要な変数等
var g_cnt = 0;
var g_cntSwitch = 1;
var t_cnt = 0;
var t_cntSwitch = 1;

// 一覧のロード
async function deallists_load() {
    console.log("give");
    deal_give_lists();
    await wait(6);
    console.log("trade");
    deal_trade_lists();
}

//カレントユーザーのID取得
function getCurrentUserId() {
    // カレントユーザー情報の取得
    var currentUser = ncmb.User.getCurrentUser();
    console.log("currentUser:" + currentUser);
    if (currentUser != null) {
        console.log("ユーザー: " + currentUser.get("userName"));
        current_user_id = currentUser.get("objectId");
        return current_user_id;
    } else {
        console.log("未ログインまたは取得に失敗");
        return null;
    }
}

// 商品のリストを展開する
async function deal_give_lists() {
    var Give = ncmb.DataStore("give");
    var myId = getCurrentUserId();
    var subquery1 = Give.equalTo("give_user_id", myId);
    var subquery2 = Give.equalTo("take_user_id", myId);
    Give.equalTo("deal_status", "取引成立")
        .or([subquery1, subquery2])
        .fetchAll()
        .then(function (results) {
            for (var i = results.length - g_cntSwitch - (g_cnt * 4); i > results.length - 4 * (g_cnt + 1); i--) {
                var object = results[i];
                var image_id = "g_image" + (i + 1);
                var objectId = object.objectId;
                // 商品の箱を追加していく
                var itemlist_element = document.getElementById('itemlist_give');
                itemlist_element.insertAdjacentHTML("beforebegin", '<div class="container" id="item_box"> <button class="lists_btn" onclick="location.href=\'dealDetail.html?' + objectId + '\'"><div class="container_parent"> <div class="container_left"> <img src="img/loading.png" id="' + image_id + '" width="200" height="200"/> </div> <div class="container_center"> <a id="item_name">' + object.item_name + '</a> </div> <div class="container_right"> <i class="fas fa-angle-right size"></i></div></div></button></div>');
                g_imgs[i] = object.item_image;
            }
        })
        .catch(function (err) {
            console.log(err);
        });
    cnt = g_cnt;
    var flg = 0;
    console.log("setImg(g)");
    await wait(2);
    setImg(flg);
}

// 商品名を全件取得(成立待ちのみ)
async function deal_give_search() {
    var c_cnt = document.getElementsByClassName("container").length;
    // 既存の要素を削除
    for (var c = 0; c < c_cnt; c++) {
        document.getElementById("item_box").remove();
    }
    suji.splice(0.1);
    // 検索
    var Give = ncmb.DataStore("give");
    Give.equalTo("deal_status", "成立待ち")
        .fetchAll()
        .then(function (results) {
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                var objectId = object.objectId;
                // 配列に格納
                resultName[i] = object.item_name;
                resultObject[i] = object.objectId;
                g_imgs[i] = object.item_image;
            }
        })
        .catch(function (err) {
            console.log(err);
        });
    // 関数を呼ぶ
    cnt = g_cnt;
    await wait(1);
    pickup();
}

// 商品のリストを展開する
async function deal_trade_lists() {
    var Trade = ncmb.DataStore("trade");
    var myId = getCurrentUserId();
    var subquery1 = Trade.equalTo("trade_user_id", myId);
    var subquery2 = Trade.equalTo("take_user_id", myId);
    Trade.equalTo("deal_status", "取引成立")
        .or([subquery1, subquery2])
        .fetchAll()
        .then(function (results) {
            for (var i = results.length - t_cntSwitch - (t_cnt * 4); i > results.length - 4 * (t_cnt + 1); i--) {
                var object = results[i];
                var image_id = "t_image" + (i + 1);
                var objectId = object.objectId;
                // 商品の箱を追加していく
                var itemlist_element = document.getElementById('itemlist_trade');
                itemlist_element.insertAdjacentHTML("beforebegin", '<div class="container" id="item_box"> <button class="lists_btn" onclick="location.href=\'dealDetail.html?' + objectId + '\'"><div class="container_parent"> <div class="container_left"> <img src="img/loading.png" id="' + image_id + '" width="200" height="200"/> </div> <div class="container_center"> <a id="item_name">' + object.item_name + '</a> </div> <div class="container_right"> <i class="fas fa-angle-right size"></i></div></div></button></div>');
                t_imgs[i] = object.item_image;
            }
        })
        .catch(function (err) {
            console.log(err);
        });
    cnt = t_cnt;
    var flg = 1;
    console.log("setImg(t)");
    await wait(1);
    setImg(flg);
}

// 商品名を全件取得(成立待ちのみ)
async function deal_trade_search() {
    var c_cnt = document.getElementsByClassName("container").length;
    // 既存の要素を削除
    for (var c = 0; c < c_cnt; c++) {
        document.getElementById("item_box").remove();
    }
    suji.splice(0.1);
    // 検索
    var Trade = ncmb.DataStore("trade");
    Trade.equalTo("deal_status", "成立待ち")
        .fetchAll()
        .then(function (results) {
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                var objectId = object.objectId;
                // 配列に格納
                resultName[i] = object.item_name;
                resultObject[i] = object.objectId;
                t_imgs[i] = object.item_image;
            }
        })
        .catch(function (err) {
            console.log(err);
        });
    // 関数を呼ぶ
    cnt = t_cnt;
    await wait(1);
    pickup();
}

// 一覧を追加で読み込み
// 商品のリストを追加で読み込む
function g_addload() {
    g_count();
    console.log("add(g)");
    deal_give_lists();
}
// 商品のリストを追加で読み込む
function t_addload() {
    t_count();
    console.log("add(t)");
    deal_trade_lists();
}

function g_count() {
    g_cnt = g_cnt + 1;
    g_cntSwitch = 0;
}

function t_count() {
    t_cnt = t_cnt + 1;
    t_cntSwitch = 0;
}

// リンク先の画面に遷移する
function g_link(objectId) {
    localStorage.setItem("dealflg", "give");
}

function t_link(objectId) {
    localStorage.setItem("dealflg", "trade");
}



// 取引履歴

// 一覧のロード
async function historys_load() {
    console.log("give");
    history_give_lists();
    await wait(6);
    console.log("trade");
    history_trade_lists();
}

// 商品のリストを展開する
async function history_give_lists() {
    var Give = ncmb.DataStore("give");
    var myId = getCurrentUserId();
    var subquery1 = Give.equalTo("give_user_id", myId);
    var subquery2 = Give.equalTo("take_user_id", myId);
    Give.equalTo("deal_status", "取引完了")// 正式には取引完了。
        .or([subquery1, subquery2])
        .fetchAll()
        .then(function (results) {
            for (var i = results.length - g_cntSwitch - (g_cnt * 4); i > results.length - 4 * (g_cnt + 1); i--) {
                var object = results[i];
                var image_id = "g_image" + (i + 1);
                var objectId = object.objectId;
                // 商品の箱を追加していく
                var itemlist_element = document.getElementById('itemlist_give');
                itemlist_element.insertAdjacentHTML("beforebegin", '<div class="container" id="item_box"> <button class="lists_btn" onclick="location.href=\'historyDetail.html?' + objectId + '\'"><div class="container_parent"> <div class="container_left"> <img src="img/loading.png" id="' + image_id + '" width="200" height="200"/> </div> <div class="container_center"> <a id="item_name">' + object.item_name + '</a> </div> <div class="container_right"> <i class="fas fa-angle-right size"></i></div></div></button></div>');
                g_imgs[i] = object.item_image;
            }
        })
        .catch(function (err) {
            console.log(err);
        });
    cnt = g_cnt;
    var flg = 0;
    console.log("setImg(g)");
    await wait(2);
    setImg(flg);
}

// 商品名を全件取得(成立待ちのみ)
async function history_give_search() {
    var c_cnt = document.getElementsByClassName("container").length;
    // 既存の要素を削除
    for (var c = 0; c < c_cnt; c++) {
        document.getElementById("item_box").remove();
    }
    suji.splice(0.1);
    // 検索
    var Give = ncmb.DataStore("give");
    Give.equalTo("deal_status", "成立待ち")
        .fetchAll()
        .then(function (results) {
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                var objectId = object.objectId;
                // 配列に格納
                resultName[i] = object.item_name;
                resultObject[i] = object.objectId;
                g_imgs[i] = object.item_image;
            }
        })
        .catch(function (err) {
            console.log(err);
        });
    // 関数を呼ぶ
    cnt = g_cnt;
    await wait(1);
    pickup();
}

// 商品のリストを展開する
async function history_trade_lists() {
    var Trade = ncmb.DataStore("trade");
    var myId = getCurrentUserId();
    var subquery1 = Trade.equalTo("trade_user_id", myId);
    var subquery2 = Trade.equalTo("take_user_id", myId);
    Trade.equalTo("deal_status", "取引完了")// 正式には取引完了。
        .or([subquery1, subquery2])
        .fetchAll()
        .then(function (results) {
            for (var i = results.length - t_cntSwitch - (t_cnt * 4); i > results.length - 4 * (t_cnt + 1); i--) {
                var object = results[i];
                var image_id = "t_image" + (i + 1);
                var objectId = object.objectId;
                // 商品の箱を追加していく
                var itemlist_element = document.getElementById('itemlist_trade');
                itemlist_element.insertAdjacentHTML("beforebegin", '<div class="container" id="item_box"> <button class="lists_btn" onclick="location.href=\'historyDetail.html?' + objectId + '\'"><div class="container_parent"> <div class="container_left"> <img src="img/loading.png" id="' + image_id + '" width="200" height="200"/> </div> <div class="container_center"> <a id="item_name">' + object.item_name + '</a> </div> <div class="container_right"> <i class="fas fa-angle-right size"></i></div></div></button></div>');
                t_imgs[i] = object.item_image;
            }
        })
        .catch(function (err) {
            console.log(err);
        });
    cnt = t_cnt;
    var flg = 1;
    console.log("setImg(t)");
    await wait(1);
    setImg(flg);
}

// 商品名を全件取得(成立待ちのみ)
async function history_trade_search() {
    var c_cnt = document.getElementsByClassName("container").length;
    // 既存の要素を削除
    for (var c = 0; c < c_cnt; c++) {
        document.getElementById("item_box").remove();
    }
    suji.splice(0.1);
    // 検索
    var Trade = ncmb.DataStore("trade");
    Trade.equalTo("deal_status", "成立待ち")
        .fetchAll()
        .then(function (results) {
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                var objectId = object.objectId;
                // 配列に格納
                resultName[i] = object.item_name;
                resultObject[i] = object.objectId;
                t_imgs[i] = object.item_image;
            }
        })
        .catch(function (err) {
            console.log(err);
        });
    // 関数を呼ぶ
    cnt = t_cnt;
    await wait(1);
    pickup();
}
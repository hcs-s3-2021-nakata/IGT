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
var imgs = []; // 商品の画像
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
function setImage(i) {
  reader.onload = function (e) {
    var dataUrl = reader.result;
    image_id = "image" + (i+1);
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
async function setImg() {
  // 一覧画面(リロード)
  if (reloadSwitch == 1) {
    for (var j = imgs.length; 0 <= j; j--) {
      downloadImage(imgs[j]);
      setImage(j);
      await wait(1.5);
    }
    // 検索
  } else if (reloadSwitch == 2) {
    for (var j = suji.length; 0 < j; j--) {
      var s = suji[j];
      downloadImage(imgs[s]);
      setImage(j - 2);
      await wait(1.5);
    }
    // 一覧画面(もっと読み込む)
  } else {
    for (var j = imgs.length - cntSwitch - (cnt * 6); j > imgs.length - 6 * (cnt + 1); j--) {
      if (j <= -1) {
        break;
      }
      downloadImage(imgs[j]);
      console.log(j);
      await wait(0.1);
      setImage(j);
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

// 検索結果の表示(正規表現)
async function pickup() {
  var keyword = document.getElementById("keyword").value;
  var j = 1;
  for (var i = 0; i < resultName.length; i++) {
    var image_id = "image";
    var item_name = resultName[i];
    var objectId = resultObject[i];
    if (item_name.indexOf(keyword) != -1) {

      //nameにkeywordを含む場合の処理
      image_id = "image" + (j);
      j = j + 1;
      var itemlist_element = document.getElementById('itemlist');
      itemlist_element.insertAdjacentHTML("afterend", '<div class="container" id="item_box"> <div class="container_parent"> <div class="container_left"> <img src="" id="' + image_id + '" width="200" height="200"/> </div> <div class="container_center"> <a id="item_name">' + item_name + '</a> </div> <div class="container_right"> <a href="giveDetail.html?' + objectId + '"> <i class="fas fa-angle-right size"></i></a></div></div></div>');
      suji[j] = i;

    }
  }
  await wait(1);
  reloadSwitch = 2;
  setImg();
  reloadSwitch = 0;
}

// 譲渡一覧側
// 商品のリストを展開する
async function give_lists() {
  var Give = ncmb.DataStore("give");
  Give.equalTo("deal_status", "成立待ち")
    .fetchAll()
    .then(function (results) {
      for (var i = results.length - cntSwitch - (cnt * 6); i > results.length - 6 * (cnt + 1); i--) {
        var object = results[i];
        var image_id = "image" + (i + 1);
        var objectId = object.objectId;
        // 商品の箱を追加していく
        var itemlist_element = document.getElementById('itemlist');
        itemlist_element.insertAdjacentHTML("beforebegin", '<div class="container" id="item_box"> <div class="container_parent"> <div class="container_left"> <img src="" id="' + image_id + '" width="200" height="200"/> </div> <div class="container_center"> <a id="item_name">' + object.item_name + '</a> </div> <div class="container_right"> <a href="giveDetail.html?' + objectId + '"> <i class="fas fa-angle-right size"></i></a></div></div></div>');
        imgs[i] = object.item_image;
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  await wait(2);
  setImg();
}

// 商品名を全件取得(成立待ちのみ)
async function give_search() {
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
        imgs[i] = object.item_image;
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  // 関数を呼ぶ
  await wait(1);
  pickup();
}

// 交換品一覧

// 商品のリストを展開する
async function trade_lists() {
  var Trade = ncmb.DataStore("trade");
  Trade.equalTo("deal_status", "成立待ち")
    .fetchAll()
    .then(function (results) {
      for (var i = results.length - cntSwitch - (cnt * 6); i > results.length - 6 * (cnt + 1); i--) {
        var object = results[i];
        var image_id = "image" + (i + 1);
        var objectId = object.objectId;
        // 商品の箱を追加していく
        var itemlist_element = document.getElementById('itemlist');
        itemlist_element.insertAdjacentHTML("beforebegin", '<div class="container" id="item_box"> <div class="container_parent"> <div class="container_left"> <img src="" id="' + image_id + '" width="200" height="200"/> </div> <div class="container_center"> <a id="item_name">' + object.item_name + '</a> </div> <div class="container_right"> <a href="tradeDetail.html?' + objectId + '"> <i class="fas fa-angle-right size"></i></a></div></div></div>');
        imgs[i] = object.item_image;
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  await wait(2);
  setImg();
}

// 商品名を全件取得(成立待ちのみ)
async function trade_search() {
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
        imgs[i] = object.item_image;
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  // 関数を呼ぶ
  await wait(1);
  pickup();
}


// 取引一覧
// 個別の定義が必要な変数等
var g_cnt = 0;
var g_cntSwitch = 1;
var t_cnt = 0;
var t_cntSwitch = 1;

// 一覧のロード
async function deallists_load(){
  deal_give_lists();
  await wait(5);
  deal_trade_lists();
}

// 商品のリストを展開する
async function deal_give_lists() {
  var Give = ncmb.DataStore("give");
  Give.equalTo("deal_status", "成立待ち")
    .fetchAll()
    .then(function (results) {
      for (var i = results.length - cntSwitch - (cnt * 3); i > results.length - 4 * (g_cnt + 1); i--) {
        var object = results[i];
        var image_id = "image" + (i + 1);
        var objectId = object.objectId;
        // 商品の箱を追加していく
        var itemlist_element = document.getElementById('itemlist_give');
        itemlist_element.insertAdjacentHTML("beforebegin", '<div class="container" id="item_box"> <div class="container_parent"> <div class="container_left"> <img src="" id="' + image_id + '" width="200" height="200"/> </div> <div class="container_center"> <a id="item_name">' + object.item_name + '</a> </div> <div class="container_right"> <a href="dealDetail.html?' + objectId + '"> <i class="fas fa-angle-right size"></i></a></div></div></div>');
        imgs[i] = object.item_image;
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  await wait(2);
  setImg();
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
        imgs[i] = object.item_image;
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
  Trade.equalTo("deal_status", "成立待ち")// テスト用。正式には”取引成立”
    .fetchAll()
    .then(function (results) {
      for (var i = results.length - cntSwitch - (cnt * 3); i > results.length - 4 * (cnt + 1); i--) {
        var object = results[i];
        var image_id = "image" + (i + 1);
        var objectId = object.objectId;
        // 商品の箱を追加していく
        var itemlist_element = document.getElementById('itemlist_trade');
        itemlist_element.insertAdjacentHTML("beforebegin", '<div class="container" id="item_box"> <div class="container_parent"> <div class="container_left"> <img src="" id="' + image_id + '" width="200" height="200"/> </div> <div class="container_center"> <a id="item_name">' + object.item_name + '</a> </div> <div class="container_right"> <a href="tradeDetail.html?' + objectId + '"> <i class="fas fa-angle-right size"></i></a></div></div></div>');
        imgs[i] = object.item_image;
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  cnt = t_cnt;
  await wait(1);
  setImg();
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
        imgs[i] = object.item_image;
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  // 関数を呼ぶ
  await wait(1);
  pickup();
}

// 一覧を追加で読み込み


// 商品のリストを追加で読み込む
function g_addload() {
  g_count();
  deal_give_lists();
}
// 商品のリストを追加で読み込む
function t_addload() {
  t_count();
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
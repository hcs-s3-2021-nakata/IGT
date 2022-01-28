// APIキーの設定とSDK初期化
// API key.
var applicationKey = "4d9d122337ca0de373857821e96b10ad1952a9133ffea44e66bcee94c282fccf";
var clientKey = "00902e576a265322a217a2b2706056ca26048d4bd4f9096744fdd7e565d0f377";
// SDK initialization.
var ncmb = new NCMB(applicationKey, clientKey);
var reader = new FileReader();
// 必要なグローバル変数の定義
var current_user_id = getCurrentUserId();

// 処理を一時停止する
const wait = (sec) => { // タイマ
    return new Promise((resolve, reject) => {
        setTimeout(resolve, sec * 1000);
        //setTimeout(() => {reject(new Error("エラー！"))}, sec*1000);
    });
};

// 通知のリストを展開する
function messages() {
    console.log("function boot " + current_user_id);
    var Message = ncmb.DataStore("message");
    Message.equalTo("receive_user_id", current_user_id)
        .fetchAll()
        .then(async function (results) {
            for (var i = results.length; i > 0; i--) {
                console.log("get results");
                // 必要な変数の定義
                var object = results[i - 1];
                var objectId = object.objectId;
                var createDate = object.createDate;
                var message = object.message;
                var read_flag = object.read_flag;
                // 既読未読の分類を行う
                var readState = setReadState(read_flag);
                // 日付の書き換えを行う
                var new_createDate = dateRewrite(createDate);
                await wait(0.1);
                // 通知を表示する
                var messagelist_element = document.getElementById('messagelist');
                messagelist_element.insertAdjacentHTML("beforebegin", ' <li class="message"><div class="ef_img"><img class="message" src="img/message.png">' + new_createDate + ' ' + '<span id="readState">' + readState + '</span><br><div class="ef_div"><span>' + message + '</span><br><div class="kidoku"><button class="kidoku" value="'+objectId+'" onclick="kidoku(this.value)">既読にする</button><sapn>　</span><button class="kidoku" value="'+objectId+'" onclick="del(this.value)">通知を削除する</button></div></div></li> ');
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

//カレントユーザーのID取得
function getCurrentUserId() {
    // カレントユーザー情報の取得
    var currentUser = ncmb.User.getCurrentUser();
    console.log("currentUser:" + currentUser);
    if (currentUser != null) {
        console.log("ユーザー: " + currentUser.get("userName"));
        var c_u_id = currentUser.get("objectId");
        return c_u_id;
    } else {
        console.log("未ログインまたは取得に失敗");
        return null;
    }
}

// 日付の書き換え関数
function dateRewrite(createDate) {
    // DBから引き出したデータを日本時間に直す
    var c_date = new Date(createDate).toLocaleString({ timeZone: 'Asia/Tokyo' });
    // 余分な値を排除
    var day = c_date.substring(0, c_date.indexOf(" "))
    var time = new Date(createDate).toTimeString();
    time = time.substring(0, 5);
    console.log("日 " + day + "\n時 " + time);
    // 通知作成日が今日の場合分岐
    var date = new Date().toLocaleString({ timeZone: 'Asia/Tokyo' });
    date = date.substring(0, date.indexOf(" "));
    if (day == date) {
        day = "今日";
    }
    return day + " " + time;
}

// 通知が既読かどうか分類する関数
function setReadState(read_flag) {
    var readState = "";
    if (read_flag == 0) { // 未読であれば
        readState = "未読";
    }
    return readState;
}

// 通知を削除する関数
function del(objectId) {
    console.log("del boot");
    // データベースの改変
    var Message = ncmb.DataStore("message");
    Message.equalTo("objectId", objectId)
        .fetch()
        .then(async function (result) {
            result.delete();
            await wait(0.5);
            document.location.reload();
        })
        .catch(function (err) {
            console.log(err);
        });
}

// 通知を既読にする関数
function kidoku(objectId) {
    console.log("kidoku boot");
    // データベースの改変
    var Message = ncmb.DataStore("message");
    Message.equalTo("objectId", objectId)
        .fetch()
        .then(async function (result) {
            result.set('read_flag', 1);
            result.update();
            await wait(0.5);
            document.location.reload();
        })
        .catch(function (err) {
            console.log(err);
        });
}




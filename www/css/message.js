// APIキーの設定とSDK初期化
// API key.
var applicationKey = "4d9d122337ca0de373857821e96b10ad1952a9133ffea44e66bcee94c282fccf";
var clientKey = "00902e576a265322a217a2b2706056ca26048d4bd4f9096744fdd7e565d0f377";
// SDK initialization.
var ncmb = new NCMB(applicationKey, clientKey);
var reader = new FileReader();

// 商品のリストを展開する
async function messages() {
  var Message = ncmb.DataStore("message");
  Message.equalTo("receive_user_id", "current_user_id")
    .fetchAll()
    .then(function (results) {
      for (var i = results.length; i > 0; i--) {
        var object = results[i];
        var objectId = object.objectId;
        // 商品の箱を追加していく
        var messagelist_element = document.getElementById('itemlist');
        messagelist_element.insertAdjacentHTML("beforebegin", ' この辺に通知の箱を追加 ');
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}
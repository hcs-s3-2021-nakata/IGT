//ワインボタン
$(function () {
  $("#js-tab li").click(function () {
    $("#js-tab li").removeClass("active");
    $(this).addClass("active");
    var index = $(this).index();

    $(".tab-content").removeClass("active");
    $(".tab-content").eq(index).addClass("active");
  });
});


/* ユーザ新規登録の入力チェック */
function createNewUserCheck() {
  var createN = document.getElementById("cN").value;
  var createP = document.getElementById("cP").value;
  var createSN = document.getElementById("cSN").value;
  var createTOS = document.getElementById("wineTOS").checked;
  var createPrivacy = document.getElementById("winePrivacy").checked;
  //エラーメッセージ
  var checkFlag = true;
  searchStudentNumber(createSN).then(function (checkFlag) {
      console.log(createSN.length);

    var returnSnFlag = false;
    if (createSN === "") {
      document.getElementById('errMessageNum').innerHTML = "学籍番号は必須入力です";
      returnSnFlag = true;
    }else if(createSN.length != 8){
        document.getElementById('errMessageNum').innerHTML = "学籍番号は8桁で入力してください"
        returnSnFlag = true;
    } else if (!checkFlag) {
      document.getElementById('errMessageNum').innerHTML = "この学籍番号は既に使用されています";
      returnSnFlag = true;
    } else {
      console.log("入ってる");
      document.getElementById('errMessageNum').innerHTML = "";
      returnSnFlag = false;
    }

    var returnPFlag = false;
    if (createP === "") {
      document.getElementById('errMessagePass').innerHTML = "パスワードは必須入力です";
      returnPFlag = true;
    } else if(createP.length <= 3){
        document.getElementById('errMessagePass').innerHTML = "パスワードは4文字以上です";
        returnPFlag = true;
    } else {
      document.getElementById('errMessagePass').innerHTML = "";
      returnPFlag = false;
    }

    var returnNFlag = false;
    if (createN === "") {
      document.getElementById('errMessageName').innerHTML = "名前は必須入力です";
      returnNFlag = true;
    } else {
      document.getElementById('errMessageName').innerHTML = "";
      returnNFlag = false;
    }
    var returnTosFlag = false;
    if(createTOS){
        document.getElementById('errMessageTOS').innerHTML = "";
        returnTosFlag = false;
    } else {
        document.getElementById('errMessageTOS').innerHTML = "利用規約に同意してください";
        returnTosFlag = true;
    }

    var returnPrivacyFlag = false;
    if(createPrivacy){
        document.getElementById('errMessagePrivacy').innerHTML = "";
        returnPrivacyFlag = false;
    } else {
        document.getElementById('errMessagePrivacy').innerHTML = "プライバシーポリシーに同意してください";
        returnPrivacyFlag = true;
    }


    if (!returnSnFlag && !returnPFlag && !returnNFlag && !returnTosFlag && !returnPrivacyFlag) {
      //チェックが無ければユーザ新規登録
       createNewUser();
    }
  });
}



//新規ユーザ作成
function createNewUser() {
  console.log("*******ここから新規登録********");
  var createN = document.getElementById("cN").value;
  var createP = document.getElementById("cP").value;
  var createSN = document.getElementById("cSN").value;


  // ユーザークラスのインスタンスを生成
  var user = new ncmb.User();
  //ユーザ名/パスワードで新規ユーザー登録
  user.set("user_account_name", createN)
    .set("userName", createSN)
    .set("password", createP)
    .set("effectiveness", 0)
    .set("acl", (new ncmb.Acl()).setPublicWriteAccess(true).setPublicReadAccess(true))
    .signUpByAccount()
    .then(function (newUser) {
      //新規ユーザー登録成功
      console.log("新規ユーザー登録成功：" + JSON.stringify(newUser));
      const userAcl = new ncmb.Acl();
      userAcl.setPublicReadAccess(true)
        .setUserWriteAccess(newUser, true)
        .setUserReadAccess(newUser, true);
      return newUser.set("acl", userAcl).update();
    })
    .then(function (user) {
      // アクセスコントロール更新成功時の処理
      console.log("更新成功:" + JSON.stringify(user));
      return ncmb.User.login(user);
    })
    .then(function (user) {
      location.href = "./index.html";
    })
    .catch(function (error) {
      //新規ユーザー登録失敗時の処理
      console.log("新規ユーザー登録・更新失敗：" + JSON.stringify(error));
    });
}



function try_multh() {
  var num = document.getElementById("wineNum").value;
  var pass = document.getElementById("winePass").value;
  console.log("ナンバー：" + num);
  console.log("パスワード：" + pass);

  if (num === "") {
    console.log("空です！");
    document.getElementById('wineNumErr').innerHTML = "番号は未入力です";
  } else {
    document.getElementById('wineNumErr').innerHTML = "";
  }
  if (pass === "") {
    console.log("空です！");
    document.getElementById('winePassErr').innerHTML = "パスワードは未入力です";
  } else {
    document.getElementById('winePassErr').innerHTML = "";
  }


}

//学籍番号検索機能
function SearchNumber(loginStudentNumber) {
  //var loginStudentNumber = document.getElementById("searchSN").value;
  console.log("検索番号：" + loginStudentNumber);
  let lowNumber = 0;
  var searchFlag = true;
  ncmb.User.fetchAll()
    .then(users => {
      users.forEach(user => {
        console.log(user);
        //ここで登録されている学籍番号かチェック
        if (user.userName === loginStudentNumber) {
          console.log("あった！");
          console.log(user.user_account_name);
          lowNumber = lowNumber + 1;
          searchFlag = false;
        }
      })
      console.log("検索結果：" + lowNumber + "件");
      return searchFlag;
    }).catch(err => {
      console.log("変数データ取得エラー")
    });


}

/* 学籍番号検索のプロミス */
function searchStudentNumber(searchNumber) {
  return new Promise(function (resolve, reject) {
    console.log("検索番号：" + searchNumber);
    let lowNumber = 0;
    var searchFlag = true;
    ncmb.User.fetchAll()
      .then(users => {
        users.forEach(user => {
          //console.log("学生名：" + user.user_account_name);
          //ここで登録されている学籍番号かチェック
          if (user.userName === searchNumber) {
            console.log(user.user_account_name);
            lowNumber = lowNumber + 1;
            searchFlag = false;
          }
        })
        console.log("検索結果：" + lowNumber + "件");
        setTimeout(function () {
          resolve(searchFlag);
          console.log("検索機能のフラグ：" + searchFlag);
        }, 1000);
      }).catch(err => {
        console.log("変数データ取得エラー")
        reject("Falied!");
      });
  });
}


//スクロールをしなければチェックボックスチェックできないやつ
jQuery(function(){
	jQuery('input[type=checkbox]').prop('disabled', true);
	jQuery(window).bind("scroll", function() {
		document_ht = jQuery(document).height(); //コンテンツの高さを取得
		scroll_position = jQuery(window).height() + jQuery(window).scrollTop();

		if ((document_ht - scroll_position) / scroll_position <= 0.03) {
			jQuery('input[type=checkbox]').prop('disabled', false);
        	}
	});
});
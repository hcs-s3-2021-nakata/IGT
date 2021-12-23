// This is a JavaScript file
///ログアウト
function logout_button() {
  
  function getNowUser(user) {
    return new Promise(function (resolve, reject) {
      // userがカレントユーザ(true)ならuserを返し、
      //   カレントユーザ以外(false)なら"Falied!"
      if (user.isCurrentUser()) {
        setTimeout(function () {
          resolve(user);
        }, 1000);
      } else {
        reject("Falied!");
      }
    });
  }

  getNowUser(ncmb.User.getCurrentUser())
    .then(function (result) {
      console.log("1つ目：" + result);
      //ログインしてるとわかったので、ログアウトする
      return ncmb.User.logout();
    }).then(function (result) {
      //おそらくログアウトした後の処理になる
      console.log("2つ目：" + "result");
      document.location.href = './login.html';
    }, function (err) {
      // カレントユーザがfalseの時
      console.log("3つ目：" + err);
    });

}
/*jshint globalstrict: true*/
/*jshint esversion: 6 */
/*eslint-env es6*/
/*jshint globalstrict: true*/
/*jshint esversion: 6 */
/*jshint jquery: true*/
/*jshint node: true*/
/*jshint browser: true*/
/*jshint devel: true*/
/*eslint-env es6*/
/*eslint-env jquery*/
/*eslint-env browser*/
/*eslint no-console: 0*/

/* 画像プレビュー */
let key = 0;
function loadImage(obj) {
    for (i = 0; i < obj.files.length; i++) {
        var fileReader = new FileReader();
        fileReader.onload = (function (e) {
            var field = document.getElementById("preview");
            var figure = document.createElement("figure");
            var rmBtn = document.createElement("input");
            var image = new Image();
            img.src = e.target.result;
            rmBtn.type = "button";
            rmBtn.name = key;
            rmBtn.value = "削除";
            rmBtn.onclick = (function () {
                var element = document.getElementById("img-" + String(rmBtn.name)).remove();
            });
            figure.setAttribute("id", "img-" + key);
            figure.appendChild(image);
            figure.appendChild(rmBtn)
            field.appendChild(figure);
            key++;
        });
        fileReader.readAsDataURL(obj.files[i]);
    }
}

<<<<<<< HEAD
/* お気に入り登録（ボタン色反転） */
function button(){
document.getElementById("favorite-button").onclick = (function() {
  this.classList.toggle("blue");
});
}
=======
>>>>>>> 9f7371534640cc6f75e80765d62f16aa86eda323

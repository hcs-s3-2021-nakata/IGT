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
function imgPreView(event) {
  var file = event.target.files[0];
  var reader = new FileReader();
  var preview = document.getElementById("preview");
  var previewImage = document.getElementById("previewImage");
   
  if(previewImage != null) {
    preview.removeChild(previewImage);
  }
  reader.onload = function(event) {
    var img = document.createElement("img");
    img.setAttribute("src", reader.result);
    img.setAttribute("id", "previewImage");
    preview.appendChild(img);
  };
 
  reader.readAsDataURL(file);
}

/* お気に入り登録（ボタン色反転） */
function button(){
document.getElementById("favorite-button").onclick = (function() {
  this.classList.toggle("orange");
  this.classList.toggle("blue");
});
}

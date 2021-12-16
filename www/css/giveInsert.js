
// APIキーの設定とSDK初期化
  // API key.
  var applicationKey = "4d9d122337ca0de373857821e96b10ad1952a9133ffea44e66bcee94c282fccf";
  var clientKey = "00902e576a265322a217a2b2706056ca26048d4bd4f9096744fdd7e565d0f377";
  // SDK initialization.
  var ncmb = new NCMB(applicationKey, clientKey);

    // 共通機能
    const wait = (sec) => { // タイマ
      return new Promise((resolve, reject) => {
        setTimeout(resolve, sec*1000);
        //setTimeout(() => {reject(new Error("エラー！"))}, sec*1000);
      });
    };

    async function transition() {
      try {
        document.getElementById("loader-wrap").style.visibility = 'visible';
        await wait(3); // ここで処理待ち
        document.location.href='insertFixed.html';
      } catch (err) {
        console.error(err);
      }
    }

    // 画像アップロード用スクリプト
    function imgUpload(imageData) {
      // ncmbに画像をアップロード
      var fileName = makeUUID() + ".jpg";
      var fileData = toBlob(imageData, "image/jpeg");
      ncmb.File.upload(fileName, fileData);
      return fileName;
    }

    // Blob作成
    function toBlob(base64, mime_type) {
      var bin = atob(base64.replace(/^.*,/, ''));
      var buffer = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
      }

      try {
        var blob = new Blob([buffer.buffer], {
          type: mime_type
        });
      } catch (e) {
        return false;
      }
      return blob;
    }

    //UUID生成
    function makeUUID() {
      var d = +new Date();
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function(c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          return (c == 'X' ? r : (r & 0x3 | 0x8)).toString(16);

        });
    }

    // カテゴリーを書き換える
    function changeCategory(){
      var category = document.getElementById("category").value;
      switch (category){
            case '1':
              category = "おもちゃ・ゲーム";
              break;
            case '2':
              category = "本・テキスト";
              break;
            case '3':
              category = "音楽・ＤＶＤ";
              break;
            case '4':
              category = "服・コスメ";
              break;
            case '5':
              category = "キッチン";
              break;
            case '6':
              category = "スポーツ";
              break;
            case '7':
              category = "PC・スマホ用品";
              break;
            case '100':
              category = "その他";
              break;
            default:
              break;
          }
      return category;
    }

    // 商品状態を書き換える
    function changeItemStatus(){
      var item_status = document.getElementById("item_status").value;
      switch (item_status){
            case '1':
              item_status = "新品";
              break;
            case '2':
              item_status = "ほぼ新品";
              break;
            case '3':
              item_status = "多少の傷あり";
              break;
            case '4':
              item_status = "傷・汚れあり";
              break;
            case '5':
              item_status = "状態が悪い";
              break;
            default:
              break;
          }
      return item_status;
    }

    // 受け渡し時間帯を書き換える
    function changeDtime(){
      var delivery_time = document.getElementById("delivery_time").value;
      switch (delivery_time){
            case '1':
              delivery_time = "１コマ目終了後";
              break;
            case '2':
              delivery_time = "昼休み";
              break;
            case '3':
              delivery_time = "３コマ目終了後";
              break;
            case '4':
              delivery_time = "４コマ目終了後";
              break;
            default:
              break;
          }
      return delivery_time;
    }

    // 受け渡し場所を書き換える
    function changeLocation(){
      var location = document.getElementById("location").value;
      switch (location){
            case '1':
              location = "本校舎3Fホール";
              break;
            case '2':
              location = "本校舎4Fホール";
              break;
            case '3':
              location = "本校舎5F";
              break;
            case '4':
              location = "本校舎6Fホール";
              break;
            case '5':
              location = "本校舎7F";
              break;
            case '6':
              location = "本校舎8F";
              break;
            case '7':
              location = "2号館入口";
              break;
            case '8':
              location = "3号館入口";
              break;
            case '9':
              location = "3号館ホール";
              break;
            case '100':
              location = "その他";
              break;
            default:
              break;
          }
      return location;
    }


    // ここから譲渡関連機能
    function give_newDeal(){ 
      // 画像ファイル生成
      var imageData = document.getElementById("previewImage");
      var src = previewImage.getAttribute('src');
      var item_image = imgUpload(src);// 先行して画像をアップロード。画像の名前を返す

      var category = document.getElementById("category").value;
      var delivery_end_date = document.getElementById("delivery_end_date").value;
      var delivery_start_date = document.getElementById("delivery_start_date").value;
      var delivery_time = document.getElementById("delivery_time").value;

      var item_info = document.getElementById("item_info").value;
      var item_name = document.getElementById("item_name").value;
      var item_status = document.getElementById("item_status").value;
      var location = document.getElementById("location").value;
      // 
      var Give = ncmb.DataStore("give");
      // クラスインスタンスの生成
      var give = new Give();
      // データを設定して保存する
      give.set("category", category)
        .set("deal_status", "成立待ち")
        .set("delivery_end_date", delivery_end_date)
        .set("delivery_start_date", delivery_start_date)
        .set("delivery_time", delivery_time)
        .set("item_image", item_image)
        .set("item_info", item_info)
        .set("item_name", item_name)
        .set("item_status", item_status)
        .set("location", location)
        .save();
        localStorage.setItem("flag","give");
        transition();
      }

      // モーダル表示用スクリプト
      function give_modal_open(){
        const open = document.getElementById('d_open');
        const ok = document.getElementById('d_ok');
        const close = document.getElementById('d_cancel');
        const modal = document.getElementById('d_modal');
        const mask = document.getElementById('mask');
        
        open.addEventListener('click',()=>{
          // 値を置き換える関数を呼ぶ
          var category = changeCategory();
          var item_status = changeItemStatus();
          var delivery_time = changeDtime();
          var location = changeLocation();
          
          // モーダルの値を書き換える
          document.getElementById('m_item_name').innerHTML = document.getElementById("item_name").value;
          document.getElementById('m_category').innerHTML = category;
          document.getElementById('m_item_status').innerHTML = item_status;
          document.getElementById('m_item_info').innerHTML = document.getElementById("item_info").value.replace(/\n/g, '<br>');
          document.getElementById('m_delivery_date').innerHTML = document.getElementById("delivery_start_date").value + "<br><span class='wave'>～</span><br>" + document.getElementById("delivery_end_date").value;
          document.getElementById('m_delivery_time').innerHTML = delivery_time;
          document.getElementById('m_location').innerHTML = location;
          // 表示
          modal.classList.remove('hidden');
          mask.classList.remove('hidden');
        });
        
        close.addEventListener('click',()=>{
          modal.classList.add('hidden');
          mask.classList.add('hidden');
        });
        
        mask.addEventListener('click',()=>{
          close.click();
        });
      }


      // ここから交換関連機能
      function trade_newDeal(){ 
      // 画像ファイル生成
      var imageData = document.getElementById("previewImage");
      var src = previewImage.getAttribute('src');
      var item_image = imgUpload(src);// 先行して画像をアップロード。画像の名前を返す

      var category = document.getElementById("category").value;
      var delivery_end_date = document.getElementById("delivery_end_date").value;
      var delivery_start_date = document.getElementById("delivery_start_date").value;
      var delivery_time = document.getElementById("delivery_time").value;
      var item_info = document.getElementById("item_info").value;
      var swap_item_info = document.getElementById("swap_item_info").value;
      var item_name = document.getElementById("item_name").value;
      var item_status = document.getElementById("item_status").value;
      var location = document.getElementById("location").value;
      // 
      var Trade = ncmb.DataStore("trade");
      // クラスインスタンスの生成
      var trade = new Trade();
      // データを設定して保存する
      trade.set("category", category)
        .set("deal_status", "成立待ち")
        .set("delivery_end_date", delivery_end_date)
        .set("delivery_start_date", delivery_start_date)
        .set("delivery_time", delivery_time)
        .set("item_image", item_image)
        .set("item_info", item_info)
        .set("swap_item_info", swap_item_info)
        .set("item_name", item_name)
        .set("item_status", item_status)
        .set("location", location)
        .save();
        localStorage.setItem("flag","trade");
        transition();
      }

      // モーダル表示用スクリプト
      function trade_modal_open(){
        const open = document.getElementById('d_open');
        const ok = document.getElementById('d_ok');
        const close = document.getElementById('d_cancel');
        const modal = document.getElementById('d_modal');
        const mask = document.getElementById('mask');
        
        open.addEventListener('click',()=>{
          // 値を置き換える関数を呼ぶ
          var category = changeCategory();
          var item_status = changeItemStatus();
          var delivery_time = changeDtime();
          var location = changeLocation();
          
          // モーダルの値を書き換える
          document.getElementById('m_item_name').innerHTML = document.getElementById("item_name").value;
          document.getElementById('m_category').innerHTML = category;
          document.getElementById('m_item_status').innerHTML = item_status;
          document.getElementById('m_item_info').innerHTML = document.getElementById("item_info").value.replace(/\n/g, '<br>');
          document.getElementById('m_swap_item_info').innerHTML = document.getElementById("swap_item_info").value.replace(/\n/g, '<br>');
          document.getElementById('m_delivery_date').innerHTML = document.getElementById("delivery_start_date").value + "<br><span class='wave'>～</span><br>" + document.getElementById("delivery_end_date").value;
          document.getElementById('m_delivery_time').innerHTML = delivery_time;
          document.getElementById('m_location').innerHTML = location;
          // 表示
          modal.classList.remove('hidden');
          mask.classList.remove('hidden');
        });
        
        close.addEventListener('click',()=>{
          modal.classList.add('hidden');
          mask.classList.add('hidden');
        });
        
        mask.addEventListener('click',()=>{
          close.click();
        });
      }

console.log("Cropper.js 全体がロードされました！");
window.addEventListener("load", () => {
    console.log("window.onload 完了");
    console.log("ShowCropper is", typeof window.ShowCropper);
});

try {
    console.log("Cropper.js が読み込まれました！");
    let cropper;

    window.ShowCropper = function (imageSrc) {
        console.log("ShowCropper が呼ばれました！");

        // すでに表示中なら削除
        const existing = document.getElementById("cropper-modal");
        if (existing && existing.parentNode) {
            existing.parentNode.removeChild(existing);
        }

        const modal = document.createElement('div');
        modal.id = "cropper-modal"; // IDを明示
        modal.innerHTML = `
        <div id="cropper-container" style="
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        ">
            <div style="
                background: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                max-width: 90vw;
                max-height: 90vh;
                overflow: auto;
                box-shadow: 0 0 20px rgba(0,0,0,0.3);
            ">
                <img id="cropper-image" src="${imageSrc}" style="max-width: 300px; height: auto; border: 1px solid #ccc;">
                <div style="margin-top: 10px;">
                    <button id="cropper-confirm" style="
                      padding: 10px 20px;
                      font-size: 16px;
                      background-color: #4CAF50;
                      color: white;
                      border: none;
                      border-radius: 5px;
                      cursor: pointer;
                    ">トリミング確定</button>
                    <button id="cropper-cancel" style="
                      padding: 10px 20px;
                      font-size: 16px;
                      background-color: #f44336;
                      color: white;
                      border: none;
                      border-radius: 5px;
                      margin-left: 10px;
                      cursor: pointer;
                    ">キャンセル</button>
                 </div>
            </div>
        </div>
        `;
        document.body.appendChild(modal);

        // キャンセルボタン処理
        document.getElementById('cropper-cancel').addEventListener('click', () => {
            const target = document.getElementById("cropper-modal");
            if (target && target.parentNode) {
                target.parentNode.removeChild(target);
            }
        });

        // Cropper起動
        const image = document.getElementById('cropper-image');
        cropper = new Cropper(image, {
            aspectRatio: 3 / 4,
            viewMode: 1
        });

        // トリミング確定処理
        document.getElementById('cropper-confirm').onclick = function () {
            const canvas = cropper.getCroppedCanvas();
            if (canvas) {
                const croppedImage = canvas.toDataURL('image/png');
                console.log("トリミング画像を Unity に送信します");

                if (typeof unityInstance !== 'undefined') {
                    unityInstance.SendMessage('StudentIDDataManager', 'OnCropComplete', croppedImage);
                } else {
                    console.error("UnityInstance が見つかりません！");
                }

                const target = document.getElementById("cropper-modal");
                if (target && target.parentNode) {
                    target.parentNode.removeChild(target);
                }
            }
        };
    };    
} catch (e) {
    console.error("Cropper.js の実行中にエラー発生:", e);
}

window.NotifyCropperReadyFromUnity = function () {
    console.log("?? JS側 NotifyCropperReadyFromUnity が直接呼ばれました！");
    // Unityへ準備完了通知
    if (typeof unityInstance !== 'undefined') {
        console.log("? Unity に Cropper.js 読み込み完了を通知します！");
        unityInstance.SendMessage('StudentIDDataManager', 'OnCropperReady');
    } else {
        console.warn("UnityInstance が未定義です！");
    }
};

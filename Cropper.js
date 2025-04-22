console.log("Cropper.js �S�̂����[�h����܂����I");
window.addEventListener("load", () => {
    console.log("window.onload ����");
    console.log("ShowCropper is", typeof window.ShowCropper);
});

try {
    console.log("Cropper.js ���ǂݍ��܂�܂����I");
    let cropper;

    window.ShowCropper = function (imageSrc) {
        console.log("ShowCropper ���Ă΂�܂����I");

        // ���łɕ\�����Ȃ�폜
        const existing = document.getElementById("cropper-modal");
        if (existing && existing.parentNode) {
            existing.parentNode.removeChild(existing);
        }

        const modal = document.createElement('div');
        modal.id = "cropper-modal"; // ID�𖾎�
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
                    ">�g���~���O�m��</button>
                    <button id="cropper-cancel" style="
                      padding: 10px 20px;
                      font-size: 16px;
                      background-color: #f44336;
                      color: white;
                      border: none;
                      border-radius: 5px;
                      margin-left: 10px;
                      cursor: pointer;
                    ">�L�����Z��</button>
                 </div>
            </div>
        </div>
        `;
        document.body.appendChild(modal);

        // �L�����Z���{�^������
        document.getElementById('cropper-cancel').addEventListener('click', () => {
            const target = document.getElementById("cropper-modal");
            if (target && target.parentNode) {
                target.parentNode.removeChild(target);
            }
        });

        // Cropper�N��
        const image = document.getElementById('cropper-image');
        cropper = new Cropper(image, {
            aspectRatio: 3 / 4,
            viewMode: 1
        });

        // �g���~���O�m�菈��
        document.getElementById('cropper-confirm').onclick = function () {
            const canvas = cropper.getCroppedCanvas();
            if (canvas) {
                const croppedImage = canvas.toDataURL('image/png');
                console.log("�g���~���O�摜�� Unity �ɑ��M���܂�");

                if (typeof unityInstance !== 'undefined') {
                    unityInstance.SendMessage('StudentIDDataManager', 'OnCropComplete', croppedImage);
                } else {
                    console.error("UnityInstance ��������܂���I");
                }

                const target = document.getElementById("cropper-modal");
                if (target && target.parentNode) {
                    target.parentNode.removeChild(target);
                }
            }
        };
    };    
} catch (e) {
    console.error("Cropper.js �̎��s���ɃG���[����:", e);
}

window.NotifyCropperReadyFromUnity = function () {
    console.log("?? JS�� NotifyCropperReadyFromUnity �����ڌĂ΂�܂����I");
    // Unity�֏��������ʒm
    if (typeof unityInstance !== 'undefined') {
        console.log("? Unity �� Cropper.js �ǂݍ��݊�����ʒm���܂��I");
        unityInstance.SendMessage('StudentIDDataManager', 'OnCropperReady');
    } else {
        console.warn("UnityInstance ������`�ł��I");
    }
};

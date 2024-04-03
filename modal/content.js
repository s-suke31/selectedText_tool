chrome.runtime.onMessage.addListener((request) => {
    if (request.type === 'popup-modal') {
        // document.body.classList.add("is-modal");
        showModal(request.len1, request.len2);
    }
});

const showModal = (len1, len2) => {
    const dialog_elem = document.createElement("dialog");
    dialog_elem.innerHTML = `
      <div class="modal__contents">
      空白も含めた文字数 : ${len1} 文字<br>
      空白を除いた文字数 : ${len2} 文字
      </div>
      <button id="modal__close" class="modal__close">&times;</button>
    `;
    document.body.appendChild(dialog_elem);

    const dialog = document.querySelector("dialog");
    dialog.showModal();
    document.addEventListener('click', ({ target }) => {
        if (target === dialog) {
            // document.body.classList.remove("is-modal");
            dialog.close();
        }
    });

    let close = document.querySelector('.modal__close');
    close.addEventListener('click', () => {
        // document.body.classList.remove("is-modal");
        dialog.close();
    });
}

let id4tab = 0, id4win = 0;

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'strlen_counter',
    contexts: ['selection'],
    title: '文字数カウント'
  });
  chrome.contextMenus.create({
    id: 'translate_window',
    contexts: ['selection'],
    title: '英 → 日 (Open window)'
  });
  chrome.contextMenus.create({
    id: 'translate_tab',
    contexts: ['selection'],
    title: '英 → 日 (Open tab)'
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case 'strlen_counter': {
      let url = info.pageUrl;
      if (!url.startsWith("https") || !url.startsWith("http")) {
        return;
      }
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let [normal_len, trim_len] = strlen_count(info.selectionText);
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "popup-modal",
          len1: `${normal_len}`,
          len2: `${trim_len}`
        });
      });
      break;
    }
    case 'translate_tab': {
      let deepl_url = return_deepl_url(info.selectionText);
      chrome.tabs.get(id4tab, function (oldTab) {
        if (!chrome.runtime.lastError && oldTab) {
          chrome.tabs.update(oldTab.id, { active: true, url: deepl_url });
          return;
        }
        chrome.tabs.create(
          { url: deepl_url },
          function (tab) { id4tab = tab.id; }
        )
      })
      break;
    }
    case 'translate_window': {
      let deepl_url = return_deepl_url(info.selectionText);
      chrome.windows.get(id4win, function (chromeWindow) {
        if (!chrome.runtime.lastError && chromeWindow) {
          chrome.windows.update(id4win, { focused: true });
          let queryOptions = { active: true, currentWindow: true };
          chrome.tabs.query(queryOptions, ([tab2]) => {
            chrome.tabs.update(tab2.id, { url: deepl_url });
          });
          return;
        }
        chrome.windows.create(
          { url: deepl_url, type: 'popup', width: 600, height: 700, },
          function (window) { id4win = window.id; }
        );
      });
      break;
    }
  }
});

function return_deepl_url(str) {
  let nosp_str = str.replace(/\r?\n/g, '').replace(/ +/g, ' ');
  let encode_str = encodeURIComponent(nosp_str).replaceAll('%2F', '%5C$&');
  let deepl_url = `https://www.deepl.com/ja/translator#en/ja/${encode_str}`
  return deepl_url;
}

function strlen_count(str) {
  const segmenter = new Intl.Segmenter('ja', { granularity: 'grapheme' });
  let normal_length = [...segmenter.segment(str)].length;
  let nosp_str = str.replace(/\r?\n/g, '').replace(/[\s\u{3000}]/ug, '');
  let nosp_length = [...segmenter.segment(nosp_str)].length;
  return [normal_length, nosp_length];
}

function strlen_count() {
  let str = textarea.value;

  const segmenter = new Intl.Segmenter('ja', { granularity: 'grapheme' });
  let no_br_str = str.replace(/\r?\n/g, '')
  let no_br_sp_str = no_br_str.replace(/[\s\u{3000}]/ug, '');

  let normal_len = [...segmenter.segment(str)].length;
  let no_br_len = [...segmenter.segment(no_br_str)].length;
  let no_br_sp_len = [...segmenter.segment(no_br_sp_str)].length;

  document.getElementById("normal-len").value = normal_len;
  document.getElementById("no-br-len").value = no_br_len;
  document.getElementById("no-br-sp-len").value = no_br_sp_len;
}

const textarea = document.getElementById("input-text");
textarea.addEventListener("input", strlen_count);

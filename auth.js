// Simple client-side password gate for the demo bundle.
// NOTE: This is light obfuscation, not real security — source is public.
// To change the password: set HASH below to sha256(newPassword) hex.
(function () {
  var KEY = 'musubi_demo_auth';
  var HASH = 'b926ac8c5d0c77e47a9b03a5acc32560eaa0b75b2e4fca46dc130a4efd2661ff';

  if (sessionStorage.getItem(KEY) === HASH) return;

  var hide = document.createElement('style');
  hide.textContent =
    'body>*:not(#authgate){visibility:hidden!important}' +
    '#authgate{visibility:visible!important}';
  document.head.appendChild(hide);

  async function sha256(s) {
    var buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
    return Array.from(new Uint8Array(buf))
      .map(function (b) { return b.toString(16).padStart(2, '0'); })
      .join('');
  }

  function mount() {
    var g = document.createElement('div');
    g.id = 'authgate';
    g.setAttribute('style',
      'position:fixed;inset:0;z-index:2147483647;background:#0f1e3d;' +
      'display:flex;align-items:center;justify-content:center;' +
      'font-family:-apple-system,\'Noto Sans JP\',system-ui,sans-serif');
    g.innerHTML =
      '<div style="background:#fff;border-radius:18px;padding:38px 34px 30px;width:min(360px,86vw);box-shadow:0 24px 60px rgba(0,0,0,.4);text-align:center">' +
        '<div style="width:52px;height:52px;border-radius:13px;background:#127b66;color:#fff;font-weight:700;font-size:26px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px">結</div>' +
        '<div style="font-size:18px;font-weight:700;color:#22262f;letter-spacing:.04em">むすび デモ</div>' +
        '<div style="font-size:12.5px;color:#8b8578;margin:6px 0 22px">閲覧にはパスワードが必要です</div>' +
        '<input id="authpw" type="password" placeholder="パスワード" autocomplete="off" ' +
          'style="width:100%;box-sizing:border-box;padding:12px 14px;border:1px solid #e8e2d6;border-radius:10px;font-size:15px;outline:none">' +
        '<div id="autherr" style="height:16px;color:#b5402e;font-size:12px;margin:8px 0 2px;visibility:hidden">パスワードが違います</div>' +
        '<button id="authbtn" style="width:100%;margin-top:8px;padding:12px;border:0;border-radius:10px;background:#127b66;color:#fff;font-size:15px;font-weight:700;cursor:pointer">開く</button>' +
      '</div>';
    document.body.appendChild(g);

    var input = g.querySelector('#authpw');
    var err = g.querySelector('#autherr');
    var btn = g.querySelector('#authbtn');
    input.focus();

    async function submit() {
      var h = await sha256(input.value);
      if (h === HASH) {
        sessionStorage.setItem(KEY, HASH);
        location.reload();
      } else {
        err.style.visibility = 'visible';
        input.value = '';
        input.focus();
      }
    }
    btn.addEventListener('click', submit);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') submit();
      else err.style.visibility = 'hidden';
    });
  }

  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();

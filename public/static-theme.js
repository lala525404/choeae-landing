// 정적 페이지용 화면 테마. 랜딩(index.html)과 같은 저장 키 choeae-theme(light/dark/system)를 쓴다.
(function () {
  var KEY = 'choeae-theme';
  var root = document.documentElement;
  var query = window.matchMedia('(prefers-color-scheme: dark)');
  function saved() {
    try {
      var value = localStorage.getItem(KEY);
      return value === 'light' || value === 'dark' ? value : 'system';
    } catch (e) {
      return 'system';
    }
  }
  function apply() {
    var pref = saved();
    root.dataset.theme = pref === 'system' ? (query.matches ? 'dark' : 'light') : pref;
  }
  apply();
  query.addEventListener('change', function () {
    if (saved() === 'system') apply();
  });
})();

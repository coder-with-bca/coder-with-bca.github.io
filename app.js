/* coder_with_bca — quick actions: search, share, toast. Original code, no libraries. */
(function () {
  "use strict";

  var VIDEOS = [
    { t: "Why b = a does not copy a list", k: "Python", u: "topics.html#v-list-copy" },
    { t: "Where did 5 go in range(1, 5)?", k: "Python", u: "topics.html#v-range" },
    { t: "Why is -7 // 2 = -4?", k: "Python", u: "topics.html#v-floor-division" },
    { t: "Why does 5 + 2 become 52?", k: "Python", u: "topics.html#v-input-int" },
    { t: "Build a 25-minute study timer", k: "Python", u: "topics.html#v-study-timer" },
    { t: "Split a lunch bill with Python", k: "Python", u: "topics.html#v-lunch-bill" },
    { t: "Why scanf cannot read a full name", k: "C Programming", u: "topics.html#v-scanf-name" },
    { t: "12 / 0 = Infinity?", k: "JavaScript", u: "topics.html#v-divide-zero" },
    { t: "How DNS works", k: "How Tech Works", u: "topics.html#v-dns" },
    { t: "A fake call can sound real", k: "How Tech Works", u: "topics.html#v-fake-call" },
    { t: "The voice sounds like family?", k: "How Tech Works", u: "topics.html#v-voice-clone" },
    { t: "AI vs Developer vs Data", k: "Career and Skills", u: "topics.html#v-career-paths" },
    { t: "Only 3 things to do during BCA", k: "Career and Skills", u: "topics.html#v-bca-three-things" },
    { t: "Microsoft's 60,000 voluntary exit offer", k: "Career and Skills", u: "topics.html#v-microsoft-exit" },
    { t: "The truth behind the number", k: "Career and Skills", u: "topics.html#v-microsoft-number" }
  ];

  var overlay = document.getElementById("search-overlay");
  var input = document.getElementById("search-input");
  var results = document.getElementById("search-results");
  var openBtn = document.getElementById("search-open");
  var closeBtn = document.getElementById("search-close");
  var shareBtn = document.getElementById("share-btn");
  var toast = document.getElementById("toast");
  var toastTimer = null;
  var lastFocus = null;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2600);
  }

  function renderResults(query) {
    if (!results) return;
    var q = query.trim().toLowerCase();
    var hits = VIDEOS.filter(function (v) {
      return !q || v.t.toLowerCase().indexOf(q) !== -1 || v.k.toLowerCase().indexOf(q) !== -1;
    });
    results.textContent = "";
    if (hits.length === 0) {
      var empty = document.createElement("li");
      empty.className = "search-empty";
      empty.textContent = "No videos match \"" + query.trim() + "\" yet. New videos come out every day.";
      results.appendChild(empty);
      return;
    }
    hits.forEach(function (v) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = v.u;
      var tag = document.createElement("span");
      tag.className = "search-tag";
      tag.textContent = v.k;
      var title = document.createElement("span");
      title.className = "search-title";
      title.textContent = v.t;
      a.appendChild(tag);
      a.appendChild(title);
      a.addEventListener("click", closeSearch);
      li.appendChild(a);
      results.appendChild(li);
    });
  }

  function openSearch() {
    if (!overlay) return;
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.body.classList.add("search-open");
    renderResults("");
    if (input) { input.value = ""; setTimeout(function () { input.focus(); }, 40); }
  }

  function closeSearch() {
    if (!overlay) return;
    overlay.hidden = true;
    document.body.classList.remove("search-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function sharePage() {
    var url = location.href.split("#")[0];
    var data = {
      title: document.title,
      text: "coder_with_bca - free coding videos, code and notes for beginners.",
      url: url
    };
    if (navigator.share) {
      navigator.share(data).catch(function () { /* user closed the sheet */ });
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        showToast("Link copied. Paste it anywhere to share.");
      }, function () {
        showToast(url);
      });
      return;
    }
    showToast(url);
  }

  if (openBtn) openBtn.addEventListener("click", openSearch);
  if (closeBtn) closeBtn.addEventListener("click", closeSearch);
  if (shareBtn) shareBtn.addEventListener("click", sharePage);
  if (input) input.addEventListener("input", function () { renderResults(input.value); });
  if (overlay) overlay.addEventListener("click", function (e) { if (e.target === overlay) closeSearch(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay && !overlay.hidden) closeSearch();
  });
})();

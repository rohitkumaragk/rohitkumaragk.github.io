/* Load recent Blogger posts through its public JSONP feed. Static featured posts remain as fallback. */
(function () {
  const target = document.getElementById('blogPosts');
  const note = document.getElementById('blogFeedNote');
  if (!target) return;
  const fallback = target.innerHTML;
  const callback = 'renderQuestionEverythingFeed';
  const script = document.createElement('script');
  let finished = false;
  const timeout = setTimeout(() => { if (!finished && note) note.textContent = 'Showing selected articles. Open the blog archive for the complete and latest list.'; }, 6500);
  window[callback] = function (feed) {
    finished = true; clearTimeout(timeout);
    const entries = (feed && feed.feed && feed.feed.entry) || [];
    if (!entries.length) return;
    const cards = entries.slice(0, 12).map(entry => {
      const title = entry.title && entry.title.$t ? entry.title.$t : 'Untitled post';
      const link = (entry.link || []).find(x => x.rel === 'alternate' && x.type === 'text/html');
      const href = link ? link.href : 'https://questioneverythingagk.blogspot.com/';
      const date = entry.published && entry.published.$t ? new Date(entry.published.$t).toLocaleDateString(undefined,{year:'numeric',month:'short'}) : 'Blog article';
      const summary = (entry.summary && entry.summary.$t ? entry.summary.$t : '').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().slice(0,180);
      const card = document.createElement('article'); card.className = 'blog-post';
      const type = document.createElement('span'); type.className = 'blog-post-type'; type.textContent = date;
      const h = document.createElement('h4'); const a = document.createElement('a'); a.href = href; a.target = '_blank'; a.rel = 'noopener'; a.textContent = title; h.appendChild(a);
      const p = document.createElement('p'); p.textContent = summary ? summary + (summary.length >= 180 ? '…' : '') : 'Open the article to read more.';
      const read = document.createElement('a'); read.className = 'read-link'; read.href = href; read.target = '_blank'; read.rel = 'noopener'; read.textContent = 'Read article ↗';
      card.append(type,h,p,read); return card;
    });
    target.replaceChildren(...cards);
    if (note) note.textContent = 'Recent posts are loaded from the public blog feed. Use the topic links above to explore more.';
  };
  script.onerror = function () { clearTimeout(timeout); if (note) note.textContent = 'Showing selected articles. The live blog feed could not be reached; the archive link remains available.'; };
  script.src = 'https://questioneverythingagk.blogspot.com/feeds/posts/default?alt=json-in-script&max-results=12&callback=' + callback;
  document.head.appendChild(script);
  window.addEventListener('pagehide', () => { try { delete window[callback]; } catch (e) {} });
})();

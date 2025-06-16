// script.js
let currentUser = RandomUser.getProfile();

const splash = document.getElementById('splash');
const app = document.getElementById('app');
setTimeout(() => {
  splash.style.opacity = 0;
  setTimeout(() => {
    splash.style.display = 'none';
    app.style.display = 'block';
    setTimeout(() => app.style.opacity = 1, 100);
    initApp();
  }, 600);
}, 6000);

function initApp() {
  document.getElementById('current-user').textContent = `👤 ${currentUser.username}`;
  document.getElementById('post-bot').onclick = () => {
    GluuData.postBotVideo();
    renderFeed();
  };
  renderFeed();
}

function renderFeed() {
  const feed = document.getElementById('feed');
  feed.innerHTML = '';
  GluuData.getVideos().forEach(video => {
    const card = document.createElement('div');
    card.className = 'video-card';

    card.innerHTML = `
      <iframe src="${video.url}" allowfullscreen></iframe>
      <div class="video-meta">
        <span>👤 ${video.uploader.username}</span>
        <button class="like-btn">❤️ ${video.likes}</button>
      </div>
      <div class="comment-section" id="comments-${video.id}"></div>
      <div class="comment-input">
        <textarea rows="1" placeholder="Write a comment..."></textarea>
        <button>Send</button>
      </div>
    `;

    // Like
    card.querySelector('.like-btn').onclick = () => {
      const likes = GluuData.likeVideo(video.id);
      card.querySelector('.like-btn').textContent = `❤️ ${likes}`;
    };

    // Comments
    const commentDiv = card.querySelector(`#comments-${video.id}`);
    GluuData.getComments(video.id).forEach(c => {
      const cEl = document.createElement('div');
      cEl.className = 'comment';
      cEl.textContent = `[${c.user.username}]: ${c.content}`;
      commentDiv.appendChild(cEl);
    });

    // Comment Input
    const sendBtn = card.querySelector('button:last-of-type');
    const textarea = card.querySelector('textarea');
    sendBtn.onclick = () => {
      const text = textarea.value.trim();
      if (!text) return;
      GluuData.addComment(video.id, currentUser, text);
      const cEl = document.createElement('div');
      cEl.className = 'comment';
      cEl.textContent = `[${currentUser.username}]: ${text}`;
      commentDiv.appendChild(cEl);
      textarea.value = '';
    };

    feed.appendChild(card);
  });
}

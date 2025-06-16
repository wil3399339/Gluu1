const splash = document.getElementById('splash');
const app = document.getElementById('app');
setTimeout(() => {
  splash.style.opacity = '0';
  app.style.display = 'block';
  setTimeout(() => app.style.opacity = 1, 500);
}, 6000);

// Auth & UI elements
let currentUser = null;
const loginSection = document.getElementById('login-section');
const regSection = document.getElementById('reg-section');
const loginMsg = document.getElementById('login-msg');
const regMsg = document.getElementById('reg-msg');
const logoutBtn = document.getElementById('logout-btn');
const emailIn = document.getElementById('email');
const passIn = document.getElementById('password');
const rUser = document.getElementById('reg-username');
const rEmail = document.getElementById('reg-email');
const rPass = document.getElementById('reg-password');

document.getElementById('login-btn').onclick = () => {
  const res = DataServer.login(emailIn.value, passIn.value);
  if (res.error) return loginMsg.textContent = res.error;
  currentUser = res.user;
  loginSection.style.display = regSection.style.display = 'none';
  logoutBtn.style.display = 'block';
  renderFeed();
};
document.getElementById('reg-btn').onclick = () => {
  const res = DataServer.register(rUser.value, rEmail.value, rPass.value);
  if (res.error) return regMsg.textContent = res.error;
  regMsg.textContent = 'Registered! Please login.';
};

logoutBtn.onclick = () => {
  location.reload();
};

// Post bot video
document.getElementById('post-bot').onclick = () => {
  DataServer.postBotVideo();
  renderFeed();
};

// Render feed
function renderFeed() {
  const feed = document.getElementById('feed');
  feed.innerHTML = '';
  DataServer.getVideos().forEach(v => {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
      <iframe src="${v.url}" allow="autoplay"></iframe>
      <div class="video-actions">
        <button class="like-btn">❤️ ${v.likes}</button>
      </div>
      <div class="comments"></div>
      <div class="input-section">
        <textarea rows="1" placeholder="Add comment..."></textarea><button>Send</button>
      </div>
    `;
    // like button
    card.querySelector('.like-btn').onclick = () => {
      const newCount = DataServer.likeVideo(v.id);
      card.querySelector('.like-btn').textContent = `❤️ ${newCount}`;
    };
    // load comments
    const cmDiv = card.querySelector('.comments');
    DataServer.getComments(v.id).forEach(c => {
      const cEl = document.createElement('div');
      cEl.className = 'comment';
      cEl.textContent = `[${c.user.username}] ${c.content}`;
      cmDiv.append(cEl);
    });
    // send comment
    card.querySelector('button:last-of-type').onclick = () => {
      const txt = card.querySelector('textarea').value.trim();
      if (!txt) return;
      const c = DataServer.addComment(currentUser.id, v.id, txt);
      const el = document.createElement('div');
      el.className = 'comment';
      el.textContent = `[${currentUser.username}] ${c.content}`;
      cmDiv.append(el);
      card.querySelector('textarea').value = '';
    };
    feed.append(card);
  });
}

// data.js

const DataServer = (() => {
  const USERS_KEY = 'gluu_users';
  const VIDEOS_KEY = 'gluu_videos';
  const COMMENTS_KEY = 'gluu_comments';

  let users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  let videos = JSON.parse(localStorage.getItem(VIDEOS_KEY) || '[]');
  let comments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '[]');

  const saveAll = () => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos));
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  };

  const randomId = () => Date.now() + Math.floor(Math.random() * 1000);

  const register = (username, email, password) => {
    if (users.find(u => u.email === email)) return { error: 'Email already taken' };
    const newUser = { id: randomId(), username, email, password, coins: 0, followers: 0 };
    users.push(newUser); saveAll();
    return { user: newUser };
  };

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { error: 'Invalid credentials' };
    return { user };
  };

  const postBotVideo = () => {
    const bot = { username: `bot${randomId()}`, profilePic: `https://randomuser.me/api/portraits/lego/${randomId()%10}.jpg` };
    const video = { id: randomId(), uploader: bot, url: `https://random.video/${randomId()}`, likes: 0, createdAt: Date.now() };
    videos.unshift(video); saveAll();
    return video;
  };

  const likeVideo = videoId => {
    const v = videos.find(v => v.id === videoId);
    if (v) { v.likes += 1; saveAll(); return v.likes; }
    return null;
  };

  const addComment = (userId, videoId, content) => {
    const user = users.find(u => u.id === userId);
    if (!user) return null;
    const comment = { id: randomId(), videoId, user, content, createdAt: Date.now() };
    comments.push(comment); saveAll();
    return comment;
  };

  const getComments = videoId =>
    comments.filter(c => c.videoId === videoId).sort((a,b) => a.createdAt - b.createdAt);

  return { register, login, postBotVideo, likeVideo, addComment, getVideos: () => videos, getComments };
})();

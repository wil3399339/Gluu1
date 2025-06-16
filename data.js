// data.js
const RandomUser = (() => {
  const names = ['Nova', 'Ezra', 'Kai', 'Luna', 'Milo', 'Aria', 'Zara', 'Leo'];
  const getProfile = () => ({
    username: names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 1000),
    profilePic: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 90)}.jpg`
  });
  return { getProfile };
})();

const GluuData = (() => {
  let videos = [];
  let comments = {};

  const postBotVideo = () => {
    const uploader = RandomUser.getProfile();
    const video = {
      id: Date.now(),
      uploader,
      url: `https://www.youtube.com/embed/${Math.random().toString(36).substr(2, 8)}`,
      likes: 0
    };
    videos.unshift(video);
    return video;
  };

  const likeVideo = (id) => {
    const video = videos.find(v => v.id === id);
    if (video) video.likes++;
    return video.likes;
  };

  const addComment = (videoId, user, content) => {
    if (!comments[videoId]) comments[videoId] = [];
    comments[videoId].push({ user, content });
  };

  const getComments = (videoId) => comments[videoId] || [];

  const getVideos = () => videos;

  return { postBotVideo, getVideos, likeVideo, addComment, getComments };
})();

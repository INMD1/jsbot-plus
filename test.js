const appleMusicPlaylist = require("apple-music-playlist");

let sUrl = "https://music.apple.com/kr/playlist/jazzzzzzzzzzzzzzz/pl.f31fb34cf8ad46f0a27c960fa805cc4c?l=en";

appleMusicPlaylist.getPlaylist(sUrl).then(aResult => {
	console.log(aResult);
}).catch(err => {
	throw err;
});
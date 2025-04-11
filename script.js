// Select DOM elements
const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const shuffleBtn = document.getElementById("shuffle");
const volume = document.getElementById("volume");
const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const playlist = document.getElementById("playlist");
const recapBtn = document.getElementById("recap");
const recapContainer = document.getElementById("recap-container");

let isPlaying = false;
let currentSongIndex = 0;
let isShuffling = false;

// Song list
const songs = [
  { name: "song1", displayName: "cry for me", artist: "the weekend", cover: "cover1.jpg" },
  { name: "song2", displayName: "open hearts", artist: "the weekend", cover: "cover2.jpg" },
  { name: "song3", displayName: "like jennie", artist: "jennie", cover: "cover3.jpg" },
  { name: "song4", displayName: "mantra", artist: "jennie", cover: "cover4.jpg" },
  { name: "song5", displayName: "ME!", artist: "Taylor Swift", cover: "cover5.jpg" },
  { name: "song6", displayName: "Bejeweled", artist: "Taylor Swift", cover: "cover6.jpg" }
];

// Play tracking
let playCounts = {};
let artistCounts = {};
let songJustLoaded = false; // Flag to count play only once per song load

songs.forEach((song, index) => {
  playCounts[index] = 0;
  artistCounts[song.artist] = 0;
});

// Load song
function loadSong(song) {
  title.textContent = song.displayName;
  artist.textContent = song.artist;
  audio.src = `assets/music/${song.name}.mp3`;
  cover.src = `assets/images/${song.cover}`;
  songJustLoaded = true;
  updatePlaylistHighlight();
}

// Count play
function countPlay(index) {
  if (songJustLoaded) {
    playCounts[index]++;
    artistCounts[songs[index].artist]++;
    songJustLoaded = false;
  }
}

// Play
function playSong() {
  isPlaying = true;
  audio.play();
  playBtn.textContent = "💓";
  countPlay(currentSongIndex);
}

// Pause
function pauseSong() {
  isPlaying = false;
  audio.pause();
  playBtn.textContent = "💗";
}

// Toggle play/pause
playBtn.addEventListener("click", () => {
  isPlaying ? pauseSong() : playSong();
});

// Next song
function nextSong() {
  currentSongIndex = isShuffling
    ? Math.floor(Math.random() * songs.length)
    : (currentSongIndex + 1) % songs.length;
  loadSong(songs[currentSongIndex]);
  playSong();
}

// Previous song
function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(songs[currentSongIndex]);
  playSong();
}

// Volume control
volume.addEventListener("input", () => {
  audio.volume = volume.value;
});

// Progress bar
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${percent}%`;

    const currentMinutes = Math.floor(audio.currentTime / 60);
    const currentSeconds = Math.floor(audio.currentTime % 60);
    const durationMinutes = Math.floor(audio.duration / 60);
    const durationSeconds = Math.floor(audio.duration % 60);

    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, "0")}`;
    durationEl.textContent = `${durationMinutes}:${durationSeconds.toString().padStart(2, "0")}`;
  }
});

// Seek bar click
progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
});

// Shuffle toggle
shuffleBtn.addEventListener("click", () => {
  isShuffling = !isShuffling;
  shuffleBtn.style.backgroundColor = isShuffling ? "#1db954" : "#3e4a5b";
});

// Auto-play next
audio.addEventListener("ended", () => {
  nextSong();
});

// Controls
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

// Load playlist
function loadPlaylist() {
  playlist.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = `${song.displayName} — ${song.artist}`;
    li.addEventListener("click", () => {
      currentSongIndex = index;
      loadSong(song);
      playSong();
    });
    playlist.appendChild(li);
  });
}

// Highlight current song
function updatePlaylistHighlight() {
  const listItems = playlist.querySelectorAll("li");
  listItems.forEach((li, index) => {
    li.classList.toggle("active", index === currentSongIndex);
  });
}

// Recap logic
recapBtn.addEventListener("click", () => {
  // Most played song
  let mostPlayedTrackIndex = Object.keys(playCounts).reduce((a, b) =>
    playCounts[a] > playCounts[b] ? a : b
  );
  let mostPlayedSong = songs[mostPlayedTrackIndex];

  // Most played artist
  let mostPlayedArtist = Object.keys(artistCounts).reduce((a, b) =>
    artistCounts[a] > artistCounts[b] ? a : b
  );

  // Recap content
  let recapHTML = `
    <strong>🎧 Recap:</strong><br/><br/>
    <strong>Most Played Track:</strong> ${mostPlayedSong.displayName} (${playCounts[mostPlayedTrackIndex]} plays)<br/>
    <strong>Most Played Artist:</strong> ${mostPlayedArtist} (${artistCounts[mostPlayedArtist]} plays)<br/><br/>
    <strong>All Tracks:</strong><br/>
  `;

  songs.forEach((song, index) => {
    recapHTML += `• ${song.displayName} by ${song.artist}: ${playCounts[index]} plays<br/>`;
  });

  recapContainer.innerHTML = recapHTML;
  recapContainer.style.display = "block";
});

// Init
loadPlaylist();
loadSong(songs[currentSongIndex]);

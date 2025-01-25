const image = document.getElementById('cover'),
    title = document.getElementById('music-title'),
    artist = document.getElementById('music-artist'),
    currentTimeEl = document.getElementById('current-time'),
    durationEl = document.getElementById('duration'),
    progress = document.getElementById('progress'),
    playerProgress = document.getElementById('player-progress'),
    prevBtn = document.getElementById('prev'),
    nextBtn = document.getElementById('next'),
    playBtn = document.getElementById('play'),
    background = document.getElementById('bg-img'),
    repeatBtn = document.getElementById('repeat');
    shuffleBtn = document.getElementById('shuffle');

const music = new Audio();
let isShuffle = false;

const songs = [
    {
        path: 'songs/Mann ki Lagan.mp3',
        displayName: 'Mann ki Lagan',
        cover: 'image/pic2.jpg',
        artist: 'Rahat Fateh Ali Khan',
    },
    {
        path: 'songs/Mi Amor.mp3',
        displayName: 'Mi Amor',
        cover: 'image/pic2.jpg',
        artist: 'Sharn, The Paul',
    },
    {
        path: 'songs/SHUTDOWN.mp3',
        displayName: 'SHUTDOWN',
        cover: 'image/pic2.jpg',
        artist: 'Seedhe Maut',
    },
    {
        path: 'songs/The Night We Met.mp3',
        displayName: 'The Night We Met',
        cover: 'image/pic2.jpg',
        artist: 'Lord Huron',
    },
    {
        path: 'songs/RED.mp3',
        displayName: 'RED',
        cover: 'image/pic2.jpg',
        artist: 'Seedhe Maut, Hisab',
    }
];

let musicIndex = 0;
let isPlaying = false;
let isRepeat = false;

function togglePlay() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    isPlaying = true;
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
    music.play();
}

function pauseMusic() {
    isPlaying = false;
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
    music.pause();
}

function loadMusic(song) {
    music.src = song.path;
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    image.src = song.cover;
    background.src = song.cover;
}

function changeMusic(direction) {
    musicIndex = (musicIndex + direction + songs.length) % songs.length;
    loadMusic(songs[musicIndex]);
    playMusic();
}

function updateProgressBar() {
    const { duration, currentTime } = music;

    if (!isNaN(duration)) {
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;

        const formatTime = (time) => String(Math.floor(time)).padStart(2, '0');
        durationEl.textContent = `${formatTime(duration / 60)}:${formatTime(duration % 60)}`;
        currentTimeEl.textContent = `${formatTime(currentTime / 60)}:${formatTime(currentTime % 60)}`;
    }
}

function setProgressBar(e) {
    const width = playerProgress.clientWidth;
    const clickX = e.offsetX;
    music.currentTime = (clickX / width) * music.duration;
}

function toggleRepeat() {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active'); // Visually indicate repeat mode
}

function toggleShuffle() {
    isShuffle = !isShuffle; // Switch shuffle state
    shuffleBtn.classList.toggle('active'); // Highlight the shuffle button when active
}

function getShuffledIndex(currentIndex, totalSongs) {
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * totalSongs); // Generate a random index
    } while (newIndex === currentIndex); // Ensure the new index is different from the current index
    return newIndex;
}

function changeMusic(direction) {
    if (isShuffle && direction === 1) {
        // If shuffle mode is active and the user clicks "Next"
        musicIndex = getShuffledIndex(musicIndex, songs.length);
    } else {
        // Normal behavior
        musicIndex = (musicIndex + direction + songs.length) % songs.length;
    }
    loadMusic(songs[musicIndex]);
    playMusic();
}

// Event Listeners
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeMusic(-1));
nextBtn.addEventListener('click', () => changeMusic(1));
music.addEventListener('timeupdate', updateProgressBar);
playerProgress.addEventListener('click', setProgressBar);
repeatBtn.addEventListener('click', toggleRepeat);

music.addEventListener('ended', () => {
    if (isRepeat) {
        music.currentTime = 0; // Restart the current track
        music.play();
    } else {
        changeMusic(1); // Proceed to the next track
    }
});
shuffleBtn.addEventListener('click', toggleShuffle);

// Load Initial Song
loadMusic(songs[musicIndex]);

// Wait for the DOM to be fully loaded before executing the script
//console.log('1-Script loaded');
document.addEventListener('DOMContentLoaded', () => {
// Select all audio elements on the page
//console.log('2-DOM fully loaded and parsed');
const audioPlayers = document.querySelectorAll('audio');
//console.log(`Total audio elements found: ${audioPlayers.length}`);
let isPlaying = true; // Track play/pause status
let currentTrack = 0; // Index of the currently playing track
let isShuffle = false; // Shuffle mode status (off by default)
let repeatMode = 0; // Repeat mode status (0: No Repeat, 1: Repeat One, 2: Repeat All)
let shuffleOrder = []; // Array to hold the order of tracks when shuffling
// Function to initialize or update the order of tracks for shuffle mode
const updateShuffleOrder = () => {
    // Create an array with indices corresponding to the track list
    shuffleOrder = Array.from({length: audioPlayers.length}, (_, i) => i);
    if (isShuffle) {
        //console.log('3-Shuffle mode is on');
        let currentIndex = shuffleOrder.indexOf(currentTrack);
        shuffleOrder.splice(currentIndex, 1); // Remove the current track from shuffle order
        shuffleOrder.sort(() => Math.random() - 0.5); // Randomly shuffle the remaining tracks
        shuffleOrder.unshift(currentTrack); // Reinsert the current track at the start
    }
};

// Function to highlight the playing track
const highlightPlayingTrack = (index) => {
    const tracks = document.querySelectorAll('li');
    tracks.forEach((track, i) => {
        if (i === index) {
            track.classList.add('playing');
            // Ensure the playing track is visible on the screen
            track.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            track.classList.remove('playing');
        }
    });
};

const playTrack = (index) => {
    // First, pause and reset all tracks
    audioPlayers.forEach((audio, audioIndex) => {
        if (!audio.paused) {
            audio.pause(); // Pause any playing track
            audio.currentTime = 0; // Reset its time
        }
    });

    // Now, attempt to play the selected track
    const trackToPlay = audioPlayers[index];
    trackToPlay.play().then(() => {
        console.log(`Track ${index} is now playing.`);
        currentTrack = index; // Update the currentTrack index only after playback starts
        highlightPlayingTrack(index); // Highlight and scroll to the playing track
        }).catch(error => {
        console.error(`Error playing track ${index}:`, error);
    });
};

// Function to pause all tracks except the currently playing one
function pauseOtherTracks(currentIndex) {
    audioPlayers.forEach((audio, index) => {
    if (index !== currentIndex && !audio.paused) {
        audio.pause(); // Pause the track
        audio.currentTime = 0; // Optionally, reset its time
    }
});
}

// Add event listeners to each audio element
audioPlayers.forEach((audio, index) => {
audio.addEventListener('play', () => pauseOtherTracks(index));
});

document.getElementById('repeatTrack').addEventListener('click', () => {
    repeatMode = (repeatMode + 1) % 3;
    const repeatSymbols = ['🔁', '🔂', '🔄'];
    const repeatTexts = ['', 'ONE', 'ALL'];
    const button = document.getElementById('repeatTrack');
    button.textContent = repeatSymbols[repeatMode] + ' ' + repeatTexts[repeatMode];
    // Remove all possible classes before adding the new one to avoid conflicts
    button.classList.remove('repeat-off', 'repeat-one', 'repeat-all');
    button.classList.add('repeat-' + ['off', 'one', 'all'][repeatMode]); // Update the button's class based on the repeat mode
});
// Function to get the index of the next track to play
const getNextTrackIndex = () => {
    //console.log("5-Next function called");
    if (isShuffle) {
        // In shuffle mode, proceed according to the shuffled order
        let currentShuffleIndex = shuffleOrder.indexOf(currentTrack);
        return shuffleOrder[(currentShuffleIndex + 1) % shuffleOrder.length];
    }
    // In linear mode, simply proceed to the next track
    return (currentTrack + 1) % audioPlayers.length;
};

// Function to get the index of the previous track to play
const getPreviousTrackIndex = () => {
    //console.log("6-Previous function called");
    if (isShuffle) {
        // In shuffle mode, find the previous index in the shuffled order
        let currentShuffleIndex = shuffleOrder.indexOf(currentTrack);
        let prevIndex = (currentShuffleIndex - 1 + shuffleOrder.length) % shuffleOrder.length;
        return shuffleOrder[prevIndex];
    }
    // In linear mode, go back to the previous track
    return (currentTrack - 1 + audioPlayers.length) % audioPlayers.length;
};

// Function to toggle play/pause and update button appearance
const togglePlayPause = () => {
    const playPauseButton = document.getElementById('Play');
    const currentAudio = audioPlayers[currentTrack];

    if (currentAudio.paused) {
        currentAudio.play();
        playPauseButton.textContent = '⏸️';
        playPauseButton.classList.remove('paused');
    } else {
        currentAudio.pause();
        playPauseButton.textContent = '▶️';
        playPauseButton.classList.add('paused');
    }
};

document.getElementById('Play').addEventListener('click', togglePlayPause);

const updatePlayButton = () => {
    const playPauseButton = document.getElementById('Play');
    const currentAudio = audioPlayers[currentTrack];

    if (currentAudio.paused) {
        playPauseButton.textContent = '⏸️';
        playPauseButton.classList.add('paused');
    } else {
        playPauseButton.textContent = '▶️';
        playPauseButton.classList.remove('paused');
    }
};

audioPlayers.forEach((audio, index) => {
    audio.addEventListener('play', updatePlayButton);
    audio.addEventListener('pause', updatePlayButton);
});


 // Event listeners for controls
document.getElementById('nextTrack').addEventListener('click', () => {
    if (repeatMode === 1) {
      playTrack(currentTrack); // Repeat current track in "Repeat One" mode
    } else {
      playTrack(getNextTrackIndex());
    }
});

document.getElementById('prevTrack').addEventListener('click', () => {
    if (repeatMode === 1) {
      playTrack(currentTrack); // Repeat current track in "Repeat One" mode
    } else {
      playTrack(getPreviousTrackIndex());
    }
});

// Event listener for toggling shuffle mode
document.getElementById('shuffleTrack').addEventListener('click', () => {
    isShuffle = !isShuffle; // Toggle shuffle mode
    document.getElementById('shuffleTrack').classList.toggle('active', isShuffle); // Update button appearance
    updateShuffleOrder(); // Reinitialize shuffle order with the new mode
});

// Set up handling for when a track ends
audioPlayers.forEach((player, index) => {
    player.onended = () => {
            let nextIndex = getNextTrackIndex();
            if (nextIndex === currentTrack && repeatMode === 0) {
                // If it's the last track and no repeat mode is active, do nothing
                return;
            }
            playTrack(nextIndex); // Otherwise, move to the next track
        };
});

updateShuffleOrder(); // Initialize shuffle order when the page loads

//make the changing images background same as the gif
const images_header = [
    'url(https://tuphung1787.github.io/TuPhung/image/forest_2.jpeg)',
    'url(https://tuphung1787.github.io/TuPhung/image/forest_4.jpeg)',
    'url(https://tuphung1787.github.io/TuPhung/image/forest_6.jpeg)',
       // Add as many images as you want, ensure they're wrapped with url()
];
const images_main = [
    'url(https://tuphung1787.github.io/TuPhung/image/lake_2.jpeg)',
    'url(https://tuphung1787.github.io/TuPhung/image/lake_4.jpeg)',
    'url(https://tuphung1787.github.io/TuPhung/image/lake_6.jpeg)',
    'url(https://tuphung1787.github.io/TuPhung/image/lake_10.jpeg)',
       // Add as many images as you want, ensure they're wrapped with url()
];
let currentIndexHeader = 0;
let currentIndexMain = 0;

const changeBackgroundImageHeader = () => {
    const headerElement = document.getElementById('dynamicHeader');
    headerElement.style.backgroundImage = images_header[currentIndexHeader];
    currentIndexHeader = (currentIndexHeader + 1) % images_header.length;
};

const changeBackgroundImageMain = () => {
    const mainElement = document.getElementById('dynamicMain');
    mainElement.style.backgroundImage = images_main[currentIndexMain];
    currentIndexMain = (currentIndexMain + 1) % images_main.length;
};

// Set different intervals for changing background images
setInterval(changeBackgroundImageHeader, 2000); // Change header background every 2 seconds
setInterval(changeBackgroundImageMain, 3000); // Change main background every 3 seconds

});

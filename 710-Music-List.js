// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    // Select all audio elements on the page
    const audioPlayers = document.querySelectorAll('audio');
    let currentTrack = 0; // Index of the currently playing track
    let isShuffle = false; // Shuffle mode status (off by default)
    let repeatMode = 0; // Repeat mode status (0: No Repeat, 1: Repeat One, 2: Repeat All)
    let shuffleOrder = []; // Array to hold the order of tracks when shuffling

    // Function to initialize or update the order of tracks for shuffle mode
    const updateShuffleOrder = () => {
        // Create an array with indices corresponding to the track list
        shuffleOrder = Array.from({length: audioPlayers.length}, (_, i) => i);
        if (isShuffle) {
            // If shuffle mode is on, shuffle the track order
            let currentIndex = shuffleOrder.indexOf(currentTrack);
            shuffleOrder.splice(currentIndex, 1); // Remove the current track from shuffle order
            shuffleOrder.sort(() => Math.random() - 0.5); // Randomly shuffle the remaining tracks
            shuffleOrder.unshift(currentTrack); // Reinsert the current track at the start
        }
    };

    // Function to play a specific track by its index
    // const playTrack = (index) => {
    //     audioPlayers.forEach((audio, i) => {
    //         if (i === index) {
    //             audio.play(); // Play the selected track
    //         } else {
    //             audio.pause(); // Pause all other tracks
    //             audio.currentTime = 0; // Reset their playback position
    //         }
    //     });
    //     currentTrack = index; // Update the index of the currently playing track
    // };
    const playTrack = (index) => {
        audioPlayers.forEach((audio, i) => {
            if (i === index) {
                audioPlayers.forEach(p => {
                    if (!p.paused) {
                        p.pause(); // Pause any playing track
                        p.currentTime = 0; // Reset its time
                    }
                });
                audio.play(); // Then play the selected track
            }
        });
        currentTrack = index;
    };


    // Function to get the index of the next track to play
    const getNextTrackIndex = () => {
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
        if (isShuffle) {
            // In shuffle mode, find the previous index in the shuffled order
            let currentShuffleIndex = shuffleOrder.indexOf(currentTrack);
            let prevIndex = (currentShuffleIndex - 1 + shuffleOrder.length) % shuffleOrder.length;
            return shuffleOrder[prevIndex];
        }
        // In linear mode, go back to the previous track
        return (currentTrack - 1 + audioPlayers.length) % audioPlayers.length;
    };

    // Event listener for the "Next" button
    document.getElementById('nextTrack').addEventListener('click', () => {
        playTrack(getNextTrackIndex()); // Play the next track
    });

    // Event listener for the "Previous" button
    document.getElementById('prevTrack').addEventListener('click', () => {
        playTrack(getPreviousTrackIndex()); // Play the previous track
    });

    // Event listener for toggling shuffle mode
    document.getElementById('shuffleTrack').addEventListener('click', () => {
        isShuffle = !isShuffle; // Toggle shuffle mode
        document.getElementById('shuffleTrack').classList.toggle('active', isShuffle); // Update button appearance
        updateShuffleOrder(); // Reinitialize shuffle order with the new mode
    });

    // Event listener for cycling through repeat modes
    // document.getElementById('repeatTrack').addEventListener('click', () => {
    //     repeatMode = (repeatMode + 1) % 3; // Cycle through the repeat modes
    //     const repeatTexts = ['Repeat', 'Repeat: One', 'Repeat: All'];
    //     document.getElementById('repeatTrack').textContent = repeatTexts[repeatMode]; // Update button text
    // });
    document.getElementById('repeatTrack').addEventListener('click', () => {
        repeatMode = (repeatMode + 1) % 3;
        const repeatTexts = ['Repeat', 'Repeat: One', 'Repeat: All'];
        const repeatClasses = ['repeat-off', 'repeat-one', 'repeat-all']; // Add this line
        const button = document.getElementById('repeatTrack');
        button.textContent = repeatTexts[repeatMode];
    
        // Remove all possible classes before adding the new one to avoid conflicts
        button.classList.remove('repeat-off', 'repeat-one', 'repeat-all');
        button.classList.add(repeatClasses[repeatMode]); // Update the button's class based on the repeat mode
    });

    // Set up handling for when a track ends
    audioPlayers.forEach((player, index) => {
        player.onended = () => {
            if (repeatMode === 1) {
                playTrack(currentTrack); // If "Repeat One" mode, replay the current track
            } else {
                let nextIndex = getNextTrackIndex();
                if (nextIndex === currentTrack && repeatMode === 0) {
                    // If it's the last track and no repeat mode is active, do nothing
                    return;
                }
                playTrack(nextIndex); // Otherwise, move to the next track
            }
        };
    });

    updateShuffleOrder(); // Initialize shuffle order when the page loads
});
let animation;

// Handle mouse events
function setupMouseEvents(animation) {
    const playForward = () => {
        animation.setDirection(1);
        animation.goToAndStop(0, true);
        animation.play();
    };

    const playReverse = () => {
        animation.setDirection(-1);
        animation.goToAndStop(animation.totalFrames, true);
        animation.play();
    };

    // Mouse events
    document.addEventListener('mousedown', playForward);
    document.addEventListener('mouseup', playReverse);
}

// Load the Lottie animation data
fetch('lottie/data-18.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('lottie-container');
        
        animation = lottie.loadAnimation({
            container: container,
            renderer: 'html',
            loop: false,
            autoplay: false,
            animationData: data,
            rendererSettings: {
                clearCanvas: true,
                progressiveLoad: true,
                preserveAspectRatio: 'xMidYMid meet'
            }
        });

        // Set playback speed
        animation.setSpeed(1.6);

        // Set initial state
        animation.setDirection(1);
        animation.goToAndStop(0, true);

        // Setup mouse events
        setupMouseEvents(animation);
    })
    .catch(error => {
        console.error('Error loading Lottie data:', error);
    });

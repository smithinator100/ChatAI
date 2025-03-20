let animation;
let arrowAnimation;

// Handle mouse events
function setupMouseEvents(animation, arrowAnimation) {
    const playForward = () => {
        animation.setDirection(1);
        animation.goToAndStop(0, true);
        animation.play();
        
        arrowAnimation.setDirection(1);
        arrowAnimation.goToAndStop(0, true);
        arrowAnimation.play();
    };

    const playReverse = () => {
        animation.setDirection(-1);
        animation.goToAndStop(animation.totalFrames, true);
        animation.play();
        
        arrowAnimation.setDirection(-1);
        arrowAnimation.goToAndStop(arrowAnimation.totalFrames, true);
        arrowAnimation.play();
    };

    // Mouse events
    document.addEventListener('mousedown', playForward);
    document.addEventListener('mouseup', playReverse);
}

// Load the Lottie animation data
Promise.all([
    fetch('lottie/logo-to-plus.json').then(response => response.json()),
    fetch('lottie/arrow.json').then(response => response.json())
])
.then(([logoData, arrowData]) => {
    const logoContainer = document.getElementById('logo-to-plus-lottie');
    const arrowContainer = document.getElementById('arrow-lottie');
    
    animation = lottie.loadAnimation({
        container: logoContainer,
        renderer: 'html',
        loop: false,
        autoplay: false,
        animationData: logoData,
        rendererSettings: {
            clearCanvas: true,
            progressiveLoad: true,
            preserveAspectRatio: 'xMidYMid meet'
        }
    });

    arrowAnimation = lottie.loadAnimation({
        container: arrowContainer,
        renderer: 'html',
        loop: false,
        autoplay: false,
        animationData: arrowData,
        rendererSettings: {
            clearCanvas: true,
            progressiveLoad: true,
            preserveAspectRatio: 'xMidYMid meet'
        }
    });

    // Set playback speed
    animation.setSpeed(1.6);
    arrowAnimation.setSpeed(1.6);

    // Set initial state
    animation.setDirection(1);
    animation.goToAndStop(0, true);
    
    arrowAnimation.setDirection(1);
    arrowAnimation.goToAndStop(0, true);

    // Setup mouse events
    setupMouseEvents(animation, arrowAnimation);
})
.catch(error => {
    console.error('Error loading Lottie data:', error);
});

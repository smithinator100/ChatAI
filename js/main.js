let animation;
let arrowAnimation;

// Handle mouse events
function setupMouseEvents(animation, arrowAnimation) {
    const container = document.querySelector('.container');
    const existingChat = document.querySelector('.existing-chat');
    const placeholderChat = document.querySelector('.placeholder-chat');
    const prototypeToggle = document.getElementById('prototype-toggle');
    const titleTextDefault = document.querySelector('.title-text--default');
    const titleTextActive = document.querySelector('.title-text--active');
    const subtitleText = document.querySelector('.subtitle-text');
    
    const playForward = () => {
        animation.setDirection(1);
        animation.goToAndStop(0, true);
        animation.play();
        
        // Delay arrow animation by 100ms if toggle is on
        if (prototypeToggle.checked) {
            setTimeout(() => {
                arrowAnimation.setDirection(1);
                arrowAnimation.goToAndStop(0, true);
                arrowAnimation.play();
            }, 100);
        } else {
            arrowAnimation.setDirection(1);
            arrowAnimation.goToAndStop(0, true);
            arrowAnimation.play();
        }

        // Show placeholder chat and update text when mouse down if toggle is on
        if (prototypeToggle.checked) {
            placeholderChat.style.opacity = '1';
            titleTextDefault.style.opacity = '0';
            titleTextActive.style.opacity = '1';
            subtitleText.style.opacity = '1';
            container.classList.add('existing-chat-active');
        }
    };

    const playReverse = () => {
        animation.setDirection(-1);
        animation.goToAndStop(animation.totalFrames, true);
        animation.play();
        
        arrowAnimation.setDirection(-1);
        arrowAnimation.goToAndStop(arrowAnimation.totalFrames, true);
        arrowAnimation.play();

        // Hide placeholder chat and restore text when mouse up if toggle is on
        if (prototypeToggle.checked) {
            placeholderChat.style.opacity = '0';
            titleTextDefault.style.opacity = '0';
            titleTextActive.style.opacity = '1';
            subtitleText.style.opacity = '1';
        }
    };

    // Mouse events
    container.addEventListener('mousedown', playForward);
    container.addEventListener('mouseup', playReverse);
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

// Handle chat toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const prototypeToggle = document.getElementById('prototype-toggle');
    const existingChat = document.querySelector('.existing-chat');
    const placeholderChat = document.querySelector('.placeholder-chat');
    const container = document.querySelector('.container');
    const titleTextDefault = document.querySelector('.title-text--default');
    const titleTextActive = document.querySelector('.title-text--active');
    const subtitleText = document.querySelector('.subtitle-text');

    // Set initial state
    existingChat.style.opacity = '0';
    placeholderChat.style.opacity = '1';

    prototypeToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            existingChat.style.opacity = '1';
            placeholderChat.style.opacity = '0';
            titleTextDefault.style.opacity = '0';
            titleTextActive.style.opacity = '1';
            subtitleText.style.opacity = '1';
            container.classList.add('existing-chat-active');
        } else {
            existingChat.style.opacity = '0';
            placeholderChat.style.opacity = '1';
            titleTextDefault.style.opacity = '1';
            titleTextActive.style.opacity = '0';
            subtitleText.style.opacity = '0';
            container.classList.remove('existing-chat-active');
        }
    });
});

let animation;
let arrowAnimation;

// Handle drag events for file dropping
function setupDragEvents(animation, arrowAnimation) {
    const container = document.querySelector('.container');
    const existingChat = document.querySelector('.existing-chat');
    const placeholderChat = document.querySelector('.placeholder-chat');
    const prototypeToggle = document.getElementById('prototype-toggle');
    const titleTextDefault = document.querySelector('.title-text--default');
    const titleTextActive = document.querySelector('.title-text--active');
    const subtitleText = document.querySelector('.subtitle-text');
    
    // Track drag state
    let isDraggingFile = false;
    let dragCounter = 0;
    
    const playForward = () => {
        container.classList.add('drag-over');
        animation.setDirection(1);
        animation.goToAndStop(0, true);
        animation.play();
        
        // Delay arrow animation by 200ms if prototype toggle is checked
        if (prototypeToggle.checked) {
            setTimeout(() => {
                arrowAnimation.setDirection(1);
                arrowAnimation.goToAndStop(0, true);
                arrowAnimation.play();
            }, 200);
        } else {
            arrowAnimation.setDirection(1);
            arrowAnimation.goToAndStop(0, true);
            arrowAnimation.play();
        }

        // Update text states on drag enter
        if (prototypeToggle.checked) {
            container.classList.add('existing-chat-active');
            // Delay showing placeholder until animation starts
            setTimeout(() => {
                placeholderChat.style.opacity = '1';
            }, 50);
        }
        titleTextDefault.style.opacity = '0';
        titleTextActive.style.opacity = '1';
        subtitleText.style.opacity = '1';
    };

    const playReverse = () => {
        container.classList.remove('drag-over');
        animation.setDirection(-1);
        animation.goToAndStop(animation.totalFrames, true);
        animation.play();
        
        arrowAnimation.setDirection(-1);
        arrowAnimation.goToAndStop(arrowAnimation.totalFrames, true);
        arrowAnimation.play();

        // Update text states on drag leave
        if (prototypeToggle.checked) {
            // Delay hiding placeholder until animation starts
            setTimeout(() => {
                container.classList.remove('existing-chat-active');
                placeholderChat.style.opacity = '0';
            }, 50);
            titleTextDefault.style.opacity = '0';
            titleTextActive.style.opacity = '1';
            subtitleText.style.opacity = '1';
        } else {
            titleTextDefault.style.opacity = '1';
            titleTextActive.style.opacity = '0';
            subtitleText.style.opacity = '0';
        }
    };

    // Check if the drag contains files
    function isFileDrag(e) {
        return e.dataTransfer && e.dataTransfer.types && 
               (e.dataTransfer.types.indexOf('Files') !== -1 || 
                e.dataTransfer.types.indexOf('text/uri-list') !== -1);
    }

    // Add window-level drag event handlers for entering the window
    document.addEventListener('dragenter', function(e) {
        if (isFileDrag(e)) {
            dragCounter++;
            if (dragCounter === 1) {
                isDraggingFile = true;
                playForward();
            }
        }
    });

    // Prevent default to allow for drop
    document.addEventListener('dragover', function(e) {
        if (isFileDrag(e)) {
            e.preventDefault();
        }
    });

    // Handle drag leave at document level
    document.addEventListener('dragleave', function(e) {
        if (isFileDrag(e)) {
            dragCounter--;
            if (dragCounter === 0) {
                isDraggingFile = false;
                playReverse();
            }
        }
    });

    // Handle the drop
    document.addEventListener('drop', function(e) {
        if (isFileDrag(e)) {
            e.preventDefault();
            dragCounter = 0;
            isDraggingFile = false;
            playReverse();
            
            // Handle the file drop if it's on the container
            if (container.contains(e.target) || e.target === container) {
                const files = e.dataTransfer.files;
                console.log('Files dropped:', files);
            }
        }
    });

    // Backup safety measure: reset the counter if user clicks anywhere in the document
    document.addEventListener('mousedown', function() {
        if (dragCounter !== 0) {
            dragCounter = 0;
            isDraggingFile = false;
            playReverse();
        }
    });

    // Backup safety measure: reset on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && dragCounter !== 0) {
            dragCounter = 0;
            isDraggingFile = false;
            playReverse();
        }
    });
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

    // Setup drag events
    setupDragEvents(animation, arrowAnimation);
})
.catch(error => {
    console.error('Error loading Lottie data:', error);
});

// Handle chat toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const prototypeToggle = document.getElementById('prototype-toggle');
    const thumbnailsToggle = document.getElementById('thumbnails-toggle');
    const existingChat = document.querySelector('.existing-chat');
    const placeholderChat = document.querySelector('.placeholder-chat');
    const container = document.querySelector('.container');
    const titleTextDefault = document.querySelector('.title-text--default');
    const titleTextActive = document.querySelector('.title-text--active');
    const subtitleText = document.querySelector('.subtitle-text');
    const thumbnails = document.querySelector('.thumbnails');

    // Set initial state
    existingChat.style.opacity = '0';
    placeholderChat.style.opacity = '1';
    titleTextDefault.style.opacity = '1';
    titleTextActive.style.opacity = '0';
    subtitleText.style.opacity = '0';
    thumbnailsToggle.checked = false;

    prototypeToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            existingChat.style.opacity = '1';
            titleTextDefault.style.opacity = '0';
            titleTextActive.style.opacity = '1';
            subtitleText.style.opacity = '1';
            container.classList.add('existing-chat-active');
            // Only hide placeholder if not currently pressing
            if (!container.matches(':active')) {
                placeholderChat.style.opacity = '0';
            }
        } else {
            existingChat.style.opacity = '0';
            titleTextDefault.style.opacity = '1';
            titleTextActive.style.opacity = '0';
            subtitleText.style.opacity = '0';
            container.classList.remove('existing-chat-active');
            placeholderChat.style.opacity = '1';
        }
    });

    thumbnailsToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            // Start expand animation immediately
            requestAnimationFrame(() => {
                thumbnails.classList.add('expand');
                // After height animation, show content
                setTimeout(() => {
                    thumbnails.classList.add('show');
                    // Animate individual thumbnails after container animation
                    setTimeout(() => {
                        document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
                            setTimeout(() => {
                                thumb.classList.add('show');
                            }, index * 50); // Reduced from 80ms to 50ms for faster sequence
                        });
                    }, 50); // Reduced from 200ms to 100ms for faster start
                }, 150); // Reduced from 300ms to 150ms for faster expansion
            });
        } else {
            // Remove all thumbnails at once
            document.querySelectorAll('.thumbnail').forEach(thumb => {
                thumb.classList.remove('show');
            });
            
            // After thumbnails are hidden, fade out container
            setTimeout(() => {
                thumbnails.classList.remove('show');
                // After container fade, collapse height
                setTimeout(() => {
                    thumbnails.classList.remove('expand');
                }, 0);
            }, 0);
        }
    });
});

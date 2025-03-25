// Animation Management
class AnimationManager {
    constructor() {
        this.animation = null;
        this.arrowAnimation = null;
    }

    async initialize() {
        try {
            const [logoData, arrowData] = await Promise.all([
                fetch('lottie/logo-to-plus.json').then(response => response.json()),
                fetch('lottie/arrow.json').then(response => response.json())
            ]);

            this.setupAnimations(logoData, arrowData);
            return true;
        } catch (error) {
            console.error('Error loading Lottie data:', error);
            return false;
        }
    }

    setupAnimations(logoData, arrowData) {
        const logoContainer = document.getElementById('logo-to-plus-lottie');
        const arrowContainer = document.getElementById('arrow-lottie');
        
        this.animation = lottie.loadAnimation({
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

        this.arrowAnimation = lottie.loadAnimation({
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

        this.setInitialState();
    }

    setInitialState() {
        const speed = 1.6;
        this.animation.setSpeed(speed);
        this.arrowAnimation.setSpeed(speed);

        this.animation.setDirection(1);
        this.animation.goToAndStop(0, true);
        
        this.arrowAnimation.setDirection(1);
        this.arrowAnimation.goToAndStop(0, true);
    }

    playForward(prototypeToggle) {
        this.animation.setDirection(1);
        this.animation.goToAndStop(0, true);
        this.animation.play();
        
        if (prototypeToggle.checked) {
            setTimeout(() => this.playArrowForward(), 100);
        } else {
            this.playArrowForward();
        }
    }

    playReverse() {
        this.animation.setDirection(-1);
        this.animation.goToAndStop(this.animation.totalFrames, true);
        this.animation.play();
        
        this.arrowAnimation.setDirection(-1);
        this.arrowAnimation.goToAndStop(this.arrowAnimation.totalFrames, true);
        this.arrowAnimation.play();
    }

    playArrowForward() {
        this.arrowAnimation.setDirection(1);
        this.arrowAnimation.goToAndStop(0, true);
        this.arrowAnimation.play();
    }
}

// UI State Management
class UIStateManager {
    constructor() {
        this.elements = {
            container: document.querySelector('.container'),
            existingChat: document.querySelector('.existing-chat'),
            placeholderChat: document.querySelector('.placeholder-chat'),
            prototypeToggle: document.getElementById('prototype-toggle'),
            titleTextDefault: document.querySelector('.title-text--default'),
            titleTextActive: document.querySelector('.title-text--active'),
            subtitleText: document.querySelector('.subtitle-text'),
            thumbnailsToggle: document.getElementById('thumbnails-toggle'),
            thumbnails: document.querySelector('.thumbnails')
        };
    }

    setInitialState() {
        this.elements.existingChat.style.opacity = '0';
        this.elements.placeholderChat.style.opacity = '1';
        this.elements.titleTextDefault.style.opacity = '1';
        this.elements.titleTextActive.style.opacity = '0';
        this.elements.subtitleText.style.opacity = '0';
        this.elements.thumbnailsToggle.checked = false;
        
        this.elements.thumbnails.classList.remove('expand', 'show');
        document.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.classList.remove('show');
        });
    }

    updateUIState(isPrototypeActive) {
        const {
            existingChat,
            placeholderChat,
            titleTextDefault,
            titleTextActive,
            subtitleText,
            container
        } = this.elements;

        if (isPrototypeActive) {
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
    }

    handleThumbnailsToggle(isExpanded) {
        const { thumbnails } = this.elements;
        
        if (isExpanded) {
            this.expandThumbnails();
        } else {
            this.collapseThumbnails();
        }
    }

    expandThumbnails() {
        const { thumbnails } = this.elements;
        
        requestAnimationFrame(() => {
            thumbnails.classList.add('expand');
            setTimeout(() => {
                thumbnails.classList.add('show');
                setTimeout(() => {
                    document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
                        setTimeout(() => thumb.classList.add('show'), index * 80);
                    });
                }, 200);
            }, 300);
        });
    }

    collapseThumbnails() {
        const { thumbnails } = this.elements;
        
        document.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.classList.remove('show');
        });
        
        setTimeout(() => {
            thumbnails.classList.remove('show');
            setTimeout(() => thumbnails.classList.remove('expand'), 0);
        }, 0);
    }
}

// Event Handler
class EventHandler {
    constructor(animationManager, uiStateManager) {
        this.animationManager = animationManager;
        this.uiStateManager = uiStateManager;
    }

    setupEventListeners() {
        const { container, prototypeToggle, thumbnailsToggle } = this.uiStateManager.elements;

        // Mouse events
        container.addEventListener('mousedown', () => {
            this.animationManager.playForward(prototypeToggle);
            if (prototypeToggle.checked) {
                this.uiStateManager.updateUIState(true);
            }
        });

        container.addEventListener('mouseup', () => {
            this.animationManager.playReverse();
            if (prototypeToggle.checked) {
                this.uiStateManager.updateUIState(true);
            } else {
                this.uiStateManager.updateUIState(false);
            }
        });

        // Toggle events
        prototypeToggle.addEventListener('change', (e) => {
            this.uiStateManager.updateUIState(e.target.checked);
        });

        thumbnailsToggle.addEventListener('change', (e) => {
            this.uiStateManager.handleThumbnailsToggle(e.target.checked);
        });
    }
}

// Initialize application
async function initializeApp() {
    const animationManager = new AnimationManager();
    const uiStateManager = new UIStateManager();
    
    await animationManager.initialize();
    uiStateManager.setInitialState();
    
    const eventHandler = new EventHandler(animationManager, uiStateManager);
    eventHandler.setupEventListeners();
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

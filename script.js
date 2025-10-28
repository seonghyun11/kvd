window.onload = () => {
    const hitIndicatorsToggle = document.getElementById('hitIndicatorsToggle');
    const musicToggle = document.getElementById('musicToggle');
    
    const songs = [
        { element: document.getElementById('song1'), title: 'misty morning in the springtime'},
        { element: document.getElementById('song2'), title: 'hellebore' },
        { element: document.getElementById('song3'), title: 'to be real' }
    ];
    const musicPlayer = document.getElementById('musicPlayer');
    const songTitle = document.getElementById('songTitle');
    const playPauseButton = document.getElementById('playPauseButton');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    
    let currentSongIndex = 0;
    let hitIndicatorsEnabled = false;
    let musicEnabled = false;
    let isPlaying = false;
    
    const topIndicator = document.getElementById('topIndicator');
    const bottomIndicator = document.getElementById('bottomIndicator');
    const leftIndicator = document.getElementById('leftIndicator');
    const rightIndicator = document.getElementById('rightIndicator');
    
    hitIndicatorsToggle.addEventListener('change', (e) => {
        hitIndicatorsEnabled = e.target.checked;
    });
    
    function updateSongTitle() {
        songTitle.textContent = songs[currentSongIndex].title;
    }
    
    function playCurrentSong() {
        songs[currentSongIndex].element.play().catch(err => {
            console.log('Audio play failed:', err);
            musicToggle.checked = false;
            musicEnabled = false;
            musicPlayer.classList.remove('visible');
            isPlaying = false;
        });
        isPlaying = true;
        playPauseButton.textContent = '❚❚';
    }
    
    function pauseCurrentSong() {
        songs[currentSongIndex].element.pause();
        isPlaying = false;
        playPauseButton.textContent = '▶';
    }
    
    function stopAllSongs() {
        songs.forEach(song => {
            song.element.pause();
            song.element.currentTime = 0;
        });
    }
    
    function switchToSong(index) {
        stopAllSongs();
        currentSongIndex = index;
        updateSongTitle();
        if (musicEnabled && isPlaying) {
            playCurrentSong();
        }
    }
    
    songs.forEach((song, index) => {
        song.element.addEventListener('ended', () => {
            if (musicEnabled) {
                switchToSong((index + 1) % songs.length);
            }
        });
    });
    
    musicToggle.addEventListener('change', (e) => {
        musicEnabled = e.target.checked;
        if (musicEnabled) {
            musicPlayer.classList.add('visible');
            playCurrentSong();
        } else {
            musicPlayer.classList.remove('visible');
            pauseCurrentSong();
        }
    });
    
    playPauseButton.addEventListener('click', () => {
        if (isPlaying) {
            pauseCurrentSong();
        } else {
            playCurrentSong();
        }
    });
    
    prevButton.addEventListener('click', () => {
        switchToSong((currentSongIndex - 1 + songs.length) % songs.length);
    });
    
    nextButton.addEventListener('click', () => {
        switchToSong((currentSongIndex + 1) % songs.length);
    });
    
    updateSongTitle();
    
    function showEdgeIndicator(edge, color, posX, posY) {
        if (!hitIndicatorsEnabled) return;
        
        let indicator;
        switch(edge) {
            case 'top':
                indicator = topIndicator;
                indicator.style.top = '0';
                indicator.style.left = (posX - 100) + 'px';
                break;
            case 'bottom':
                indicator = bottomIndicator;
                indicator.style.bottom = '0';
                indicator.style.left = (posX - 100) + 'px';
                break;
            case 'left':
                indicator = leftIndicator;
                indicator.style.left = '0';
                indicator.style.top = (posY - 100) + 'px';
                break;
            case 'right':
                indicator = rightIndicator;
                indicator.style.right = '0';
                indicator.style.top = (posY - 100) + 'px';
                break;
        }
        
        if (indicator) {
            indicator.style.color = `hsl(${color}, 100%, 65%)`;
            indicator.style.opacity = '0.9';
            setTimeout(() => {
                indicator.style.opacity = '0';
            }, 50);
        }
    }
    
    const cornerGlow = document.getElementById('cornerGlow');
    const returnGlow = document.getElementById('returnGlow');
    const horizontalGlow = document.getElementById('horizontalGlow');
    const returnHorizontalGlow = document.getElementById('returnHorizontalGlow');
    const mainPage = document.getElementById('mainPage');
    const infoPage = document.getElementById('infoPage');
    
    let hoverStartTime = null;
    let isHovering = false;
    let hasTransitioned = false;
    const HOVER_DURATION = 1300;
    const TRANSITION_DURATION = 1200;
    let animationFrameId = null;
    let returnHoverStartTime = null;
    let isReturnHovering = false;
    let returnAnimationFrameId = null;
    
    cornerGlow.addEventListener('mouseenter', () => {
        if (hasTransitioned) return;
        isHovering = true;
        hoverStartTime = Date.now();
        animateGlow();
    });
    
    cornerGlow.addEventListener('mouseleave', () => {
        isHovering = false;
        hoverStartTime = null;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        fadeGlowOut();
    });
    
    function animateGlow() {
        if (!isHovering || hasTransitioned) return;
        
        const elapsed = Date.now() - hoverStartTime;
        const progress = Math.min(elapsed / HOVER_DURATION, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const randomnessFactor = 1 - (progress * 0.8);
        const randomPulse = Math.sin(elapsed * 0.004) * 0.04 * randomnessFactor;
        const scale = 1 + (easeProgress * 0.8);
        const baseOpacity = 1 + (easeProgress * 6);
        const opacity = baseOpacity * (1 + randomPulse);
        const blur = 8 + (easeProgress * 20);
        
        cornerGlow.style.transform = `scale(${scale})`;
        cornerGlow.style.transformOrigin = 'bottom right';
        cornerGlow.style.opacity = opacity;
        cornerGlow.style.filter = `blur(${blur}px)`;
        
        if (elapsed >= HOVER_DURATION) {
            hasTransitioned = true;
            animateHorizontalGlow();
            mainPage.classList.add('slide-up');
            infoPage.classList.add('visible');
            animateReturnGlowEntrance();
        } else {
            animationFrameId = requestAnimationFrame(animateGlow);
        }
    }
    
    function animateHorizontalGlow() {
        const startTime = Date.now();
        const duration = 600;
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const width = easeProgress * 100;
            const opacity = progress < 0.3 ? progress / 0.3 : 1 - ((progress - 0.3) / 0.7);
            
            horizontalGlow.style.width = width + '%';
            horizontalGlow.style.opacity = opacity;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                horizontalGlow.style.width = '0';
                horizontalGlow.style.opacity = '0';
            }
        }
        
        animate();
    }
    
    function animateReturnGlowEntrance() {
        returnGlow.style.opacity = '1';
    }
    
    function fadeGlowOut() {
        let start = null;
        const duration = 400;
        const startScale = parseFloat(cornerGlow.style.transform?.match(/scale\(([\d.]+)\)/)?.[1] || 1);
        const startOpacity = parseFloat(cornerGlow.style.opacity || 1);
        const startBlur = parseFloat(cornerGlow.style.filter?.match(/blur\(([\d.]+)px\)/)?.[1] || 8);
        
        function fade(timestamp) {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            const scale = startScale - ((startScale - 1) * progress);
            const opacity = startOpacity - ((startOpacity - 1) * progress);
            const blur = startBlur - ((startBlur - 8) * progress);
            
            cornerGlow.style.transform = `scale(${scale})`;
            cornerGlow.style.opacity = opacity;
            cornerGlow.style.filter = `blur(${blur}px)`;
            
            if (progress < 1) {
                requestAnimationFrame(fade);
            } else {
                cornerGlow.style.transform = '';
                cornerGlow.style.opacity = '';
                cornerGlow.style.filter = '';
            }
        }
        
        requestAnimationFrame(fade);
    }
    
    returnGlow.addEventListener('mouseenter', () => {
        if (!hasTransitioned) return;
        isReturnHovering = true;
        returnHoverStartTime = Date.now();
        animateReturnGlow();
    });
    
    returnGlow.addEventListener('mouseleave', () => {
        isReturnHovering = false;
        returnHoverStartTime = null;
        if (returnAnimationFrameId) {
            cancelAnimationFrame(returnAnimationFrameId);
        }
        fadeReturnGlowOut();
    });
    
    function animateReturnGlow() {
        if (!isReturnHovering) return;
        
        const elapsed = Date.now() - returnHoverStartTime;
        const progress = Math.min(elapsed / HOVER_DURATION, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const randomnessFactor = 1 - (progress * 0.8);
        const randomPulse = Math.sin(elapsed * 0.004) * 0.04 * randomnessFactor;
        const scale = 1 + (easeProgress * 0.8);
        const baseOpacity = 1 + (easeProgress * 6);
        const opacity = baseOpacity * (1 + randomPulse);
        const blur = 8 + (easeProgress * 20);
        
        returnGlow.style.transform = `scale(${scale})`;
        returnGlow.style.transformOrigin = 'top right';
        returnGlow.style.opacity = opacity;
        returnGlow.style.filter = `blur(${blur}px)`;
        
        if (elapsed >= HOVER_DURATION) {
            returnToMainPage();
        } else {
            returnAnimationFrameId = requestAnimationFrame(animateReturnGlow);
        }
    }
    
    function fadeReturnGlowOut() {
        let start = null;
        const duration = 400;
        const startScale = parseFloat(returnGlow.style.transform?.match(/scale\(([\d.]+)\)/)?.[1] || 1);
        const startOpacity = parseFloat(returnGlow.style.opacity || 1);
        const startBlur = parseFloat(returnGlow.style.filter?.match(/blur\(([\d.]+)px\)/)?.[1] || 8);
        
        function fade(timestamp) {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            const scale = startScale - ((startScale - 1) * progress);
            const opacity = startOpacity - ((startOpacity - 1) * progress);
            const blur = startBlur - ((startBlur - 8) * progress);
            
            returnGlow.style.transform = `scale(${scale})`;
            returnGlow.style.opacity = opacity;
            returnGlow.style.filter = `blur(${blur}px)`;
            
            if (progress < 1) {
                requestAnimationFrame(fade);
            } else {
                returnGlow.style.transform = '';
                returnGlow.style.opacity = '1';
                returnGlow.style.filter = '';
            }
        }
        
        requestAnimationFrame(fade);
    }
    
    function returnToMainPage() {
        animateReturnHorizontalGlow();
        mainPage.classList.remove('slide-up');
        infoPage.classList.remove('visible');
        
        setTimeout(() => {
            hasTransitioned = false;
            cornerGlow.style.transform = '';
            cornerGlow.style.opacity = '';
            cornerGlow.style.filter = '';
            returnGlow.style.transform = '';
            returnGlow.style.opacity = '0';
            returnGlow.style.filter = '';
        }, TRANSITION_DURATION);
    }
    
    function animateReturnHorizontalGlow() {
        const startTime = Date.now();
        const duration = 600;
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const width = easeProgress * 100;
            const opacity = progress < 0.3 ? progress / 0.3 : 1 - ((progress - 0.3) / 0.7);
            
            returnHorizontalGlow.style.width = width + '%';
            returnHorizontalGlow.style.opacity = opacity;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                returnHorizontalGlow.style.width = '0';
                returnHorizontalGlow.style.opacity = '0';
            }
        }
        
        animate();
    }

    const logo = document.getElementById('bouncingLogo');

    const startAnimation = () => {
        let viewportWidth = window.innerWidth;
        let viewportHeight = window.innerHeight;
        let logoWidth = logo.offsetWidth;
        let logoHeight = logo.offsetHeight;

        const paddingLeft = 58;
        const paddingRight = 58;
        const paddingTop = 120;
        const paddingBottom = 120;

        const corner = Math.floor(Math.random() * 4);
        let x, y, dx, dy;
        const speed = 3;
        const offscreenDistance = 500;
        
        switch(corner) {
            case 0:
                x = -offscreenDistance;
                y = -offscreenDistance;
                dx = speed;
                dy = speed;
                break;
            case 1:
                x = viewportWidth + offscreenDistance;
                y = -offscreenDistance;
                dx = -speed;
                dy = speed;
                break;
            case 2:
                x = -offscreenDistance;
                y = viewportHeight + offscreenDistance;
                dx = speed;
                dy = -speed;
                break;
            case 3:
                x = viewportWidth + offscreenDistance;
                y = viewportHeight + offscreenDistance;
                dx = -speed;
                dy = -speed;
                break;
        }

        const colors = [0, 60, 120, 180, 240, 300];
        let colorIndex = -1;
        let hue = 0;
        let hasEnteredViewport = false;
        let logoVisible = false;
        let hasHadFirstBounce = false;

        let mouseX = -1000;
        let mouseY = -1000;
        const cursorRadius = 10;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animate() {
            x += dx;
            y += dy;

            const logoCenterX = x + logoWidth / 2;
            const logoCenterY = y + logoHeight / 2;
            const distX = mouseX - logoCenterX;
            const distY = mouseY - logoCenterY;
            const distance = Math.sqrt(distX * distX + distY * distY);
            const logoRadius = Math.min(
                (logoWidth - paddingLeft - paddingRight) / 2,
                (logoHeight - paddingTop - paddingBottom) / 2
            );
            
            if (distance < logoRadius + cursorRadius) {
                const angle = Math.atan2(logoCenterY - mouseY, logoCenterX - mouseX);
                const knockForce = 8;
                dx = Math.cos(angle) * knockForce;
                dy = Math.sin(angle) * knockForce;
                
                if (hasEnteredViewport && hasHadFirstBounce) {
                    colorIndex = (colorIndex + 1) % colors.length;
                    hue = colors[colorIndex];
                    logo.style.filter = `hue-rotate(${hue}deg)`;
                }
                
                const pushDistance = logoRadius + cursorRadius - distance + 5;
                x += Math.cos(angle) * pushDistance;
                y += Math.sin(angle) * pushDistance;
            }

            let hitWall = false;

            if (x + logoWidth - paddingRight >= viewportWidth) {
                dx = -dx;
                x = viewportWidth - logoWidth + paddingRight;
                if (!hasEnteredViewport) {
                    hasEnteredViewport = true;
                } else if (hasHadFirstBounce) {
                    hitWall = true;
                }
                showEdgeIndicator('right', hue, viewportWidth, y + logoHeight / 2);
            }

            if (x + paddingLeft <= 0) {
                dx = -dx;
                x = -paddingLeft;
                if (!hasEnteredViewport) {
                    hasEnteredViewport = true;
                } else if (hasHadFirstBounce) {
                    hitWall = true;
                }
                showEdgeIndicator('left', hue, 0, y + logoHeight / 2);
            }

            if (y + logoHeight - paddingBottom >= viewportHeight) {
                dy = -dy;
                y = viewportHeight - logoHeight + paddingBottom;
                if (!hasEnteredViewport) {
                    hasEnteredViewport = true;
                } else if (hasHadFirstBounce) {
                    hitWall = true;
                }
                showEdgeIndicator('bottom', hue, x + logoWidth / 2, viewportHeight);
            }

            if (y + paddingTop <= 0) {
                dy = -dy;
                y = -paddingTop;
                if (!hasEnteredViewport) {
                    hasEnteredViewport = true;
                } else if (hasHadFirstBounce) {
                    hitWall = true;
                }
                showEdgeIndicator('top', hue, x + logoWidth / 2, 0);
            }
            
            if (hasEnteredViewport && !hasHadFirstBounce) {
                hasHadFirstBounce = true;
            }

            const normalSpeed = 3;
            const decayRate = 0.98;
            const currentSpeed = Math.sqrt(dx * dx + dy * dy);
            
            if (currentSpeed > normalSpeed) {
                dx *= decayRate;
                dy *= decayRate;
                
                if (Math.abs(currentSpeed - normalSpeed) < 0.1) {
                    const angle = Math.atan2(dy, dx);
                    dx = Math.cos(angle) * normalSpeed;
                    dy = Math.sin(angle) * normalSpeed;
                }
            }

            logo.style.left = x + 'px';
            logo.style.top = y + 'px';
            
            if (!logoVisible) {
                logo.style.opacity = '1';
                logoVisible = true;
            }

            if (hitWall && hasEnteredViewport) {
                colorIndex = (colorIndex + 1) % colors.length;
                hue = colors[colorIndex];
                logo.style.filter = `hue-rotate(${hue}deg)`;
            }

            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => {
            viewportWidth = window.innerWidth;
            viewportHeight = window.innerHeight;
            logoWidth = logo.offsetWidth;
            logoHeight = logo.offsetHeight;
        });

        animate();
    };

    if (logo.complete) {
        startAnimation();
    } else {
        logo.addEventListener('load', startAnimation);
    }
};

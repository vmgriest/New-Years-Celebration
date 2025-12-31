    // Get DOM elements
    const currentTimeEl = document.getElementById('currentTime');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const midnightMessageEl = document.getElementById('midnightMessage');
    const fireworksTitleEl = document.getElementById('fireworksTitle');
    
    let hasCelebrated = false;
    let celebrationInterval;
    
    // Format time to always show 2 digits
    function formatTime(num) {
      return num.toString().padStart(2, '0');
    }
    
    // Get time until midnight
    function getTimeUntilMidnight() {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0); // Set to next midnight
      
      const diff = midnight - now;
      
      // If it's already midnight (or within 1 second)
      if (diff <= 1000) {
        return { hours: 0, minutes: 0, seconds: 0, isMidnight: true };
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return { hours, minutes, seconds, isMidnight: false };
    }
    
    // Update the countdown display
    function updateCountdown() {
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      currentTimeEl.textContent = `Current time: ${timeString}`;
      
      const timeUntil = getTimeUntilMidnight();
      
      if (timeUntil.isMidnight) {
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        
        if (!hasCelebrated) {
          startMidnightCelebration();
          hasCelebrated = true;
        }
      } else {
        hoursEl.textContent = formatTime(timeUntil.hours);
        minutesEl.textContent = formatTime(timeUntil.minutes);
        secondsEl.textContent = formatTime(timeUntil.seconds);
        hasCelebrated = false; // Reset for next day
      }
    }
    
    // Start the midnight celebration
    function startMidnightCelebration() {
      midnightMessageEl.style.display = 'block';
      fireworksTitleEl.style.display = 'block';
      
      // Start continuous confetti
      celebrationInterval = setInterval(launchConfettiBursts, 100);
      
      // Stop celebration after 30 seconds
      setTimeout(() => {
        clearInterval(celebrationInterval);
        midnightMessageEl.style.display = 'none';
        fireworksTitleEl.style.display = 'none';
      }, 30000);
    }
    
    // Launch multiple confetti bursts
    function launchConfettiBursts() {
      // Random color palettes
      const colorPalettes = [
        ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
        ['#ff6b6b', '#4ecdc4', '#ffe66d', '#06d6a0', '#118ab2'],
        ['#f94144', '#f3722c', '#f8961e', '#90be6d', '#43aa8b'],
        ['#ff9a00', '#ff006e', '#ffbe0b', '#3a86ff', '#8338ec']
      ];
      
      const colors = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
      
      // Launch from left
      confetti({
        particleCount: Math.floor(Math.random() * 30) + 20,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
        scalar: Math.random() * 0.5 + 0.7
      });
      
      // Launch from right
      confetti({
        particleCount: Math.floor(Math.random() * 30) + 20,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
        scalar: Math.random() * 0.5 + 0.7
      });
      
      // Random center bursts
      if (Math.random() > 0.5) {
        confetti({
          particleCount: Math.floor(Math.random() * 50) + 30,
          spread: Math.random() * 50 + 50,
          origin: { 
            y: Math.random() * 0.3 + 0.4,
            x: Math.random() * 0.4 + 0.3
          },
          colors: colors,
          decay: Math.random() * 0.1 + 0.85,
          scalar: Math.random() * 0.5 + 0.8
        });
      }
      
      // Occasionally do big bursts
      if (Math.random() > 0.9) {
        confetti({
          particleCount: 150,
          spread: 360,
          ticks: 100,
          origin: { y: 0.4 },
          colors: colors,
          scalar: 1.2
        });
      }
    }
    
    // Special big celebration bursts
    function launchBigCelebration() {
      // Big central burst
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff0000', '#00ff00', '#0000ff'],
        scalar: 1.2
      });
      
      // Firework-style bursts from bottom
      setTimeout(() => {
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            confetti({
              particleCount: 100,
              angle: 90,
              spread: 360,
              startVelocity: 40,
              decay: 0.9,
              origin: { 
                x: Math.random() * 0.4 + 0.3,
                y: 0.1
              },
              colors: ['#ff9a00', '#ff006e', '#ffbe0b'],
              scalar: 1.3
            });
          }, i * 200);
        }
      }, 500);
    }
    
    // Check if it's already midnight on page load
    window.addEventListener('load', () => {
      const timeUntil = getTimeUntilMidnight();
      if (timeUntil.isMidnight) {
        startMidnightCelebration();
        // Launch initial big celebration
        setTimeout(launchBigCelebration, 500);
      }
      
      // Update immediately
      updateCountdown();
    });
    
    // Update countdown every second
    setInterval(updateCountdown, 1000);
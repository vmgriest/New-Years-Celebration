// Get DOM elements
const currentTimeEl = document.getElementById('currentTime');
const currentYearEl = document.getElementById('currentYear');
const nextYearEl = document.getElementById('nextYear');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const midnightMessageEl = document.getElementById('midnightMessage');

let hasCelebrated = false;
let celebrationInterval;

// Format time to show specific digits
function formatTime(num, digits = 2) {
  return num.toString().padStart(digits, '0');
}

// Get the current year
function getCurrentYear() {
  return new Date().getFullYear();
}

// Check if we're in the New Year period (Jan 1st, but not necessarily at midnight)
function isNewYearsDay() {
  const now = new Date();
  return now.getMonth() === 0 && now.getDate() === 1;
}

// Get the next New Year's date
function getNextNewYearsDate() {
  const now = new Date();
  const currentYear = getCurrentYear();
  
  // If it's January 1st, we need to determine if we're counting down to this year or next
  if (isNewYearsDay()) {
    // If it's before midnight on Jan 1st, we're counting to this year's midnight
    // If it's after midnight on Jan 1st, we're counting to next year
    if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() <= 1) {
      // It's exactly midnight on New Year's - celebrate and start counting to next year
      return {
        nextYear: currentYear + 1,
        nextNewYears: new Date(currentYear + 1, 0, 1, 0, 0, 0, 0),
        shouldCelebrate: true
      };
    } else {
      // It's Jan 1st but not midnight yet - count to this year's midnight
      const todayMidnight = new Date(currentYear, 0, 1, 0, 0, 0, 0);
      if (now < todayMidnight) {
        // This shouldn't happen unless clock is wrong, but handle it
        return {
          nextYear: currentYear,
          nextNewYears: todayMidnight,
          shouldCelebrate: false
        };
      } else {
        // It's past midnight on Jan 1st - count to next year
        return {
          nextYear: currentYear + 1,
          nextNewYears: new Date(currentYear + 1, 0, 1, 0, 0, 0, 0),
          shouldCelebrate: false
        };
      }
    }
  }
  
  // For any other day of the year, count to next year's Jan 1st
  return {
    nextYear: currentYear + 1,
    nextNewYears: new Date(currentYear + 1, 0, 1, 0, 0, 0, 0),
    shouldCelebrate: false
  };
}

// Get time until next New Year
function getTimeUntilNewYear() {
  const now = new Date();
  const { nextYear, nextNewYears, shouldCelebrate } = getNextNewYearsDate();
  
  const diff = nextNewYears - now;
  
  // If we should celebrate (it's exactly midnight) or if diff is very small
  if (shouldCelebrate || (diff <= 1000 && diff >= -1000)) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      isNewYear: true,
      nextYear: nextYear
    };
  }
  
  // Calculate total hours, minutes, seconds
  const totalHours = Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
  const hours = totalHours;
  const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
  const seconds = Math.max(0, Math.floor((diff % (1000 * 60)) / 1000));
  
  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    isNewYear: false,
    nextYear: nextYear
  };
}

// Launch multiple confetti bursts (for New Year celebration) - UPDATED FOR MORE/FREQUENT CONFETTI
function launchConfettiBursts() {
  // Random color palettes
  const colorPalettes = [
    ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
    ['#ff6b6b', '#4ecdc4', '#ffe66d', '#06d6a0', '#118ab2'],
    ['#f94144', '#f3722c', '#f8961e', '#90be6d', '#43aa8b'],
    ['#ff9a00', '#ff006e', '#ffbe0b', '#3a86ff', '#8338ec'],
    ['#ff0000', '#ff9a00', '#ffcc00', '#ffeb3b', '#ffffff'],
    ['#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50']
  ];
  
  const colors = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
  
  // Launch from left - INCREASED PARTICLE COUNT
  confetti({
    particleCount: Math.floor(Math.random() * 80) + 40, // Increased from 20-50 to 40-120
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors: colors,
    scalar: Math.random() * 0.5 + 0.8, // Slightly larger
    startVelocity: Math.random() * 30 + 30 // Higher velocity
  });
  
  // Launch from right - INCREASED PARTICLE COUNT
  confetti({
    particleCount: Math.floor(Math.random() * 80) + 40, // Increased from 20-50 to 40-120
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors: colors,
    scalar: Math.random() * 0.5 + 0.8,
    startVelocity: Math.random() * 30 + 30
  });
  
  // Random center bursts - MORE FREQUENT (80% chance)
  if (Math.random() > 0.2) { // Changed from 0.5 to 0.2
    confetti({
      particleCount: Math.floor(Math.random() * 100) + 60, // Increased from 30-80 to 60-160
      spread: Math.random() * 50 + 50,
      origin: { 
        y: Math.random() * 0.4 + 0.3, // Adjusted position
        x: Math.random() * 0.4 + 0.3
      },
      colors: colors,
      decay: Math.random() * 0.1 + 0.85,
      scalar: Math.random() * 0.5 + 0.9,
      startVelocity: Math.random() * 40 + 30
    });
  }
  
  // Occasionally do big bursts - MORE FREQUENT (25% chance)
  if (Math.random() > 0.75) { // Changed from 0.9 to 0.75
    confetti({
      particleCount: 180, // Increased from 150
      spread: 100, // Increased spread
      ticks: 120,
      origin: { 
        y: 0.4,
        x: Math.random() * 0.6 + 0.2
      },
      colors: colors,
      scalar: 1.3,
      startVelocity: 40
    });
  }
  
  // Add occasional upward bursts (20% chance)
  if (Math.random() > 0.8) {
    confetti({
      particleCount: Math.floor(Math.random() * 60) + 40,
      angle: 270,
      spread: 40,
      startVelocity: 45,
      origin: { 
        x: Math.random() * 0.6 + 0.2,
        y: 0.9
      },
      colors: colors,
      scalar: 0.9,
      decay: 0.9
    });
  }
}

// Special big celebration bursts - ENHANCED
function launchBigCelebration() {
  // Big central burst - INCREASED
  confetti({
    particleCount: 250, // Increased from 200
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
    scalar: 1.3,
    startVelocity: 45
  });
  
  // Firework-style bursts from bottom - MORE BURSTS
  setTimeout(() => {
    for (let i = 0; i < 8; i++) { // Increased from 5 to 8
      setTimeout(() => {
        const colorPalette = [
          ['#ff9a00', '#ff006e', '#ffbe0b'],
          ['#3a86ff', '#8338ec', '#ff006e'],
          ['#ff0000', '#ffff00', '#00ff00'],
          ['#00ffff', '#ff00ff', '#ffff00']
        ][i % 4];
        
        confetti({
          particleCount: 120, // Increased from 100
          angle: 90,
          spread: 360,
          startVelocity: 50, // Increased velocity
          decay: 0.9,
          origin: { 
            x: Math.random() * 0.5 + 0.25,
            y: 0.1
          },
          colors: colorPalette,
          scalar: 1.4,
          ticks: 120
        });
      }, i * 150); // Faster interval: 150ms instead of 200ms
    }
  }, 300); // Reduced delay: 300ms instead of 500ms
  
  // Add horizontal bursts after firework
  setTimeout(() => {
    // Left to right
    confetti({
      particleCount: 100,
      angle: 0,
      spread: 30,
      startVelocity: 50,
      origin: { x: 0, y: 0.5 },
      colors: ['#ff9a00', '#ff006e', '#ffbe0b'],
      scalar: 1.2
    });
    
    // Right to left
    setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 180,
        spread: 30,
        startVelocity: 50,
        origin: { x: 1, y: 0.5 },
        colors: ['#3a86ff', '#8338ec', '#ff006e'],
        scalar: 1.2
      });
    }, 200);
  }, 1000);
}

// Function to launch a single confetti burst (for page load) - ENHANCED
function launchConfettiBurst() {
  const colorPalettes = [
    ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
    ['#ff6b6b', '#4ecdc4', '#ffe66d', '#06d6a0', '#118ab2'],
    ['#f94144', '#f3722c', '#f8961e', '#90be6d', '#43aa8b']
  ];
  
  const colors = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
  
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

// Update the countdown display
function updateCountdown() {
  const now = new Date();
  const currentYear = getCurrentYear();
  
  // Update current time display
  const timeString = now.toLocaleTimeString();
  currentTimeEl.textContent = `Current time: ${timeString}`;
  
  // Get next New Year's info
  const { nextYear } = getNextNewYearsDate();
  
  // Update year displays
  currentYearEl.textContent = currentYear;
  nextYearEl.textContent = nextYear;
  
  // Get time until next New Year
  const timeUntil = getTimeUntilNewYear();
  
  if (timeUntil.isNewYear) {
    hoursEl.textContent = '0000';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
    
    if (!hasCelebrated) {
      startNewYearCelebration();
      hasCelebrated = true;
    }
  } else {
    // Format hours as 4 digits (0000 format)
    hoursEl.textContent = formatTime(timeUntil.hours, 4);
    minutesEl.textContent = formatTime(timeUntil.minutes);
    secondsEl.textContent = formatTime(timeUntil.seconds);
    hasCelebrated = false; // Reset for next year
  }
}

// Start the New Year celebration - ENHANCED FOR FASTER CONFETTI
function startNewYearCelebration() {
  midnightMessageEl.style.display = 'block';
  
  // Start continuous confetti - FASTER INTERVAL
  celebrationInterval = setInterval(launchConfettiBursts, 80); // Changed from 100ms to 80ms
  
  // Launch big initial celebration with delay
  setTimeout(launchBigCelebration, 300); // Reduced delay
  
  // Update year display to show the new current year
  setTimeout(() => {
    const currentYear = getCurrentYear();
    currentYearEl.textContent = currentYear;
    nextYearEl.textContent = currentYear + 1;
  }, 800);
  
  // Stop celebration after 45 seconds (increased from 30)
  setTimeout(() => {
    clearInterval(celebrationInterval);
    midnightMessageEl.style.display = 'none';
  }, 45000);
}

// Initialize on page load
window.addEventListener('load', () => {
  // Trigger multiple confetti bursts immediately when page loads
  launchConfettiBurst();
  
  // Add more frequent initial bursts
  setTimeout(() => launchConfettiBurst(), 800);
  setTimeout(() => launchConfettiBurst(), 1600);
  
  // Set initial display
  const currentYear = getCurrentYear();
  currentYearEl.textContent = currentYear;
  
  // Update immediately
  updateCountdown();
  
  // Check if we should start celebrating immediately (if it's New Year)
  const timeUntil = getTimeUntilNewYear();
  if (timeUntil.isNewYear && !hasCelebrated) {
    startNewYearCelebration();
  }
  
  // Trigger additional frequent confetti bursts
  setTimeout(launchConfettiBurst, 2000);
  setTimeout(launchConfettiBurst, 3500);
  setTimeout(launchConfettiBurst, 5000);
  
  // Add a continuous burst every 1 seconds for 10 seconds
  let pageLoadInterval;
  pageLoadInterval = setInterval(() => {
    launchConfettiBurst();
  }, 1000);
  
  // Stop the page load bursts after 10 seconds
  setTimeout(() => {
    clearInterval(pageLoadInterval);
  }, 10000);
});

// Update countdown every second
setInterval(updateCountdown, 1000);
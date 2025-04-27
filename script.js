document.addEventListener("DOMContentLoaded", () => {

  /* --- Cat Following Mouse --- */
  const cat = document.getElementById("chasing-cat-img");
  if (cat) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let catX = mouseX, catY = mouseY;
    const speed = 0.08;
    const followDelay = 100;
    let followTimeout = null;
    let scaleX = 1;
    let animating = false;

    const idleFrame = "images/cat-3.png";
    const walkFrames = ["images/cat-1.png", "images/cat-2.png", "images/cat-4.png", "images/cat-5.png", "images/cat-6.png", "images/cat-7.png", "images/cat-8.png"];
    let walkIndex = 0, lastFrameTime = 0, frameInterval = 100; // ms between walk frames

    function loop(currentTime) {
      if (!animating) return;

      const dxMouse = mouseX - catX;
      const dyMouse = mouseY - catY;
      if (Math.abs(dxMouse) > 2) { // Only flip if moving horizontally significantly
         scaleX = dxMouse > 0 ? 1 : -1;
      }

      // Adjust target to center the mouse on the cat image roughly
      const targetX = mouseX - scaleX * (cat.offsetWidth / 2);
      const targetY = mouseY - (cat.offsetHeight / 2);

      const dx = targetX - catX;
      const dy = targetY - catY;
      const dist = Math.hypot(dx, dy);
      const moving = dist > 5; // Is the cat far enough from the target to be considered 'moving'?

      // Move cat towards target
      if (dist > 1) { // Only move if not already very close
          catX += dx * speed;
          catY += dy * speed;
      }

      cat.style.transform = `translate(${catX.toFixed(2)}px, ${catY.toFixed(2)}px) scaleX(${scaleX})`;

      // Handle walking animation
      if (moving) {
         if (currentTime - lastFrameTime > frameInterval) {
             walkIndex = (walkIndex + 1) % walkFrames.length;
             cat.src = walkFrames[walkIndex];
             lastFrameTime = currentTime;
         }
      } else {
         // If not moving, switch back to idle frame if not already there
         if (cat.src !== idleFrame) {
             cat.src = idleFrame;
         }
         walkIndex = 0; // Reset walk cycle
      }

      requestAnimationFrame(loop);
    }

    function startFollowing() {
      if (animating) return;
      animating = true;
      cat.style.opacity = "0.9"; // Make cat visible
      cat.src = idleFrame; // Start with idle frame
      lastFrameTime = performance.now(); // Initialize frame timer
      requestAnimationFrame(loop); // Start the animation loop
    }

    function stopFollowing() {
      animating = false;
      cat.style.opacity = "0"; // Hide cat
      if (followTimeout) {
          clearTimeout(followTimeout); // Clear any pending start timeout
      }
    }

    document.addEventListener("mousemove", e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // If not already animating, set a timeout to start following shortly
      if (!animating) {
        if (followTimeout) clearTimeout(followTimeout); // Clear previous timeout
        followTimeout = setTimeout(startFollowing, followDelay);
      }
    });

    // Stop following if the mouse leaves the window
    document.addEventListener("mouseleave", stopFollowing);

    // Update mouse position immediately if mouse enters window (edge case)
    document.addEventListener("mouseenter", e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        // Optional: You might want to trigger startFollowing immediately on mouseenter
        // if (followTimeout) clearTimeout(followTimeout);
        // followTimeout = setTimeout(startFollowing, followDelay);
    });

    // Initial position (off-screen or center, then move with mouse)
     cat.style.transform = `translate(${catX}px, ${catY}px) scaleX(${scaleX})`;

  } // end if(cat)

  /* --- Header Blur on Scroll --- */
  const header = document.querySelector("header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
          header.classList.add("scrolled");
      } else {
          header.classList.remove("scrolled");
      }
    });
  }

  /* --- Mobile Menu Toggle --- */
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent click from immediately closing menu
      mobileMenu.classList.toggle("hidden");
    });

    // Close menu when a link inside it is clicked
    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
      });
    });

    // Close menu if clicking outside of it
    document.addEventListener('click', (event) => {
        if (!mobileMenu.classList.contains('hidden') && // If menu is open
            !mobileMenu.contains(event.target) &&      // And click is not inside menu
            !mobileMenuButton.contains(event.target)) { // And click is not the button itself
            mobileMenu.classList.add('hidden');
        }
    });
  }

  /* --- Scroll Reveal Sections --- */
  const sectionsToReveal = document.querySelectorAll("section");
  if (sectionsToReveal.length > 0) {
      // Initially hide sections (except hero) and set up for transition
      sectionsToReveal.forEach(sec => {
          if (sec.id !== "hero") { // Don't animate the hero section this way
              sec.classList.add("opacity-0", "translate-y-5", "transition-all", "duration-700", "ease-out");
          }
      });

      const intersectionObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  // When section comes into view, reveal it
                  entry.target.classList.remove("opacity-0", "translate-y-5");
                  entry.target.classList.add("opacity-100", "translate-y-0");
                  // Stop observing this section once revealed
                  observer.unobserve(entry.target);
              }
          });
      }, { threshold: 0.1 }); // Trigger when 10% of the section is visible

      // Observe all sections except the hero
      sectionsToReveal.forEach(sec => {
          if (sec.id !== "hero") {
              intersectionObserver.observe(sec);
          }
      });
  }

  /* --- Footer Year --- */
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* --- Hi All! Font Changing Animation --- */
  const fontText = document.getElementById('font-change-text');
  if (fontText) {
    const styles = [
      { text: "Hi All!", fontFamily: "'Rubik', sans-serif" },
      { text: "Hi All!", fontFamily: "'Montserrat', sans-serif" },
      { text: "H̶̢̭̓i̸͈̓̂ ̵̥́̊A̴̪̎̒l̴̹̪̆ļ̵̼̊!̶̰̅", fontFamily: "'Rubik', sans-serif" }, // Glitch style
      { text: "Hi All!", fontFamily: "'Courier New', monospace" },
      { text: "Hi All!", fontFamily: "cursive" },
      { text: "Hi All!", fontFamily: "fantasy" },
      { text: "Hi All!", fontFamily: "'Honk', system-ui" } // Honk font
    ];
    let currentStyleIndex = 0;
    const changeInterval = 750; // Time between changes (ms)
    const glitchDuration = 150; // How long the glitch text stays visible

    function applyStyle(index) {
      if (index >= 0 && index < styles.length) {
          fontText.textContent = styles[index].text;
          fontText.style.fontFamily = styles[index].fontFamily;
      }
    }

    // Apply the initial style
    applyStyle(currentStyleIndex);

    setInterval(() => {
        const nextStyleIndex = (currentStyleIndex + 1) % styles.length;

        // Special handling for the glitch effect
        if (styles[nextStyleIndex].text.includes('̶')) { // Check if the next style is the glitch
            applyStyle(nextStyleIndex); // Apply glitch style
            // Set a timeout to switch *past* the glitch style after its duration
            setTimeout(() => {
                const afterGlitchIndex = (nextStyleIndex + 1) % styles.length;
                applyStyle(afterGlitchIndex);
                currentStyleIndex = afterGlitchIndex; // Update index to the style *after* the glitch
            }, glitchDuration);
            // Don't update currentStyleIndex immediately, wait for the timeout
        } else {
            // Normal style change
            applyStyle(nextStyleIndex);
            currentStyleIndex = nextStyleIndex; // Update index to the new style
        }
    }, changeInterval);

  } // end if(fontText)

  /* === MODIFIED: Profile Picture Zoom and Tilt (No Flip on Exit) === */
  const profilePic = document.getElementById('profile-picture');
  if (profilePic) {
      let isHovering = false;

      profilePic.addEventListener('mouseenter', () => {
          isHovering = true;
          profilePic.classList.add('hovering'); // Use class for faster transition during mousemove
          // Start the initial zoom effect. The 0.8s transition from base CSS applies here.
          profilePic.style.transform = 'scale(1.2) rotateX(0deg) rotateY(0deg)';
      });

      profilePic.addEventListener('mousemove', (e) => {
          if (!isHovering) return; // Only tilt if hovering

          const rect = profilePic.getBoundingClientRect();
          const x = e.clientX - rect.left; // Mouse X relative to element
          const y = e.clientY - rect.top;  // Mouse Y relative to element
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          // Calculate normalized positions, clamping between -1 and 1
          let normalizedX = (x - centerX) / centerX;
          let normalizedY = (y - centerY) / centerY;
          normalizedX = Math.max(-1, Math.min(1, normalizedX)); // Clamp between -1 and 1
          normalizedY = Math.max(-1, Math.min(1, normalizedY)); // Clamp between -1 and 1

          // Calculate rotation angles using clamped values
          const rotateX = -normalizedY * 30; // Simplified and using clamped value
          const rotateY = normalizedX * 30;  // Simplified and using clamped value

   
          // Apply the scale and calculated tilt.
          // The faster 0.2s transition from .hovering class makes this responsive.
          profilePic.style.transform = `scale(1.5) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      profilePic.addEventListener('mouseleave', () => {
          isHovering = false;
          // Remove class to revert to the slower (0.8s) transition for the exit animation
          profilePic.classList.remove('hovering');

          // MODIFIED: Set the final transform: scale back to 1 and reset rotation to 0.
          // The base CSS transition (0.8s) will handle the animation smoothly.
          // No more rotateY(360deg) here.
          profilePic.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)';

      });
  }
  /* === End of Profile Picture Code === */

}); // End DOMContentLoaded
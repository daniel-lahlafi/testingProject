// initialization
document.addEventListener('DOMContentLoaded', function() {
  const RESPONSIVE_WIDTH = 1024;

  let headerWhiteBg = false;
  let isHeaderCollapsed = window.innerWidth < RESPONSIVE_WIDTH;
  
  // Initialize components that don't depend on the header
  initVideoHandlers();
  initFaqAccordion();
  initEmailForms();
  initAnimations();
  
  // Wait for header to be loaded before initializing navigation
  document.addEventListener('headerLoaded', initializeHeader);
  
  // In case the header is already loaded when this script runs
  if (document.querySelector('#nav-dropdown-toggle-0')) {
    initializeHeader();
  }
  
  function initializeHeader() {
    console.log('Header loaded, initializing navigation...');
    
    // Get header elements
    const collapseBtn = document.getElementById("collapse-btn");
    const collapseHeaderItems = document.getElementById("collapsed-header-items");
    const navToggle = document.querySelector("#nav-dropdown-toggle-0");
    const navDropdown = document.querySelector("#nav-dropdown-list-0");

    // Initialize navigation dropdown if elements exist
    if (navToggle && navDropdown) {
      console.log('Navigation elements found, setting up dropdown...');
      initializeNavDropdown();
    } else {
      console.error('Navigation elements not found!', {
        navToggle: !!navToggle,
        navDropdown: !!navDropdown
      });
    }

    // Initialize responsive behavior
    responsive();
    window.addEventListener("resize", responsive);
    
    // If header has a collapse button, initialize it
    if (collapseBtn) {
      collapseBtn.addEventListener("click", toggleHeader);
    }
    
    // ==================== Navigation Dropdown Functions ====================
    
    function initializeNavDropdown() {
      // For desktop: use hover events
      if (window.innerWidth > RESPONSIVE_WIDTH) {
        navToggle.addEventListener("mouseenter", openNavDropdown);
        navToggle.addEventListener("mouseleave", handleNavMouseLeave);
        navDropdown.addEventListener("mouseleave", closeNavDropdown);
      }
      
      // For all devices: use click events
      navToggle.addEventListener("click", toggleNavDropdown);
    }

    function toggleNavDropdown() {
      console.log('Toggle dropdown clicked');
      if (navDropdown.getAttribute("data-open") === "true") {
        closeNavDropdown();
      } else {
        openNavDropdown();
      }
    }

    function handleNavMouseLeave() {
      setTimeout(closeNavDropdown, 100);
    }

    function openNavDropdown() {
      console.log('Opening dropdown');
      
      // Use inline styles for better control
      navDropdown.style.opacity = "1";
      navDropdown.style.transform = "translateX(-50%) scale(1)";
      navDropdown.style.pointerEvents = "all";
      
      // Update dropdown position
      updateDropdownPosition();
      
      // Mobile specific adjustments
      if (window.innerWidth <= RESPONSIVE_WIDTH) {
        // Prevent body scrolling when dropdown is open on mobile
        document.body.classList.add("modal-open");
      }
      
      navDropdown.setAttribute("data-open", "true");
      
      // Add highlight to the toggle button
      navToggle.style.backgroundColor = "rgba(128, 128, 128, 0.1)";
    }

    function closeNavDropdown() {
      if (navDropdown.matches(":hover")) {
        return;
      }

      // Use inline styles for better control
      navDropdown.style.opacity = "0";
      navDropdown.style.transform = "translateX(-50%) scale(0)";
      navDropdown.style.pointerEvents = "none";
      
      // Remove modal-open class when on mobile
      if (window.innerWidth <= RESPONSIVE_WIDTH) {
        document.body.classList.remove("modal-open");
      }
      
      // Reset toggle button highlight
      navToggle.style.backgroundColor = "";
      
      navDropdown.setAttribute("data-open", "false");
    }

    // ==================== Header Collapse Functions ====================

    function onHeaderClickOutside(e) {
      if (collapseHeaderItems && !collapseHeaderItems.contains(e.target)) {
        toggleHeader();
      }
    }

    function toggleHeader() {
      if (!collapseHeaderItems || !collapseBtn) return;
      
      if (isHeaderCollapsed) {
        collapseHeaderItems.classList.add("max-lg:!tw-opacity-100", "tw-min-h-[90vh]");
        collapseHeaderItems.style.height = "90vh";
        collapseBtn.classList.remove("bi-list");
        collapseBtn.classList.add("bi-x", "max-lg:tw-fixed");
        isHeaderCollapsed = false;
        document.body.classList.add("modal-open");
        setTimeout(() => window.addEventListener("click", onHeaderClickOutside), 1);
      } else {
        collapseHeaderItems.classList.remove("max-lg:!tw-opacity-100", "tw-min-h-[90vh]");
        collapseHeaderItems.style.height = "0vh";
        collapseBtn.classList.remove("bi-x", "max-lg:tw-fixed");  
        collapseBtn.classList.add("bi-list");
        document.body.classList.remove("modal-open");
        isHeaderCollapsed = true;
        window.removeEventListener("click", onHeaderClickOutside);
      }
    }

    // ==================== Responsive Behavior ====================

    function responsive() {
      // Skip if required elements don't exist
      if (!collapseHeaderItems) return;
      
      // Handle header collapse state
      if (!isHeaderCollapsed && collapseHeaderItems.classList.contains("max-lg:!tw-opacity-100")) {
        toggleHeader();
      }

      // Reinitialize navigation for the current screen size
      if (navToggle && navDropdown) {
        // If the dropdown is open, update its position
        if (navDropdown.getAttribute("data-open") === "true") {
          updateDropdownPosition();
        }
        
        // Remove all existing event listeners by cloning the element
        if (navToggle && navToggle.parentNode) {
          const newNavToggle = navToggle.cloneNode(true);
          navToggle.parentNode.replaceChild(newNavToggle, navToggle);
          
          // Get the fresh reference
          const freshNavToggle = document.querySelector("#nav-dropdown-toggle-0");
          
          if (window.innerWidth > RESPONSIVE_WIDTH) {
            // Desktop behavior
            collapseHeaderItems.style.height = "";
            
            // Add hover behavior for desktop
            freshNavToggle.addEventListener("mouseenter", openNavDropdown);
            freshNavToggle.addEventListener("mouseleave", handleNavMouseLeave);
            navDropdown.addEventListener("mouseleave", closeNavDropdown);
            
            // Also add click behavior for accessibility
            freshNavToggle.addEventListener("click", toggleNavDropdown);
          } else {
            // Mobile behavior
            isHeaderCollapsed = true;
            // Only use click for mobile
            freshNavToggle.addEventListener("click", toggleNavDropdown);
          }
        } else {
          console.warn('Navigation toggle element or its parent not found');
        }
      }
    }
    
    // Function to update dropdown position based on current header position
    function updateDropdownPosition() {
      // Get header element and calculate its bottom position
      const header = document.querySelector('header');
      if (!header) return;
      
      const headerRect = header.getBoundingClientRect();
      const headerBottom = headerRect.bottom + window.scrollY;
      
      // Add a small gap between header and dropdown
      const dropdownTop = headerBottom + 5;
      
      // Set the top position
      navDropdown.style.top = `${dropdownTop}px`;
    }
    
    // Add scroll event listener to update dropdown position during scrolling
    window.addEventListener('scroll', function() {
      if (navDropdown && navDropdown.getAttribute("data-open") === "true") {
        updateDropdownPosition();
      }
    });
  }

  // ==================== Video Handlers ====================

  function initVideoHandlers() {
    const videoBg = document.querySelector("#video-container-bg");
    const videoContainer = document.querySelector("#video-container");
    
    if (!videoBg || !videoContainer) return;
    
    // Add video open/close handlers to any buttons that need them
    const videoOpenButtons = document.querySelectorAll('[data-video-open]');
    videoOpenButtons.forEach(btn => {
      btn.addEventListener('click', openVideo);
    });
    
    const videoCloseButtons = document.querySelectorAll('[data-video-close]');
    videoCloseButtons.forEach(btn => {
      btn.addEventListener('click', closeVideo);
    });
    
    function openVideo() {
      videoBg.classList.remove("tw-scale-0", "tw-opacity-0");
      videoBg.classList.add("tw-scale-100", "tw-opacity-100");
      videoContainer.classList.remove("tw-scale-0");
      videoContainer.classList.add("tw-scale-100");
      document.body.classList.add("modal-open");
    }
    
    function closeVideo() {
      videoContainer.classList.add("tw-scale-0");
      videoContainer.classList.remove("tw-scale-100");
      
      setTimeout(() => {
        videoBg.classList.remove("tw-scale-100", "tw-opacity-100");
        videoBg.classList.add("tw-scale-0", "tw-opacity-0");
      }, 400);
      
      document.body.classList.remove("modal-open");
    }
  }

  // ==================== FAQ Accordion ====================

  function initFaqAccordion() {
    const faqAccordion = document.querySelectorAll('.faq-accordion');
    
    faqAccordion.forEach(function(btn) {
      btn.addEventListener('click', function() {
        this.classList.toggle('active');
        
        // Toggle arrow rotation and content height
        let content = this.nextElementSibling;
        let icon = this.querySelector(".bi-plus");
        
        if (!content || !icon) return;
        
        if (content.style.maxHeight === '240px') {
          content.style.maxHeight = '0px';
          content.style.padding = '0px 18px';
          icon.style.transform = "rotate(0deg)";
        } else {
          content.style.maxHeight = '240px';
          content.style.padding = '20px 18px';
          icon.style.transform = "rotate(45deg)";
        }
      });
    });
  }

  // ==================== Email Forms ====================

  function initEmailForms() {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbw5P_caxf6wQqccU9_0IuU_fh0YrIZXpgzDiNLbVKhEfVdnnHoa_jE0HcCHNG4rac6MMg/exec';

    document.querySelectorAll('.email-form').forEach(form => {
      // Prevent attaching multiple listeners
      if (form.dataset.listenerAttached === 'true') return;
      form.dataset.listenerAttached = 'true';

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Check reCAPTCHA
        var captchaResponse = this.querySelector('.g-recaptcha-response');
        if (captchaResponse && !captchaResponse.value) {
          const responseMessage = this.querySelector('.response-message');
          if (responseMessage) {
            responseMessage.textContent = 'Please complete the CAPTCHA.';
            responseMessage.style.color = 'red';
          }
          return;
        }
        
        const formData = new FormData(this);
        
        const responseMessage = this.querySelector('.response-message');
        const submitBtn = this.querySelector('.submit-email-btn');
        
        if (!responseMessage || !submitBtn) return;
        
        responseMessage.textContent = 'Loading…';
        responseMessage.style.color = 'gray';
        submitBtn.style.display = 'none';
        
        fetch(scriptURL, { method: 'POST', body: formData })
          .then(r => r.json())
          .then(data => {
            if (data.result === 'success') {
              responseMessage.style.color = 'green';
              responseMessage.textContent = 'Success! We will be in touch.';
              if (typeof gtag === 'function') {
                gtag('event', 'sign_up', {
                  method: 'Email Form',
                  email: formData.get('email')
                });
              }
            } else {
              responseMessage.style.color = 'red';
              responseMessage.textContent = 'Failed: ' + data.msg;
            }
            this.reset();
          })
          .catch(err => {
            console.error(err);
            responseMessage.style.color = 'red';
            responseMessage.textContent = 'An error occurred. Please try again.';
          })
          .finally(() => {
            submitBtn.style.display = 'block';
          });
      });
    });
  }
  window.initEmailForms = initEmailForms;

  // ==================== Animations ====================

  function initAnimations() {
    if (typeof gsap === 'undefined') return;
    
    // Initialize GSAP animations
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      // Initialize reveal animations
      gsap.to(".reveal-up", {
        opacity: 0,
        y: "100%",
      });
      
      // Dashboard slanting image animation
      const dashboard = document.querySelector("#dashboard");
      if (dashboard) {
        gsap.to("#dashboard", {
          scale: 1,
          translateY: 0,
          rotateX: "0deg",
          scrollTrigger: {
            trigger: "#hero-section",
            start: window.innerWidth > RESPONSIVE_WIDTH ? "top 95%" : "top 70%",
            end: "bottom bottom",
            scrub: 1,
          }
        });
      }
      
      // Section reveal animations
      const sections = gsap.utils.toArray("section");
      sections.forEach((sec) => {
        gsap.timeline({
          scrollTrigger: {
            trigger: sec,
            start: "10% 80%",
            toggleActions: "play none none none",
          }
        })
        .from(sec.querySelectorAll(".reveal-up"), {
          opacity: 0,
          y: "20%",
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out"
        });
      });
    }
  }
});


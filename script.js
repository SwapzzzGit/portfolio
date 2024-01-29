gsap.registerPlugin(ScrollTrigger);

// Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

const locoScroll = new LocomotiveScroll({
  el: document.querySelector("#main"),
  smooth: true
});
// each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
locoScroll.on("scroll", ScrollTrigger.update);

// tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
ScrollTrigger.scrollerProxy("#main", {
  scrollTop(value) {
    return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
  }, // we don't have to define a scrollLeft because we're only scrolling vertically.
  getBoundingClientRect() {
    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
  },
  // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
  pinType: document.querySelector("#main").style.transform ? "transform" : "fixed"
});


// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();

var menu = document.querySelector("#menu");
var fullScreenNav = document.querySelector("#full-scr-nav");
var isOpen = false;

menu.addEventListener("click", function () {
    // Toggle the full-screen navigation
    fullScreenNav.style.left = isOpen ? "-100%" : "0";
    
    // Toggle the isOpen state
    isOpen = !isOpen;

  // Toggle the cross effect smoothly using GSAP animations
  gsap.to("#line-1", {
      duration: 0.3,
      rotate: isOpen ? 45 : 0,
      y: isOpen ? 8 : 0,
      background: isOpen ? "white" : "black"
  });

  gsap.to("#line-2", {
      duration: 0.3,
      rotate: isOpen ? -45 : 0,
      y: isOpen ? -8 : 0,
      background: isOpen ? "white" : "black"
  });

    // Toggle the class 'openmenu' on the menu div
    document.querySelector("#menu").classList.toggle("openmenu", isOpen);
});

document.querySelectorAll("#full-scr-nav a").forEach(function(link) {
  link.addEventListener("click", function() {
      // Set fullScreenNav to -100% when a link is clicked
      fullScreenNav.style.left = "-100%";
      isOpen = false;
      document.querySelector("#menu").classList.remove("openmenu");
  });
});
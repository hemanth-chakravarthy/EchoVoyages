import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import AnimatedSection from './AnimatedSection';
import LandingNavbar from './LandingNavbar';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 120; // Extracted 120 frames
const IMAGE_SCALE = 1.0; // Changed to 1.0 to fully cover screen like 'object-fit: cover'
const FRAME_SPEED = 2.0;

const ScrollAnimatedLanding = () => {
  const canvasRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const heroSectionRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const [frames, setFrames] = useState([]);
  const [loadedFrames, setLoadedFrames] = useState(0);
  const [navIsWhite, setNavIsWhite] = useState(false);
  const themeRef = useRef(false);
  const navigate = useNavigate();

  // 1. Lenis Smooth Scroll Configuration
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  // 2. Preload Frames
  useEffect(() => {
    let images = [];
    let loaded = 0;
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      // Adjust path format to match output of node script
      const idx = String(i).padStart(4, '0');
      img.src = `/frames/frame_${idx}.webp`;
      img.onload = () => {
        loaded++;
        setLoadedFrames(loaded);
      };
      images.push(img);
    }
    setFrames(images);
  }, []);

  // 3. Canvas Rendering Logic
  useEffect(() => {
    if (frames.length === 0 || loadedFrames === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Support high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const setCanvasSize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      drawFrame(0);
    };
    
    const drawFrame = (index) => {
      const img = frames[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const cw = window.innerWidth;
      const ch = window.innerHeight;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      const scale = Math.max(cw / iw, ch / ih) * IMAGE_SCALE;
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;

      // Fill with dark/white bg color depending on frame
      ctx.fillStyle = '#ffffff'; // The prompt requested white for the rest of the background
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // 4. Scroll Binding
    let currentFrame = 0;
    const scrollAnimation = ScrollTrigger.create({
      trigger: scrollContainerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        // Ensure FRAME_COUNT is matched to actual loaded total
        const actualFrames = frames.length;
        const accelerated = Math.min(self.progress * FRAME_SPEED, 1);
        const index = Math.min(
          Math.floor(accelerated * actualFrames),
          actualFrames - 1
        );
        if (index !== currentFrame) {
          currentFrame = index;
          requestAnimationFrame(() => drawFrame(currentFrame));
        }
      },
    });

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      scrollAnimation.kill();
    };
  }, [frames, loadedFrames]);

  // 5. Circle Wipe Hero Reveal
  useEffect(() => {
    const heroAnimation = ScrollTrigger.create({
      trigger: scrollContainerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        if (heroSectionRef.current) {
          heroSectionRef.current.style.opacity = Math.max(0, 1 - p * 15);
        }
        if (canvasWrapRef.current) {
          const wipeProgress = Math.min(1, Math.max(0, p / 0.08)); // from 0% to 8% scroll
          const radius = 60 + (wipeProgress * 90); // starts at 10% radius (small circle), expands to 100%
          canvasWrapRef.current.style.clipPath = `circle(${radius}% at 50% 50%)`;
        }

        const isPastHalfway = p > 0.5;
        if (themeRef.current !== isPastHalfway) {
          themeRef.current = isPastHalfway;
          setNavIsWhite(isPastHalfway);
        }
      },
    });
    return () => heroAnimation.kill();
  }, []);

  return (
    <div className="w-full bg-[#f5f3f0] text-[#1a1a1a] font-sans">
      {/* Loader */}
      {loadedFrames < FRAME_COUNT && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#f5f3f0]">
          <div className="text-2xl font-bold mb-4 tracking-tight text-black">EchoVoyages</div>
          <div className="w-64 h-[2px] bg-black/10 overflow-hidden relative">
            <div 
              className="absolute left-0 top-0 h-full bg-black transition-all duration-300" 
              style={{ width: `${(loadedFrames / FRAME_COUNT) * 100}%` }}
            />
          </div>
          <div className="mt-4 text-[10px] text-black/50 uppercase font-bold tracking-widest">
            Loading Universe... {Math.round((loadedFrames / FRAME_COUNT) * 100)}%
          </div>
        </div>
      )}

      <LandingNavbar navIsWhite={navIsWhite} />

      {/* Scroll Container (800vh+) */}
      <div ref={scrollContainerRef} className="relative z-[2] w-full" style={{ height: '800vh' }}>
        
        {/* Sticky wrapper that locks the canvas and hero during the 800vh scroll down */}
        <div className="sticky top-0 left-0 w-full h-[100dvh] overflow-hidden pointer-events-none">
          

          {/* Hero Standalone Content */}
          <section 
            ref={heroSectionRef} 
            className="absolute inset-0 z-10 flex flex-col justify-center px-10 md:px-20 bg-transparent pointer-events-none"
          >
            {/* Left Aligned Typography */}
            <div className="max-w-2xl mt-20 pointer-events-auto">
              <h1 className="text-xl md:text-2xl lg:text-4xl font-bold tracking-tight leading-[1.1] text-white" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.1)' }}>
                Step into a World of<br/>Discoveries
              </h1>
              <p className="mt-4 text-[8px] md:text-[10px] font-bold text-white max-w-[280px] leading-relaxed tracking-wider opacity-90 uppercase text-justify" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                Unique travel destinations await to spark curiosity and inspire your next adventure.
                At Echo Voyages, we uncover hidden gems around the world,
                including enchanting cities and offbeat travel destinations waiting to be explored.
                Find travel inspiration that helps you plan your next trip and turn every journey into an unforgettable experience.
              </p>
              
              <Link to="/signup" className="pointer-events-auto block mt-6">
                <button className="bg-white text-black px-5 py-2 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors shadow-lg">
                  Explore Now
                </button>
              </Link>
            </div>

          </section>

          {/* Canvas Wrap */}
          <div 
            ref={canvasWrapRef} 
            className="absolute inset-0 z-0" 
            style={{ clipPath: 'none' }}
          >
            <canvas ref={canvasRef} className="absolute inset-0" />
          </div>

          {/* Dark Overlay (For specific sections) */}
          <div id="dark-overlay" className="absolute inset-0 bg-black/80 z-[1] opacity-0 pointer-events-none transition-opacity duration-300"></div>

        </div>
        <AnimatedSection enter={15} leave={25} animationType="fade-up" align="left">
          <span className="section-label block text-xs md:text-sm font-semibold tracking-widest text-white/70 uppercase mb-4">001 / The Journey</span>
          <h2 className="section-heading text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white drop-shadow-md">Cosmic Beauty</h2>
          <p className="section-body text-[10px] sm:text-xs md:text-lg lg:text-xl text-white/90 max-w-lg leading-relaxed drop-shadow">
            Float through boundless landscapes where the sky meets the endless void. A true escape from the ordinary.
          </p>
        </AnimatedSection>

        <AnimatedSection enter={28} leave={40} animationType="slide-right" align="right">
          <span className="section-label block text-xs md:text-sm font-semibold tracking-widest text-white/70 uppercase mb-4">002 / Discovery</span>
          <h2 className="section-heading text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white drop-shadow-md">Uncharted Territories</h2>
          <p className="section-body text-[10px] sm:text-xs md:text-lg lg:text-xl text-white/90 max-w-lg leading-relaxed drop-shadow">
            Wander into the dreamscape. Redefine your understanding of the universe through ethereal exploration.
          </p>
        </AnimatedSection>

        <AnimatedSection enter={45} leave={58} animationType="scale-up" align="left">
          <span className="section-label block text-xs md:text-sm font-semibold tracking-widest text-white/70 uppercase mb-4">003 / Immersion</span>
          <h2 className="section-heading text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white drop-shadow-md">Boundless Freedom</h2>
          <p className="section-body text-[10px] sm:text-xs md:text-lg lg:text-xl text-white/90 max-w-lg leading-relaxed drop-shadow">
            Move seamlessly through dimensions. Uncover secrets of a sprawling cosmos designed entirely around you.
          </p>
        </AnimatedSection>

        <AnimatedSection enter={65} leave={78} animationType="stagger-up" align="right">
          <span className="section-label block text-sm font-semibold tracking-widest text-[#f5f3f0] uppercase mb-4 mix-blend-difference">004 / Metrics</span>
          <div className="stats-grid grid grid-cols-2 gap-12 mix-blend-difference text-white">
            <div className="stat text-center">
              <div className="text-6xl font-bold"><span className="stat-number">100</span>+</div>
              <div className="stat-label text-sm uppercase tracking-widest mt-2 opacity-80">Worlds Explored</div>
            </div>
            <div className="stat text-center">
              <div className="text-6xl font-bold"><span className="stat-number">24</span>/7</div>
              <div className="stat-label text-sm uppercase tracking-widest mt-2 opacity-80">Voyage Assistance</div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection enter={85} leave={100} animationType="fade-up" align="left" persist={true}>
          <span className="section-label block text-sm font-semibold tracking-widest text-[#f5f3f0] opacity-90 uppercase mb-4 mix-blend-difference">Ready?</span>
          <h2 className="section-heading text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none text-white drop-shadow-lg">Begin your voyage.</h2>
          <button 
            onClick={() => navigate('/signup')} 
            className="cta-button bg-black text-white px-10 py-5 text-lg font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors pointer-events-auto"
          >
            Start Exploring
          </button>
        </AnimatedSection>

      </div>

      {/* Normal static content that scrolls in below the experience */}
      <div className="w-full bg-[#111111] text-[#f5f3f0] relative z-10 overflow-hidden font-sans uppercase tracking-[0.15em] text-xs">
        
        {/* Footer Top Grid */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-24 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          {/* Column 1: Links */}
          <div className="flex flex-col gap-4 opacity-80">
            <h4 className="font-bold text-white mb-4 tracking-[0.3em]">Navigation</h4>
            <span className="hover:text-white cursor-pointer transition-colors">Home</span>
            <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
            <span className="hover:text-white cursor-pointer transition-colors">Destinations</span>
          </div>

          {/* Column 2: Languages & Auth */}
          <div className="flex flex-col gap-4 opacity-80">
            <h4 className="font-bold text-white mb-4 tracking-[0.3em]">Region</h4>
            <span className="text-white font-bold cursor-pointer">English</span>
            
            <h4 className="font-bold text-white mt-8 mb-4 tracking-[0.3em]">Account</h4>
            <Link to="/login" className="hover:text-white cursor-pointer transition-colors pointer-events-auto block">Login</Link>
            <Link to="/signup" className="hover:text-white cursor-pointer transition-colors pointer-events-auto block">Register</Link>
          </div>

          {/* Column 3: Socials */}
          <div className="flex flex-col gap-4 opacity-80">
            <h4 className="font-bold text-white mb-4 tracking-[0.3em]">Social</h4>
            <span className="hover:text-white cursor-pointer transition-colors">Pinterest</span>
            <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
            <span className="hover:text-white cursor-pointer transition-colors">Youtube</span>
            <span className="hover:text-white cursor-pointer transition-colors">Facebook</span>
            <span className="hover:text-white cursor-pointer transition-colors">TikTok</span>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="border-t border-white/10 w-full mt-8 md:mt-0">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60 text-[9px] tracking-widest text-center md:text-left">
            <span className="font-bold">© 2026 Echo Voyages</span>
            <div className="flex flex-wrap gap-6 justify-center">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Cookie Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Imprint</span>
            </div>
            <span className="hover:text-white cursor-pointer transition-colors">Website by Hemanth</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ScrollAnimatedLanding;

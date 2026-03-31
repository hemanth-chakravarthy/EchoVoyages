/** @format */
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaCompass,
  FaArrowRight,
  FaUserPlus,
  FaSearch,
  FaCalendarCheck,
  FaPlane,
  FaGlobeAmericas,
  FaUsers,
  FaSuitcase,
  FaStar,
  FaUserTie,
  FaMapMarkedAlt,
  FaBriefcase,
  FaBuilding,
  FaCheck,
  FaThumbsUp,
  FaComment,
  FaHeart,
  FaMapMarkerAlt,
  FaUser,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPaperPlane,
} from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const heroRef = useRef(null);
  const howItWorksRef = useRef(null);
  const statsRef = useRef(null);
  const guidesRef = useRef(null);
  const agenciesRef = useRef(null);

  useEffect(() => {
    // Hero section animation
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.5,
          stagger: 0.2,
          ease: "power3.out"
        }
      );
    }

    // How it works cards stagger
    if (howItWorksRef.current) {
      gsap.fromTo(
        howItWorksRef.current.querySelectorAll('.work-card'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: howItWorksRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    // Stats animation
    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current.querySelectorAll('.stat-card'),
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="w-full bg-[#f5f3f0] text-[#1a1a1a] font-sans">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            src="/videos/homepage_video.mp4"
            autoPlay
            loop
            muted
          ></video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        </div>

        <div ref={heroRef} className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 py-20">
          <span className="block text-xs md:text-sm font-bold tracking-[0.3em] text-white/70 uppercase mb-6">
            001 / Welcome to EchoVoyages
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight leading-[1.05] text-white mb-8 max-w-4xl">
            Discover Breathtaking<br/>Destinations
          </h1>
          <p className="text-base md:text-xl text-white/90 mb-12 max-w-2xl leading-relaxed">
            Plan unforgettable trips, and connect with local guides and travel experts. 
            Your next adventure starts here!
          </p>
          <Link
            to="/search"
            className="inline-flex items-center px-8 py-4 bg-white text-black text-sm font-bold uppercase tracking-widest hover:bg-white/90 transition-all"
          >
            <FaCompass className="mr-3" />
            Get Started
            <FaArrowRight className="ml-3" />
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" ref={howItWorksRef} className="py-20 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <span className="block text-xs md:text-sm font-bold tracking-[0.3em] text-black/50 uppercase mb-6">
            002 / Process
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-20 text-[#1a1a1a]">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            {[
              {
                icon: <FaUserPlus />,
                title: "Register",
                description: "Create your account to get started on your journey",
                number: "01"
              },
              {
                icon: <FaSearch />,
                title: "Choose guide or agency",
                description: "Find the perfect match for your travel needs",
                number: "02"
              },
              {
                icon: <FaCalendarCheck />,
                title: "Book your dream package",
                description: "Secure your spot on an unforgettable adventure",
                number: "03"
              },
              {
                icon: <FaPlane />,
                title: "Enjoy your trip!",
                description: "Experience the journey of a lifetime",
                number: "04"
              },
            ].map((step, index) => (
              <div key={index} className="work-card group">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-black/30 uppercase mb-8">
                    Step {step.number}
                  </span>
                  <div className="w-16 h-16 flex items-center justify-center bg-[#1a1a1a] text-white mb-6 group-hover:bg-[#2d2d2d] transition-all duration-500">
                    <div className="text-2xl">{step.icon}</div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#1a1a1a] mb-4">
                    {step.title}
                  </h3>
                  <p className="text-black/60 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Stats Section */}
      <section ref={statsRef} className="py-20 md:py-32 bg-[#1a1a1a] text-white">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <span className="block text-xs md:text-sm font-bold tracking-[0.3em] text-white/50 uppercase mb-6">
            003 / Why Choose Us
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-20">
            Why Choose EchoVoyages
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaGlobeAmericas />,
                count: "100+",
                label: "Destinations",
              },
              { icon: <FaUsers />, count: "5,000+", label: "Happy Travelers" },
              { icon: <FaSuitcase />, count: "500+", label: "Travel Packages" },
              { icon: <FaStar />, count: "4.8", label: "Average Rating" },
            ].map((stat, index) => (
              <div
                key={index}
                className="stat-card group bg-white/5 p-8 border border-white/10 hover:bg-white/10 transition-all duration-500"
              >
                <div className="text-white text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">
                  {stat.icon}
                </div>
                <h3 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">
                  {stat.count}
                </h3>
                <p className="text-sm font-bold tracking-[0.2em] text-white/60 uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guides Info Section */}
      <section ref={guidesRef} className="py-20 md:py-32 bg-[#f5f3f0]">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <span className="block text-xs md:text-sm font-bold tracking-[0.3em] text-black/50 uppercase mb-6">
                004 / Local Experts
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-[#1a1a1a]">
                Expert Local<br/>Guides
              </h2>
              <p className="text-black/70 mb-10 leading-relaxed text-lg">
                Discover destinations through the eyes of experienced local guides 
                who know every hidden gem and cultural secret. Our guides are passionate 
                about sharing authentic experiences and creating unforgettable memories.
              </p>
              <Link
                to="/customerGuide"
                className="inline-flex items-center px-8 py-4 bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#2d2d2d] transition-all"
              >
                <FaUserTie className="mr-3" />
                View Guides
                <FaArrowRight className="ml-3" />
              </Link>
            </div>

            <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
              <div className="overflow-hidden h-64">
                <img
                  src="/images/guide-1.png"
                  alt="Local Guide"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="overflow-hidden h-64">
                <img
                  src="/images/guide-2.png"
                  alt="Tour Guide"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="overflow-hidden col-span-2 h-48">
                <img
                  src="/images/guide-3.png"
                  alt="Adventure Guide"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agencies Info Section */}
      <section ref={agenciesRef} className="py-20 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="overflow-hidden">
                <img
                  src="/images/agency-main.png"
                  alt="Travel Agency"
                  className="w-full h-96 object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 overflow-hidden border-8 border-white">
                <img
                  src="/images/agency-small.png"
                  alt="Travel Agency Office"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              <span className="block text-xs md:text-sm font-bold tracking-[0.3em] text-black/50 uppercase mb-6">
                005 / Professional Services
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-[#1a1a1a]">
                Find the Perfect<br/>Travel Agency
              </h2>
              <p className="text-black/70 mb-10 leading-relaxed text-lg">
                Connect with professional travel agencies that offer curated packages 
                for all types of adventures. From luxury getaways to budget-friendly trips, 
                find the perfect match for your travel needs.
              </p>
              <Link
                to="/home"
                className="inline-flex items-center px-8 py-4 bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#2d2d2d] transition-all"
              >
                <FaBriefcase className="mr-3" />
                View Agencies
                <FaArrowRight className="ml-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Make Your Choice Section */}
      <section className="py-20 md:py-32 bg-[#f5f3f0]">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <span className="block text-xs md:text-sm font-bold tracking-[0.3em] text-black/50 uppercase mb-6">
            006 / Your Choice
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-20 text-[#1a1a1a]">
            Choose Your Travel<br/>Experience
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-10 md:p-12 border-l-4 border-[#1a1a1a] group hover:shadow-2xl transition-all duration-500">
              <div className="text-[#1a1a1a] text-5xl mb-8 group-hover:scale-110 transition-transform">
                <FaUserTie />
              </div>
              <h3 className="text-3xl font-bold text-[#1a1a1a] mb-6">
                Travel with a Guide
              </h3>
              <p className="text-black/60 mb-8 leading-relaxed">
                Immerse yourself in unique cultural experiences and uncover hidden 
                treasures guided by a local expert. Whether it's exploring historic 
                landmarks or finding the best local cuisine, a guide ensures a truly 
                personalized journey.
              </p>
              <ul className="space-y-4">
                {[
                  "Personalized attention",
                  "Local knowledge",
                  "Flexible itineraries",
                  "Cultural insights",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <FaCheck className="text-[#1a1a1a] mt-1 mr-4 flex-shrink-0" />
                    <span className="text-[#1a1a1a] font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-10 md:p-12 border-l-4 border-[#1a1a1a] group hover:shadow-2xl transition-all duration-500">
              <div className="text-[#1a1a1a] text-5xl mb-8 group-hover:scale-110 transition-transform">
                <FaBuilding />
              </div>
              <h3 className="text-3xl font-bold text-[#1a1a1a] mb-6">
                Book with an Agency
              </h3>
              <p className="text-black/60 mb-8 leading-relaxed">
                Experience a worry-free journey with pre-planned itineraries and 
                all-inclusive services for your convenience. From comfortable accommodations 
                to guided activities, everything is taken care of so you can focus on 
                enjoying your trip.
              </p>
              <ul className="space-y-4">
                {[
                  "All-inclusive packages",
                  "Group discounts",
                  "Coordinated logistics",
                  "24/7 support",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <FaCheck className="text-[#1a1a1a] mt-1 mr-4 flex-shrink-0" />
                    <span className="text-[#1a1a1a] font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full bg-[#111111] text-[#f5f3f0] py-16 uppercase tracking-[0.15em] text-xs">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6 tracking-[0.3em]">
                EchoVoyages
              </h3>
              <p className="text-white/60 mb-6 normal-case tracking-normal leading-relaxed">
                Connecting travelers with expert guides and professional agencies 
                for unforgettable journeys.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: <FaFacebookF />, url: "#" },
                  { icon: <FaTwitter />, url: "#" },
                  { icon: <FaInstagram />, url: "#" },
                  { icon: <FaLinkedinIn />, url: "#" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="w-10 h-10 bg-white/5 flex items-center justify-center text-white/60 hover:bg-white hover:text-black transition-all"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-bold text-white mb-6 tracking-[0.3em]">
                Quick Links
              </h3>
              <ul className="space-y-3 opacity-60">
                {[
                  { label: "Home", url: "/" },
                  { label: "About Us", url: "/about" },
                  { label: "Guides", url: "/guides" },
                  { label: "Agencies", url: "/agencies" },
                  { label: "Packages", url: "/packages" },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.url}
                      className="hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-bold text-white mb-6 tracking-[0.3em]">
                Resources
              </h3>
              <ul className="space-y-3 opacity-60">
                {[
                  { label: "Travel Blog", url: "/blog" },
                  { label: "FAQs", url: "/faqs" },
                  { label: "Privacy Policy", url: "/privacy" },
                  { label: "Terms of Service", url: "/terms" },
                  { label: "Contact Us", url: "/contact" },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.url}
                      className="hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-sm font-bold text-white mb-6 tracking-[0.3em]">
                Stay Updated
              </h3>
              <p className="text-white/60 mb-4 normal-case tracking-normal text-xs">
                Subscribe to our newsletter for travel tips and exclusive offers.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-all normal-case text-xs"
                />
                <button className="bg-white text-black px-4 py-3 hover:bg-white/90 transition-colors">
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60 text-[9px] tracking-widest">
            <span className="font-bold">
              &copy; {new Date().getFullYear()} EchoVoyages. All rights reserved.
            </span>
            <div className="flex space-x-6">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link to="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

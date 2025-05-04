/** @format */
import React, { useState } from "react";
import { Link } from "react-router-dom";
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

const HomePage = () => {
  return (
    <div className="font-['Segoe UI', Arial, sans-serif]">
      {/* Hero Section with Video Background */}
      <section className="relative h-screen">
        <div className="absolute inset-0 overflow-hidden">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            src="/videos/homepage_video.mp4"
            autoPlay
            loop
            muted
          ></video>
          <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/70 to-[#000000]/40"></div>
        </div>

        <div className="relative h-full flex items-center">
          <div className="max-w-6xl mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Discover breathtaking destinations
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Plan unforgettable trips, and connect with local guides and
                travel experts. Your next adventure starts here!
              </p>
              <Link
                to="/search"
                className="inline-flex items-center px-6 py-4 bg-[#0077B5] text-white rounded hover:bg-[#00A0DC] transition-colors text-lg font-medium"
              >
                <FaCompass className="mr-2" />
                Get Started
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Horizontal Flow */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#313335] mb-12">
            How It Works
          </h2>

          <div className="flex flex-col md:flex-row justify-between">
            {[
              {
                icon: <FaUserPlus />,
                title: "Register",
                description:
                  "Create your account to get started on your journey",
              },
              {
                icon: <FaSearch />,
                title: "Choose guide or agency",
                description: "Find the perfect match for your travel needs",
              },
              {
                icon: <FaCalendarCheck />,
                title: "Book your dream package",
                description: "Secure your spot on an unforgettable adventure",
              },
              {
                icon: <FaPlane />,
                title: "Enjoy your trip!",
                description: "Experience the journey of a lifetime",
              },
            ].map((step, index) => (
              <div key={index} className="md:w-1/4 px-4 mb-8 md:mb-0">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-[#0077B5] text-white">
                    <div className="text-2xl">{step.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold text-[#313335] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[#86888A]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Stats Section */}
      <section className="py-16 bg-[#f3f6f8]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#313335] mb-12">
            Why Choose EchoVoyages
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow"
              >
                <div className="text-[#0077B5] text-4xl mb-4">{stat.icon}</div>
                <h3 className="text-3xl font-bold text-[#313335] mb-2">
                  {stat.count}
                </h3>
                <p className="text-[#86888A]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guides Info Section */}
      <section className="py-16 bg-[#f3f6f8]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-[#313335] mb-4">
                Expert Local Guides
              </h2>
              <p className="text-[#86888A] mb-6 leading-relaxed">
                Discover destinations through the eyes of experienced local
                guides who know every hidden gem and cultural secret. Our guides
                are passionate about sharing authentic experiences and creating
                unforgettable memories.
              </p>
              <Link
                to="/customerGuide"
                className="inline-flex items-center px-5 py-3 bg-[#0077B5] text-white rounded hover:bg-[#00A0DC] transition-colors"
              >
                <FaUserTie className="mr-2" />
                View Guides
                <FaArrowRight className="ml-2" />
              </Link>
            </div>

            <div className="md:w-1/2 grid grid-cols-2 gap-4">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src="/images/guide-1.png"
                  alt="Local Guide"
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src="/images/guide-2.png"
                  alt="Tour Guide"
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg col-span-2">
                <img
                  src="/images/guide-3.png"
                  alt="Adventure Guide"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agencies Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-[#313335] mb-4">
                Find the Perfect Travel Agency
              </h2>
              <p className="text-[#86888A] mb-6 leading-relaxed">
                Connect with professional travel agencies that offer curated
                packages for all types of adventures. From luxury getaways to
                budget-friendly trips, find the perfect match for your travel
                needs.
              </p>
              <Link
                to="/home"
                className="inline-flex items-center px-5 py-3 bg-[#0077B5] text-white rounded hover:bg-[#00A0DC] transition-colors"
              >
                <FaBriefcase className="mr-2" />
                View Agencies
                <FaArrowRight className="ml-2" />
              </Link>
            </div>

            <div className="md:w-1/2 relative">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src="/images/agency-main.png"
                  alt="Travel Agency"
                  className="w-full h-80 object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-48 h-48 rounded-lg overflow-hidden shadow-lg border-4 border-white">
                <img
                  src="/images/agency-small.png"
                  alt="Travel Agency Office"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Make Your Choice Section */}
      <section className="py-16 bg-[#f3f6f8]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#313335] mb-12">
            Choose Your Travel Experience
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-8 hover:shadow-md transition-shadow">
              <div className="text-[#0077B5] text-4xl mb-4">
                <FaUserTie />
              </div>
              <h3 className="text-2xl font-bold text-[#313335] mb-4">
                Travel with a Guide
              </h3>
              <p className="text-[#86888A] mb-6">
                Immerse yourself in unique cultural experiences and uncover
                hidden treasures guided by a local expert. Whether it's
                exploring historic landmarks or finding the best local cuisine,
                a guide ensures a truly personalized journey.
              </p>
              <ul className="space-y-2">
                {[
                  "Personalized attention",
                  "Local knowledge",
                  "Flexible itineraries",
                  "Cultural insights",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <FaCheck className="text-[#0077B5] mt-1 mr-2 flex-shrink-0" />
                    <span className="text-[#313335]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8 hover:shadow-md transition-shadow">
              <div className="text-[#0077B5] text-4xl mb-4">
                <FaBuilding />
              </div>
              <h3 className="text-2xl font-bold text-[#313335] mb-4">
                Book with an Agency
              </h3>
              <p className="text-[#86888A] mb-6">
                Experience a worry-free journey with pre-planned itineraries and
                all-inclusive services for your convenience. From comfortable
                accommodations to guided activities, everything is taken care of
                so you can focus on enjoying your trip.
              </p>
              <ul className="space-y-2">
                {[
                  "All-inclusive packages",
                  "Group discounts",
                  "Coordinated logistics",
                  "24/7 support",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <FaCheck className="text-[#0077B5] mt-1 mr-2 flex-shrink-0" />
                    <span className="text-[#313335]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* Footer Section */}
      <footer className="bg-white border-t border-[#dce6f1] py-12 font-['Segoe UI', Arial, sans-serif]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-lg font-bold text-[#313335] mb-4">
                EchoVoyages
              </h3>
              <p className="text-[#86888A] mb-4">
                Connecting travelers with expert guides and professional
                agencies for unforgettable journeys.
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
                    className="w-8 h-8 rounded-full bg-[#f3f6f8] flex items-center justify-center text-[#0077B5] hover:bg-[#0077B5] hover:text-white transition-colors"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold text-[#313335] mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
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
                      className="text-[#56687a] hover:text-[#0077B5] hover:underline transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-bold text-[#313335] mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
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
                      className="text-[#56687a] hover:text-[#0077B5] hover:underline transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-bold text-[#313335] mb-4">
                Stay Updated
              </h3>
              <p className="text-[#86888A] mb-3">
                Subscribe to our newsletter for travel tips and exclusive
                offers.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="input w-full bg-[#f3f6f8] border-[#0a66c2]/20 focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] transition-all duration-300"
                />
                <button className="bg-[#0077B5] text-white px-4 py-2 rounded-r hover:bg-[#00A0DC] transition-colors">
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-[#dce6f1] mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#86888A] text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} EchoVoyages. All rights
              reserved.
            </p>
            <div className="flex space-x-4">
              <Link
                to="/privacy"
                className="text-[#56687a] text-sm hover:text-[#0077B5] hover:underline transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="text-[#56687a] text-sm hover:text-[#0077B5] hover:underline transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/cookies"
                className="text-[#56687a] text-sm hover:text-[#0077B5] hover:underline transition-colors"
              >
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

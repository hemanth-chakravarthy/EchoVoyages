// import './Footer.css';
// import { Button } from "./Button";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

function Footer() {
  return (
    <div className="footer-container">
      <section className="footer-subscription"></section>
      <div className="footer-links">
        <div className="footer-link-wrapper">
          <div className="footer-link-items">
            <h2>About Us</h2>
            <Link to="/home">How it works</Link>
            <Link to="/home">Testimonials</Link>
            <Link to="/home">Careers</Link>
            <Link to="/home">Investors</Link>
            <Link to="/home">Terms of Service</Link>
          </div>
          <div className="footer-link-items">
            <h2>Contact Us</h2>
            <Link to="/home">Contact</Link>
            <Link to="/home">Support</Link>
            <Link to="/home">Destinations</Link>
            <Link to="/home">Sponsorships</Link>
          </div>
        </div>
        <div className="footer-link-wrapper">
          <div className="footer-link-items">
            <h2>Videos</h2>
            <Link to="/home">Submit Video</Link>
            <Link to="/home">Ambassadors</Link>
            <Link to="/home">Agency</Link>
            <Link to="/home">Influencer</Link>
          </div>
          <div className="footer-link-items">
            <h2>Social Media</h2>
            <Link to="/home">Instagram</Link>
            <Link to="/home">Facebook</Link>
            <Link to="/home">Youtube</Link>
            <Link to="/home">Twitter</Link>
          </div>
        </div>
      </div>
      <section className="social-media">
        <div className="social-media-wrap">
          <div className="footer-logo">
            <Link to="/home" className="social-logo" onClick={scrollToTop}>
              Echo Voyage <i className="fa-regular fa-wave"></i>
            </Link>
          </div>
          <small className="website-rights">Echo Voyage 2024</small>
          <div className="social-icons">
            <Link
              className="social-icon-link facebook"
              to="/home"
              target="_blank"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f" />
            </Link>
            <Link
              className="social-icon-link instagram"
              to="/home"
              target="_blank"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram" />
            </Link>
            <Link
              className="social-icon-link youtube"
              to="/home"
              target="_blank"
              aria-label="Youtube"
            >
              <i className="fab fa-youtube" />
            </Link>
            <Link
              className="social-icon-link twitter"
              to="/home"
              target="_blank"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter" />
            </Link>
            <Link
              className="social-icon-link twitter"
              to="/home"
              target="_blank"
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;

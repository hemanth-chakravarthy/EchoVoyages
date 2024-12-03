import styles from "./style";
import { AdventureCards, Business, CardDeal, CTA, Footer, Navbar, Testimonials, Hero } from "../components/landing";
import GoToTop from "./landing/go-to-top";
import TravelFAQBotButton from "./landing/TravelFAQBotButton";


const RealLandingPage = () => (
  <div className="bg-primary w-full min-h-screen overflow-hidden">
    {/* Navbar Section */}
    <div className={`${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <Navbar />
      </div>
    </div>

    {/* Hero Section */}
    <div className={`bg-primary ${styles.flexStart}`}>
      <div className={`${styles.boxWidth}`}>
        <Hero />
      </div>
    </div>
    
    {/* Main Content Section */}
    <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <Business />
        <AdventureCards />
        <CardDeal />
        <Testimonials />
        <CTA />        
        <GoToTop />
        <TravelFAQBotButton/>
        <Footer />
      </div>
    </div>
  </div>
);

export default RealLandingPage;

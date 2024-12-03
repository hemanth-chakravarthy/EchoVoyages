import {adventurecards} from "../assets";
import styles, { layout } from "../style";
import '../landingpage.css';

const AdventureCards = () => (
  <section id="product" className={layout.sectionReverse}>
    <div className={layout.sectionImgReverse}>
      <img src={adventurecards} alt="billing" className="w-[100%] h-[100%] relative z-[5]" />

      {/* gradient start */}
      <div className="absolute z-[3] -left-1/2 top-0 w-[50%] h-[50%] rounded-full white__gradient" />
      <div className="absolute z-[0] w-[50%] h-[50%] -left-1/2 bottom-0 rounded-full pink__gradient" />
      {/* gradient end */}
    </div>

    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
      Start Your Adventure <br className="sm:block hidden" /> Today!!
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
      Your dream destination is just a click away.<br className="sm:block hidden" />

      Explore breathtaking locations.<br className="sm:block hidden" />
      Book curated stays and experiences.<br className="sm:block hidden" />
      Enjoy a hassle-free journey from start to finish.<br className="sm:block hidden" />
      Let’s make your next trip extraordinary! 🌎✨
      </p>

    </div>
  </section>
);

export default AdventureCards;

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaCar, FaBolt, FaUtensils, FaShoppingCart, FaRobot, FaTrophy, FaChartLine, FaLeaf } from "react-icons/fa";

const ICONS = [<FaCar />, <FaBolt />, <FaUtensils />, <FaShoppingCart />, <FaRobot />, <FaTrophy />, <FaChartLine />, <FaLeaf />];
const KEYS  = ["transport","energy","food","shopping","aiCoach","leaderboard","analytics","certificate"];
const COLORS = ["#3b82f6","#fbbf24","#f97316","#a855f7","#33FFC7","#FFD700","#ec4899","#10b981"];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity:0, y:28 }, show: { opacity:1, y:0, transition:{ duration:0.5, ease:[0.16,1,0.3,1] } } };

export default function Features() {
  const { t } = useTranslation();
  return (
    <section className="features-section">
      <div className="fs-header">
        <motion.span className="fs-eyebrow" initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
          {t("features.eyebrow")}
        </motion.span>
        <motion.h2 className="fs-title" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:0.1}}>
          {t("features.title")}<span className="fs-title-accent">{t("features.titleAccent")}</span>
        </motion.h2>
        <motion.p className="fs-subtitle" initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{delay:0.2}}>
          {t("features.subtitle")}
        </motion.p>
      </div>
      <motion.div className="fs-grid" variants={container} initial="hidden" whileInView="show" viewport={{once:true,margin:"-60px"}}>
        {KEYS.map((key, i) => (
          <motion.div key={i} className="fs-card" style={{"--accent":COLORS[i]}} variants={item} whileHover={{y:-8,transition:{duration:0.22}}}>
            <div className="fs-card-icon">{ICONS[i]}</div>
            <h3 className="fs-card-title">{t(`features.${key}`)}</h3>
            <p className="fs-card-desc">{t(`features.${key}Desc`)}</p>
            <span className="fs-card-arrow">→</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

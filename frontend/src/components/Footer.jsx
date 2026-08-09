import { FaLeaf, FaGithub, FaTwitter, FaLinkedin, FaHeart } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const COLS = [
    { titleKey: "footer.product",  links: [["footer.dashboard","#"],["footer.ecoCoach","#"],["footer.leaderboard","#"],["footer.certificate","#"]] },
    { titleKey: "footer.company",  links: [["footer.about","#"],["footer.blog","#"],["footer.careers","#"],["footer.contactUs","#"]] },
    { titleKey: "footer.legal",    links: [["footer.privacy","#"],["footer.terms","#"],["footer.cookie","#"]] },
  ];
  return (
    <footer className="footer-premium">
      <div className="fp-inner">
        <div className="fp-brand">
          <div className="fp-logo"><div className="fp-logo-icon"><FaLeaf /></div><span>CarbonTracker</span></div>
          <p className="fp-tagline">{t("footer.tagline")}</p>
          <div className="fp-socials">
            {[<FaGithub />, <FaTwitter />, <FaLinkedin />].map((icon, i) => (
              <a key={i} href="#" className="fp-social-btn" aria-label="social">{icon}</a>
            ))}
          </div>
        </div>
        {COLS.map((col) => (
          <div className="fp-col" key={col.titleKey}>
            <h4 className="fp-col-title">{t(col.titleKey)}</h4>
            {col.links.map(([key, href]) => <a key={key} href={href} className="fp-link">{t(key)}</a>)}
          </div>
        ))}
      </div>
      <div className="fp-bottom">
        <span>{t("footer.copyright")}</span>
        <span className="fp-made-with">{t("footer.madeWith")} <FaHeart className="fp-heart" /> {t("footer.forPlanet")}</span>
      </div>
    </footer>
  );
}

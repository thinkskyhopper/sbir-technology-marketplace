
import { useNavigate } from "react-router-dom";

const ExpertValueHero = () => {
  const navigate = useNavigate();

  const handleExpertTeamClick = () => {
    navigate('/team');
  };

  return (
    <section className="text-center mb-16">
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
          What are <span className="text-gradient">SBIRs</span> and <span className="text-gradient">STTRs</span>?
        </h2>
        <p className="text-xl max-w-4xl mx-auto leading-relaxed text-muted-foreground">
          Since the enactment of the Small Business Innovation Development Act of 1982, the SBIR (Small Business Innovation Research) and STTR (Small Business Technology Transfer) programs have supported the development and commercialization of cutting-edge technologies. SBIR focuses on small businesses, while STTR fosters collaboration between small businesses and research institutions. In practice, "SBIR" is often used as shorthand for both programs.
        </p>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        Why Choose <span className="text-gradient">Expert Guidance</span>?
      </h1>
      <p className="text-xl max-w-3xl mx-auto leading-relaxed text-muted-foreground">
        SBIR technology transactions involve complex regulations, substantial paperwork, and significant financial implications. 
        Our{" "}
        <button 
          onClick={handleExpertTeamClick}
          className="text-gradient underline hover:no-underline font-semibold cursor-pointer transition-all duration-200 hover:scale-105"
        >
          expert team
        </button>{" "}
        has successfully facilitated over $500M in technology transfers, ensuring smooth, compliant, and profitable transactions.
      </p>
    </section>
  );
};

export default ExpertValueHero;

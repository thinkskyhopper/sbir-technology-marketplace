
import { useNavigate } from "react-router-dom";

const ExpertValueHero = () => {
  const navigate = useNavigate();

  const handleExpertTeamClick = () => {
    navigate('/team');
  };

  return (
    <section className="text-center mb-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        Why Choose <span className="text-gradient">Expert Guidance</span>?
      </h1>
      <p className="text-xl max-w-3xl mx-auto leading-relaxed text-slate-50">
        SBIR technology transactions involve complex regulations, substantial paperwork, and significant financial implications. 
        Our{" "}
        <button 
          onClick={handleExpertTeamClick}
          className="text-gradient hover:underline font-semibold cursor-pointer transition-all duration-200 hover:scale-105"
        >
          expert team
        </button>{" "}
        has successfully facilitated over $500M in technology transfers, ensuring smooth, compliant, and profitable transactions.
      </p>
    </section>
  );
};

export default ExpertValueHero;

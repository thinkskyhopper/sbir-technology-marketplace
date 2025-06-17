
const ExpertValueStats = () => {
  return (
    <section className="grid md:grid-cols-3 gap-8 mb-16">
      <div className="text-center">
        <div className="text-3xl font-bold text-primary mb-2">98%</div>
        <div className="text-muted-foreground">Success Rate</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-primary mb-2">$500M+</div>
        <div className="text-muted-foreground">Contracts Facilitated</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-primary mb-2">30 Days</div>
        <div className="text-muted-foreground">Average Transaction Time</div>
      </div>
    </section>
  );
};

export default ExpertValueStats;

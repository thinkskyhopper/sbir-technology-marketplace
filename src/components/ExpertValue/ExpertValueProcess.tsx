
const ExpertValueProcess = () => {
  const processSteps = [
    {
      step: "1",
      title: "Initial Consultation",
      description: "Free 30-minute assessment of your needs and objectives"
    },
    {
      step: "2",
      title: "SBIR Strategy",
      description: "Develop a customized approach for your specific situation"
    },
    {
      step: "3",
      title: "Expert Execution",
      description: "Our team handles negotiations, paperwork, and compliance"
    },
    {
      step: "4",
      title: "Successful Transfer",
      description: "Complete the transaction with full legal and regulatory compliance"
    }
  ];

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-12">Our Proven Process</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {processSteps.map((step, index) => (
          <div key={index} className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground font-bold text-xl">{step.step}</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExpertValueProcess;

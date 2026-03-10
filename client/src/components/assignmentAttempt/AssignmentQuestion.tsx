// Dev note: question section stays dumb/presentational; data prep happens in route layer.
interface AssignmentQuestionProps {
  question: string;
}

export default function AssignmentQuestion({ question }: AssignmentQuestionProps) {
  return (
    <section className="content-card">
      <h2 className="content-card__title">Question</h2>
      <p>{question}</p>
    </section>
  );
}



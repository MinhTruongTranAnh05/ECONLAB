import { ArrowUpRight } from 'lucide-react';
import { chapters, type Question } from '../data';
import { AnimatedNumber } from '../motion';

export function ExamInsights({ questions, answers }: { questions: Question[]; answers: Record<string, number> }) {
  const correct = questions.filter(question => answers[question.id] === question.answer).length;
  const accuracy = questions.length ? Math.round(correct / questions.length * 100) : 0;
  const circumference = 2 * Math.PI * 52;
  return <section className="exam-insights" aria-label="Kết quả theo chủ đề">
    <div className="exam-score-ring" role="img" aria-label={`${accuracy}% chính xác`}>
      <svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52"/><circle className="score-arc" cx="60" cy="60" r="52" strokeDasharray={`${circumference * accuracy / 100} ${circumference}`}/></svg>
      <div aria-hidden="true"><strong><AnimatedNumber value={accuracy}/>%</strong><small>ĐỘ CHÍNH XÁC</small></div>
    </div>
    <div className="exam-topic-performance">{chapters.map(chapter => {
      const items = questions.filter(question => question.topic === chapter.number);
      const score = items.filter(question => answers[question.id] === question.answer).length;
      return <div key={chapter.id}><strong>{chapter.number} — {chapter.short}</strong><p>{items.length ? `${score}/${items.length} câu đúng · ${items.length - score} câu cần xem lại` : 'Không có câu thuộc chủ đề này trong đề'}</p>{items.length > 0 && <progress aria-label={`Kết quả chương ${chapter.number}`} max={items.length} value={score}/>}{items.length > score && <a href={`#${chapter.id}`} className="text-link">Ôn lại chương {chapter.number}<ArrowUpRight size={13}/></a>}</div>;
    })}</div>
  </section>;
}

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getType } from "../../constants";

const MARKDOWN_PLUGINS = [remarkGfm];

export default function QuizView({
  quizState,
  qWord,
  qChoices,
  onStartQuiz,
  onAnswerQuiz,
  onNextQuiz,
  onBackToCards,
}) {
  if (!quizState) {
    return (
      <div className="quiz-wrap">
        <div className="empty">
          <div className="empty-icon">🎯</div>
          <div className="empty-text" style={{ marginBottom: 14 }}>No active quiz yet for this selection</div>
          <button className="btn-primary" onClick={onStartQuiz}>Start Quiz</button>
          <div className="empty-text" style={{ marginTop: 12, fontSize: "0.75rem" }}>Quiz runs per sense, with definition context.</div>
        </div>
      </div>
    );
  }

  if (quizState.done) {
    return (
      <div className="quiz-wrap">
        <div className="quiz-result">
          <div className="quiz-score">{quizState.score}/{quizState.words.length}</div>
          <div className="quiz-score-label">
            {quizState.score === quizState.words.length
              ? "🎉 Perfect!"
              : quizState.score >= quizState.words.length * 0.7
                ? "👍 Great job!"
                : "💪 Keep practicing!"}
          </div>
          <button className="btn-primary" style={{ marginTop: 24 }} onClick={onBackToCards}>← Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-wrap">
      <div className="quiz-progress">
        <span>Question {quizState.idx + 1} / {quizState.words.length}</span>
        <span>⭐ {quizState.score} points</span>
      </div>

      <div className="quiz-prog-bar">
        <div className="quiz-prog-fill" style={{ width: `${(quizState.idx / quizState.words.length) * 100}%` }} />
      </div>

      <div className="quiz-card">
        <div className="quiz-question">Choose the correct Vietnamese meaning for this sense</div>
        <div className="quiz-word">{qWord.en}</div>
        {qWord.ph && <div className="quiz-ph">{qWord.ph}</div>}
        <div className="quiz-sense-line md-content md-compact">
          <ReactMarkdown remarkPlugins={MARKDOWN_PLUGINS}>{qWord.meaningEn}</ReactMarkdown>
        </div>
        <div className="quiz-sense-line">{getType(qWord.type).label}{qWord.grammar ? ` · ${qWord.grammar}` : ""}</div>
      </div>

      <div className="quiz-choices">
        {qChoices.map(choice => {
          let cls = "quiz-choice";
          if (quizState.answered !== null) {
            if (choice.id === qWord.id) cls += " correct";
            else if (choice.id === quizState.choice && choice.id !== qWord.id) cls += " wrong";
          }

          return (
            <button
              key={choice.id}
              className={cls}
              onClick={() => onAnswerQuiz(choice)}
              disabled={quizState.answered !== null}
            >
              {choice.meaningVi}
            </button>
          );
        })}
      </div>

      {quizState.answered !== null && (
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <div style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: 8, color: quizState.answered ? "#4ade80" : "#f87171" }}>
            {quizState.answered ? "✅ Correct!" : `❌ Wrong! Correct answer: "${qWord.meaningVi}"`}
          </div>

          {qWord.ex && (
            <div className="quiz-example md-content" style={{ marginBottom: 10 }}>
              <div className="md-label">💬 Example</div>
              <ReactMarkdown remarkPlugins={MARKDOWN_PLUGINS}>{qWord.ex}</ReactMarkdown>
            </div>
          )}

          <button className="btn-primary" onClick={onNextQuiz}>
            {quizState.idx + 1 >= quizState.words.length ? "View results →" : "Next →"}
          </button>
        </div>
      )}
    </div>
  );
}

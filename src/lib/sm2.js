// rating: 0=Không nhớ, 1=Khó, 2=Ổn, 3=Dễ
// card: { ease, interval, repetitions, nextReview }
export function sm2(card = {}, rating) {
  let { ease = 2.5, interval = 0, repetitions = 0 } = card;
  if (rating < 1) {
    repetitions = 0; interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 3;
    else interval = Math.round(interval * ease);
    repetitions += 1;
  }
  ease = Math.max(1.3, ease + 0.1 - (3 - rating) * (0.08 + (3 - rating) * 0.02));
  const nextReview = Date.now() + interval * 86400000;
  return { ease, interval, repetitions, nextReview };
}

export function isDueToday(card) {
  if (!card || !card.nextReview) return true;
  return card.nextReview <= Date.now();
}

export function isDueSoon(card) {
  if (!card || !card.nextReview) return false;
  const now = Date.now();
  return card.nextReview > now && card.nextReview <= now + 86400000 * 3;
}

import type { Expert } from '../types';

/** Demo expert roster. Each verifies specific categories of lots (linked via Product.expertId).
    Ukrainian-only content, same convention as reviews/Q&A — surrounding UI labels are translated,
    this seed content isn't. */
export const EXPERTS: Record<string, Expert> = {
  kovalenko: {
    id: 'kovalenko',
    name: 'Іван Коваленко',
    specialization: 'Нумізматика, ордени та медалі',
    yearsExperience: 17,
    verificationsCount: 1234,
    rating: 4.9,
    bio: 'Кандидат історичних наук, спеціалізується на монетах Російської імперії та радянській нумізматиці. Консультує аукціонні дома з 2009 року.',
  },
  semenova: {
    id: 'semenova',
    name: 'Олена Семенова',
    specialization: 'Фарфор та керамика',
    yearsExperience: 12,
    verificationsCount: 612,
    rating: 5.0,
    bio: 'Експерт з європейського та радянського фарфору. Працювала з музейними колекціями, визначає мануфактуру та період за клеймом і розписом.',
  },
  bondar: {
    id: 'bondar',
    name: 'Михайло Бондар',
    specialization: 'Годинники та механізми',
    yearsExperience: 22,
    verificationsCount: 894,
    rating: 4.8,
    bio: 'Годинникар-реставратор. Перевіряє автентичність механізму, відповідність клейм виробника та оригінальність комплектуючих.',
  },
  tkachuk: {
    id: 'tkachuk',
    name: 'Анна Ткачук',
    specialization: 'Живопис та графіка',
    yearsExperience: 9,
    verificationsCount: 347,
    rating: 4.9,
    bio: 'Мистецтвознавець, спеціалізується на українському та європейському живописі XIX–XX століть. Аналізує техніку, кракелюр та провенанс.',
  },
};

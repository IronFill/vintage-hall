# Деплой «ГрантПлан» на Netlify

Проєкт лежить у підпапці **`grantplan/`** репозиторію, тому ключове налаштування — **Base directory = `grantplan`**. Форми обробляє Netlify Function (`netlify/functions/submit.mjs`), яка надсилає заявки в Telegram.

---

## Варіант A. Через Git (рекомендовано — авто-деплой при пуші)

### 1. Підготувати Telegram-бота (для форми)

1. У [@BotFather](https://t.me/BotFather) → `/newbot` → отримати **`TG_BOT_TOKEN`**.
2. Дізнатися **`TG_CHAT_ID`**: напишіть своєму боту, потім відкрийте [@userinfobot](https://t.me/userinfobot) (для особистого чату). Для каналу — додайте бота адміном і візьміть id каналу.

### 2. Створити сайт у Netlify

Netlify → **Add new site → Import an existing project** → **GitHub** → вибрати репозиторій `ironfill/vintage-hall`.

### 3. Налаштування збірки (найважливіше)

| Поле | Значення |
| --- | --- |
| **Base directory** | `grantplan` |
| **Build command** | `npm run build` |
| **Publish directory** | `grantplan/dist` |
| **Functions directory** | `grantplan/netlify/functions` |

> У репозиторії вже є `grantplan/netlify.toml`. Коли Base directory = `grantplan`, Netlify читає його й сам підставить build / publish / functions і Node 20. Тобто в UI достатньо вказати **Base directory = `grantplan`**, решта підтягнеться.

### 4. Змінні оточення

Site configuration → **Environment variables** → додати:

- `TG_BOT_TOKEN` — токен бота
- `TG_CHAT_ID` — id чату
- (опц.) `SITE_URL` — фінальний домен, напр. `https://grantplan.com.ua`

### 5. Гілка для деплою

- Поки PR не змерджено — у **Site configuration → Build & deploy → Branches** вкажіть продакшн-гілку `claude/session-a0469f`.
- Після мержу в `master` — переключіть продакшн-гілку на `master`.

### 6. Deploy

**Deploy site**. Функція форми буде доступна на `/.netlify/functions/submit`.

### 7. Домен

- **Domain management → Add a custom domain** → ввести домен → у реєстратора прописати CNAME/записи за підказкою Netlify → SSL видається автоматично.
- Після зміни домену оновіть у коді: `src/data/site.ts` (`url`), `astro.config.mjs` (`site`), `public/robots.txt` і `data-domain` Plausible у `src/layouts/Layout.astro`.

### 8. Перевірка

Надішліть тестову заявку через форму → має прийти повідомлення в Telegram.

---

## Варіант B. Через Netlify CLI (ручний деплой)

```bash
npm install -g netlify-cli
cd grantplan
netlify login
netlify init          # привʼязати/створити сайт; base = поточна папка
netlify env:set TG_BOT_TOKEN "СЮДИ_ТОКЕН"
netlify env:set TG_CHAT_ID "СЮДИ_CHAT_ID"
netlify deploy --build --prod   # збере і задеплоїть із функціями
```

CLI запускається з папки `grantplan`, тож Base directory уже правильний, а `netlify.toml` поруч підхопиться автоматично.

---

## Якщо токенів Telegram ще немає

Сайт усе одно задеплоїться, і заявки не загубляться: функція логуватиме їх у **Functions logs**, поки змінні не задані. Пізніше додасте `TG_BOT_TOKEN` / `TG_CHAT_ID` і передеплоїте.

## Fallback без Netlify Functions (Formspree)

Якщо не хочете піднімати функцію (напр. деплой на GitHub Pages) — у `netlify/functions/submit.mjs` знизу є закоментований варіант через [Formspree](https://formspree.io): замініть `XXXXXXX` на id вашої форми, а у формах (`LeadForm.astro`, `Quiz.astro`) — шлях `fetch` на URL Formspree.

---

Коротка версія цих кроків також є в `README.md` (розділи «Форми → Telegram» і «Деплой»).

import type { Lang } from '../types';

/** All copy for the standalone /login and /register pages (Violity-style flow).
    Kept out of the main UI dict — these pages render entirely client-side so the
    language switcher works without a page reload. */
export const AUTH_T: Record<string, Record<Lang, string>> = {
  // ---- shared chrome ----
  back_home: { uk: '← На головну', en: '← Back to home', pl: '← Strona główna', ru: '← На главную' },

  // ---- register: wizard ----
  reg_title: { uk: 'Створити акаунт', en: 'Create account', pl: 'Utwórz konto', ru: 'Создать аккаунт' },
  reg_step1: { uk: 'Реєстраційні дані', en: 'Registration details', pl: 'Dane rejestracyjne', ru: 'Регистрационные данные' },
  reg_step2: { uk: 'Підтвердження e-mail', en: 'E-mail confirmation', pl: 'Potwierdzenie e-mail', ru: 'Подтверждение e-mail' },
  reg_step3: { uk: 'Готово', en: 'Done', pl: 'Gotowe', ru: 'Готово' },

  sec_lang_country: { uk: 'Мова і країна', en: 'Language and country', pl: 'Język i kraj', ru: 'Язык и страна' },
  field_site_lang: { uk: 'Мова сайту', en: 'Site language', pl: 'Język strony', ru: 'Язык сайта' },
  field_country: { uk: 'Країна проживання', en: 'Country of residence', pl: 'Kraj zamieszkania', ru: 'Страна проживания' },

  sec_contact: { uk: 'Контактна інформація', en: 'Contact information', pl: 'Informacje kontaktowe', ru: 'Контактная информация' },
  field_nickname: { uk: "Ваше ім'я на сайті", en: 'Your name on the site', pl: 'Twoja nazwa na stronie', ru: 'Ваше имя на сайте' },
  field_fullname: { uk: "Ім'я та прізвище", en: 'First and last name', pl: 'Imię i nazwisko', ru: 'Имя и фамилия' },
  field_email: { uk: 'E-mail', en: 'E-mail', pl: 'E-mail', ru: 'E-mail' },
  field_phone: { uk: 'Телефон', en: 'Phone', pl: 'Telefon', ru: 'Телефон' },
  field_phone_code: { uk: 'Код', en: 'Code', pl: 'Kod', ru: 'Код' },

  sec_security: { uk: 'Безпека', en: 'Security', pl: 'Bezpieczeństwo', ru: 'Безопасность' },
  field_password: { uk: 'Пароль', en: 'Password', pl: 'Hasło', ru: 'Пароль' },
  field_password2: { uk: 'Повторіть пароль', en: 'Repeat password', pl: 'Powtórz hasło', ru: 'Повторите пароль' },
  show_password: { uk: 'Показати пароль', en: 'Show password', pl: 'Pokaż hasło', ru: 'Показать пароль' },
  hide_password: { uk: 'Приховати пароль', en: 'Hide password', pl: 'Ukryj hasło', ru: 'Скрыть пароль' },

  captcha_label: { uk: 'Символи', en: 'Characters', pl: 'Znaki', ru: 'Символы' },
  captcha_refresh: { uk: 'Інші символи', en: 'Other characters', pl: 'Inne znaki', ru: 'Другие символы' },

  consent_text: {
    uk: 'Підтверджую, що ознайомився(ознайомилася) з <a href="/rules" target="_blank">Правилами Vintage Hall</a> та <a href="/guarantee" target="_blank">Гарантією автентичності</a>, приймаю їх і зобов\'язуюся їх дотримуватися. Надаю згоду на обробку зазначених мною даних для цілей роботи платформи та на отримання службових повідомлень на вказані e-mail і телефон. Мені відомо, що я можу в будь-який час відмовитися від маркетингових розсилок у кабінеті користувача.',
    en: 'I confirm that I have read the <a href="/rules" target="_blank">Vintage Hall Rules</a> and the <a href="/guarantee" target="_blank">Authenticity Guarantee</a>, accept them and undertake to comply with them. I consent to the processing of the data I provided for the operation of the platform and to receiving service messages to the specified e-mail and phone. I know I can opt out of marketing messages at any time in my account.',
    pl: 'Potwierdzam, że zapoznałem(-am) się z <a href="/rules" target="_blank">Regulaminem Vintage Hall</a> oraz <a href="/guarantee" target="_blank">Gwarancją autentyczności</a>, akceptuję je i zobowiązuję się ich przestrzegać. Wyrażam zgodę na przetwarzanie podanych danych w celu działania platformy oraz na otrzymywanie wiadomości serwisowych na podany e-mail i telefon. Wiem, że w każdej chwili mogę zrezygnować z wiadomości marketingowych w koncie użytkownika.',
    ru: 'Подтверждаю, что ознакомился(ознакомилась) с <a href="/rules" target="_blank">Правилами Vintage Hall</a> и <a href="/guarantee" target="_blank">Гарантией аутентичности</a>, принимаю их и обязуюсь их соблюдать. Даю согласие на обработку указанных мною данных для целей работы платформы и на получение служебных сообщений на указанные e-mail и телефон. Мне известно, что я могу в любой момент отказаться от маркетинговых рассылок в кабинете пользователя.',
  },

  btn_register: { uk: 'Зареєструватися', en: 'Sign up', pl: 'Zarejestruj się', ru: 'Зарегистрироваться' },

  // ---- register: aside ----
  aside_login_title: { uk: 'Раді Вас знову бачити :)', en: 'Glad to see you again :)', pl: 'Miło Cię znowu widzieć :)', ru: 'Рады Вас снова видеть :)' },
  aside_login_text: {
    uk: 'Зареєстровані? Щоб увійти на сайт, введіть Ваші реєстраційні дані.',
    en: 'Already registered? Enter your credentials to sign in.',
    pl: 'Masz konto? Wpisz swoje dane, aby się zalogować.',
    ru: 'Зарегистрированы? Чтобы войти на сайт, введите Ваши регистрационные данные.',
  },
  btn_go_login: { uk: 'Увійти', en: 'Sign in', pl: 'Zaloguj się', ru: 'Войти' },

  // ---- register: confirm step ----
  confirm_title: { uk: 'Підтвердження e-mail', en: 'E-mail confirmation', pl: 'Potwierdzenie e-mail', ru: 'Подтверждение e-mail' },
  confirm_aside_text: {
    uk: 'Перейдіть до своєї поштової скриньки {email}, знайдіть надісланий Вам лист із кодом підтвердження та введіть його в поле. Також Ви можете перейти за посиланням у листі й одразу підтвердити свій e-mail.',
    en: 'Go to your inbox {email}, find the e-mail with the confirmation code and enter it below. You can also follow the link in the e-mail to confirm your address right away.',
    pl: 'Przejdź do swojej skrzynki {email}, znajdź wiadomość z kodem potwierdzającym i wpisz go w pole. Możesz też kliknąć link w wiadomości i od razu potwierdzić swój e-mail.',
    ru: 'Перейдите в свой почтовый ящик {email}, найдите отправленное Вам письмо с кодом подтверждения и введите его в поле. Также Вы можете перейти по ссылке в письме и сразу подтвердить свой e-mail.',
  },
  check_spam: { uk: 'Перевірте Вхідні та Спам.', en: 'Check Inbox and Spam.', pl: 'Sprawdź Odebrane i Spam.', ru: 'Проверьте Входящие и Спам.' },
  resend_code: { uk: 'Надіслати код ще раз', en: 'Send the code again', pl: 'Wyślij kod ponownie', ru: 'Отправить код ещё раз' },
  summary_not_set: { uk: 'не вибрано', en: 'not set', pl: 'nie wybrano', ru: 'не выбрано' },
  demo_code_note: {
    uk: 'Демо-режим: поштовий сервіс не підключено, ваш код —',
    en: 'Demo mode: e-mail service is not connected, your code is',
    pl: 'Tryb demo: usługa e-mail nie jest podłączona, Twój kod to',
    ru: 'Демо-режим: почтовый сервис не подключён, ваш код —',
  },
  field_code: { uk: 'Код з листа', en: 'Code from the e-mail', pl: 'Kod z wiadomości', ru: 'Код из письма' },
  btn_confirm: { uk: 'Підтвердити', en: 'Confirm', pl: 'Potwierdź', ru: 'Подтвердить' },

  // ---- register: done step ----
  done_title: { uk: 'Акаунт створено!', en: 'Account created!', pl: 'Konto utworzone!', ru: 'Аккаунт создан!' },
  done_text: {
    uk: 'Вітаємо на Vintage Hall. Тепер ви можете робити ставки, купувати та виставляти власні лоти.',
    en: 'Welcome to Vintage Hall. You can now bid, buy and list your own lots.',
    pl: 'Witamy w Vintage Hall. Możesz teraz licytować, kupować i wystawiać własne loty.',
    ru: 'Добро пожаловать на Vintage Hall. Теперь вы можете делать ставки, покупать и выставлять собственные лоты.',
  },
  btn_to_cabinet: { uk: 'Перейти до кабінету', en: 'Go to my account', pl: 'Przejdź do konta', ru: 'Перейти в кабинет' },

  // ---- login page ----
  login_title: { uk: 'Вхід до акаунту', en: 'Sign in to your account', pl: 'Logowanie do konta', ru: 'Вход в аккаунт' },
  field_login_or_email: { uk: 'Логін або e-mail', en: 'Login or e-mail', pl: 'Login lub e-mail', ru: 'Логин или e-mail' },
  remember_me: { uk: "Запам'ятати мене", en: 'Remember me', pl: 'Zapamiętaj mnie', ru: 'Запомнить меня' },
  forgot_password: { uk: 'Забули пароль?', en: 'Forgot your password?', pl: 'Nie pamiętasz hasła?', ru: 'Забыли пароль?' },
  btn_login: { uk: 'Увійти', en: 'Sign in', pl: 'Zaloguj się', ru: 'Войти' },

  aside_reg_title: { uk: 'Вперше на Vintage Hall?', en: 'New to Vintage Hall?', pl: 'Pierwszy raz w Vintage Hall?', ru: 'Впервые на Vintage Hall?' },
  aside_reg_text: {
    uk: 'Створіть акаунт, щоб робити ставки, продавати власні речі та зберігати обране.',
    en: 'Create an account to bid, sell your own items and keep favorites.',
    pl: 'Utwórz konto, aby licytować, sprzedawać własne przedmioty i zapisywać ulubione.',
    ru: 'Создайте аккаунт, чтобы делать ставки, продавать собственные вещи и сохранять избранное.',
  },
  btn_go_register: { uk: 'Створити акаунт', en: 'Create account', pl: 'Utwórz konto', ru: 'Создать аккаунт' },

  // ---- forgot password ----
  reset_title: { uk: 'Відновлення пароля', en: 'Password recovery', pl: 'Odzyskiwanie hasła', ru: 'Восстановление пароля' },
  reset_text: {
    uk: 'Вкажіть e-mail, на який зареєстровано акаунт — ми надішлемо посилання для зміни пароля.',
    en: 'Enter the e-mail your account is registered to — we will send a password reset link.',
    pl: 'Podaj e-mail, na który zarejestrowano konto — wyślemy link do zmiany hasła.',
    ru: 'Укажите e-mail, на который зарегистрирован аккаунт — мы отправим ссылку для смены пароля.',
  },
  btn_reset: { uk: 'Надіслати', en: 'Send', pl: 'Wyślij', ru: 'Отправить' },
  reset_done: {
    uk: 'Якщо такий e-mail зареєстровано, лист із інструкціями вже в дорозі. Демо-режим: пошта не підключена — новий пароль:',
    en: 'If this e-mail is registered, instructions are on the way. Demo mode: e-mail is not connected — your new password:',
    pl: 'Jeśli taki e-mail jest zarejestrowany, instrukcje są w drodze. Tryb demo: poczta nie jest podłączona — nowe hasło:',
    ru: 'Если такой e-mail зарегистрирован, письмо с инструкциями уже в пути. Демо-режим: почта не подключена — новый пароль:',
  },
  back_to_login: { uk: '← Повернутися до входу', en: '← Back to sign in', pl: '← Wróć do logowania', ru: '← Вернуться ко входу' },

  // ---- validation errors ----
  err_required: { uk: "Обов'язкове поле", en: 'Required field', pl: 'Pole wymagane', ru: 'Обязательное поле' },
  err_nickname_len: { uk: 'Від 3 до 25 символів', en: '3 to 25 characters', pl: 'Od 3 do 25 znaków', ru: 'От 3 до 25 символов' },
  err_nickname_taken: { uk: "Це ім'я вже зайняте", en: 'This name is already taken', pl: 'Ta nazwa jest już zajęta', ru: 'Это имя уже занято' },
  err_email_invalid: { uk: 'Невірний формат e-mail', en: 'Invalid e-mail format', pl: 'Nieprawidłowy format e-mail', ru: 'Неверный формат e-mail' },
  err_email_taken: { uk: 'Цей e-mail вже зареєстровано', en: 'This e-mail is already registered', pl: 'Ten e-mail jest już zarejestrowany', ru: 'Этот e-mail уже зарегистрирован' },
  err_phone: { uk: 'Вкажіть номер телефону', en: 'Enter a phone number', pl: 'Podaj numer telefonu', ru: 'Укажите номер телефона' },
  err_password_len: { uk: 'Від 6 до 12 символів', en: '6 to 12 characters', pl: 'Od 6 do 12 znaków', ru: 'От 6 до 12 символов' },
  err_password_match: { uk: 'Паролі не збігаються', en: 'Passwords do not match', pl: 'Hasła nie są zgodne', ru: 'Пароли не совпадают' },
  err_captcha: { uk: 'Символи введено невірно', en: 'Characters entered incorrectly', pl: 'Znaki wpisane niepoprawnie', ru: 'Символы введены неверно' },
  err_consent: { uk: 'Потрібно прийняти правила', en: 'You must accept the rules', pl: 'Musisz zaakceptować regulamin', ru: 'Необходимо принять правила' },
  err_login_notfound: { uk: 'Користувача з таким логіном або e-mail не знайдено', en: 'No user with this login or e-mail', pl: 'Nie znaleziono użytkownika o tym loginie lub e-mailu', ru: 'Пользователь с таким логином или e-mail не найден' },
  err_password_wrong: { uk: 'Невірний пароль', en: 'Wrong password', pl: 'Błędne hasło', ru: 'Неверный пароль' },
  err_code: { uk: 'Невірний код', en: 'Wrong code', pl: 'Błędny kod', ru: 'Неверный код' },
  err_country: { uk: 'Оберіть країну', en: 'Select a country', pl: 'Wybierz kraj', ru: 'Выберите страну' },
};

export const AUTH_COUNTRIES: { code: string; label: Record<Lang, string> }[] = [
  { code: 'UA', label: { uk: 'Україна', en: 'Ukraine', pl: 'Ukraina', ru: 'Украина' } },
  { code: 'PL', label: { uk: 'Польща', en: 'Poland', pl: 'Polska', ru: 'Польша' } },
  { code: 'DE', label: { uk: 'Німеччина', en: 'Germany', pl: 'Niemcy', ru: 'Германия' } },
  { code: 'CZ', label: { uk: 'Чехія', en: 'Czechia', pl: 'Czechy', ru: 'Чехия' } },
  { code: 'GB', label: { uk: 'Велика Британія', en: 'United Kingdom', pl: 'Wielka Brytania', ru: 'Великобритания' } },
  { code: 'US', label: { uk: 'США', en: 'USA', pl: 'USA', ru: 'США' } },
  { code: 'CA', label: { uk: 'Канада', en: 'Canada', pl: 'Kanada', ru: 'Канада' } },
  { code: 'OTHER', label: { uk: 'Інша країна', en: 'Other country', pl: 'Inny kraj', ru: 'Другая страна' } },
];

export const AUTH_PHONE_CODES = ['+380', '+48', '+49', '+420', '+44', '+1', '+33', '+39'];

export const AUTH_LANG_NAMES: Record<Lang, string> = {
  uk: 'Українська', en: 'English', pl: 'Polski', ru: 'Русский',
};

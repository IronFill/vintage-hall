# Подключение Supabase

Сейчас весь проект работает на демо-данных в памяти браузера (`src/data/products.ts`,
`localStorage` — см. `loadPreferences`/`savePreference`/`saveCart` в `src/scripts/app.ts`).
Это сделано осознанно: без реального Supabase-проекта подключать "живые" вызовы было бы
нечестно — они бы просто ничего не делали или падали с ошибкой.

## Шаги для реального подключения

1. Создайте проект на https://supabase.com (бесплатный план достаточен для старта).
2. Откройте SQL Editor → вставьте и выполните `supabase/schema.sql` (создаёт таблицы
   `profiles`, `products`, `bids`, `favorites`, `reviews` + RLS-политики).
3. Settings → API → скопируйте **Project URL** и **anon public key**.
4. Скопируйте `.env.example` → `.env`, вставьте туда эти два значения.
5. `src/lib/supabase.ts` теперь экспортирует реальный клиент `supabase` (раньше — `null`).

## Что делать дальше (по одной фиче, не всё сразу)

Самое безопасное — мигрировать по одной точке за раз, тестируя каждую:

- **Авторизация**: заменить `openLogin`/`submitLogin` (`src/scripts/cabinet.ts`) на
  `supabase.auth.signInWithOtp(...)` или `signInWithPassword`.
- **Каталог**: `SEEDED_PRODUCTS` → `await supabase.from('products').select('*')` при инициализации.
- **Ставки**: `placeBid` (`src/scripts/lot-detail.ts`) → `insert` в таблицу `bids` +
  Supabase Realtime подписка для живого обновления у всех зрителей лота.
- **Избранное**: `toggleFavorite` → `insert`/`delete` в таблицу `favorites`.
- **Создание лота**: `publishListing` (`src/scripts/cabinet.ts`) → `insert` в `products`.

Полная схема полей в `supabase/schema.sql` сделана зеркально структуре `Product` в
`src/types.ts` — переносить поля 1:1, без изменения дизайна данных.

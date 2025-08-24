# Svoboda RP (alt:V) — Windows стартовий RP-фреймворк

> Увага: через ліцензійні обмеження **altv-server.exe** не включено в архів.
> Завантаж його з офіційного сайту: https://altv.mp/#/downloads і поклади `altv-server.exe` у корінь проєкту (поруч з `server.cfg`).

## Вимоги
- Node.js 20+ для ресурсів (JS)
- MySQL/MariaDB
- Alt:V server (Windows build)
- Відкритий порт 7788/udp

## Швидкий старт
1) Встанови залежності (бібліотеки ресурсів):
```
npm install
```

2) Створи БД і імпортуй схему:
```
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS svoboda_rp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p svoboda_rp < sql/svoboda_rp.sql
```

3) Заповни доступ до БД у `resources/core/config.json`.

4) Скопіюй `altv-server.exe` та обов'язкові файли (з архіву alt:V) у корінь проєкту.

5) Запуск:
- подвійний клік по `start.bat`
або
- з терміналу: `altv-server.exe`

## Ресурси
- **core** — БД, економіка (готівка/банк), RP-команди `/me`, `/do`, `/try`
- **accounts** — реєстрація/логін (UI CEF), spawn
- **factions** — Поліція, Медики, Армія, Мафія (ранги, зарплати)
- **vehicles** — купівля/спавн/збереження авто
- **inventory** — простий інвентар (БД + події)
- **ui** — `login.html` і мінімальний `hud.html`

## Примітки
- Це фундамент, системи спрощені та розширювані.
- UI на Vanilla HTML/JS — легко замінити на React/Vue.
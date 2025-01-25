Projekt z przedmiotu Frameworki front-endowe.

Wersja live aplikacji: https://vercel.app

Użytwkonicy:
-login: milosz.pradela1@gmail.com, Haslo123

1. Zarejestruj się weryfikując email
2. Zaloguj się: milosz.pradela1@gmail.com, Haslo123

3. W profilu można edytować informację, aktualizować zdjęcie i podejrzeć ilość punktów zdobytych przez gracza.

4. Nowa gra - rozpoczyna gre po wybraniu poziomu trudności
   Poprawnie zakończona gra jest premiowana dodatkowymi punktami, skończenie gry w bonusowym czasie dodaje dodatkowe punkty do zwycięstwa.
   Są 3 poziomy trudności, easy, medium i hard, każdy z nich im trudniejszy tym więcej punktów można uzyskać. Odgadywanie haseł na ukos pion poziom dostępne na poziomie HARD.

bonusowe punkty za wygraną

function calculateLevelBonus(difficulty) {
if (difficulty === "easy") return 3;
if (difficulty === "medium") return 7;
if (difficulty === "hard") return 15;
return 0;
}

bonusowe punkty za wygraną w bonusowym krótszym czasie
Poziom easy - w mniej niż 3 minuty
poziom medium - w mniej niż 2 minuty
poziom hard - w mniej niż 1 minutę

function calculateBonusTimePoints(difficulty) {
if (difficulty === "easy") return 5;
if (difficulty === "medium") return 10;
if (difficulty === "hard") return 20;
return 0;
}

4. Ostatnio rozegrane gry można podejrzeć w zakładce Ostatnie gry, gdzie pokazuję czas grania, poziom trudności, ilość rozwiązanych słów oraz ilość zdobytych punktów z podziałem na bonusy za wygraną grę oraz bonus czasowy.
   W tej zakładce pokazuję ostatnie 10 gier.
5. Wylogowanie z poziomu panelu bocznego

6. npm install
7. npm run build
8. npm run dev

Stack:
-headlessUI (^2.1)
-react-hook-form (^7.54.0)
-react-icons (^5.3.0)
-tailwindcss (^3.4.1)
-firebase (^11.0.2)

Temat 6

Komponent wykreślanki, który umożliwia:
renderowanie siatki n x n, w każdym polu znajduje się litera,
zapis stanu wykreślanki: poprawnie zaznaczone słowa,
możliwość zaznaczenia ciągu liter wzdłuż linii poziomej, pionowej lub na ukos,
jeśli zaznaczone litery stanowią słowo ze słownika, to zmienia się stan i zaznaczenie pozostaje, słowo jest wykreślone,
jeśli zaznaczone litery nie stanowią słowa ze słownika to zaznaczenie znika,
gdy wszystkie słowa ze słownika zostaną zaznaczone to komponent wyświetla komunikat sukcesu.
konfigurację wyglądu planszy: kolorów, grubości linii, czcionki.

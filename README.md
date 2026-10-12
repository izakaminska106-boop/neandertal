# Witek: 100 BMW

Polska platformówka 2D według PRD: neandertal Witek pokonuje mamuty maczugą i zbiera pozostawione motocykle. Pięć stałych krain po 20 przeciwników, 100 unikalnych nagród, punkty kontrolne i finał w Wielkim Garażu.

## Uruchomienie

Wymagany Node.js 20 lub nowszy. Brak zależności do instalowania, backendu, kont, zewnętrznych grafik i CDN.

```sh
cd /workspace/neandertal
npm start
```

Serwer HTTP używa portu 3000; można zmienić go zmienną `PORT`. Otwórz aplikację w przeglądarce pod adresem serwera. Moduły ES wymagają HTTP — nie otwieraj `index.html` przez `file://`.

```sh
npm test
npm run check
```

## Sterowanie

| Akcja | Klawisze |
| --- | --- |
| Ruch | A / D lub ← / → |
| Skok | Spacja, W lub ↑ |
| Atak | J lub X; każdy cios wymaga nowego naciśnięcia |
| Pauza | Esc lub przycisk w HUD |
| Restart po przegranej | R lub przycisk |

Gra jest przeznaczona do komputera z klawiaturą. Obraz skaluje się proporcjonalnie do okna, bez zmiany fizyki. Utrata aktywności okna pauzuje grę. Dźwięk jest domyślnie wyciszony i wymaga interakcji gracza, by uruchomić Web Audio.

## Zasady i zapis

Cios działa w kierunku patrzenia, również w powietrzu; skały go blokują. Mamut pozostawia dokładnie jeden motocykl. Wynik rośnie dopiero po dotknięciu nagrody. Brama wymaga wszystkich 20 nagród; można wrócić po pominięte BMW.

Witek ma trzy serca i 1,2 sekundy odporności po obrażeniach. Woda lub przepaść odbiera serce i cofa do punktu kontrolnego, zachowując stan poziomu. Pierwsze aktywowanie punktu kontrolnego odnawia zdrowie. Restart zeruje bieżący poziom, zachowując wynik ukończonych krain. Nowa gra zeruje kampanię.

`localStorage` pod kluczem `witek-save` zapisuje liczbę ukończonych poziomów (wynik to ta liczba × 20) i ustawienie dźwięku. Kontynuacja rozpoczyna pierwszy nieukończony poziom od początku. Częściowy wynik nie jest zapisywany. Uszkodzony lub niedostępny zapis nie blokuje gry.

## Struktura

- `src/levels.js` — stałe układy pięciu krain oraz łatwe do strojenia parametry `SETTINGS` i prędkości patroli.
- `src/game.js` — fizyka, kolizje, walka, nagrody, kampania i zapis; krok 1/120 sekundy.
- `src/render.js` — własne ilustracje Canvas: Witek, mamuty, motocykle BMW, sokoły, kajaki, krajobrazy i garaż.
- `src/audio.js` — lokalnie generowane efekty Web Audio.
- `src/main.js` — interfejs, klawiatura, stały krok symulacji i `requestAnimationFrame`.
- `tests/game.test.js` — testy mechaniki oraz przejście kampanii przez automat używający wyłącznie ruchu, skoków i ataków, bez teleportacji i dopisywania nagród.

## Weryfikacja

11 testów Node sprawdza m.in. 100 unikalnych przeciwników, walkę w zasięgu, kierunek, blokowanie przez skałę, pierwszeństwo ciosu, unikalność nagród, punkty kontrolne, odporność, reset wyniku, bramę 19/20 i 20/20, pauzę, zapis oraz pełną kampanię.

Chromium: menu, start, ruch, pierwszy cios i podniesienie BMW, pauza/wznowienie, rozmiar 1440 i 720 px; brak błędów JavaScript i poziomego przepełnienia strony. Dodatkowe kontrole zapisu i automatycznej pauzy opisano w raporcie zadania.

Czas ludzkiego przejścia 15–25 minut oraz 60 FPS na typowym laptopie wymagają testu grywalności i pomiaru na docelowym sprzęcie. Automat pokonuje kampanię w około 217 sekund czasu symulacji, więc tempo oraz poziom trudności mogą wymagać strojenia. Ten wynik nie stanowi potwierdzenia docelowego czasu z PRD.

## GitHub Pages

Gra jest statyczna i działa z podkatalogu `/neandertal/` dzięki względnym ścieżkom zasobów. Plik `.nojekyll` wyłącza przetwarzanie Jekyll. W ustawieniach repozytorium GitHub wybierz **Pages → Deploy from a branch → main → / (root) → Save**. GitHub publikuje wyłącznie pliki statyczne; `server.js` nie jest potrzebny na hostingu Pages.

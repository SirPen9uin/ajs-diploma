# Дипломное задание к курсу «Продвинутый JavaScript». Retro Game
#### Ссылка на развернутый релиз: https://sirpen9uin.github.io/ajs-diploma/ 

###### tags: `netology` `advanced js`

## Задача

Реализовать пошаговую игру на готовый UI. Перевести проект на npm, Babel, Webpack, ESLint, а так же дописать оставшийся функционал.

## Концепция игры

Двухмерная игра в стиле фэнтези, где игроку предстоит выставлять своих персонажей против 
персонажей нечисти. После каждого раунда восстанавливается жизнь уцелевших персонажей 
игрока и повышается их уровень. Максимальный уровень - 4.

Игру можно сохранять и восстанавливать из сохранения.

## Ожидаемый результат

Пример итогового проекта: https://youtu.be/3iB3AerDJ0w

## Файловая структура

Ключевые сущности:
1. GamePlay - класс, отвечающий за взаимодействие с HTML-страницей
2. GameController - класс, отвечающий за логику приложения (важно: это не контроллер в терминах MVC), там вы будете работать больше всего
3. Character - базовый класс, от которого вы будете наследоваться и реализовывать специализированных персонажей
4. GameState - объект, который хранит текущее состояние игры (может сам себя воссоздавать из другого объекта)
5. GameStateService - объект, который взаимодействует с текущим состоянием (сохраняет данные в localStorage для последующей загрузки)
6. PositionedCharacter - Character, привязанный к координате на поле. Обратите внимание, что несмотря на то, что поле выглядит как двумерный массив, внутри оно хранится как одномерный (считайте это своеобразным `legacy`, с которым вам придётся бороться)
7. Team - класс для команды (набор персонажей), представляющих компьютер и игрока
8. generators - модуль, содержащий вспомогательные функции для генерации команды и персонажей

## Ключевые задачи

1. Отрисовать поле
2. Разместить на поле игровых персонажей
3. Вывод информации о персонаже
4. Выбор персонажа
5. Научить ходить
6. Научить сражаться
7. Разработка ИИ
8. Прохождение уровней
9. Сохранение и загрузка
10. Публикация проекта

## 1. Отрисовать поле

Этапы:
1. Настройка Webpack и окружения
2. Отрисовка поля
3. Отрисовка границ поля

## 2. Разместить на поле игровых персонажей

### Классы персонажей

У игрока и соперника в команде могут быть только определённые классы персонажей

#### Классы игрока

1. Bowman (Лучник)
2. Swordsman (Мечник)
3. Magician (Маг)

#### Классы соперника

4. Vampire (Вампир)
5. Undead (Восставший из мёртвых)
6. Daemon (Демон)

### Описание свойств персонажа

1. level - его уровень, от 1 до 4
2. attack - показатель атаки
3. defence - показатель защиты
4. health - здоровье персонажа
4. type - строка с одним из допустимых значений:
   *'swordsman'*, *'bowman'*, *'magician'*, *'daemon'*, *'undead'*, *'vampire'*. 

   К этим значениям привязаны изображения персонажей на поле.

В таблице приведены начальные характеристики каждого класса:

| Класс     | attack | defence |
|-----------|--------|---------|
| Bowman    | 25     | 25      |
| Swordsman | 40     | 10      |
| Magician  | 10     | 40      |
| Vampire   | 25     | 25      |
| Undead    | 40     | 10      |
| Daemon    | 10     | 10      |

### Формирование команд

Реализованно: 
1. Вспомогательные функции в модуле `src/js/generators.js`
2. Класс `src/js/Team.js` для хранения команд персонажей игрока и соперника

#### characterGenerator 

*characterGenerator* - функция генератор, которая формирует случайного персонажа 
из списка переданных классов.

#### Класс Team

*Класс Team* хранит команду игрока или соперника. 

#### generateTeam

*generateTeam* - формирует команду на основе `characterGenerator`.

Функция возвращает экземпляр класса Team

```js
const playerTypes = [Bowman, Swordsman, Magician]; // доступные классы игрока
const team = generateTeam(playerTypes, 3, 4); // массив из 4 случайных персонажей playerTypes с уровнем 1, 2 или 3

team.characters[0].level // 3
team.characters[1].level // 3
team.characters[2].level // 1
```

### Отрисовка команд персонажей

Персонажи генерируются случайным образом в столбцах 1 и 2 для игрока и в столбцах 7 и 8 для соперника:

![](https://i.imgur.com/XqcV1uW.jpg)

## 3. Вывод информации о персонаже

`GamePlay` может уведомлять вас о событиях, происходящих с игровым полем через механизм callback'ов.

Для игрового поля предусмотрены:
1. Вход указателя мыши в ячейку поля (`addCellEnterListener`)
2. Выход указателя мыши из ячейки поля (`addCellLeaveListener`)
3. Клик мышью по ячейке поля (`addCellClickListener`)

Формат информации:
"🎖1 ⚔10 🛡40 ❤50", где:
* 1 - level
* 10 - значение атаки
* 40 - значение защиты
* 50 - значение жизни

🎖 U+1F396 - медалька (уровень)
⚔ U+2694 - мечи (атака)
🛡 U+1F6E1 - щит (защита)
❤ U+2764 - сердце (уровень жизни)

## 4. Выбор персонажа

Для хранения состояния используются объекты специального класса `GameState`. 
В нём хранится информация о том, чей шаг следующий.

Для того, чтобы реагировать на клик на ячейке поля в классе `GamePlay`, реализован метод `addCellClickListener`, 
который в качестве аргумента принимает callback. Подпишитесь из `GameController` на событие `cellClick`.

## 5. Ход игрока

Если персонаж игрока выбран, то дальнейшие возможные действия могут быть:
1. Выбрать другого персонажа 
2. Перейти на другую клетку (в рамках допустимых переходов)
3. Атаковать противника (в рамках допустимого радиуса атаки)
4. Недопустимое действие (наведение на ячейку, не попадающую под первые три варианта)

### Особенности атаки и движения персонажей

Направление движения аналогично ферзю в шахматах. 
Персонажи разного типа могут ходить на разное расстояние 
(в базовом варианте можно перескакивать через других персонажей, т.е. как конь в шахматах, 
единственное правило - ходим по прямым и по диагонали):

* Мечники/Скелеты - 4 клетки в любом направлении
* Лучники/Вампиры - 2 клетки в любом направлении
* Маги/Демоны - 1 клетка в любом направлении

![](https://i.imgur.com/yp8vjhL.jpg)

Дальность атаки тоже ограничена:
* Мечники/Скелеты - могут атаковать только соседнюю клетку
* Лучники/Вампиры - на ближайшие 2 клетки
* Маги/Демоны - на ближайшие 4 клетки

Клетки считаются "по радиусу", допустим для мечника зона поражения будет выглядеть вот так:

![](https://i.imgur.com/gJ8DXPU.jpg)

Для лучника(отмечено красным):

![](https://i.imgur.com/rIINaFD.png)

## 6. Перемещение

Перемещение: Выбирается свободное поле, на которое можно передвинуть персонажа (для этого на поле необходимо кликнуть левой кнопкой мыши)

Реализована логика, связанная с перемещением в `GameController` и обновление отображаемых на экране персонажей с помощью метода `redrawPositions`.

## 7. Атака

Реализована логика, связанная с атакой в `GameController`. 

Урон рассчитывается по формуле: `Math.max(attacker.attack - target.defence, attacker.attack * 0.1)`, 
где `attacker` - атакующий персонаж, `target` - атакованный персонаж

## 8. Ответные действия компьютера

Реализована стратегия атаки компьютера на персонажей игрока .

Игрок и компьютер последовательно выполняют по одному игровому действию, после чего управление передаётся противостоящей стороне. 

## 9. Смерть, повышение уровня персонажей

Реализована логика:
1. Персонажи исчезают после смерти (поле освобождается)
2. В случае, если у противника не осталось персонажей:
   1. Повысьте уровень персонажа
   2. Начните игру на новом уровне

### Повышение уровня персонажа

1. Показатель health приводится к значению: текущий уровень + 80 (но не более 100). 

    Т.е. если у персонажа 1 после окончания раунда уровень жизни был 10, а персонажа 2 - 80, то после levelup:
    - персонаж 1 - жизнь станет 90
    - персонаж 2 - жизнь станет 100

2. Повышение показателей атаки/защиты привязаны к оставшейся жизни по формуле: 

    `attackAfter = Math.max(attackBefore, attackBefore * (80 + life) / 100)`, т.е. если у персонажа после окончания раунда жизни осталось 50%, то его показатели улучшатся на 30%. Если  жизни осталось 1%, то показатели никак не увеличатся.
3. Учтена логика при создании персонажа выше 1 уровня:

   ```js
    const character = new Daemon(3); // Создаёт персонажа 1-уровня и 2 раза повышает его уровень и характеристики
   ```
   
### Новый уровень игры

После перехода на новый уровень меняется тема игры (prairie -> desert -> arctic -> mountain)

## 10. Game Over, New Game и статистика

После завершения игры (проигрыша игрока) или завершения всех 4 уровней игровое поле блокируется.

При нажатии на кнопку `New Game`, начинается новая игра, но при этом максимальное количество баллов (очков), набранное за предыдущие игры сохраняется в `GameState`.

## 11. Хранение состояния

Спроектирован и реализован класс `GameState` (модуль `GameState`), который позволяет хранить всю информацию об текущем состоянии игры. Хранящейся в нём информации достаточно, чтобы сохранить полное состояние игры и восстановиться из него.

Сервис `GameStateService` умеет с помощью методов `save` и `load` загружать состояние из локального хранилища браузера при перезагрузке.

## 12. Deployment

Приложение доступно по ссылке: https://sirpen9uin.github.io/ajs-diploma/

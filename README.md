## Таймер обратного отсчета на куках
НЕТ ЗАВИСИМОСТЕЙ JQUERY\
Этот таймер при первом открытии страницы пользователем 
сохраняет в куки дату и время первое открытия страницы и от этого времени формирует
таймер обратного отсчета.\
Очень часто на страницы (лендинги, акционные страницы) которые нужны очень срочно 
просят поставить таймеры обратного отсчета с нестандартной логикой.

Например:\
На странице есть таймер обратного отщета который повышает цену 
на товар после окончания выделеного периода времени после первого захода на страницу.\
Таймер отображается на странице в нескольких местах.\
Цену нужно повышать по истечения определенного периода времени.\
Пример бизнес логики таймера:
- через (days: 0, hours: 2, minutes: 30, seconds: 0) - первое повышение цены
- через (days: 0, hours: 1, minutes: 30, seconds: 0) - вотрое повышение цены
- через (days: 0, hours: 0, minutes: 30, seconds: 0) - третее повышение цены
- через (days: 0, hours: 3, minutes: 0, seconds: 0) - четвертое повышение цены
- через (days: 0, hours: 12, minutes: 30, seconds: 0) - пятое повышение цены
- через (days: 0, hours: 2, minutes: 30, seconds: 0) - скидка заканчивается
## Быстрый старт

```html
<div style="display: none;" id="myTimer1">
  <div>
    <strong>[days2]</strong>[days1][days0] :
    <strong>[hours1]</strong>[hours0] : <strong>[mins1]</strong>[mins0] :
    <strong>[secs1]</strong>[secs0]
  </div>
</div>
<div style="display: none;" id="myTimer2">
  <div>[days] : [hours] : [mins] : [secs]</div>
</div>
<div style="display: none;" class="timer">
  class timer
  <div>[days] : [hours] : [mins] : [secs]</div>
</div>
<div style="display: none;" class="timer">
  class timer
  <div>[days] : [hours] : [mins] : [secs]</div>
</div>

```
```html
<script src="DPTimerCookie.js"></script>
<script>
  var timer = new DPTimerCookie({
    htmlLayouts: [ // масив контейнеров версток таймера на странице которые определены в html
      {
        selector: "#myTimer1",
        display: "block" // показываем верстки таймера сss свойством 'display: block,inline-block,flex и тд'
      },
      {
        selector: "#myTimer2",
        display: "block"
      },
      {
        selector: ".timer",
        display: "block" // применится ко всем контейнерам найденым по селектору
      }
    ],
    // Время сеществования куков
    lifeDurationCookieDays: 10,
    //cookieIdForTimer - если изменить то таймеры гарантировано
    //стартуют заново для всех пользователей
    cookieIdForTimer: "id11",
  
    timers: [
      {
        duration: { // Период времени. (счет начнется с первого захода на страницу)
          days: 0, hours: 0, minutes: 0, seconds: 30
        },
        timerStarted: function () {
          console.log("таймер 1 начал работу!!");
        },
        timerFinished: function () {
          console.log("Таймер 1 закончил работу!!");
        }
      },
      {
        duration: { // Период времени. (счет начнется по окончанию (таймер 1))
          days: 0, hours: 0, minutes: 0, seconds: 30
        },
        timerStarted: function () {
          console.log("таймер 2 начал работу!!");
        },
        timerFinished: function () {
          console.log("Таймер 2 закончил работу!!");
        }
      }
      // ... любое количество промежутков
    ]
  });
  timer.start();
</script>
```

## Важно!
DPTimerCookie представляет собой один обьект который будет 
показывать одинаковое время во всех верстках с id прописаных в htmlLayouts
согласно логике с конфигурированой в timers.\
На одной странице может быть несколько обьектов DPTimerCookie и параметр cookieIdForTimer
должен у них отличатся.

## Построение верстки таймера
[days2][days1][days0] : [hours1][hours0] : [mins1][mins0] : [secs1][secs0]

365: 02: 15: 33\
[days] = 365; [hours] = 2;  [mins] = 15;  [secs] = 33;\
[days2] = 3; [hours1] = 0;  [mins1] = 1;  [secs1] = 3;\
[days1] = 6; [hours0] = 2;  [mins0] = 5;  [secs0] = 3;\
[days0] = 5;\
Когда скрипт запустится переменные [days2], [days1], [days0], [hours1], [hours0], [mins1], [mins0], [secs1], [secs0] 
заменятся на числа от 0 - 9.\
```html
<div style="display: none;" id="TIMER_ID1">
  <div>[days2][days1][days0] : [hours1][hours0] : [mins1][mins0] : [secs1][secs0]</div>
</div>

```
Таймер на странице может быть уже сверстан. Вы можете подставить замисть цифр [values] а обертке таймера назначить id.
Если [values] подставить в имена класов то будут генерироваться нужные класы и дизайн таймера может быт абсолютно любым.
```html
<div style="display: none;" id="TIMER_ID1">
  <div class="days_img_number_[days2]"></div>
  <div class="days_img_number_[days1]"></div>
  <div class="days_img_number_[days0]"></div>

  <div class="hours_img_number_[hours1]"></div>
  <div class="hours_img_number_[hours0]"></div>

  <div class="mins_img_number_[mins1]"></div>
  <div class="mins_img_number_[mins0]"></div>

  <div class="secs_img_number_[secs1]"></div>
  <div class="secs_img_number_[secs0]"></div>
</div>

```
Внутри обертки таймера может быть ЛЮБАЯ HTML верстка главно правельно подставить [values] в квадратных скобках.

## Start demo
- скачиваем репозиторий
- открываем demo.html в редакторе
- редактируем периоды времени 
- открываем demo.html в браузере

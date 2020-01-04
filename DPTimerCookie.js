function DPTimerCookie(timerSettings) {
  "use strict";
  var i, j;
  var self = this;
  function _setCookie(name, value, expires) {
    document.cookie =
      name +
      "=" +
      encodeURIComponent(value) +
      (expires ? "; expires=" + expires.toUTCString() : "");
  }
  function _getCookie(name) {
    var prefix = name + "=";
    var cookieStartIndex = document.cookie.indexOf(prefix);
    if (cookieStartIndex === -1) return null;
    var cookieEndIndex = document.cookie.indexOf(
      ";",
      cookieStartIndex + prefix.length
    );
    if (cookieEndIndex === -1) cookieEndIndex = document.cookie.length;
    return decodeURIComponent(
      document.cookie.substring(
        cookieStartIndex + prefix.length,
        cookieEndIndex
      )
    );
  }
  function _getNumeral(number, position) {
    var _number = number + "";
    if (position >= _number.length) {
      return "0";
    }
    return _number.charAt(_number.length - 1 - position);
  }
  function _parseHtml(html, setting) {
    var result = html;
    for (var i = 0; i < setting.length; i++) {
      result = result.replace(setting[i].key, setting[i].value);
    }
    return result;
  }
  function _eqNull(value) {
    return typeof value === "undefined" || value === null;
  }
  function _isFunction(value) {
    return typeof value === "function";
  }
  function _initTimerStartDateCookie(duration, timerCookieId) {
    var keyCookie =
      duration.days * 60 * 60 * 24 +
      duration.hours * 60 * 60 +
      duration.minutes * 60 +
      duration.seconds;
    var strId = "";
    for (i = 0; i < timerSettings.htmlLayouts.length; i++) {
      strId = strId + timerSettings.htmlLayouts[i].selector;
    }
    var date = {
      days: _getCookie(
        "daysCookie" +
          strId +
          timerCookieId +
          keyCookie +
          timerSettings.cookieIdForTimer
      ),
      hours: _getCookie(
        "hoursCookie" +
          strId +
          timerCookieId +
          keyCookie +
          timerSettings.cookieIdForTimer
      ),
      minutes: _getCookie(
        "minutesCookie" +
          strId +
          timerCookieId +
          keyCookie +
          timerSettings.cookieIdForTimer
      ),
      seconds: _getCookie(
        "secondsCookie" +
          strId +
          timerCookieId +
          keyCookie +
          timerSettings.cookieIdForTimer
      )
    };
    if (!date.hours) {
      var dateStart = new Date();
      date = {
        days: dateStart.getDate() + duration.days,
        hours: dateStart.getHours() + duration.hours,
        minutes: dateStart.getMinutes() + duration.minutes,
        seconds: dateStart.getSeconds() + duration.seconds + 1
      };
      var dateLiveCookie = new Date();
      dateLiveCookie.setDate(
        dateLiveCookie.getDate() + timerSettings.lifeDurationCookieDays
      );
      _setCookie(
        "daysCookie" +
          strId +
          timerCookieId +
          keyCookie +
          timerSettings.cookieIdForTimer,
        date.days,
        dateLiveCookie
      );
      _setCookie(
        "hoursCookie" +
          strId +
          timerCookieId +
          keyCookie +
          timerSettings.cookieIdForTimer,
        date.hours,
        dateLiveCookie
      );
      _setCookie(
        "minutesCookie" +
          strId +
          timerCookieId +
          keyCookie +
          timerSettings.cookieIdForTimer,
        date.minutes,
        dateLiveCookie
      );
      _setCookie(
        "secondsCookie" +
          strId +
          timerCookieId +
          keyCookie +
          timerSettings.cookieIdForTimer,
        date.seconds,
        dateLiveCookie
      );
    }
    return date;
  }
  var timerDOMElements = [];
  var outs = [];
  if (!_eqNull(timerSettings.htmlLayouts)) {
    for (i = 0; i < timerSettings.htmlLayouts.length; i++) {
      var elements = document.querySelectorAll(timerSettings.htmlLayouts[i].selector);
      for (j = 0; j < elements.length; j++) {
        elements[j]['____DPTimerCookie_display'] = timerSettings.htmlLayouts[i].display;
        timerDOMElements.push(elements[j]);
      }

      //timerDOMElements = timerDOMElements.concat(elements);
      if (elements.length === 0) {
        console.error(
          "Верстка таймера с css селектором   " +
          timerSettings.htmlLayouts[i].selector +
          "   не найдена"
        );
      }

    }

    for (i = 0; i < timerDOMElements.length; i++) {
      outs[i] = timerDOMElements[i].innerHTML;
    }
  }

  function _Timer(duration, timerCookieId) {
    var self = this;
    this._timerId = undefined;
    this.timerStarted = function() {};
    this.timerFinished = function() {};
    this.start = function() {
      var timerKeys;
      var dateCookie = _initTimerStartDateCookie(duration, timerCookieId);
      self.timerStarted();
      var amount = 0;

      function _tick() {
        var dateNow = new Date();
        amount =
          ((dateCookie.days - dateNow.getDate()) * 60 * 60 * 24 +
            (dateCookie.hours - dateNow.getHours()) * 60 * 60 +
            (dateCookie.minutes - dateNow.getMinutes()) * 60 +
            (dateCookie.seconds - dateNow.getSeconds())) *
          1000;
        if (amount < 0) {
          if (!_eqNull(timerSettings.htmlLayouts)) {
            timerKeys = [
              { key: "[days]", value: 0 },
              { key: "[days0]", value: 0 },
              { key: "[days1]", value: 0 },
              { key: "[days2]", value: 0 },
              { key: "[hours]", value: 0 },
              { key: "[hours0]", value: 0 },
              { key: "[hours1]", value: 0 },
              { key: "[mins]", value: 0 },
              { key: "[mins0]", value: 0 },
              { key: "[mins1]", value: 0 },
              { key: "[secs]", value: 0 },
              { key: "[secs0]", value: 0 },
              { key: "[secs1]", value: 0 }
            ];
            for (i = 0; i < timerDOMElements.length; i++) {
              timerDOMElements[i].innerHTML = _parseHtml(outs[i], timerKeys);
            }
          }
          self.timerFinished();
          self.stop();
        } else {
          if (!_eqNull(timerSettings.htmlLayouts)) {
            var amount1 = Math.floor(amount / 1e3);
            var days = Math.floor(amount1 / 86400);
            var days0 = _getNumeral(days, 0);
            var days1 = _getNumeral(days, 1);
            var days2 = _getNumeral(days, 2);
            amount1 = amount1 % 86400;
            var hours = Math.floor(amount1 / 3600);
            var hours0 = _getNumeral(hours, 0);
            var hours1 = _getNumeral(hours, 1);
            amount1 = amount1 % 3600;
            var mins = Math.floor(amount1 / 60);
            var mins0 = _getNumeral(mins, 0);
            var mins1 = _getNumeral(mins, 1);
            amount1 = amount1 % 60;
            var secs = Math.floor(amount1);
            var secs0 = _getNumeral(secs, 0);
            var secs1 = _getNumeral(secs, 1);
            timerKeys = [
              { key: "[days]", value: days },
              { key: "[days0]", value: days0 },
              { key: "[days1]", value: days1 },
              { key: "[days2]", value: days2 },
              { key: "[hours]", value: hours },
              { key: "[hours0]", value: hours0 },
              { key: "[hours1]", value: hours1 },
              { key: "[mins]", value: mins },
              { key: "[mins0]", value: mins0 },
              { key: "[mins1]", value: mins1 },
              { key: "[secs]", value: secs },
              { key: "[secs0]", value: secs0 },
              { key: "[secs1]", value: secs1 }
            ];
            for (i = 0; i < timerDOMElements.length; i++) {
              timerDOMElements[i].innerHTML = _parseHtml(outs[i], timerKeys);
            }
          }
        }
        if (!_eqNull(timerSettings.htmlLayouts)) {
          for (i = 0; i < timerDOMElements.length; i++) {
            timerDOMElements[i].style.display = timerDOMElements[i]['____DPTimerCookie_display'];
          }
        }
      }

      _tick();
      if (amount > 0) self._timerId = setInterval(_tick, 1e3);
    };
    this.stop = function() {
      if (!_eqNull(self._timerId)) clearInterval(self._timerId);
    };
  }
  this.timers = [];
  for (i = 0; i < timerSettings.timers.length; i++) {
    if (!_isFunction(timerSettings.timers[i].timerStarted)) {
      timerSettings.timers[i].timerStarted = function() {};
    }
    if (!_isFunction(timerSettings.timers[i].timerFinished)) {
      timerSettings.timers[i].timerFinished = function() {};
    }
  }
  for (i = 0; i < timerSettings.timers.length - 1; i++) {
    this.timers[i] = new _Timer(timerSettings.timers[i].duration, i);
    this.timers[i].timerStarted = timerSettings.timers[i].timerStarted;
    this.timers[i].timerFinished = (function(i) {
      return function() {
        timerSettings.timers[i].timerFinished();
        self.timers[i + 1].start();
      };
    })(i);
  }
  this.timers[i] = new _Timer(timerSettings.timers[i].duration, i);
  this.timers[i].timerStarted = timerSettings.timers[i].timerStarted;
  this.timers[i].timerFinished = timerSettings.timers[i].timerFinished;
  self.start = function() {
    self.timers[0].start();
  };
}

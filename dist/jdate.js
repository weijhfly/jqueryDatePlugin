/** 
 * Jdate 2.0.0
 * Copyright 2017-2019
 * weijhfly https://github.com/weijhfly/jqueryDatePlugin
 * Licensed under MIT
 * Released on: jan 24, 2017
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Jdate = factory());
}(this, function () { 'use strict';

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css = "ul{margin:0;padding:0}li{list-style-type:none}.jdate-container{font-size:20px;color:#333;text-align:center}.jdate-container header{position:relative;line-height:60px;font-size:18px;border-bottom:1px solid #e0e0e0}.jdate-container .jdate-mask{position:fixed;width:100%;height:100%;top:0;left:0;background:#000;opacity:.4;z-index:999}.jdate-container .jdate-panel{position:fixed;bottom:0;left:0;width:100%;height:273px;z-index:1000;background:#fff;-webkit-animation-duration:.3s;animation-duration:.3s;-webkit-animation-delay:0s;animation-delay:0s;-webkit-animation-iteration-count:1;animation-iteration-count:1}.jdate-container .jdate-btn{position:absolute;left:0;top:0;height:100%;padding:0 15px;color:#666;font-size:16px;cursor:pointer;-webkit-tap-highlight-color:transparent}.jdate-container .jdate-confirm{left:auto;right:0;color:#007bff}.jdate-container .jdate-content{position:relative;top:20px}.jdate-container .jdate-wrapper{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.jdate-container .jdate-wrapper>div{position:relative;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;height:173px;line-height:36px;overflow:hidden;-webkit-flex-basis:-8e;-ms-flex-preferred-size:-8e;flex-basis:-8e;width:1%}.jdate-container .jdate-wrapper ul{position:absolute;left:0;top:0;width:100%;margin-top:68px}.jdate-container .jdate-wrapper li{height:36px}.jdate-container .jdate-dim{position:absolute;left:0;top:0;width:100%;height:68px;background:-webkit-gradient(linear,left bottom,left top,from(hsla(0,0%,100%,.4)),to(hsla(0,0%,100%,.8)));background:-webkit-linear-gradient(bottom,hsla(0,0%,100%,.4),hsla(0,0%,100%,.8));background:-o-linear-gradient(bottom,hsla(0,0%,100%,.4),hsla(0,0%,100%,.8));background:-webkit-gradient(linear, left bottom, left top, from(hsla(0, 0%, 100%, 0.4)), to(hsla(0, 0%, 100%, 0.8)));background:-webkit-linear-gradient(bottom, hsla(0, 0%, 100%, 0.4), hsla(0, 0%, 100%, 0.8));background:-o-linear-gradient(bottom, hsla(0, 0%, 100%, 0.4), hsla(0, 0%, 100%, 0.8));background:linear-gradient(0deg,hsla(0,0%,100%,.4),hsla(0,0%,100%,.8));pointer-events:none;-webkit-transform:translateZ(0);transform:translateZ(0);z-index:10}.jdate-container .mask-top{border-bottom:1px solid #ebebeb}.jdate-container .mask-bottom{top:auto;bottom:1px;border-top:1px solid #ebebeb}.jdate-container .fadeIn{-webkit-animation-name:fadeIn;animation-name:fadeIn}.jdate-container .fadeOut{-webkit-animation-name:fadeOut;animation-name:fadeOut}@-webkit-keyframes fadeIn{0%{bottom:-273px}to{bottom:0}}@keyframes fadeIn{0%{bottom:-273px}to{bottom:0}}@-webkit-keyframes fadeOut{0%{bottom:0}to{bottom:-273px;display:none}}@keyframes fadeOut{0%{bottom:0}to{bottom:-273px;display:none}}@media screen and (max-width:414px){.jdate-container{font-size:18px}}@media screen and (max-width:320px){.jdate-container{font-size:15px}}";
  styleInject(css);

  var version = "2.0.0";

  var $ = typeof $ != 'undefined' ? $ : typeof jQuery != 'undefined' ? jQuery : null,
      h = 36;

  Jdate.usejQuery = function (jQuery) {
      $ = jQuery;
  };
  function Jdate(config) {
      if (!$) {
          console.error('jQuery is not defined');
          return;
      }
      if (!config || !config.el) {
          return;
      }
      var _this = this,
          el = _this.$(config.el);

      if (!el || el.bindJdate) {
          return;
      }
      el.bindJdate = 1;
      _this.extend(config);
      _this.tap(el, function () {
          _this.show();
      });
      // 设置默认日期
      if (config.value) {
          if (el.nodeName.toLowerCase() == 'input') {
              el.value = config.value;
          } else {
              el.innerText = config.value;
          }
          var str = config.value.replace(/-/g, '/').replace(/[^\d/:\s]/g, ''),
              date = new Date(str);

          if (!date || date == 'Invalid Date') {
              console.error('Invalid Date：' + str);
          } else {
              el.bindDate = date;
          }
      }
  }
  Jdate.prototype = {
      constructor: Jdate,
      baseData: function baseData() {
          return {
              domId: {
                  YYYY: 'jdate-year',
                  MM: 'jdate-month',
                  DD: 'jdate-day',
                  hh: 'jdate-hour',
                  mm: 'jdate-min',
                  ss: 'jdate-sec'
              },
              opts: { //插件默认配置
                  el: '',
                  format: 'YYYY-MM-DD',
                  beginYear: 2000,
                  endYear: 2100,
                  init: null,
                  moveEnd: null,
                  confirm: null,
                  cancel: null,
                  minStep: 1,
                  trigger: 'tap',
                  lang: { title: '选择日期', cancel: '取消', confirm: '确认', year: '年', month: '月', day: '日', hour: '时', min: '分', sec: '秒' }
              }
          };
      },
      extend: function extend(config) {
          var _this = this,
              opts = _this.baseData().opts;

          for (var key in opts) {
              if (opts[key] && Object.prototype.toString.call(opts[key]) == '[object Object]') {
                  for (var key2 in config[key]) {
                      opts[key][key2] = config[key][key2] == undefined ? opts[key][key2] : config[key][key2];
                  }
              } else {
                  opts[key] = config[key] || opts[key];
              }
          }
          _this.config = opts;
      },
      createUI: function createUI() {
          var _this = this,
              data = _this.baseData(),
              config = _this.config,
              domId = data.domId,
              FormatArr = config.format.split(/-|\/|\s|:/g),
              len = FormatArr.length,
              ul = '',
              date = _this.$(config.el).bindDate || new Date(),
              itemClass = '',
              lang = config.lang;

          for (var i = 0; i < len; i++) {
              var f = FormatArr[i];

              ul += '<div id="' + domId[f] + '"><ul>';

              if (f == 'YYYY') {
                  for (var j = config.beginYear; j <= config.endYear; j++) {
                      itemClass = j == date.getFullYear() ? 'active' : '';

                      ul += '<li class="' + itemClass + '">' + j + lang.year + '</li>';
                  }
              } else if (f == 'MM') {
                  for (var k = 1; k <= 12; k++) {
                      itemClass = k == date.getMonth() + 1 ? 'active' : '';

                      ul += '<li class="' + itemClass + '">' + (k < 10 ? '0' + k : k) + lang.month + '</li>';
                  }
              } else if (f == 'DD') {
                  var day = _this.bissextile(date.getFullYear(), date.getMonth() + 1);
                  for (var l = 1; l <= day; l++) {
                      itemClass = l == date.getDate() ? 'active' : '';

                      ul += '<li class="' + itemClass + '">' + (l < 10 ? '0' + l : l) + lang.day + '</li>';
                  }
              } else if (f == 'hh') {
                  for (var m = 0; m <= 23; m++) {
                      itemClass = m == date.getHours() ? 'active' : '';

                      ul += '<li class="' + itemClass + '">' + (m < 10 ? '0' + m : m) + lang.hour + '</li>';
                  }
              } else if (f == 'mm') {
                  for (var n = 0; n <= 59; n += config.minStep) {
                      itemClass = n == date.getMinutes() ? 'active' : '';

                      ul += '<li class="' + itemClass + '">' + (n < 10 ? '0' + n : n) + lang.min + '</li>';
                  }
              } else if (f == 'ss') {
                  for (var o = 0; o <= 59; o++) {
                      itemClass = o == date.getSeconds() ? 'active' : '';

                      ul += '<li class="' + itemClass + '">' + (o < 10 ? '0' + o : o) + lang.sec + '</li>';
                  }
              }
              ul += '</ul></div>';
          }
          var $html = '<div class="jdate-mask"></div>\n            <div class="jdate-panel fadeIn">\n                <header>\n                    <span class="jdate-btn jdate-cancel">' + lang.cancel + '</span>\n                    ' + lang.title + '\n                    <span class="jdate-btn jdate-confirm">' + lang.confirm + '</span>\n                </header>\n                <section class="jdate-content">\n                    <div class="jdate-dim mask-top"></div>\n                    <div class="jdate-dim mask-bottom"></div>\n                    <div class="jdate-wrapper">\n                        ' + ul + '\n                    </div>\n                </section>\n            </div>',
              box = document.createElement("div");

          box.className = 'jdate-container';
          box.innerHTML = $html;
          document.body.appendChild(box);

          _this.scroll = {};

          for (var _i = 0; _i < len; _i++) {
              var $id = domId[FormatArr[_i]];

              _this.scroll[FormatArr[_i]] = $id;
              _this.slide($('#' + $id + '>ul'));
          }
          if (_this.scroll['mm'] && config.minStep != 1) {
              $('#' + _this.scroll['mm'] + ' li').eq(Math.round(date.getMinutes() / config.minStep)).addClass('active');
          }
          $('.jdate-container ul').each(function () {
              var that = $(this),
                  active = that.find('.active');

              var liTop = -active.position().top;
              that.animate({
                  top: liTop
              }, 0);
          });
      },
      eventType: function eventType() {
          var isTouch = "ontouchend" in document;

          return {
              isTouch: isTouch,
              tstart: isTouch ? "touchstart" : "mousedown",
              tmove: isTouch ? "touchmove" : "mousemove",
              tend: isTouch ? "touchend" : "mouseup",
              tcancel: isTouch ? "touchcancel" : "mouseleave"
          };
      },
      slide: function slide(el) {
          var _this = this,
              domId = _this.baseData().domId,
              lang = _this.config.lang;

          //滑动
          var T = void 0,
              mT = void 0,
              isPress = false,
              events = _this.eventType();

          el.bind(events.tstart, function (e) {
              e.stopPropagation();
              e.preventDefault();
              e = e.originalEvent;
              T = e.pageY || e.touches[0].pageY;
              if (!events.isTouch) {
                  isPress = true;
              }
          });
          el.bind(events.tmove, function (e) {
              var that = $(this);

              e.stopPropagation();
              e.preventDefault();
              e = e.originalEvent;

              if (!events.isTouch && !isPress) {
                  return false;
              }            mT = e.pageY || e.touches[0].pageY;
              that.css('top', that.position().top + (mT - T) + 'px');
              T = mT;
              if (that.position().top > 0) that.css('top', '0');
              if (that.position().top < -(that.height() - h)) that.css('top', '-' + (that.height() - h) + 'px');
          });
          el.bind(events.tend, function (e) {
              var that = $(this);

              e.stopPropagation();
              e.preventDefault();
              e = e.originalEvent;
              isPress = false;
              dragEnd(that);
          });
          el.bind(events.tcancel, function (e) {
              var that = $(this);

              e.stopPropagation();
              e.preventDefault();
              e = e.originalEvent;

              isPress = false;
              dragEnd(that);
          });

          function dragEnd(that) {
              //滚动调整
              var t = that.position().top;

              that.css('top', Math.round(t / h) * h + 'px');
              //定位active
              t = Math.round(Math.abs($(that).position().top));
              var li = that.children('li').get(t / h);
              $(li).addClass('active').siblings().removeClass('active');
              //修正天数
              if ([domId['YYYY'], domId['MM']].indexOf(that.parent().attr('id')) != -1 && _this.scroll['DD']) {
                  var year = $('#' + domId['YYYY'] + ' .active').text().replace(/\D/g, ''),
                      month = $('#' + domId['MM'] + ' .active').text().replace(/\D/g, '');

                  if (!year || !month) {
                      return;
                  }
                  var day = _this.bissextile(year, month);
                  if (day != $('#' + domId['DD'] + ' li').length) {
                      var active = $('#' + domId['DD'] + ' .active'),
                          d = active.text().replace(/\D/g, ''),
                          $html = '',
                          ul = $('#' + domId['DD'] + ' ul');

                      d > day && (d = day);

                      for (var l = 1; l <= day; l++) {
                          $html += '<li ' + (d == l ? 'class="active"' : '') + '>' + (l < 10 ? '0' + l : l) + lang.day + '</li>';
                      }
                      $('#' + domId['DD'] + ' ul').html($html);
                      if (Math.abs(ul.position().top) > ul.height() - h) ul.css('top', '-' + (ul.height() - h) + 'px');
                  }
              }
              if (_this.config.moveEnd) {
                  _this.config.moveEnd.call(_this);
              }
          }
      },
      $: function $(selector, flag) {
          if (typeof selector != 'string' && selector.nodeType) {
              return selector;
          }

          return flag ? document.querySelectorAll(selector) : document.querySelector(selector);
      },
      tap: function tap(el, fn) {
          var _this = this,
              hasTouch = "ontouchstart" in window;

          if (hasTouch && _this.config.trigger == 'tap') {
              var o = {};
              el.addEventListener('touchstart', function (e) {
                  var t = e.touches[0];

                  o.startX = t.pageX;
                  o.startY = t.pageY;
                  o.sTime = +new Date();
              });
              el.addEventListener('touchend', function (e) {
                  var t = e.changedTouches[0];

                  o.endX = t.pageX;
                  o.endY = t.pageY;
                  if (+new Date() - o.sTime < 300) {
                      if (Math.abs(o.endX - o.startX) + Math.abs(o.endY - o.startY) < 20) {
                          e.preventDefault();
                          fn.call(this, e);
                      }
                  }
                  o = {};
              });
          } else {
              el.addEventListener('click', function (e) {
                  fn.call(this, e);
              });
          }
      },
      show: function show() {
          var _this = this,
              config = _this.config,
              el = _this.$(config.el);

          if (!el.bindJdate) {
              return;
          }
          if (el.nodeName.toLowerCase() == 'input') {
              el.blur();
          }
          if (_this.$('.jdate-container')) {
              return;
          }
          if (config.init && config.init.call(_this) === false) {
              return;
          }

          _this.createUI();
          _this.event();
      },
      hide: function hide(flag) {
          var _this = this,
              el = _this.$('.jdate-panel.fadeIn');

          if (el) {
              el.className = 'jdate-panel fadeOut';
              _this.destroy(flag);
          }
      },
      event: function event() {
          var _this = this,
              mask = _this.$('.jdate-mask'),
              cancel = _this.$('.jdate-cancel'),
              confirm = _this.$('.jdate-confirm');

          _this.tap(mask, function () {
              _this.hide(1);
          });
          _this.tap(cancel, function () {
              _this.hide(1);
          });
          _this.tap(confirm, function () {
              var config = _this.config,
                  el = _this.$(config.el),
                  date = config.format,
                  newDate = new Date();

              for (var f in _this.scroll) {
                  var d = $('#' + _this.scroll[f] + ' .active').text().replace(/\D/g, '');

                  date = date.replace(f, d);
                  if (f == 'YYYY') {
                      newDate.setFullYear(d);
                  } else if (f == 'MM') {
                      newDate.setMonth(d - 1);
                  } else if (f == 'DD') {
                      newDate.setDate(d);
                  } else if (f == 'hh') {
                      newDate.setHours(d);
                  } else if (f == 'mm') {
                      newDate.setMinutes(d);
                  } else if (f == 'ss') {
                      newDate.setSeconds(d);
                  }
              }
              if (config.confirm) {
                  var flag = config.confirm.call(_this, date);
                  if (flag === false) {
                      return false;
                  } else if (flag) {
                      date = flag;
                  }
              }
              if (el.nodeName.toLowerCase() == 'input') {
                  el.value = date;
              } else {
                  el.innerText = date;
              }
              _this.hide();
              el.bindDate = newDate;
          });
      },
      bissextile: function bissextile(year, month) {
          var day = void 0;
          if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
              day = 31;
          } else if (month == 4 || month == 6 || month == 11 || month == 9) {
              day = 30;
          } else if (month == 2) {
              if (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)) {
                  //闰年
                  day = 29;
              } else {
                  day = 28;
              }
          }
          return day;
      },
      destroy: function destroy(flag) {
          var _this = this,
              config = _this.config;

          if (flag && config.cancel) {
              config.cancel.call(_this);
          }
          setTimeout(function () {
              var el = _this.$('.jdate-container');
              document.body.removeChild(el);
          }, 300);
      }
  };
  Jdate.version = version;

  return Jdate;

}));

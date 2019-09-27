import './jdate.less';

import {version} from '../package.json';

let $ = typeof $ != 'undefined'? $ : typeof jQuery != 'undefined'? jQuery : null,
    h = 36;

Jdate.usejQuery = function(jQuery) {
  $ = jQuery;
};
function Jdate(config){
  if(!$){
    console.error('jQuery is not defined');
    return;
  }
  if(!config || !config.el){return;}
  let _this = this,
      el = _this.$(config.el);

  if(!el || el.bindJdate){return;}
  el.bindJdate = 1;
  _this.extend(config);
  _this.tap(el,function(){
      _this.show();
  })
  // 设置默认日期
  if(config.value){
      if(el.nodeName.toLowerCase() == 'input'){
          el.value = config.value;
      }else{
          el.innerText = config.value;
      }
      let str = config.value.replace(/-/g,'/').replace(/[^\d/:\s]/g,''),
          date = new Date(str);

      if(!date || date == 'Invalid Date'){
          console.error('Invalid Date：'+str);
      }else{
          el.bindDate = date;
      }
  }
}
Jdate.prototype = {
  constructor: Jdate,
  baseData: function(){
    return {
        domId:{
          YYYY:'jdate-year',
          MM:'jdate-month',
          DD:'jdate-day',
          hh:'jdate-hour',
          mm:'jdate-min',
          ss:'jdate-sec'
        },
        opts:{//插件默认配置
            el:'',
            format:'YYYY-MM-DD',
            beginYear:2000,
            endYear:2100,
            init:null,
            moveEnd:null,
            confirm:null,
            cancel:null,
            minStep:1,
            trigger:'tap',
            lang:{title:'选择日期',cancel:'取消',confirm:'确认',year:'年',month:'月',day:'日',hour:'时',min:'分',sec:'秒'}
        }
    };
  },
  extend: function(config){
      let _this = this,
          opts = _this.baseData().opts;

      for(let key in opts){
          if(opts[key] && Object.prototype.toString.call(opts[key]) == '[object Object]'){
              for(let key2 in config[key]){
                  opts[key][key2] = config[key][key2] == undefined? opts[key][key2]:config[key][key2];
              }
          }else{
              opts[key] = config[key] || opts[key];
          }
      }
      _this.config = opts;
  },
  createUI: function(){
        let _this = this,
            data = _this.baseData(),
            config = _this.config,
            domId = data.domId,
            FormatArr = config.format.split(/-|\/|\s|:/g),
            len = FormatArr.length,
            ul = '',
            date = _this.$(config.el).bindDate || new Date(),
            itemClass = '',
            lang = config.lang;

        for(let i=0; i<len; i++){
            let f = FormatArr[i],
                domMndex = 0;

            ul += '<div id="'+ domId[f]+'"><ul>';

            if(f == 'YYYY'){
                for(let j=config.beginYear; j<=config.endYear; j++){
                    itemClass = j == date.getFullYear()? 'active':'';

                    ul += `<li class="${itemClass}">${j}${lang.year}</li>`;
                    domMndex ++;
                }
            }else if(f == 'MM'){
                for(let k=1; k<=12; k++){
                    itemClass = k == date.getMonth() + 1? 'active':'';

                    ul += `<li class="${itemClass}">${k<10? '0'+k : k}${lang.month}</li>`;
                    domMndex ++;
                }
            }else if(f == 'DD'){
                let day = _this.bissextile(date.getFullYear(),date.getMonth() + 1);
                for(let l=1; l<=day; l++){
                    itemClass = l == date.getDate()? 'active':'';

                    ul += `<li class="${itemClass}">${l<10? '0'+l : l}${lang.day}</li>`;
                    domMndex ++;
                }
            }else if(f == 'hh'){
                for(let m=0; m<=23; m++){
                    itemClass = m == date.getHours()? 'active':'';

                    ul += `<li class="${itemClass}">${m<10? '0'+m : m}${lang.hour}</li>`;
                    domMndex ++;
                }
            }else if(f == 'mm'){
                for(let n=0; n<=59; n+=config.minStep){
                    itemClass = n == date.getMinutes()? 'active':'';

                    ul += `<li class="${itemClass}">${n<10? '0'+n : n}${lang.min}</li>`;
                    domMndex ++;
                }
            }else if(f == 'ss'){
                for(let o=0; o<=59; o++){
                    itemClass = o == date.getSeconds()? 'active':'';

                    ul += `<li class="${itemClass}">${o<10? '0'+o : o}${lang.sec}</li>`;
                    domMndex ++;
                }
            }
            ul += '</ul></div>'
        }
        let $html = `<div class="jdate-mask"></div>
            <div class="jdate-panel fadeIn">
                <header>
                    <span class="jdate-btn jdate-cancel">${lang.cancel}</span>
                    ${lang.title}
                    <span class="jdate-btn jdate-confirm">${lang.confirm}</span>
                </header>
                <section class="jdate-content">
                    <div class="jdate-dim mask-top"></div>
                    <div class="jdate-dim mask-bottom"></div>
                    <div class="jdate-wrapper">
                        ${ul}
                    </div>
                </section>
            </div>`,
            box = document.createElement("div");

            box.className = `jdate-container`;
            box.innerHTML = $html;
            document.body.appendChild(box);


        _this.scroll = {};

        for(let i=0; i<len; i++){
            let $id = domId[FormatArr[i]];

            _this.scroll[FormatArr[i]] = $id;
            _this.slide($('#' +$id +'>ul'))
        }
        if(_this.scroll['mm'] && config.minStep != 1){
          $('#' + _this.scroll['mm'] +' li').eq(Math.round(date.getMinutes()/config.minStep)).addClass('active');
        }
        $('.jdate-container ul').each(function(){
            let that = $(this),
                active = that.find('.active');

            if(!active.length){return;}
            let liTop = -(active.position().top);
            that.animate({
                top: liTop
            },
            0);
        })
  },
  eventType:function(){
    let isTouch = "ontouchend" in document;

    return {
      isTouch: isTouch,
      tstart: isTouch ? "touchstart" : "mousedown",
      tmove: isTouch ? "touchmove" : "mousemove",
      tend: isTouch ? "touchend" : "mouseup",
      tcancel: isTouch ? "touchcancel" : "mouseleave"
    };
  },
  slide: function(el){
    let _this = this,
        domId = _this.baseData().domId,
        lang = _this.config.lang;

    //滑动
    let T, mT, isPress = false,
        events = _this.eventType();

    el.bind(events.tstart, function(e) {
      e.stopPropagation();
      e.preventDefault();
      e = e.originalEvent;
      T = e.pageY || e.touches[0].pageY;
      if (!events.isTouch) {
        isPress = true;
      }
    })
    el.bind(events.tmove, function(e) {
      let  that = $(this);

      e.stopPropagation();
      e.preventDefault();
      e = e.originalEvent;

      if (!events.isTouch && !isPress) {
        return false
      };
      mT = e.pageY || e.touches[0].pageY;
      that.css('top', that.position().top + (mT - T) + 'px');
      T = mT;
      if (that.position().top > 0) that.css('top', '0');
      if (that.position().top < -(that.height() - h)) that.css('top', '-' + (that.height() - h) + 'px');
    })
    el.bind(events.tend, function(e) {
      let  that = $(this);

      e.stopPropagation();
      e.preventDefault();
      e = e.originalEvent;
      isPress = false;
      dragEnd(that);
    })
    el.bind(events.tcancel, function(e) {
      let  that = $(this);

      e.stopPropagation();
      e.preventDefault();
      e = e.originalEvent;

      isPress = false;
      dragEnd(that);
    })

    function dragEnd(that) {
      //滚动调整
      let t = that.position().top;

      that.css('top', Math.round(t / h) * h + 'px');
      //定位active
      t = Math.round(Math.abs($(that).position().top));
      let li = that.children('li').get(t / h);
      $(li).addClass('active').siblings().removeClass('active');
      //修正天数
      if ([domId['YYYY'],domId['MM']].indexOf(that.parent().attr('id')) != -1 && _this.scroll['DD']) {
        let year = $('#'+ domId['YYYY'] +' .active').text().replace(/\D/g,''),
            month = $('#'+ domId['MM'] +' .active').text().replace(/\D/g,'');

        if(!year || !month){
          return ;
        }
        let day = _this.bissextile(year, month);
        if (day != $('#'+ domId['DD'] +' li').length) {
          let active = $('#'+ domId['DD'] +' .active'),
              d = active.text().replace(/\D/g,''),
              $html = '',
              ul = $('#'+ domId['DD'] +' ul')

          d > day && (d = day);

          for(let l=1; l<=day; l++){
                $html += `<li ${d == l?'class="active"':''}>${l<10? '0'+l : l}${lang.day}</li>`;
          }
          $('#'+domId['DD']+' ul').html($html);
          if (Math.abs(ul.position().top) > (ul.height() - h)) ul.css('top', '-' + (ul.height() - h) + 'px');
        }
      }
      if(_this.config.moveEnd){
          _this.config.moveEnd.call(_this);
      }
    }
  },
  $: function(selector,flag){
      if(typeof selector != 'string' && selector.nodeType){
          return selector;
      }

      return flag? document.querySelectorAll(selector) : document.querySelector(selector);
  },
  tap:function (el, fn) {
    let _this = this,
        hasTouch = "ontouchstart" in window;

    if(hasTouch && _this.config.trigger == 'tap'){
      let o = {};
			el.addEventListener('touchstart',function(e){
				let t = e.touches[0];

				o.startX = t.pageX;
				o.startY = t.pageY;
				o.sTime = + new Date;
			});
			el.addEventListener('touchend',function(e){
				let t = e.changedTouches[0];

				o.endX = t.pageX;
				o.endY = t.pageY;
				if((+ new Date) - o.sTime < 300){
					if(Math.abs(o.endX-o.startX) + Math.abs(o.endY-o.startY) < 20){
      			e.preventDefault();
						fn.call(this,e);
					}
				}
				o = {};
			});
    }else{
      el.addEventListener('click',function(e){
				fn.call(this,e);
			});
    }
  },
  show: function(){
    let _this = this,
        config = _this.config,
        el = _this.$(config.el);

    if(!el.bindJdate){return;}
    if(el.nodeName.toLowerCase() == 'input'){el.blur();}
    if(_this.$('.jdate-container')){return;}
    if(config.init && config.init.call(_this) === false){return;}

    _this.createUI();
    _this.event();
  },
  hide: function(flag){
    let _this = this,
        el = _this.$('.jdate-panel.fadeIn');

    if(el){
      el.className = 'jdate-panel fadeOut';
      _this.destroy(flag);
    }
  },
  event: function(){
    let _this = this,
         mask = _this.$('.jdate-mask'),
         cancel = _this.$('.jdate-cancel'),
         confirm = _this.$('.jdate-confirm');

    _this.tap(mask,function(){
      _this.hide(1);
    })
    _this.tap(cancel,function(){
      _this.hide(1);
    })
    _this.tap(confirm,function(){
        let config = _this.config,
            el = _this.$(config.el),
            date = config.format,
            newDate = new Date();

            for(let f in _this.scroll){
              let d = $('#' + _this.scroll[f] + ' .active').text().replace(/\D/g,'');

              date = date.replace(f,d);
              if(f == 'YYYY'){
                  newDate.setFullYear(d);
              }else if(f == 'MM'){
                  newDate.setMonth(d-1);
              }else if(f == 'DD'){
                  newDate.setDate(d);
              }else if(f == 'hh'){
                  newDate.setHours(d);
              }else if(f == 'mm'){
                  newDate.setMinutes(d);
              }else if(f == 'ss'){
                  newDate.setSeconds(d);
              }
            }
        if(config.confirm){
            let flag = config.confirm.call(_this,date);
            if(flag === false){
                return false
            }else if(flag){
                date = flag;
            }
        }
        if(el.nodeName.toLowerCase() == 'input'){
            el.value = date;
        }else{
            el.innerText = date;
        }
        _this.hide();
        el.bindDate = newDate;
    })
  },
  bissextile: function(year,month){
      let day;
      if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
          day = 31
      } else if (month == 4 || month == 6 || month == 11 || month == 9) {
          day = 30
      } else if (month == 2) {
          if (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)) { //闰年
              day = 29
          } else {
              day = 28
          }

      }
      return day;
  },
  destroy: function(flag){
      let _this = this,
         config = _this.config;

      if(flag && config.cancel){
          config.cancel.call(_this);
      }
      setTimeout(function() {
          let el = _this.$('.jdate-container');
          document.body.removeChild(el);
      }, 300);
  }
}
Jdate.version = version;

export default Jdate;

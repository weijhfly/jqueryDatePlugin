/*!
 * jquery.date.js
 * by weijianhua  https://github.com/weijhfly
*/
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {
    var defaults,
    d = new Date(),
    nowYear = d.getFullYear(),
    nowMonth = d.getMonth() + 1,
    domDate,
    createDate,
    body = $('body'),
    emptyStr = "<li></li>",
	domD = '<div class="t3">日</div>',
    domD2 = '<ol id="d-day"></ol>',
    domHm = '<div class="t4">时</div><div class="t5">分</div>',
    domHm2 = '<ol id="d-hours"></ol><ol id="d-minutes"></ol>',
    domS = '<div class="t6">秒</div>',
    domS2 = '<ol id="d-seconds"></ol>',
    isTouch = "ontouchend" in document ? true : false,
    tstart = isTouch ? "touchstart" : "mousedown",
    tmove = isTouch ? "touchmove" : "mousemove",
    tend = isTouch ? "touchend" : "mouseup",
    tcancel = isTouch ? "touchcancel" : "mouseleave",
	
    opts = {            
        beginYear: 2010,        
        endYear: 2088,            
        type:'YYYY-MM-DD',
        limitTime:false//限制选择时间 today 今天之前的时间不可选 tomorrow 明天之前的不可选
    };
    //dom渲染
    domDate = '<div id="date-wrapper"><h3>选择日期</h3><div id="d-content"><div id="d-tit"><div class="t1">年</div><div class="t2">月</div>' + '<div class="t3">日</div></div><div id="d-bg"><ol id="d-year"></ol><ol id="d-month"></ol>' + '<ol id="d-day"></ol>' + '</div></div><a id="d-cancel" href="javascript:">取消</a><a id="d-confirm" href="javascript:">确定</a></div><div id="d-mask"></div>';
    var css = '<style type="text/css">a{text-decoration:none;}ol,li{margin:0;padding:0}li{list-style-type:none}#date-wrapper{position:fixed;top:20%;left:50%;width:90%;margin-left:-45%;z-index:56;text-align:center;background:#fff;border-radius:3px;padding-bottom:15px;display:none}#d-mask{position:fixed;width:100%;height:100%;top:0;left:0;background:#000;filter:alpha(Opacity=50);-moz-opacity:.5;opacity:.5;z-index:55;display:none}#date-wrapper h3{line-height:50px;background:#79c12f;color:#fff;font-size:20px;margin:0;border-radius:3px 3px 0 0}#date-wrapper ol,#d-tit>div{width:16.6666666%;float:left;position:relative}#d-content{padding:10px}#d-content #d-bg{background:#f8f8f8;border:1px solid #e0e0e0;border-radius:0 0 5px 5px;height:120px;overflow:hidden;margin-bottom:10px;position:relative}#d-cancel,#d-confirm{border-radius:3px;float:left;width:40%;line-height:30px;font-size:16px;background:#dcdddd;color:#666;margin:0 5%}#d-confirm{background:#79c12f;color:#fff}#date-wrapper li{line-height:40px;height:40px;cursor:pointer;position:relative}#d-tit{background:#f8f8f8;overflow:hidden;border-radius:5px 5px 0 0;line-height:30px;border:1px solid #e0e0e0;margin-bottom:-1px}#date-wrapper ol{-webkit-overflow-scrolling:touch;position:absolute;top:0;left:0}#date-wrapper ol:nth-child(2){left:16.6666666%}#date-wrapper ol:nth-child(3){left:33.3333332%}#date-wrapper ol:nth-child(4){left:49.9999998%}#date-wrapper ol:nth-child(5){left:66.6666664%}#date-wrapper ol:nth-child(6){left:83.333333%}#d-content #d-bg:after{content:\'\';height:40px;background:#ddd;position:absolute;top:40px;left:0;width:100%;z-index:1}#date-wrapper li span{position:absolute;width:100%;z-index:99;height:100%;left:0;top:0}#date-wrapper.two ol,.two #d-tit>div{width:50%}#date-wrapper.two ol:nth-child(2){left:50%}#date-wrapper.three ol,.three #d-tit>div{width:33.333333%}#date-wrapper.three ol:nth-child(2){left:33.333333%}#date-wrapper.three ol:nth-child(3){left:66.666666%}#date-wrapper.four ol,.four #d-tit>div{width:25%}#date-wrapper.four ol:nth-child(2){left:25%}#date-wrapper.four ol:nth-child(3){left:50%}#date-wrapper.four ol:nth-child(4){left:75%}#date-wrapper.five ol,.five #d-tit>div{width:20%}#date-wrapper.five ol:nth-child(2){left:20%}#date-wrapper.five ol:nth-child(3){left:40%}#date-wrapper.five ol:nth-child(4){left:60%}#date-wrapper.five ol:nth-child(5){left:80%}</style>';
	if(navigator.language.indexOf('zh') == -1){
		domDate = domDate.replace('选择日期','DatePicker ').replace('取消','cancel').replace('确定','confirm');
		css = css.replace('</style>','#date-wrapper #d-tit{display:none;}</style>');
	}
    $("head").append(css);
    body.append(domDate);
    
    createDate = {
        ymd:function(begin,end){
            var domYear = '',
            domMonth = '',
            domDay = '',
			end = end <= nowYear ? (end + 10) :end;
            //dom 年 月 日
            for (var i = begin; i <= end; i++){domYear += '<li><span>' + i + '</span></li>';}
                $('#d-year').html(emptyStr + domYear + emptyStr);
            
            for (var j = 1; j <= 12; j++) {j = j<10?'0'+j:j;domMonth += '<li><span>' + j + '</span></li>';}
                $('#d-month').html(emptyStr + domMonth + emptyStr);
            
            var day = createDate.bissextile(nowYear,nowMonth);
            for (var k = 1; k <= day; k++) {k = k<10?'0'+k:k;domDay += '<li><span>' + k + '</span></li>';}
                $('#d-day').html(emptyStr + domDay + emptyStr);
        },
        hm:function(){
            var domHours = '',domMinutes = '';
            for (var i = 0; i <= 23; i++) {i = i<10?'0'+i:i;domHours += '<li><span>' + i + '</span></li>';}
                $('#d-hours').html(emptyStr + domHours + emptyStr);
            
            for (var j = 0; j <= 59; j++) {j = j<10?'0'+j:j;domMinutes += '<li><span>' + j + '</span></li>';}
                $('#d-minutes').html(emptyStr + domMinutes + emptyStr);
            
        },
        s:function(){
            var domSeconds = '';
            for (var i = 0; i <= 59; i++) {i = i<10?'0'+i:i;domSeconds += '<li><span>' + i + '</span></li>';}
                $('#d-seconds').html(emptyStr + domSeconds + emptyStr);
        },
        bissextile:function(year,month){
            var day;
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
            slide:function(el){
            //滑动
            var T,mT,isPress = false;
            $(document).on(tstart,'#date-wrapper ol', function(e){
                var e = e.originalEvent;
                e.stopPropagation();
                e.preventDefault();
                T = e.pageY || e.touches[0].pageY;
                if(!isTouch){isPress = true;}
            })
            $(document).on(tmove,'#date-wrapper ol', function(e){
                var e = e.originalEvent,that = $(this);
                e.stopPropagation();
                e.preventDefault();
                if(!isTouch && !isPress){return false};
                mT = e.pageY || e.touches[0].pageY;
                that.css('top', that.position().top + (mT - T) + 'px');
                T = mT;
                if (that.position().top > 0) that.css('top', '0');
                if (that.position().top < -(that.height() - (120))) that.css('top', '-' + (that.height() - (120)) + 'px');
            })
            $(document).on(tend,'#date-wrapper ol', function(e){
                var e = e.originalEvent,that = $(this);
                e.stopPropagation();
                e.preventDefault();
                isPress = false;
                dragEnd(that);
            })
            $(document).on(tcancel,'#date-wrapper ol', function(e){
                var e = e.originalEvent,that = $(this);
                e.stopPropagation();
                e.preventDefault();
                isPress = false;
                dragEnd(that);
            })
            function dragEnd(that){
                //滚动调整
                var t = that.position().top;
                that.css('top',Math.round(t/40)*40+'px');
                //定位active
                t = Math.round(Math.abs($(that).position().top));
                var li = that.children('li').get(t/40+1);
                $(li).addClass('active').siblings().removeClass('active');
                //修正日期
                var id = that.attr('id');
                if(id == 'd-month' || id == 'd-year'){
                    if($('#d-day').length == 0){return false;}
                    var day = createDate.bissextile($('#d-year .active').text(),$('#d-month .active').text());
                    if(day != ($('#d-day li').length-2)){
                        var thisActive = $('#d-day .active').text();
                        thisActive > day&&(thisActive = day);
                        var str = '';
                        for (var i = 1; i <= day; i++) {
                            var j = i < 10 ? '0'+i : i;
                            if (i == thisActive) {
                                str += '<li class="active"><span>' + j + '</span></li>';
                            } else {
                                str += '<li><span>' + j + '</span></li>';
                            }
                        }
                        $('#d-day').html(emptyStr + str + emptyStr);
                        if(Math.abs($('#d-day').position().top) > $('#d-day').height()-120)$('#d-day').css('top','-'+($('#d-day').height()-120)+'px');
                    }
                }
            }
        },
        show:function(isShow){
            var domMain = $('#date-wrapper'),
            domMask = $('#d-mask');
            if (isShow) {
                domMain.show();
                domMask.show();
                body.css('overflow','hidden');
            } else {
                domMain.hide();
                domMask.hide();
                body.css('overflow','auto');
            }
        },
        resetActive:function(){
             var d = new Date();
            if(opt.limitTime == 'tomorrow'){
                d.setDate(d.getDate()+1);
            }
            $('#date-wrapper ol').each(function() {
                var e = $(this),
                eId = e.attr('id');
                e.children('li').each(function() {
                    var lie = $(this),liText = lie.text() == ''? 'x':lie.text();
                    if (eId == 'd-year' && liText == d.getFullYear()) {
                        lie.addClass('active').siblings().removeClass('active');
                        return false;
                    } else if (eId == 'd-month' && liText == (d.getMonth() + 1)) {
                        lie.addClass('active').siblings().removeClass('active');
                        return false;
                    } else if (eId == 'd-day' && liText == d.getDate()) {
                        lie.addClass('active').siblings().removeClass('active');
                        return false;
                    } else if (eId == 'd-hours' && liText == d.getHours()) {
                        lie.addClass('active').siblings().removeClass('active');
                        return false;
                    } else if (eId == 'd-minutes' && liText == d.getMinutes()) {
                        lie.addClass('active').siblings().removeClass('active');
                        return false;
                    } else if (eId == 'd-seconds' && liText == d.getSeconds()) {
                        lie.addClass('active').siblings().removeClass('active');
                        return false;
                    }
                })
            })
        },
        toNow:function(refresh){
            if (!refresh) {
                $('#date-wrapper ol').each(function(){
                    var that = $(this);
                    var liTop = -(that.children('.active').position().top -40);
                    that.animate({
                        top: liTop
                    },
                    600);
                })
            } else {
                $('#date-wrapper ol').each(function() {
                    $(this).animate({
                        top: 0
                    },
                    0);
                })
            }
        },
        clear:function(){
            createDate.toNow(true);
            createDate.show(false);
        }
    }
    createDate.slide();
    var opt,prevOpt = '';
    function DateTool(obj){
        var that = $(obj);
        that.bind('click',function() {
			userOption = that.data('options');
			if(typeof(userOption) == 'string'){userOption = JSON.parse(userOption.replace(/'/g,'"'));}
			var strOpt = JSON.stringify(userOption);
            if (!$('#date-wrapper').is(':visible')) {
                if(that.get(0).tagName == 'INPUT'){that.blur();}
				//简单比较配置是否相同，相同则不重新渲染
                if(prevOpt != strOpt){
                    $('#date-wrapper ol').empty();
                    prevOpt = strOpt;
                    opt = null;
                    opt = $.extend({},opts,userOption || {});
                    createDate.ymd(opt.beginYear,opt.endYear);
                    if(opt.type == "YYYY-MM-DD hh:mm:ss"){
						if($('#d-day').length == 0){
							$('#d-tit').append(domD);
							$('#d-bg').append(domD2);
							createDate.ymd(opt.beginYear,opt.endYear);
						}
                        $('#d-tit div:gt(2)').remove();
                        $('#d-bg ol:gt(2)').remove();
                        $('#d-tit').append(domHm+domS);
                        $('#d-bg').append(domHm2+domS2);
                        createDate.hm();
                        createDate.s();
                        $('#date-wrapper').attr('class','');
                    }else if(opt.type == "YYYY-MM-DD hh:mm"){
						if($('#d-day').length == 0){
							$('#d-tit').append(domD);
							$('#d-bg').append(domD2);
							createDate.ymd(opt.beginYear,opt.endYear);
						}
                        $('#d-tit div:gt(2)').remove();
                        $('#d-bg ol:gt(2)').remove();
                        $('#d-tit').append(domHm);
                        $('#d-bg').append(domHm2);
                        createDate.hm();
                        $('#date-wrapper').attr('class','five');
                    }else if(opt.type == "YYYY-MM-DD"){
						if($('#d-day').length == 0){
							$('#d-tit').append(domD);
							$('#d-bg').append(domD2);
							createDate.ymd(opt.beginYear,opt.endYear);
						}else{
							$('#d-tit div:gt(2)').remove();
							$('#d-bg ol:gt(2)').remove();
						}
                        $('#date-wrapper').attr('class','three');
                    }else if(opt.type == "YYYY-MM"){
                        $('#d-tit div:gt(1)').remove();
                        $('#d-bg ol:gt(1)').remove();
                        $('#date-wrapper').attr('class','two');
                    }
                }
                createDate.resetActive();
                createDate.show(true);
                createDate.toNow(false);
                $('#d-confirm').attr('d-id', obj);
            }
        });
    }
    $.date = function(obj){
		DateTool(obj);
	}
    //取消
    $(document).on('click','#d-cancel',function(){
        createDate.clear();
    })
     //确定
     $(document).on('click','#d-confirm',function(){
        var y = $('#d-year .active').text(),
			m = $('#d-month .active').text(),
			d = $('#d-day .active').text(),
			h = $('#d-hours .active').text(),
			min = $('#d-minutes .active').text(),
			s = $('#d-seconds .active').text(),
			str,
			that = $($(this).attr('d-id'));
			
        if(opt.type == "YYYY-MM-DD hh:mm:ss"){
            str = y+'-'+m+'-'+d+' '+h+':'+min+':'+s;   
        }else if(opt.type == "YYYY-MM-DD hh:mm"){
            str = y+'-'+m+'-'+d+' '+h+':'+min;
        }else if(opt.type == "YYYY-MM-DD"){
            str = y+'-'+m+'-'+d;
        }else if(opt.type == "YYYY-MM"){
            str = y+'-'+m;
        }
        if(opt.limitTime == 'today'){
            var d = new Date(),
				error = navigator.language.indexOf('zh') != -1? '不能选择过去的时间':'You can\'t choose the past time';
            //当前日期
            var day = String(d.getFullYear())+'-'+String(d.getMonth() + 1)+'-'+String(d.getDate());
            var d1 = new Date(str.replace(/\-/g, "\/")); 
            var d2 = new Date(day.replace(/\-/g, "\/"));
            if(d1 < d2){
                alert(error);
                return false;
            }  
        }else if(opt.limitTime == 'tomorrow'){
            var d = new Date(),
				error = navigator.language.indexOf('zh') != -1? '时间最少选择明天':'Choose tomorrow at least';
            //当前日期+1
            var day = String(d.getFullYear())+'-'+String(d.getMonth() + 1)+'-'+String(d.getDate()+1);
            var d1 = new Date(str.replace(/\-/g, "\/")); 
            var d2 = new Date(day.replace(/\-/g, "\/"));
            if(d1 < d2){
                alert(error);
                return false;
            }  
        }
        //赋值
        if(that.get(0).tagName == 'INPUT'){
            that.val(str);
        }else{
            that.text(str);
        }
        createDate.toNow(true);
        createDate.show(false);
        })
}))
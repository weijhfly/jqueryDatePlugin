# jdate(jquery-date) [![npm](https://img.shields.io/npm/v/jquery-date.svg)](https://www.npmjs.com/package/jquery-date) [![npm](https://img.shields.io/npm/dm/jquery-date.svg)](https://www.npmjs.com/package/jquery-date)
此为jdate 2.0新版，完全参照jdate的下一代版本<a href="https://github.com/weijhfly/rolldate">rolldate</a>做了全新改版，查看旧版请点击<a href="https://github.com/weijhfly/jqueryDatePlugin/tree/1.4.3">返回旧版(1.4.3分支)</a>  
<br>
此版特色：   
1. 拥有和rolldate完全一样的功能；<br>
2. 体积更小，兼容性更强；   

不足之处：
1. 滑动较慢；   

此版更适合滑动天数少的情况(比如限制只能滑动几天)，或者兼容性要求高的情况，一般情况更推荐使用rolldate。并且jdate基本不怎么更新和维护，主要作为一个次要版本出现。
## 演示
[jdate](https://weijhfly.github.io/jdate.html "jdate")(下方直接扫码即可体验)  

![jdate](https://weijhfly.github.io/images/jdate-demo.png)

## 使用方式
**特别注意：**     
jdate依赖jQuery，如果没有全局的$或jQuery(也要保证在jdate之前加载)，必须先使用以下的代码：  
```js
Jdate.usejQuery($);
```
如：
```js
import $ from 'jquery'
import Jdate from 'jdate'

Jdate.usejQuery($);
new Jdate({
  el:'#date'
})
```
否则插件将报错，无法运行。
### es6
```js
import Jdate from 'jdate'
new Jdate({
  el:'#date'
})
```
### commonJS
```js
var Jdate = require('jdate');
new Jdate({
  el:'#date'
})
```
### amd
```js
require(['Jdate'],function(Jdate){
  new Jdate({
    el:'#date'
  })
})
```
### cmd
```js
seajs.use('Jdate',function(undefined){
    //插件没有遵循cmd规范，这里的Jdate是全局的
    new Jdate({
      el:'#date'
    })
});
```
## 参数、方法说明
名称|必填|默认值|说明
---|:-:|:-:|---
el|是|无|绑定插件的dom元素，插件内部使用document.querySelector，<br>也可以直接传递dom元素对象，只支持单个
format|否|'YYYY-MM-DD'|日期格式，无限制。规则：年-YYYY 月-MM 日-DD 时-hh 分-mm 秒-ss 使用/、-、空格、:之一分隔，可随意组合
beginYear|否|2000|日期开始年份
endYear|否|2100|日期结束年份
value|否|无|日期初始化的默认值，列如'2018-03-18'
lang|否|年、月、日...|配置插件语言，默认：title:'选择日期',cancel:'取消',confirm:'确认',<br>year:'年',month:'月',day:'日',hour:'时',min:'分',sec:'秒'
minStep|否|1|分钟按指定数分隔
init|否|null|插件触发前的回调函数，return false可阻止插件执行
moveEnd|否|null|插件滚动后的回调函数
confirm|否|null|确认按钮触发前的回调函数，return false可阻止插件执行，<br>return其他值可修改日期，函数返回一个参数(选中的日期)
cancel|否|null|插件取消时触发的回调函数
trigger|否|'tap'|默认使用tap解决移动端click事件300ms延迟，可选click替换tap。注意使用tap会阻止其他绑定的click事件的触发
show|否|无|主动触发插件，当trigger为tap时，主动触发插件应该使用此方法
hide|否|无|主动隐藏插件
```js
//完整参数、方法示例
var jd = new Jdate({
    el: '#date',
    format: 'YYYY-MM-DD',
    beginYear: 2000,
    endYear: 2100,
    minStep:1,
    lang:{title:'自定义标题'},
    trigger:'tap',
    init: function() {
      console.log('插件开始触发');
    },
    moveEnd: function() {
      console.log('滚动结束');
    },
    confirm: function(date) {
      console.log('确定按钮触发');
    },
    cancel: function() {
      console.log('插件运行取消');
    }
})
jd.show();
jd.hide();

```

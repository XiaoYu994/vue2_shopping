"use strict";(self["webpackChunkvue2_shopping"]=self["webpackChunkvue2_shopping"]||[]).push([[761],{761:function(t,s,e){e.r(s),e.d(s,{default:function(){return u}});e(4114);var i=function(){var t=this,s=t._self._c;return s("div",{staticClass:"search"},[s("van-nav-bar",{attrs:{title:"商品搜索","left-arrow":""},on:{"click-left":function(s){return t.$router.go(-1)}}}),s("van-search",{attrs:{"show-action":"",placeholder:"请输入搜索关键词",clearable:""},on:{search:t.add},scopedSlots:t._u([{key:"action",fn:function(){return[s("div",{on:{click:t.add}},[t._v("搜索")])]},proxy:!0}]),model:{value:t.key,callback:function(s){t.key="string"===typeof s?s.trim():s},expression:"key"}}),s("div",{staticClass:"search-history"},[s("div",{staticClass:"title"},[s("span",[t._v("最近搜索")]),s("van-icon",{attrs:{name:"delete-o",size:"16"}})],1),s("div",{staticClass:"list"},t._l(t.list,(function(e,i){return s("div",{key:i,staticClass:"list-item",on:{click:function(s){return t.$router.push(`/searchlist?search=${e}`)}}},[t._v(" "+t._s(e)+" ")])})),0)])],1)},a=[],n=e(1089),r={name:"SearchIndex",data(){return{list:(0,n.TK)()||[],key:""}},methods:{add(){if(""===this.key)return void this.$toast("请输入关键字");const t=this.list.indexOf(this.key);-1!==t&&this.list.splice(t,1),this.list.unshift(this.key),(0,n.Tg)(this.list),this.$router.push(`/searchlist?search=${this.key}`)}}},c=r,l=e(1656),o=(0,l.A)(c,i,a,!1,null,"d7a4028c",null),u=o.exports}}]);
//# sourceMappingURL=761.0bf28792.js.map
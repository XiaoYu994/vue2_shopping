"use strict";(self["webpackChunkvue2_shopping"]=self["webpackChunkvue2_shopping"]||[]).push([[984],{3641:function(t,s,a){a.d(s,{A:function(){return d}});a(4114);var i=function(){var t=this,s=t._self._c;return t.goods.goods_id?s("div",{staticClass:"goods-item",on:{click:function(s){return t.$router.push(`/detail/${t.goods.goods_id}`)}}},[s("div",{staticClass:"left"},[s("img",{attrs:{src:t.goods.goods_image,alt:""}})]),s("div",{staticClass:"right"},[s("p",{staticClass:"tit text-ellipsis-2"},[t._v(" "+t._s(t.goods.goods_name)+" ")]),s("p",{staticClass:"count"},[t._v("已售 "+t._s(t.goods.goods_sales)+" 件")]),s("p",{staticClass:"price"},[s("span",{staticClass:"new"},[t._v("¥"+t._s(t.goods.goods_price_min))]),s("span",{staticClass:"old"},[t._v("¥"+t._s(t.goods.line_price_max>0?t.goods.line_price_max:t.goods.goods_price_max))])])])]):t._e()},o=[],e={name:"GoodsItem",props:{goods:{type:Object,default:()=>({})}}},n=e,r=a(1656),c=(0,r.A)(n,i,o,!1,null,"64d94c46",null),d=c.exports},8984:function(t,s,a){a.r(s),a.d(s,{default:function(){return g}});a(4114);var i=function(){var t=this,s=t._self._c;return s("div",{staticClass:"home"},[s("van-nav-bar",{attrs:{title:"智慧商城",fixed:""}}),s("van-search",{attrs:{readonly:"",shape:"round",background:"#f1f1f2",placeholder:"请在此输入搜索关键词"},on:{click:function(s){return t.$router.push("/search")}}}),s("van-swipe",{staticClass:"my-swipe",attrs:{autoplay:3e3,"indicator-color":"white"}},t._l(t.bannerList.data,(function(a){return s("van-swipe-item",{key:a.imgUrl},[s("img",{attrs:{src:a.imgUrl,alt:""},on:{click:function(s){return t.$router.push(`/prodetail/${a.link.form[0].value}`)}}})])})),1),s("van-grid",{attrs:{"column-num":"5","icon-size":"40"}},t._l(t.navBarList.data,(function(a){return s("van-grid-item",{key:a.imgUrl,attrs:{icon:a.imgUrl,text:a.text},on:{click:function(s){return t.$router.push("/category")}}})})),1),t._m(0),s("div",{staticClass:"guess"},[s("p",{staticClass:"guess-title"},[t._v("—— 猜你喜欢 ——")]),s("div",{staticClass:"goods-list"},t._l(t.goodsList.data,(function(t){return s("GoodsItem",{key:t.goods_id,attrs:{goods:t}})})),1)])],1)},o=[function(){var t=this,s=t._self._c;return s("div",{staticClass:"main"},[s("img",{attrs:{src:a(8823),alt:""}})])}],e=a(5720);const n=t=>e.A.get("/page/detail",{params:{pageId:0}});var r=a(3641),c={name:"HomePage",data(){return{bannerList:{},navBarList:{},goodsList:{}}},components:{GoodsItem:r.A},created(){this.getPageList()},methods:{async getPageList(){const{data:{pageData:{items:t}}}=await n();this.bannerList=t[1],this.navBarList=t[3],this.goodsList=t[6]}}},d=c,l=a(1656),u=(0,l.A)(d,i,o,!1,null,"5d25ca54",null),g=u.exports},8823:function(t,s,a){t.exports=a.p+"img/main.95d4fe07.png"}}]);
//# sourceMappingURL=984.5487b052.js.map
"use strict";(self["webpackChunkvue2_shopping"]=self["webpackChunkvue2_shopping"]||[]).push([[534],{4534:function(t,s,e){e.r(s),e.d(s,{default:function(){return d}});var i=function(){var t=this,s=t._self._c;return s("div",{staticClass:"comments-page"},[s("van-nav-bar",{attrs:{fixed:"",title:"商品评价","left-arrow":""},on:{"click-left":function(s){return t.$router.go(-1)}}}),s("div",{staticClass:"comments-container"},[s("div",{staticClass:"comment-stats"},[s("div",{staticClass:"rate-box"},[s("div",{staticClass:"rate-num"},[t._v(t._s(t.goodRate)+"%")]),s("div",{staticClass:"rate-text"},[t._v("好评率")])]),s("div",{staticClass:"tags-box"},t._l(t.tags,(function(e,i){return s("div",{key:i,class:["tag-item",{active:t.currentTag===e.score}],on:{click:function(s){return t.switchTag(e.score)}}},[t._v(" "+t._s(e.name)+" ("+t._s(e.count)+") ")])})),0)]),s("div",{staticClass:"comment-list"},t._l(t.commentList,(function(e){return s("div",{key:e.comment_id,staticClass:"comment-item"},[s("div",{staticClass:"user-info"},[s("img",{staticClass:"avatar",attrs:{src:e.user.avatar_url||t.defaultAvatar}}),s("span",{staticClass:"nickname"},[t._v(t._s(e.user.nick_name))]),s("van-rate",{attrs:{value:e.score,size:12,color:"#ffd21e","void-icon":"star","void-color":"#eee",readonly:""}})],1),s("div",{staticClass:"comment-content"},[t._v(t._s(e.content))]),e.images&&e.images.length?s("div",{staticClass:"comment-images"},t._l(e.images,(function(i,a){return s("img",{key:a,attrs:{src:i.image_url},on:{click:function(s){return t.previewImage(e.images,a)}}})})),0):t._e(),e.spec_value?s("div",{staticClass:"comment-spec"},[t._v(t._s(e.spec_value))]):t._e(),s("div",{staticClass:"comment-time"},[t._v(t._s(e.create_time))])])})),0),t.loading?s("van-loading",{staticClass:"loading"},[t._v("加载中...")]):t._e(),t.finished?s("div",{staticClass:"no-more"},[t._v("没有更多评价了")]):t._e()],1)],1)},a=[],n=(e(6647),e(269),e(8015),e(7484),e(7582),e(4371),e(7265),e(4259),e(1125),e(8341),e(5432)),o=(e(8992),e(3949),e(1454),e(8484)),c=e(7767),r={name:"CommentsPage",data(){return{defaultAvatar:c,commentList:[],currentTag:-1,page:1,loading:!1,finished:!1,tags:[{name:"全部",count:0,score:-1},{name:"好评",count:0,score:10},{name:"中评",count:0,score:20},{name:"差评",count:0,score:30}]}},created(){this.loadComments()},computed:{goodsId(){return this.$route.query.goodsId},goodRate(){return console.log(this.tags[0].count),(this.tags[1].count/this.tags[0].count*100).toFixed(2)}},methods:{async loadComments(){if(!this.loading&&!this.finished){this.loading=!0;try{const{data:{list:t}}=await(0,o.S)(this.currentTag,this.goodsId,this.page);console.log(t.data),this.tags[0].count=t.total,console.log(this.tags[0].count),t.data.forEach((t=>{t.score&&(t.score<20&&this.tags[1].count++,t.score<30&&t.score>=20&&this.tags[2].count++,t.score<40&&t.score>=30&&this.tags[3].count++)})),this.commentList=[...this.commentList,...t.data],this.commentList.length>=t.total?this.finished=!0:this.page++}catch(t){console.error("获取评价列表失败：",t),this.$toast("加载失败，请重试")}finally{this.loading=!1}}},switchTag(t){this.currentTag!==t&&(this.currentTag=t,this.page=1,this.commentList=[],this.finished=!1,this.loadComments())},previewImage(t,s){console.log(t);const e=t.map((t=>t.image_url));(0,n.A)({images:e,startPosition:s})}},mounted(){const t=document.querySelector(".comments-container");t.addEventListener("scroll",(()=>{const{scrollHeight:s,scrollTop:e,clientHeight:i}=t;s-e-i<50&&this.loadComments()}))}},l=r,m=e(1656),u=(0,m.A)(l,i,a,!1,null,"0d0c10aa",null),d=u.exports},8484:function(t,s,e){e.d(s,{S:function(){return n},v:function(){return a}});var i=e(5720);const a=(t,s)=>i.A.get("/comment/listRows",{params:{goodsId:t,limit:3}}),n=(t,s,e)=>i.A.get("/comment/list",{params:{scoreType:t,goodsId:s,page:e}})},7767:function(t){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkBAMAAACCzIhnAAAAKlBMVEXp6en////9/f3o6Ojw8PDj4+Pl5eXh4eHs7Oz7+/v09PTy8vL4+Pj29vY+GdZKAAADDElEQVRYw+3Wv0sbYRjA8ZNwp+Li89YhUQO+b6F0PDTx6NBBtHXpcBDPRkvhakiC1CGghqIIyRCdOqQlHdouUoqlm1Co0KUZhK4tFPvn9MnF5n6+P4R2KT6EhJe8n3y5ewOJduXJXZNr8l+Tecd5uFu6CinbS18+LR06pjJxxl4ATuZD2anMaXMKxHkOl/P6LFVxCnJi3YXAvP34zZWR1A6E54aUVI8j5J4mIcZBRExLr8WKRk5cGdmHyFyYEqI3o2SqJiH5NkRHl5B9iE3HFBJjI07StpDoC3Ey7QrJfBviYwiJCwmzLCQ7SeRCSNaTyEtTQFKbSSTtishsIrEFxBi6Jn+FFAWk+iSR1PnEyHWTSObM5pJSG5KnxSWPgDMdk0ce88gMl6zzyE0uWRnsoWFyziUubiWMAiMM8AmdtwT4zL38fJcxRnAXw6EI+0sGBpfoTUJIbxfF6ZnL5aTNP/0DklSht1w+KVFK4xVY1vjkqEkSKtltAdH2IF6Bjisi1vd4BfSGiByukWiFjtvi35dKO1qBI01M8AZEKtmahKQ2wxVK07aEaCuRCj3XZKTSDl8L6FIyPESCFZisSYm2F76Wjisn5TZlgYrekJPWLPErdKKm8kfxGfgVODFVyHATBpXJbU2FpDYGdwzGi2rkzqBC064a2fIrSP5VZTZQsZVIa8i/Y1M1JTJ86p9LZrWhdpSB01c6SqtJ/ApM1RtSYmDErzB4b0uJc0qYXyEsUzUlpDoKNFgh9LZjCkn1KTAWqhD4umvyScrJUULDFTTvsMMhxu4YimiFUfhVLSSTvPsAUMQqhMKbw0ICGckXf3giVsEHZO6vxsiIVewC7kqsUAZksR4lerENjPAquCCLhTAxtrv4Lr+CT6Rlh4hzCpSKKozQrGUGiDUKjIkrjMBEvTEg+FXsfyJWiLfRm96LV+unGPy0B6R83NuI73qAeKq/9h4epjgZ6w/Rt8Db2EeBCq4DFdQztUuy2mWKA0d9oq8RVULTNY+UMaKcyfdIao+oE/rKRqIvsCtMtpT7DVEPKD7Ga13IAAAAAElFTkSuQmCC"}}]);
//# sourceMappingURL=534.dfb8d30c.js.map
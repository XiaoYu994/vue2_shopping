# 基于vue2实现的智慧商城项目

>前言：随着各种框架技术的学习，我愈发的感觉怀疑学习的意义，总会有更便捷的技术，计算机这一行业更新迭代的太快了，当我们掌握的语言被淘汰的时候，我们还能干什么呢，ai真的太厉害了，或许以后需要程序员，但只需要一小部分程序员就可以做掉今天很多人干的活，那我们这些低学历的人学习这门专业的意义何在，也许AI 只是一个工具，就像你使用的 Vue、Vant 等框架一样，是帮助你更高效地实现想法的助手。但以后需要你来使用这些工具吗？													2025-1-16

## 项目的准备工作

1. [wiki说明 - 黑马程序员-智慧商城H5](https://apifox.com/apidoc/shared-dead2bca-2509-43dc-a4de-ede5218058a1)  接口文档地址
2. [Vant 2 - 轻量、可靠的移动端组件库](https://youzan.github.io/vant/v2/#/zh-CN/home) vant2组件
3. 创建项目 vue create

## 项目结构

<img src="./blob/master/vue2智慧商城/QQ_1737084161670.png" alt="QQ_1737084161670" style="zoom:33%;" />

​	在进行前端项目开发的时候也是一样要进行分包操作，不断的解耦使项目更便于维护和开发所以在开发的时候要根据给出的项目原型去做分类规划，这样才能使后面开发的时候更便捷，在搭建这个项目的时候首先要将最基本的架子搭好，然后在这个架子的基础上不断地去完善，填充需要的功能

### 一级路由和二级路由

一级路由的出口就是App.vue，二级路由是在一级路由中展示 在下面这个例子中就是这样，下面展示的导航栏所对应转跳的路径就是上面二级路由出口要展示的路径

```javascript
  <div>
    <!-- 二级路由出口：二级组件展示的位置 -->
    <router-view></router-view>

    <van-tabbar route active-color="#ee0a24" inactive-color="#000">
      <van-tabbar-item to="/home" icon="wap-home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/category" icon="apps-o">分类页</van-tabbar-item>
      <van-tabbar-item to="/cart" icon="shopping-cart-o">购物车</van-tabbar-item>
      <van-tabbar-item to="/user" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
```

### 路由的配置

配置路由用于转跳页面，转跳路由有两种形式，一种是在DOM元素中转跳`$router.push`这种不需要带this，在js中转跳`this.$router.push`,希望一访问页面就跳转到首页，路由配置如下

```javascript
    {
      path: '/',
      component: () => import('@/views/LayOut.vue'),
      redirect: 'home',
      children: [
        {
          path: 'home',
          component: () => import('@/views/layout/home.vue')
        },
        {
          path: 'category',
          component: () => import('@/views/layout/category.vue')
        },
        {
          path: 'cart',
          component: () => import('@/views/layout/cart.vue')
        },
        {
          path: 'user',
          component: () => import('@/views/layout/user.vue')
        }
      ]
    },
```

### 对要使用的组件库进行按需配置

将组件库全部导入太占用内存，用到时候组件就导入什么组件

1. 进行安装所需组件库和插件 

   ```cmd
   yarn add vant@latest-v2
   yarn add babel-plugin-import -D
   ```

2. 在插件的配置文件中配置 `babel.config.js`

   ```js
   module.exports = {
     presets: [
       '@vue/cli-plugin-babel/preset'
     ],
     plugins: [
       ['import', {
         libraryName: 'vant',
         libraryDirectory: 'es',
         style: true
       }, 'vant']
     ]
   }
   ```

3. 将按需导入的步骤抽离到`utils`包下,并进行按需导入

   ```js
   import Vue from 'vue'
   import { Tab } from 'vant'
   
   Vue.use(Tab)
   ```

4. 在`main.js`中引入

   ```js
   import '@/utils/vant-ui'
   ```

### vw适配

>进行不同浏览器之间的页面窗口适配

1. [Vant 2 - 轻量、可靠的移动端组件库](https://youzan.github.io/vant/v2/#/zh-CN/advanced-usage)  官方文档

2. 下载插件

   ```js
   yarn add postcss-px-to-viewport@1.1.1 -D
   ```

3. 项目根目录新建 postcss的配置文件`postcss.config.js`

   ```js
   // postcss.config.js
   module.exports = {
     plugins: {
       'postcss-px-to-viewport': {
         viewportWidth: 375,
       },
     },
   };
   ```

4. 为什么设置为375?

   - vant组件的宽度就是375 

   - 该项目的设计稿也是按照375做的

   - [设计稿不安这个值怎么办]((https://zhuanlan.zhihu.com/p/366664788))

     ```js
     module.exports = ({ file }) => {
       const designWidth = file.dirname.includes("node_modules/vant") ? 375 : 750;
     
       return {
         plugins: {
           "postcss-px-to-viewport": {
             viewportWidth: designWidth,
           },
         },
       };
     };
     ```

     

## 模块的封装

### request模块 - axios封装

对 axios 进行基本的**二次封装**, 单独封装到一个模块中，并进行**一些配置** 

```js
/* 封装axios用于发送请求 */
import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store'

// 创建一个新的axios实例
const request = axios.create({
  // 请求的基础路径
  baseURL: 'http://smart-shop.itheima.net/index.php?s=/api',
  timeout: 5000,
  headers: { platform: 'H5' }
})

// 添加请求拦截器
request.interceptors.request.use(
  config => {
    store.commit('setLoading', true)
    const token = store.getters.token
    if (token) {
      config.headers['Access-Token'] = token
    }
    return config
  },
  error => {
    store.commit('setLoading', false)
    return Promise.reject(error)
  }
)

// 添加响应拦截器
request.interceptors.response.use(
     // 对响应数据做点什么 (默认axios会多包装一层data，需要响应拦截器中处理一下)
  response => {
    // vuex中定义的方法 改变用户的登录状态
    store.commit('setLoading', false)
    return response.data
  },
  error => {
    store.commit('setLoading', false)
     // ?代表后面的属性为可选
    Toast.fail(error.response?.data?.message || '服务器异常')
    return Promise.reject(error)
  }
)

export default request

```

## 项目的开发

### 首页的开发

1. 封装请求到api文件下 不同页面的请求要放在不同的js文件夹下
2. 页面中调用api 得到数据 
3. 利用create生命周期函数在页面加载的时候就获得数据，并将数据渲染到静态结构中	
4. 封装商品组件，相当于展示当前商品的卡片,通过组件通信的方式传递需要渲染的数据

### 登录界面的开发

1. 前面的步骤都一样

2. 发送短信验证码 通过定时器实现倒计时的效果，在发送短信验证码之前就对输入的信息进行了校验

   ```js 
      //需要的变量
      totalSecond: 60, // 总秒数 这个变量不会变
       second: 60, // 倒计时的秒数
       timer: null // 定时器 id
   ```

3. 注意一个点就是，离开页面的时候要销毁定时器，也是利用钩子函数实现

   ```js
   destroyed () {
     clearInterval(this.timer)
   }
   ```

4. 将校验的行为封装为一个方法，因为多处要用到，不仅发送验证码时要用，点击登陆时也还是要用到

5. 登录成功将用户的个人信息存入vuex，并存入本地，这里又需要讲到vuex的分模块了，在vuex分模块的过程中再来解决这个问题，存储到本地的操作也可以抽取为工具类`util`中

6. 当我们没有登录访问其他页面，被判定需要登录时，登陆后如何跳转回之前的页面

   - 我们在登录成功后进行一个判断,这需要我们在跳转登录界面传递参数的时候，地址栏带上这个参数

     ```js
           // 进行判断，看地址栏有无回跳地址
           // 1. 如果有   => 说明是其他页面，拦截到登录来的，需要回跳
           // 2. 如果没有 => 正常去首页
           const url = this.$route.query.backUrl || '/'
           this.$router.replace(url)
     ```

7. 一些问题

   - 关于图形验证码的校验，在这里前端只做了位数的校验，并没有对内容进行校验，是在登陆的时候发送给后端进行校验吗？如果不通过就返回验证码错误的结果吗  这样会不会加剧后端服务器的压力

### vuex持久化处理，和将信息存储到浏览器

>什么数据才需要存储到vuex中 多个组件共享  需要集中管理的数据  跨页面/组件通信的数据
>
>在本项目中 用户的信息，登录状态和token，购物车数据还有全局加载状态都是要存到vuex中的数据

#### 将数据存储到浏览器中

 ```js
// 约定一个通用的键名
const INFO_KEY = 'hm_shopping_info'
const HISTORY_KEY = 'hm_history_list'

// 获取个人信息
export const getInfo = () => {
  const defaultObj = { token: '', userId: '' }
  const result = localStorage.getItem(INFO_KEY)
  return result ? JSON.parse(result) : defaultObj
}

 ```

在vuex中获取用户信息数据也是从浏览器内存中获取的

#### vuex的管理

还记得之前讲过的vuex分模块吗，在这个项目中也是这样的，不同的vuex模块管理不同的数据，分模块后要记得在主文件中导入这个模块

```index.js
  modules: {
    user,
    cart
  }
```

分模块一定要开启命名空间，并且在不同模块中也是可以使用其他模块中的数据,也可以通过其中actions属性来发送请求，其实这些属性就是 state提供存储数据的地方，mutaions能够修改vuex中的数据，actions进行异步操作，如果要修改vuex也就是state中的数据，必须通过mutations实现，还记得他们在页面中如何调用吗

`this.$store.commit('模块名/方法名'，要传递的参数)` `this.$store.dispatch()`

```js
import { getInfo, setInfo } from '@/utils/storage'

export default {
  namespaced: true,
  state () {
    return {
      // 个人权证相关
      userInfo: getInfo()
    }
  },
  mutations: {
    // 所有mutations的第一个参数，都是state
    setUserInfo (state, obj) {
      state.userInfo = obj
      setInfo(obj)
    }
  },
  actions: {
    logout (context) {
      // 个人信息要重置
      context.commit('setUserInfo', {})

      // 购物车信息要重置 (跨模块调用 mutation)  cart/setCartList
      context.commit('cart/setCartList', [], { root: true })
    }
  },
  getters: {}
}

```

#### 将登录成功的数据存储到vuex中

```vue
      // 发送请求，登录
      const res = await login(this.phone, this.smsCode)
      this.$store.commit('user/setUserInfo', res.data)
```



#### 在全局vuex配置中配置token

用于在页面中获取用户是否登录

```java
import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import cart from './modules/cart'

Vue.use(Vuex)
Vue.use(user)

export default new Vuex.Store({
  state: {
     // 全局的登录状态 通过它也可以来获取用户是否登录
    loading: false
  },
  getters: {
    // 获取用户是否登录
    token (state) {
      return state.user.userInfo.token
    }

  },
  mutations: {
    setLoading (state, status) {
      state.loading = status
    }
  },
  actions: {
  },
  modules: {
    user,
    cart
  }
})

```

### 添加请求 loading 效果 处理请求错误的情况

1. 请求的时候打开

   ```js
   // 添加请求拦截器
   request.interceptors.request.use(function (config) {
     // 在发送请求之前做些什么
     Toast.loading({
       message: '请求中...',
       forbidClick: true,
       loadingType: 'spinner',
       duration: 0
     })
     return config
   }, function (error) {
     // 对请求错误做些什么
     return Promise.reject(error)
   })
   ```

2. 数据响应的时候关闭 并判断请求是否成功 进行错误处理

   ```js
   // 添加响应拦截器
   instance.interceptors.response.use(function (response) {
     // 2xx 范围内的状态码都会触发该函数。
     // 对响应数据做点什么 (默认axios会多包装一层data，需要响应拦截器中处理一下)
     const res = response.data
     if (res.status !== 200) {
       // 给错误提示, Toast 默认是单例模式，后面的 Toast调用了，会将前一个 Toast 效果覆盖
       // 同时只能存在一个 Toast
       Toast(res.message)
       // 抛出一个错误的promise
       return Promise.reject(res.message)
     } else {
       // 正确情况，直接走业务核心逻辑，清除loading效果
       Toast.clear()
     }
     return res
   }, function (error) {
     // 超出 2xx 范围的状态码都会触发该函数。
     // 对响应错误做点什么
     return Promise.reject(error)
   })
   ```

#### 第二种配置loading的方法

1. 利用全局配置参数**loading**

2. 自己定义一个组件

   ```vue
   <template>
     <div class="loading-wrapper" v-if="loading">
       <div class="loading">
         <van-loading type="spinner" color="#ee0a24" />
         <span class="text">加载中...</span>
       </div>
     </div>
   </template>
   
   <script>
   import { mapState } from 'vuex'
   
   export default {
     name: 'LoadingIndex',
     computed: {
       ...mapState(['loading'])
     }
   }
   </script>
   
   <style lang="less" scoped>
   .loading-wrapper {
     position: fixed;
     top: 0;
     left: 0;
     right: 0;
     bottom: 0;
     background: rgba(0, 0, 0, 0.3);
     z-index: 999;
     display: flex;
     align-items: center;
     justify-content: center;
   
     .loading {
       background: #fff;
       padding: 20px 30px;
       border-radius: 8px;
       display: flex;
       flex-direction: column;
       align-items: center;
   
       .text {
         margin-top: 8px;
         font-size: 14px;
         color: #666;
       }
     }
   }
   </style>
   
   ```

3. 在App.vue中使用这个组件，这个组件是否显示完全取决于loading参数，也就是请求有没有响应成功，在全局拦截器中做了配置

4. 优化一下app.vue 添加**过渡效果**   `<transition name="fade" mode="out-in">`：这是一个 Vue 提供的组件，用于添加进入和离开的过渡效果。`name="fade"` 指定了过渡的名称，Vue 会自动查找与之对应的 CSS 类。`mode="out-in"` 指定了过渡的模式，即先让当前组件离开，再让新组件进入。

   ```js
   <template>
     <div id="app">
       <transition name="fade" mode="out-in">
         <router-view></router-view>
       </transition>
       <Loading />
     </div>
   </template>
   <script>
   import Loading from '@/components/Loading.vue'
   export default {
     name: 'App',
     components: {
       Loading
     }
   }
   </script>
   
   <style lang="less">
   .fade-enter-active,
   .fade-leave-active {
     transition: opacity 0.3s;
   }
   
   .fade-enter,
   .fade-leave-to {
     opacity: 0;
   }
   </style>
   
   ```

### 全局前置守卫 进行登录拦截访问

>全局前置守卫 所有的路由一旦被匹配到，都会先经过全局前置守卫，只有全局前置守卫放行，才会真正解析渲染组件，才能看到页面内容

1. 基础代码

   ```js
   router.beforeEach((to, from, next) => {
     // 1. to   往哪里去， 到哪去的路由信息对象  
     // 2. from 从哪里来， 从哪来的路由信息对象
     // 3. next() 是否放行
     //    如果next()调用，就是放行
     //    next(路径) 拦截到某个路径页面
   })
   ```

2. 项目中的使用

   ```js
   const authUrl = ['/pay', '/order']
   router.beforeEach((to, from, next) => {
     const token = store.getters.token
     // 如果目标路由是 /login，直接放行
     if (to.path === '/login') {
       next()
       return
     }
     if (!authUrl.includes(to.path)) {
       next()
       return
     }
   
     if (token) {
       next()
     } else {
       // 如果用户未登录，重定向到 /login，并带上当前路由路径作为查询参数
       next({ path: '/login', query: { backUrl: to.fullPath } })
     }
   })
   
   ```

### 搜索页开发

1. 搜索记录要本地化

2. 如果搜索的是有过记录的商品相当于将历史记录中有的数据又排到前面，方法是找到这个数据然后删除它，在将它添加到数组最前面

3. 搜索商品和点击历史记录的时候要地址栏传参，传递搜索的名称，后端通过名称进行搜索，并且我们前端也可以取出这个参数渲染到搜索栏中

4. 具体操作

   ```js
         // 跳转到搜索到的商品列表页
         this.$router.push(`/seachList?search=${key}`)
         
         // 通过计算属性获取
           computed: {
       // 通过计算属性获得通过地址栏传过来的值
       querySearch () {
         return this.$route.query.search
       },
           //不同的传参方式，实现后面查询商品接口的复用 分类页就是通过分类id查询
       categoryId () {
         return this.$route.query.categoryId
       }
     },
         
         
   ```

5. 按照价格，销量排序 就是通过点击改变 `sortType`状态，在通过`watch`监听这个属性重新拉去请求

#### 注意细节

1. 接口的复用，通过商品名和分类id查询调用的都是同一个接口，只有地址栏中有那个参数到时候就是通过那一个参数查询的

### 商品详情页开发

1. 商品描述 后端传递过来的数据是html格式的,用下面这种形式接收

   `<div class="desc" v-html="detail.content"></div>`

2. 点击不同的按钮触发不同的功能 这个mode参数是后端需要传递的，后面也有作用

   ```js
   <div class="btn-add" @click="addFn">加入购物车</div>
   <div class="btn-buy" @click="buyFn">立刻购买</div>
   
   addFn () {
     this.mode = 'cart'
     this.showPannel = true
   },
   buyFn () {
     this.mode = 'buyNow'
     this.showPannel = true
   }
   ```

3. 封装数字框组件

   ```js
   <template>
       <div class="count-box">
         <button @click="handleSub" class="minus">-</button>
         <input :value="value" @change="handleChange" class="inp" type="text">
         <button @click="handleAdd" class="add">+</button>
       </div>
     </template>
   
   <script>
   export default {
     props: {
       value: {
         type: Number,
         default: 1
       }
     },
     methods: {
       handleSub () {
         if (this.value <= 1) {
           return
         }
         this.$emit('input', this.value - 1)
       },
       handleAdd () {
         this.$emit('input', this.value + 1)
       },
       handleChange (e) {
         // console.log(e.target.value)
         const num = +e.target.value // 转数字处理 (1) 数字 (2) NaN
   
         // 输入了不合法的文本 或 输入了负值，回退成原来的 value 值
         if (isNaN(num) || num < 1) {
           e.target.value = this.value
           return
         }
   
         this.$emit('input', num)
       }
     }
   }
   </script>
   
     <style lang="less" scoped>
     .count-box {
       width: 110px;
       display: flex;
       .add, .minus {
         width: 30px;
         height: 30px;
         outline: none;
         border: none;
         background-color: #efefef;
       }
       .inp {
         width: 40px;
         height: 30px;
         outline: none;
         border: none;
         margin: 0 5px;
         background-color: #efefef;
         text-align: center;
       }
     }
     </style>
   
   ```

4. 如何修改数字框组件中的数据，利用组件通信 v-model 语法可以帮我们很好的解决这个问题

5. 进行加入购物车和立即购买时，需要判断用户是否登录 弹出提示框，如果没有登录需要转跳到登录页面，因为后面还有其他地方也会用到，我们可以使用mixins复用 处理登录确认框的弹出

6. 其他

   - 其实还有很多功能没有开发到，比如在商品详情页点击评论信息，需要一个评论的组件
   - 还有些没讲到的，商品没库存了需要改变底部的按钮

#### mixins 复用 - 处理登录确认框的弹出

>在页面中导入就可以进行混入，相当于将方法挂载到原型对象上

```js
export default {
  methods: {
    // 是否需要弹登录确认框
    // (1) 需要，返回 true，并直接弹出登录确认框
    // (2) 不需要，返回 false
    loginConfirm () {
      if (!this.$store.getters.token) {
        this.$dialog.confirm({
          title: '温馨提示',
          message: '此时需要先登录才能继续操作哦',
          confirmButtonText: '去登陆',
          cancelButtonText: '再逛逛'
        })
          .then(() => {
            // 如果希望，跳转到登录 => 登录后能回跳回来，需要在跳转去携带参数 (当前的路径地址)
            // this.$route.fullPath (会包含查询参数)
            this.$router.replace({
              path: '/login',
              query: {
                backUrl: this.$route.fullPath
              }
            })
          })
          .catch(() => {})
        return true
      }
      return false
    }
  }
}

```

页面中使用

```js
import loginConfirm from '@/mixins/loginConfirm'

export default {
  name: 'ProDetail',
  mixins: [loginConfirm],
  ...
}
```

### 购物车模块的开发

1. 明确一下购物车中的所有数据都是要和后端进行交互得到的，相当于我们在前端界面修改数据，不仅要修改vuex中的数据，还要发送请求到后端进行数据的修改  

2. 进行请求购物车数据的时候首先要判断登录状态，这个在登录成功的时候就将token存入到了全局的vuex中

3. 接下来是复选框选中状态的处理，由于后台返回的数据并没有带有这一信息的数据，所以需要我们手动维护这一数据,这里采用的方法是将所有数据的状态都设置为已选中

   ```                                                                                                                                                                                                      js
     actions: {
       async getCartAction (context) {
         const { data } = await getCartList()
         // 后台返回的数据中，不包含复选框的选中状态，为了实现将来的功能
         // 需要手动维护数据，给每一项，添加一个 isChecked 状态 (标记当前商品是否选中)
         data.list.forEach(item => {
           item.isChecked = true
         })
         context.commit('setCartList', data.list)
       }
   ```

4. 利用计算属性和辅助函数实现，全选和修改购物车

   ```js
     computed: {
       ...mapState('cart', ['cartList']),
       ...mapGetters('cart', ['cartTotal', 'selCartList', 'selCount', 'selPrice', 'isAllChecked']),
       isLogin () {
         return this.$store.getters.token
       }
     },
   ```

5. 点击编辑时，结算变成删除按钮,改变购物车的选中状态，删除时购物车商品为全不选(感觉还是有一些不合理)

   ```js
     watch: {
       isEdit (value) {
         if (value) {
           this.$store.commit('cart/toggleAllCheck', false)
         } else {
           this.$store.commit('cart/toggleAllCheck', true)
         }
       }
     }
   ```

6. 这里也是有数字框组件的使用的，但是这里传递数据的方式不是v-mode了，因为要修改的是vuex中的数据

   ```js
   <CountBox :value="item.goods_num" @input="value => changeCount(value, item.goods_id, item.goods_sku_id)"></CountBox>
   
   changeCount (value, goodsId, skuId) {
     this.$store.dispatch('cart/changeCountAction', {
       value,
       goodsId,
       skuId
     })
   },
   ```

7. 空购物车处理 在外层加个大盒子并添加if判断

   ```js
   <div class="cart-box" v-if="isLogin && cartList.length > 0">
     <!-- 购物车开头 -->
     <div class="cart-title">
       ...
     </div>
     <!-- 购物车列表 -->
     <div class="cart-list">
       ...
     </div>
     <div class="footer-fixed">
       ...
     </div>
   </div>
   
   <div class="empty-cart" v-else>
     <img src="@/assets/empty.png" alt="">
     <div class="tips">
       您的购物车是空的, 快去逛逛吧
     </div>
     <div class="btn" @click="$router.push('/')">去逛逛</div>
   </div>
   
   //相关样式
   .empty-cart {
     padding: 80px 30px;
     img {
       width: 140px;
       height: 92px;
       display: block;
       margin: 0 auto;
     }
     .tips {
       text-align: center;
       color: #666;
       margin: 30px;
     }
     .btn {
       width: 110px;
       height: 32px;
       line-height: 32px;
       text-align: center;
       background-color: #fa2c20;
       border-radius: 16px;
       color: #fff;
       display: block;
       margin: 0 auto;
     }
   }
   ```

### 订单结算模块的开发

1. 对于地址的获取，利用AI自己开发了一个地址界面，感觉还可以

2. 判断是从哪进入的订单结算台的，商品详情的立即购买还是购物车中的结算，不同的进入所对应的参数不同，但是还是用的一样的接口，只是传递的参数不同,通过地址栏传参 获取到后存入计算属性中便于使用

   ```js
     computed: {
       selectedAddress () {
         // 这里地址管理非主线业务，直接获取第一个项作为选中的地址
         return this.addressList[0] || {}
       },
       longAddress () {
         const region = this.selectedAddress.region
         return region.province + region.city + region.region + this.selectedAddress.detail
       },
       mode () {
         return this.$route.query.mode
       },
       cartIds () {
         return this.$route.query.cartIds
       },
       goodsId () {
         return this.$route.query.goodsId
       },
       goodsSkuId () {
         return this.$route.query.goodsSkuId
       },
       goodsNum () {
         return this.$route.query.goodsNum
       }
     },
   ```

### 我的订单模块开发

1. 通过vant-tab切换渲染

   ```js
   <van-tabs v-model="active" sticky>
     <van-tab name="all" title="全部"></van-tab>
     <van-tab name="payment" title="待支付"></van-tab>
     <van-tab name="delivery" title="待发货"></van-tab>
     <van-tab name="received" title="待收货"></van-tab>
     <van-tab name="comment" title="待评价"></van-tab>
   </van-tabs>
   ```

2. 封装展示订单信息的组件，遍历渲染这个组件 这些事件都是接受子组件中的传递过来的

   ```js
           <template v-if="list.length">
             <OrderListItem
               v-for="item in list"
               :key="item.order_id"
               :item="item"
               @click-item="$router.push(`/order/detail/${item.order_id}`)"
               @on-cancel="handleCancel"
               @on-pay="handlePay"
               @on-confirm="handleConfirm"
               @on-comment="handleComment"
             />
           </template>
   ```

3. 组件中有一个事件用于跳转到订单详情,但这组件中还有其他按钮绑定了事件，所以会触发事件冒泡，给其他事件添加的时候要阻止默认冒泡行为`@click.stop`

   ```js
   <div class="order-item" @click="$emit('click-item')">
   ```

   ```js
    <span v-if="item.pay_status === 10" @click.stop="$emit('on-pay', item.order_id)" class="primary urgent">立刻付款</span>
    
   <span v-if="item.delivery_status === 10" @click.stop="$emit('on-cancel',item.order_id)">申请取消</span>
   
   <span v-if="item.delivery_status === 20 || item.delivery_status === 30" @click.stop="$emit('on-confirm', item.order_id)" class="primary">确认收货</span>
   ```

### 个人中心模块的开发

1. 根据提供的静态页面和接口进行动态渲染

2. 登录退出功能,注意的是要将本地的用户信息清除和重新刷新页面

   ```js
   methods: {
     logout () {
       this.$dialog.confirm({
         title: '温馨提示',
         message: '你确认要退出么？'
       })
         .then(() => {
           this.$store.dispatch('user/logout')
         })
         .catch(() => {
   
         })
     }
   }
   
   actions: {
     logout (context) {
       context.commit('setUserInfo', {})
       context.commit('cart/setCartList', [], { root: true })
     }
   },
   ```

## 项目总结

this.$route 是只读的路由信息对象

this.$router 是可操作的路由实例，用于编程式导航

this.$route 用于获取当前路由的信息

this.$router 用于路由跳转和导航控制

当一个模块的数据需要在多个模块共享使用时，最好将数据交给vuex管理

遵循分模块开发的道理，项目的整体业务逻辑并不复杂，主要是巩固vue2的语法和vant2组件库的使用








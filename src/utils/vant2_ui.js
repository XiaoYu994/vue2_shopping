import vue from 'vue'
import {
  Tabbar, TabbarItem, NavBar, Toast, Loading, GridItem,
  Search, Swipe, SwipeItem, Grid, Icon, Rate, ActionSheet,
  Dialog, Checkbox
} from 'vant'

// 按需导入vant 组件 别忘记按照vant 和下载插件 main.js导入
vue.use(Checkbox)
vue.use(Dialog)
vue.use(ActionSheet)
vue.use(Rate)
vue.use(Icon)
vue.use(Grid)
vue.use(SwipeItem)
vue.use(Swipe)
vue.use(Search)
vue.use(GridItem)
vue.use(Loading)
vue.use(Toast)
vue.use(NavBar)
vue.use(Tabbar)
vue.use(TabbarItem)

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// import Recommend from '../components/recommend/recommend'
//   import Disc from '../components/disc/disc'
// import Singer from '../components/singer/singer'
//   import SingerDetail from '../components/singer-detail/singer-detail'
// import Rank from '../components/rank/rank'
// import Search from '../components/search/search'
// import TopList from '../components/top-list/top-list'


export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: ()=>import('../components/recommend/recommend'),
      children: [{
        path:':id',
        component: ()=>import('../components/disc/disc')
      }]
    },
    {
      path: '/singer',
      component: ()=>import('../components/singer/singer'),
      children: [
        { path: ':id',
          component: ()=>import('../components/singer-detail/singer-detail')
        }
      ]
    },
    {
      path: '/rank',
      component: ()=>import('../components/rank/rank'),
      children: [
        {
          path: ':id',
          component: ()=>import('../components/top-list/top-list')
        }
      ]
    },
    {
      path: '/search',
      component:  ()=>import('../components/search/search'),
      children: [
        { path: ':id',
          component: ()=>import('../components/singer-detail/singer-detail')
        } 
      ]
    }
  ]
})

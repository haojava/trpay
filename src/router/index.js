import Vue from 'vue'
import Router from 'vue-router'
import cashier from '@/views/cashier'
import mppay from '@/views/mppay'
import scanpay from '@/views/scanpay'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/cash/',//测试环境“cash”生产环境“/”
  routes: [
    {//公众号支付 https://trpay.7glb.com/#/mp/pay?payNo=2019071017245922420
      path: '/mp/pay',
      name: 'mppay',
      component: mppay
    },
    {//微信扫码支付 http://trpay.7glb.com/#/scan/pay?payNo=2019091017245922522
      path: '/scan/pay',
      name: 'scanpay',
      component: scanpay
    },
    {
      path: '/cashier',
      name: 'cashier',
      component: cashier
    }
  ]
})

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import App from './App'

import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {library, dom} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'

import {router} from './router/index'
import {utils} from "./components/common/utils";
import Header from './components/view/module/Header'
import Footer from './components/view/module/Footer'
//import {i18n} from "./components/common/i18n";

//1、全局变量
Vue.prototype.utils = utils;

//2、模块注册
Vue.component("i-header", Header);
Vue.component("i-footer", Footer);

//3、字体图标注册
library.add(fas);
Vue.component('fa-icon', FontAwesomeIcon);
dom.watch();

//4、配置axios拦截器
Vue.http.interceptors.request.use((config) => {
    //显示加载提示
    if (config.properties.loading !== false) {
        Vue.$vux.loading.show({
            text: config.properties.loadingText || "加载中",
            position: 'middle'
        });
    }
    return config;
}, (error) => {
    Vue.$vux.loading.hide();
    return Promise.reject(error);
});

Vue.http.interceptors.response.use((response) => {

    setTimeout(() => {
        Vue.$vux.loading.hide()
    }, 100);

    if(response.config.properties.verification === false){
        return  "";
    }

    //权限处理
    if (response.status || response.data.state || response.data.success){

        //登录接口
        if(response.data.success){
            return response;
        }
        // dispatcher分发器校验，防止跨站脚本攻击
        if(response.status){
            if(typeof response.data ==="string"){
                return response;
            }
        }
        //其他接口
        if(response.data.state.timeout===true ) {
            Vue.$vux.alert.show({
                title: '提示',
                content: '您的会话已超时，请重新登录！',
                onHide() {
                    router.push({path: '/login'});
                }
            });
            setTimeout(() => {
                Vue.$vux.alert.hide();
            }, 5000);
            return Promise.reject(response.data.state);
        } else  if(response.data.state.errcode===1){
            Vue.$vux.alert.show({
                title: '提示',
                content: response.data.state.errdesc,
            });
            return Promise.reject(response.data.state);
        }else{
            return response;
        }
    }else{
        Vue.$vux.alert.show({
            title: '提示',
            content: '请求错误（格式错误）：'+ JSON.stringify(response.data)
        });
        return Promise.reject(response.data);
    }

}, (error) => {
    Vue.$vux.loading.hide();
    return Promise.reject(error);
});

//5、轮询，防止超时
utils.stayLoggedIn()

//6、TODO


FastClick.attach(document.body);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    router,
    //i18n,暂时不需要国际化
    render: h => h(App)
}).$mount('#app-box');

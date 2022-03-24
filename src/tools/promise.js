import axios from 'axios';
import commonjs from './common.js';
import store from '../store/store';
import router from '../router/router';
import { Message } from 'element-ui'

const axiosDefault = axios.create({
    baseURL: '',
    timeout: 300000
});

// 请求数据之前回调--处理传送固定参数
axiosDefault.interceptors.request.use((config) => {
    //非登录接口添加token属性
    if (config.url.indexOf('login') < 0) {
        //console.log
        config.headers['Authorization'] = store.state.global.token;
    }
    if (config.method === 'post' || config.method === 'patch') {
        config.data = commonjs.urlEncode(config.data).substr(1);
    } else if (config.method === 'get') {

    }
    return config;
});

// 数据返回之后，先拦截处理
let text = '';
axiosDefault.interceptors.response.use((response) => {
    // 对响应数据做点什么
    if (response.data.code != 200) {
        if (response.data.code === 500) {
            text = response.data.message
        } else {
            switch (response.data.code) {
                case 4030:
                    text = '用户身份失效,请重新登录';
                    localStorage.removeItem('smartAdPlatformId');//清除ls用户数据
                    store.commit('removeUser');//清除vuex用户数据
                    //跳转到登录
                    router.push('/login');
                    break;
                case 401:
                    text = '用户身份失效,请重新登录';
                    localStorage.removeItem('smartAdPlatformId');//清除ls用户数据
                    store.commit('removeUser');//清除vuex用户数据
                    //跳转到登录
                    router.push('/login');
                    break;
                case 403:
                    text = false;
                    router.push('/notFound?type=noAuthority');
                    break;
                default:
                    text = response.data.msg;//"系统异常，请联系客服"
            }
        }
        if (!text) return response;
        Message.error(text);
    }
    return response;
}, (error) => {
    if (error.response.config.url !== 'login') {
        if (!store.state.global.token) return;
    }
    switch (error.response.status) {
        case 4030:
            text = '用户身份失效,请重新登录';
            //跳转到登录
            router.push('/login');
            break;
        case 401:
            text = false;
            //跳转到登录
            router.push({
                path: '/notFound',
                query: {
                    type: 'noAuthority'
                }
            });
            break;
        default:
            text = '数据请求有误，请联系技术人员';
            break;
    }
    Message.error(text);
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default axiosDefault;



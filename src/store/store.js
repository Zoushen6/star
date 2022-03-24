import Vue from 'vue'
import Vuex from 'vuex'
import http from "@tools/promise.js";
import {STATUS_EMPTY} from "@/views/Idea/Order/StatusPool.js"
import {asyncRoutes, constantRoutes, resetRouter} from "@/router/router";
import {GetUserOpMask, NONE_OP_MASK} from "@config/OrderAuthority";
import {GetUserRouteMask, GetRole, ALL_ROUTE_MASK} from "@config/RouteAuth";

Vue.use(Vuex);

//全局应用数据
const Global = {
    state: {
        username: '帅气的名字', //用户昵称
        name:'', //用户真实名字
        userType: ALL_ROUTE_MASK, //计算后的用户ID
        userTypeRaw: 0, //计算前用户ID
        userTypeRoute: ALL_ROUTE_MASK, //计算后的routeID
        userOrderAuth: NONE_OP_MASK, //计算后的routeID
        token: null,
        loginTime: 0, //用户登录次数
    },
    mutations: {
        //设定用户名称
        setUsername(state, data) {
            state.username = data;
        },
        //设定用户姓名
        setName(state, data) {
            state.name = data;
        },
        //设定用户类型
        setUserType(state, data) {
            const role = GetRole(data);
            state.userTypeRaw = role;
            state.userTypeRoute = GetUserRouteMask(role);
            state.userType = state.userTypeRoute;
            state.userOrderAuth = GetUserOpMask(state.userTypeRoute);
        },
        //设定用户token
        setToken(state, data) {
            state.token = data;
        },
        //清除用户数据
        removeUser(state) {
            state.username = '';
            state.userType = '';
            state.userTypeRaw = 0;
            state.token = '';
            state.loginTime = 0;
            state.userTypeRoute = 0;
            state.userOrderAuth = 0;
        },
        setLoginTime(state,data){
            state.loginTime = data;
        },
    },

    actions: {
        getUserInfo({commit}){
            return new Promise(resolve => {
                http.get("user/profile",{}).then((res) => {
                    if (res.data.code === 200) {
                        //保存数据到store
                        commit('setUsername', res.data.data.username);
                        commit('setName', res.data.data.name);
                        commit('setUserType', res.data.data.role_id);
                    }
                    resolve();
                });
            })
        }
    }
};


const Order = {
    state: {
        curStatus: STATUS_EMPTY,
        curStatusValue:'',
    },
    mutations: {
        setOrderStatus(state, data) {
            state.curStatus = data;
        },
        setOrderStatusValue(state, data) {
            state.curStatusValue = data;
        },
    },

    actions: {}
};

const Menu = {
    state: {
        activeHeaderIndex: []
    },
    mutations: {
        setActiveHeaderIndex(state, data) {
            state.activeHeaderIndex = data.split('/');
        }
    },
    actions: {}
};

const Checkbox = {
    state: {
        checkedValue:[],
        checkbox:[]
    },
    mutations: {
        setCheckedValue(state, data) {
            state.checkedValue = data;
        },
        setCheckbox(state,data){
            state.checkbox = data;
        }
    },
    actions:{}
};

function hasPermission(roles, route) {
    return roles & route.meta.auth;
}

export function filterAsyncRoutes(routes, roles) {
    const res = []

    routes.forEach(route => {
        const tmp = {...route}
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
            res.push(tmp)
        }
    })

    return res
}

const Routes = {
    state: {
        routes: [],
        addRoutes: []
    },
    mutations: {
        setRoutes: (state, routes) => {
            state.addRoutes = routes
            state.routes = constantRoutes.concat(routes)
        },
        removeRoutes:(state)=>{
            state.addRoutes = [];
            state.routes = [];
            resetRouter();
        }
    },

    actions: {
        generateRoutes({ commit }, roles) {
            return new Promise(resolve => {
                let accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
                commit('setRoutes', accessedRoutes);
                resolve(accessedRoutes)
            })
        }
    }
};

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        global: Global,
        order: Order,
        menu: Menu,
        route: Routes,
        checkedValue: Checkbox
    }
})

import Vue from 'vue'
import Router from 'vue-router'
import {
    ADMIN_ROUTE_MASK,
    ALL_ROUTE_MASK,
    FINANCE_CENTER_ROUTE_MASK,
    MANAGERS_ROUTE_MASK
} from "@config/RouteAuth";
import {redirectIndex} from "@router/redirect";

const Login = () => import('@/views/Login.vue');
const Index = () => import('@/views/Index.vue');
const notFound = () => import('@/views/404.vue');

const User = () => import('@views/Settings/User/User.vue');
const Idea = () => import('@views/Idea/Idea');
const Order = () => import('@/views/Idea/Order/Order.vue');
const OrderDetail = () => import('@/views/Idea/OrderDetail/OrderDetail.vue');
const VideoTable = () => import('@/views/Idea/Order/VideoTable.vue');
const OrderTable = () => import('@/views/Idea/Order/OrderTable.vue');
const Guide = () => import('@/views/Guide/Guide.vue');

const Data = () => import('@/views/Data/Data.vue');
const Rank = () => import('@/views/Rank/Rank.vue');

const Settings = () => import('@/views/Settings/Settings.vue');
const IndustrySetting = () => import('@/views/Settings/IndustrySetting.vue');
const ProductionSetting = () => import('@/views/Settings/ProductionSetting.vue');
const MediaSetting = () => import('@/views/Settings/MediaSetting.vue');
const TeamSetting = () => import('@/views/Settings/TeamSetting.vue');
const OperateLog = () => import('@/views/Settings/OperateLog.vue');

const Material = () => import('@/views/Idea/Material/Material.vue')
const MaterialLibrary = () => import('@/views/Idea/Material/MaterialLibrary.vue')
const UploadMaterial = () => import('@/views/Idea/Material/UploadMaterial/UploadMaterial.vue')

const Finance = () => import('@/views/Finance/Finance.vue')
const SummaryReport = () => import('@views/Finance/BasicReport/SummaryReport/SummaryReport.vue')
const BalanceQuery = () => import('@views/Finance/BalanceReport/BalanceQuery/BalanceQuery.vue')
const QuotaQuery = () => import('@views/Finance/BalanceReport/QuotaQuery/QuotaQuery.vue')
const AdStreamReport = () => import('@views/Finance/AdStreamReport/AdStreamReport.vue')
const QianChuanReport = () => import('@views/Finance/AdStreamReport/QianChuanReport.vue')
const TransferStreamReport = () => import('@views/Finance/TransferStreamReport/TransferStreamReport.vue')
const SettlementReport = () => import('@views/Finance/SettlementReport/SettlementReport.vue')
const DownloadCenter = () => import('@views/DownloadCenter/DownloadCenter.vue')
const HomePage = () => import('@views/Finance/HomePage/HomePage.vue')
const PlanReport = () => import('@views/Finance/BasicReport/PlanReport/PlanReport.vue')
const ConsumeReport = () => import('@views/Finance/BasicReport/ConsumeReport/ConsumeReport.vue')
const StarMapReport = () => import('@views/Finance/BasicReport/StarMapReport/StarMapReport.vue')

const Popular = () => import('@/views/Popular/Popular.vue')
const SmartCreate = () => import('@/views/Popular/SmartCreate/SmartCreate.vue')
const PopPlanReport = () => import('@/views/Popular/PopPlanReport/PopPlanReport.vue')
const AudienceAnalysis = () => import('@/views/Popular/AudienceAnalysis/AudienceAnalysis.vue')


Vue.use(Router);
/**
 * 权限配置说明：
 * 每个路由页面需要在meta中添加authority参数，不然无法显示
 * authority:1>管理员(默认所以权限，可不加)
 admin 1 管理员
 operator 2 运营
 */
export const asyncRoutes = [
    {
        path: '/',
        name: 'index',
        component: Index,
        redirect: redirectIndex,
        meta: {auth: ALL_ROUTE_MASK},
        children: [
            {
                path: 'idea',
                name: 'idea',
                component: Idea,
                redirect: {name: 'order'},
                meta: {auth: ALL_ROUTE_MASK},
                children: [
                    {
                        path: 'order',
                        name: 'order',
                        component: Order,
                        redirect: {name: 'orderTable'},
                        meta: {auth: ALL_ROUTE_MASK},
                        children: [
                            {
                                path: 'orderTable',
                                name: 'orderTable',
                                component: OrderTable,
                                meta: {auth: ALL_ROUTE_MASK}
                            }, {
                                path: 'videoTable',
                                name: 'videoTable',
                                component: VideoTable,
                                meta: {auth: ALL_ROUTE_MASK}
                            }
                        ]
                    }, {
                        path: 'orderDetail',
                        name: 'orderDetail',
                        component: OrderDetail,
                        meta: {auth: ALL_ROUTE_MASK}
                    }, {
                        path: 'material',
                        name: 'material',
                        component: Material,
                        redirect: {name: 'videoLibrary'},
                        children: [
                            {
                                path: 'videoLibrary',
                                name: 'videoLibrary',
                                component: MaterialLibrary,
                                meta: {auth: ALL_ROUTE_MASK},
                                props: {isVideo: true}
                            }, {
                                path: 'pictureLibrary',
                                name: 'pictureLibrary',
                                component: MaterialLibrary,
                                meta: {auth: ALL_ROUTE_MASK},
                                props: {isVideo: false}
                            }, {
                                path: 'uploadMaterial',
                                name: 'uploadMaterial',
                                component: UploadMaterial,
                                meta: {auth: ALL_ROUTE_MASK}
                            }
                        ],
                        meta: {auth: ALL_ROUTE_MASK}
                    },
                ]
            }, {
                path: 'guide',
                name: 'guide',
                component: Guide,
                meta: {auth: ALL_ROUTE_MASK}
            }, {
                path: 'rank',
                name: 'rank',
                component: Rank,
                meta: {auth: ALL_ROUTE_MASK}
            }, {
                path: 'settings',
                name: 'settings',
                component: Settings,
                redirect: {name: 'user'},
                children: [
                    {
                        path: 'industrySetting',
                        name: 'industrySetting',
                        component: IndustrySetting,
                        meta: {
                            auth: MANAGERS_ROUTE_MASK
                        }
                    }, {
                        path: 'productionSetting',
                        name: 'productionSetting',
                        component: ProductionSetting,
                        meta: {auth: MANAGERS_ROUTE_MASK}
                    }, {
                        path: 'mediaSetting',
                        name: 'mediaSetting',
                        component: MediaSetting,
                        meta: {auth: MANAGERS_ROUTE_MASK}
                    }, {
                        path: 'teamSetting',
                        name: 'teamSetting',
                        component: TeamSetting,
                        meta: {auth: ADMIN_ROUTE_MASK}
                    }, {
                        path: 'operateLog',
                        name: 'operateLog',
                        component: OperateLog,
                        meta: {auth: ADMIN_ROUTE_MASK}
                    }, {
                        path: 'user',
                        name: 'user',
                        component: User,
                        meta: {auth: MANAGERS_ROUTE_MASK}
                    }
                ],
                meta: {auth: MANAGERS_ROUTE_MASK}
            }, {
                path: 'finance',
                name: 'finance',
                component: Finance,
                redirect: {name: 'homePage'},
                children: [
                    {
                        path: 'homePage',
                        name: 'homePage',
                        component: HomePage,
                        meta: {auth: FINANCE_CENTER_ROUTE_MASK}
                    }, {
                        path: 'summaryReport',
                        name: 'summaryReport',
                        component: SummaryReport,
                        meta: {auth: FINANCE_CENTER_ROUTE_MASK}
                    }, {
                        path: 'planReport',
                        name: 'planReport',
                        component: PlanReport,
                        meta: {auth: FINANCE_CENTER_ROUTE_MASK}
                    }, {
                        path: 'consumeReport',
                        name: 'consumeReport',
                        component: ConsumeReport,
                        meta: {auth: FINANCE_CENTER_ROUTE_MASK}
                    }, {
                        path: 'starMapReport',
                        name: 'starMapReport',
                        component: StarMapReport,
                        meta: {auth: FINANCE_CENTER_ROUTE_MASK}
                    },
                    {
                        path: 'balanceQuery',
                        name: 'balanceQuery',
                        component: BalanceQuery,
                        meta: {auth: FINANCE_CENTER_ROUTE_MASK},
                    }, {
                        path: 'quotaQuery',
                        name: 'quotaQuery',
                        component: QuotaQuery,
                        meta: {auth: FINANCE_CENTER_ROUTE_MASK},
                    }, {
                        path: 'adStreamReport',
                        name: 'adStreamReport',
                        component: AdStreamReport,
                        meta: {auth: FINANCE_CENTER_ROUTE_MASK},
                    }, {
                        path: 'qianChuanReport',
                        name: 'qianChuanReport',
                        component: QianChuanReport,
                        meta: {auth: FINANCE_CENTER_ROUTE_MASK},
                    }, {
                        path: 'transferStreamReport',
                        name: 'transferStreamReport',
                        component: TransferStreamReport,
                        meta: {auth: FINANCE_CENTER_ROUTE_MASK},
                    }, {
                        path: 'settlementReport',
                        name: 'settlementReport',
                        component: SettlementReport,
                        meta: {auth: FINANCE_CENTER_ROUTE_MASK},
                    }
                ],
                meta: {auth: FINANCE_CENTER_ROUTE_MASK}
            },
            {
                path: 'popular',
                name: 'popular',
                component: Popular,
                redirect: {name: 'smartCreate'},
                children: [
                    {
                        path: 'smartCreate',
                        name: 'smartCreate',
                        component: SmartCreate,
                        meta: {auth: FINANCE_CENTER_ROUTE_MASK}
                    }, {
                        path: 'popPlanReport',
                        name: 'popPlanReport',
                        component: PopPlanReport,
                        meta: {auth: FINANCE_CENTER_ROUTE_MASK}
                    }, {
                        path: 'audienceAnalysis',
                        name: 'audienceAnalysis',
                        component: AudienceAnalysis,
                        meta: {auth: FINANCE_CENTER_ROUTE_MASK}
                    }
                ],
                meta: {auth: FINANCE_CENTER_ROUTE_MASK}
            }, {
                path: 'downloadCenter',
                name: 'downloadCenter',
                component: DownloadCenter,
                meta: {auth: ALL_ROUTE_MASK},
            }
        ]
    }, {
        path: '/data',
        name: 'data',
        component: Data,
        meta: {auth: ALL_ROUTE_MASK}
    }, {
        path: '*',
        name: 'notFound',
        component: notFound,
        meta: {auth: ALL_ROUTE_MASK}
    }
];

export const constantRoutes = [
    {
        path: '/login',
        name: 'login',
        component: Login,
    }
];


const createRouter = () => new Router({
    routes: constantRoutes
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher;// reset router
}


// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
// push
const VueRouterPush = Router.prototype.push;
Router.prototype.push = function push(to) {
    return VueRouterPush.call(this, to).catch(err => err)
};

// replace
const VueRouterReplace = Router.prototype.replace;
Router.prototype.replace = function replace(to) {
    return VueRouterReplace.call(this, to).catch(err => err)
};

export default router

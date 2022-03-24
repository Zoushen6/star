import {ADMIN_ROUTE_MASK, EXCLUDE_FINANCE_ROUTE_MASK, MANAGERS_ROUTE_MASK,FINANCE_CENTER_ROUTE_MASK} from "@config/RouteAuth";

export const AUTH_MENU_LIST = [
    {
        title: "我的资料",
        iconfont: "profile"
    },
    {
        title: "修改密码",
        iconfont: "password"
    },
    {
        title: "下载中心",
        iconfont: "download-center"
    },
    {
        title: "退出登录",
        iconfont: "exit"
    },

];

export const HEADER_MENU_LIST = [
    {
        authority: EXCLUDE_FINANCE_ROUTE_MASK,
        path: "idea",
        title: "创意中心",
    },
    {
        authority: EXCLUDE_FINANCE_ROUTE_MASK,
        path: "rank",
        title: "数据中心"
    },
    {
        authority: EXCLUDE_FINANCE_ROUTE_MASK,
        path: "data",
        title: "数据大屏"
    },
    {
        authority: MANAGERS_ROUTE_MASK,
        path: "settings",
        title: "工具"
    },
    {
        authority: FINANCE_CENTER_ROUTE_MASK,
        path: "finance",
        title: "财务中心"
    },
    {
        authority: FINANCE_CENTER_ROUTE_MASK,
        path: "popular",
        title: "推广"
    },
];

export const SETTINGS_MENU_LIST = [
    {
        authority: MANAGERS_ROUTE_MASK,
        path: "user",
        title: "账号管理",
        iconfont: "icon-account"
    },
    {
        authority: MANAGERS_ROUTE_MASK,
        title: "配置管理",
        path: "settings",
        iconfont: "icon-setting",
        children: [
            {
                authority: MANAGERS_ROUTE_MASK,
                title: "行业",
                path: "industrySetting"
            },
            {
                authority: MANAGERS_ROUTE_MASK,
                title: "产品",
                path: "productionSetting"
            },
            {
                authority: MANAGERS_ROUTE_MASK,
                title: "媒体",
                path: "mediaSetting"
            },
            {
                authority: ADMIN_ROUTE_MASK,
                title: "团队/部门",
                path: "teamSetting"
            },
        ]
    },
    {
        authority: ADMIN_ROUTE_MASK,
        path: "operateLog",
        title: "操作日志",
        iconfont: "icon-operate-log"
    }
];

export const MATERIAL_LIST = [
    {
        authority: EXCLUDE_FINANCE_ROUTE_MASK,
        title: "视频库",
        iconfont: "icon-video",
        path: "videoLibrary"
    },
    {
        authority: EXCLUDE_FINANCE_ROUTE_MASK,
        title: "图片库",
        iconfont: "icon-picture",
        path: "pictureLibrary"
    }
];

export const FINANCE_CENTER_LIST = [
    {
        authority: FINANCE_CENTER_ROUTE_MASK,
        title: "数据总览",
        iconfont: "icon-first-page",
        path: "homePage",
    },
    {
        authority: FINANCE_CENTER_ROUTE_MASK,
        title: "基础报表",
        iconfont: "icon-basics",
        path: "basicStatements",
        children: [
            {
                authority: FINANCE_CENTER_ROUTE_MASK,
                title: "汇总报表",
                path: "summaryReport"
            },
            {
                authority: FINANCE_CENTER_ROUTE_MASK,
                title: "计划报表",
                path: "planReport"
            },
            {
                authority: FINANCE_CENTER_ROUTE_MASK,
                title: "消耗报表",
                path: "consumeReport"
            },
            {
                authority: FINANCE_CENTER_ROUTE_MASK,
                title: "星图报表",
                path: "starMapReport"
            },
        ]
    }, {
        authority: FINANCE_CENTER_ROUTE_MASK,
        title: "余额报表",
        iconfont: "icon-balance",
        path: "finance",
        children: [
            {
                authority: FINANCE_CENTER_ROUTE_MASK,
                title: "余额查询",
                path: "balanceQuery"
            },{
                authority: FINANCE_CENTER_ROUTE_MASK,
                title: "额度查询",
                path: "quotaQuery"
            },
        ]
    },
    {
        authority: FINANCE_CENTER_ROUTE_MASK,
        title: "广告主流水报表",
        iconfont: "icon-ad-stream",
        path: "adStreamReport",
    }, {
        authority: FINANCE_CENTER_ROUTE_MASK,
        title: "转账流水报表",
        iconfont: "icon-transfer-accounts",
        path: "transferStreamReport",
    },{
        authority: FINANCE_CENTER_ROUTE_MASK,
        title: "返点结算行业报表",
        iconfont: "icon-settlement",
        path: "settlementReport",
    }
];

export const POPULAR_LIST = [
    {
        authority: FINANCE_CENTER_ROUTE_MASK,
        title: "智能创建",
        iconfont: "icon-first-page",
        path: "smartCreate",
    },{
        authority: FINANCE_CENTER_ROUTE_MASK,
        title: "计划报表",
        iconfont: "icon-first-page",
        path: "popPlanReport",
    },
]

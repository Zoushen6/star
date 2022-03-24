export let materialList = [
    {
        value: '小图',
        id: "CREATIVE_IMAGE_MODE_SMALL"
    },
    {
        value: '大图',
        id: "CREATIVE_IMAGE_MODE_LARGE"
    },
    {
        value: '组图',
        id: "CREATIVE_IMAGE_MODE_GROUP"
    },
    {
        value: '横版视频',
        id: "CREATIVE_IMAGE_MODE_VIDEO"
    },
    {
        value: 'GIF图',
        id: "CREATIVE_IMAGE_MODE_GIF"
    },
    {
        value: '大图竖图',
        id: "CREATIVE_IMAGE_MODE_LARGE_VERTICAL"
    },
    {
        value: '竖版视频',
        id: "CREATIVE_IMAGE_MODE_VIDEO_VERTICAL"
    },{
        value: '搜索大图',
        id: "TOUTIAO_SEARCH_AD_IMAGE"
    },
    {
        value: '搜索小图',
        id: "SEARCH_AD_SMALL_IMAGE"
    },
    {
        value: '穿山甲开屏图片',
        id: "CREATIVE_IMAGE_MODE_UNION_SPLASH"
    },
    {
        value: '穿山甲开屏视屏',
        id: "CREATIVE_IMAGE_MODE_UNION_SPLASH_VIDEO"
    },
    {
        value: '搜索橱窗',
        id: "CREATIVE_IMAGE_MODE_DISPLAY_WINDOW"
    },
    {
        value: '标题类型',
        id: "MATERIAL_IMAGE_MODE_TITLE"
    },
    {
        value: '直播画面类型',
        id: "CREATIVE_IMAGE_MODE_AWEME_LIVE"
    },
    {
        value: '横版试玩素材类型',
        id: "CREATIVE_IMAGE_MODE_PLAYABLE_HORIZONTAL"
    },
    {
        value: '竖版试玩素材类型',
        id: "CREATIVE_IMAGE_MODE_PLAYABLE_VERTICAL"
    },
];

export let channelList = [
    {
        value:"头条",
        id:"INVENTORY_FEED"
    },
    {
        value:"西瓜视频",
        id:"INVENTORY_VIDEO_FEED"
    },
    {
        value:"火山视频",
        id:"INVENTORY_HOTSOON_FEED"
    },
    {
        value:"抖音",
        id:"INVENTORY_AWEME_FEED"
    },
    {
        value:"穿山甲",
        id:"INVENTORY_UNION_SLOT"
    },
    {
        value:"ohayoo精品游戏",
        id:"UNION_BOUTIQUE_GAME"
    },
    {
        value:"穿山甲开屏广告",
        id:"INVENTORY_UNION_SPLASH_SLOT"
    },
    {
        value:"搜索广告——抖音位",
        id:"INVENTORY_AWEME_SEARCH"
    },
    {
        value:"搜索广告——头条位",
        id:"INVENTORY_SEARCH"
    },
    {
        value:"通投智选",
        id:"INVENTORY_UNIVERSAL"
    },
    {
        value:"轻颜相机",
        id:"INVENTORY_BEAUTY"
    },
    {
        value:"皮皮虾",
        id:"INVENTORY_PIPIXIA"
    },
    {
        value:"懂车帝",
        id:"INVENTORY_AUTOMOBILE"
    },
    {
        value:"好好学习",
        id:"INVENTORY_STUDY"
    },
    {
        value:"faceu",
        id:"INVENTORY_FACE_U"
    },
    {
        value:"番茄小说",
        id:"INVENTORY_TOMATO_NOVEL"
    },
];

export let consumptionList = [
    {
        value: '总消耗(广告主)',
        id: "ad_cost"
    },
    {
        value: '总消耗(计划)',
        id: "cost"
    },
    {
        value: '非赠款消耗',
        id: "un_grants_cost"
    },
    {
        value: '赠款消耗',
        id: "grants_cost"
    },
    {
        value: '代理商业绩消耗',
        id: "agent_cost"
    }
];

export let intervalList = [
    {
        value: '>',
    },
    {
        value: '<',
    },
    {
        value: '=',
    }
];

export let planList = [
    {
        value: '广告主客户',
        id: 'advertiser_customer'
    },
    {
        value: '计划ID',
        id: 'ad_id'
    },
    {
        value: '广告主账户或ID',
        id: 'advertiser_id'
    }
];

export let header = [
    {
        "prop": "stat_datetime",
        "label": "统计时间",
        "sortable": "descending",
        "fixed": true,
        "minWidth": "100",
        "checkBoxDisabled": true
    },
    {
        "prop": "ad_id",
        "label": "计划ID",
        "fixed": true,
        "minWidth": "200",
        "checkBoxDisabled": true,
    },
    {
        "prop": "ad_name",
        "label": "计划名称",
        "fixed": true,
        "minWidth": "200",
        "checkBoxDisabled": true,
    },
    {
        "prop": "start_time",
        "label": "起始时间",
        "minWidth": "160",
    },
    {
        "prop": "end_time",
        "label": "截止时间",
        "minWidth": "160",
    },
    {
        "prop": "advertiser_id",
        "label": "广告主账户ID",
        "minWidth": "200",
    },
    {
        "prop": "advertiser_name",
        "label": "广告主账户",
        "minWidth": "200",
    },
    {
        "prop": "advertiser_industry",
        "label": "广告主行业",
        "minWidth": "180",
    },
    {
        "prop": "customer_name",
        "label": "广告主客户",
        "minWidth": "150",
    },
    {
        "prop": "first_industry_name",
        "label": "客户一级行业",
        "minWidth": "150",
    },
    {
        "prop": "second_industry_name",
        "label": "客户二级行业",
        "minWidth": "150",
    },
    {
        "prop": "image_mode",
        "label": "素材类型",
        "minWidth": "80",
    },
    {
        "prop": "agent_name",
        "label": "代理商账户",
        "minWidth": "180",
    },
    {
        "prop": "agent_customer_name",
        "label": "代理商客户",
        "minWidth": "180",
    },
    {
        "prop": "inventory",
        "label": "投放平台",
        "minWidth": "120",
    },
    {
        "prop": "ad_type",
        "label": "广告类型",
        "minWidth": "80",
    },
    {
        "prop": "cost",
        "label": "总消耗(计划)",
        "minWidth": "150",
        "sortable": "descending"
    },
    {
        "prop": "ad_cost",
        "label": "总消耗(广告主)",
        "minWidth": "150",
        "sortable": "descending"
    },
    {
        "prop": "un_grants_cost",
        "label": "非赠款消耗",
        "minWidth": "150",
        "sortable": "descending"
    },
    {
        "prop": "grants_cost",
        "label": "赠款消耗",
        "minWidth": "150",
        "sortable": "descending"
    },
    {
        "prop": "agent_cost",
        "label": "代理商业绩消耗",
        "minWidth": "180",
        "sortable": "descending"
    },
    {
        "prop": "industry_settlement_type",
        "label": "结算行业统计类型",
        "minWidth": "200",
    },{
        "prop": "industry_settlement_first",
        "label": "当月结算一级行业",
        "minWidth": "180",
    },{
        "prop": "industry_settlement_second",
        "label": "当月结算二级行业",
        "minWidth": "180",
    },{
        "prop": "industry_settlement_category",
        "label": "结算行业内部行业分类",
        "minWidth": "200",
    },{
        "prop": "show",
        "label": "展示数",
        "minWidth": "80",
    },{
        "prop": "avg_show_cost",
        "label": "平均千次展现成本(元)",
        "minWidth": "180",
    },{
        "prop": "click",
        "label": "点击量",
        "minWidth": "80",
    },{
        "prop": "avg_click_cost",
        "label": "平均点击单价(元)",
        "minWidth": "150",
    },{
        "prop": "ctr",
        "label": "点击率",
        "minWidth": "80",
    },{
        "prop": "convert",
        "label": "转化数",
        "minWidth": "80",
    },{
        "prop": "convert_cost",
        "label": "转化成本",
        "minWidth": "120",
    },{
        "prop": "convert_rate",
        "label": "转化率",
        "minWidth": "80",
    },{
        "prop": "inventory",
        "label": "投放位置",
        "minWidth":  "180",
    },{
        "prop": "landing_type",
        "label": "推广目的",
    },{
        "prop": "total_play",
        "label": "播放数",
        "minWidth":  "80",
    },{
        "prop": "valid_play",
        "label": "有效播放数",
        "minWidth": "120",
    },{
        "prop": "valid_play_cost",
        "label": "有效播放成本",
        "minWidth": "120",
    },{
        "prop": "valid_play_rate",
        "label": "有效播放率",
        "minWidth": "120",
    },{
        "prop": "message_action",
        "label": "私信数",
        "minWidth": "80",
    },{
        "prop": "like",
        "label": "点赞数",
        "minWidth": "80",
    },{
        "prop": "comment",
        "label": "评论数",
        "minWidth": "80",
    },{
        "prop": "follow",
        "label": "新增关注数",
        "minWidth": "120",
    },{
        "prop": "share",
        "label": "分享数",
        "minWidth": "80",
    }
];

export const FixedHeaderProp = ["stat_datetime","ad_id","ad_name"];

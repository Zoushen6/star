export let planList = [
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
        "minWidth": "160",
        "fixed": true,
        "checkBoxDisabled": true
    },
    {
        "prop": "ad_name",
        "label": "计划名称",
        "minWidth": "160",
        "fixed": true,
        "checkBoxDisabled": true
    },
    {
        "prop": "ad_start_time",
        "label": "起始时间",
        "minWidth": "200",
    },
    {
        "prop": "ad_end_time",
        "label": "截止时间",
        "minWidth": "200",
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
        "prop": "agent_name",
        "label": "代理商账户",
        "minWidth": "150",
    },
    {
        "prop": "agent_customer_name",
        "label": "代理商客户",
        "minWidth": "150",
    },
    {
        "prop": "cost",
        "label": "总消耗",
        "minWidth": "120",
        "sortable": "descending",
    },
    {
        "prop": "show",
        "label": "展示数",
        "minWidth": "80",
    },
    {
        "prop": "avg_show_cost",
        "label": "平均千次展现成本(元)",
        "minWidth": "180",
    },
    {
        "prop": "click",
        "label": "点击量",
        "minWidth": "80",
    },
    {
        "prop": "avg_click_cost",
        "label": "平均点击单价(元)",
        "minWidth": "180",
    },
    {
        "prop": "ctr",
        "label": "点击率",
        "minWidth": "120",
        "sortable": "descending"
    },
    {
        "prop": "convert",
        "label": "转化数",
        "minWidth": "120",
        "sortable": "descending"
    },
    {
        "prop": "convert_cost",
        "label": "转化成本",
        "minWidth": "100",
        "sortable": "descending"
    },
    {
        "prop": "convert_rate",
        "label": "转化率",
        "minWidth": "120",
        "sortable": "descending"
    },
    {
        "prop": "total_play",
        "label": "播放数",
        "minWidth": "120",
        "sortable": "descending"
    },
    {
        "prop": "valid_play",
        "label": "有效播放数",
        "minWidth": "100",
    },
    {
        "prop": "valid_play_rate",
        "label": "有效播放率",
        "minWidth": "100",
    },
    {
        "prop": "valid_play_cost",
        "label": "有效播放成本",
        "minWidth": "120",
    },
    {
        "prop": "message_action",
        "label": "私信数",
        "minWidth": "80",
    },
    {
        "prop": "like",
        "label": "点赞数",
        "minWidth": "80",
    },
    {
        "prop": "comment",
        "label": "评论数",
        "minWidth": "80",
    },
    {
        "prop": "follow",
        "label": "新增关注数",
        "minWidth": "120",
    },
    {
        "prop": "share",
        "label": "分享数",
        "minWidth": "80",
    },
    {
        "prop": "inventory",
        "label": "投放平台",
        "minWidth": "80",
    }
];
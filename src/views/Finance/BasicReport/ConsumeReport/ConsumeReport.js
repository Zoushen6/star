export let planList = [
    {
        value: '广告主账户或ID',
        id: 'advertiser_id'
    },
    {
        value: '广告主客户',
        id: 'advertiser_customer'
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
        "prop": "advertiser_id",
        "label": "广告主账户ID",
        "minWidth": "200",
        "fixed": true,
        "checkBoxDisabled": true
    },
    {
        "prop": "advertiser_name",
        "label": "广告主账户",
        "minWidth": "200",
        "fixed": true,
        "checkBoxDisabled": true
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
        "prop": "child_agent_name",
        "label": "子代理商账户名称",
        "minWidth": "180",
    },
    {
        "prop": "agent_name",
        "label": "代理商账户名称",
        "minWidth": "180",
    },
    {
        "prop": "agent_customer_name",
        "label": "代理商客户名称",
        "minWidth": "180",
    },
    {
        "prop": "inventory",
        "label": "投放平台",
        "minWidth": "120",
    },
    {
        "prop": "cost",
        "label": "总消耗",
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
    },
    {
        "prop": "industry_settlement_first",
        "label": "当月结算一级行业",
        "minWidth": "180",
    },
    {
        "prop": "industry_settlement_second",
        "label": "当月结算二级行业",
        "minWidth": "180",
    },
    {
        "prop": "industry_settlement_category",
        "label": "结算行业内部行业分类",
        "minWidth": "200",
    }
];
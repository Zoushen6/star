export let header = [
    {
        "prop": "advertiser_id",
        "label": "广告主ID",
        "fixed": true,
        "width": "160",
    },
    {
        "prop": "advertiser_name",
        "label": "广告主名称",
        "fixed": true,
        "width": "200",
    },
    {
        "prop": "agent_id",
        "label": "代理商ID",
        "width": "200",
    },
    {
        "prop": "agent_name",
        "label": "代理商账户",
        "width": "160",
    },
    {
        "prop": "agent_child_id",
        "label": "代理商子账户ID",
        "width": "160",
    },
    {
        "prop": "agent_child_name",
        "label": "代理商子账户名称",
        "width": "200",
    },
    {
        "prop": "company_id",
        "label": "所属公司ID",
        "width": "200",
    },
    {
        "prop": "company_name",
        "label": "所属公司名",
        "width": "180",
    },
    {
        "prop": "customer_id",
        "label": "广告主客户ID",
        "width": "150",
    },
    {
        "prop": "customer_name",
        "label": "广告主客户名称",
        "width": "150",
    },
    {
        "prop": "top_adid",
        "label": "TOP消耗ADID",
        "width": "150",
    },
    {
        "prop": "of_first_industry_name",
        "label": "所属一级行业",
        "width": "120",
    },
    {
        "prop": "of_second_industry_name",
        "label": "所属二级行业",
        "width": "120",
    },
    {
        "prop": "cur_first_industry_name",
        "label": "当前级结算一级行业",
        "width": "180",
    },
    {
        "prop": "cur_second_industry_name",
        "label": "当前结算二级行业",
        "width": "120",
    },
    {
        "prop": "pre_first_industry_name",
        "label": "上季度结算一级行业",
        "width": "150",
    },
    {
        "prop": "pre_second_industry_name",
        "label": "上季度结算二级行业",
        "width": "150",
    },
    {
        "prop": "pre_industry_is_fit",
        "label": "上季度行业是否一致",
        "width": "150",
    },
    {
        "prop": "pre_policy_is_fit",
        "label": "上季度政策是否一致",
        "width": "150",
    },
    {
        "prop": "cur_industry_is_fit",
        "label": "本季度行业是否一致",
        "width": "150",
    },
    {
        "prop": "cur_policy_is_fit",
        "label": "本季度政策是否一致",
        "width": "180",
    },
    {
        "prop": "cur_status",
        "label": "本季度申诉状态",
        "width": "200",
    },
    {
        "prop": "cur_count",
        "label": "本季度已申诉次数",
        "width": "180",
    },
    {
        "prop": "pre_industry_category",
        "label": "上季度结算行业分类",
        "width": "180",
    },
    {
        "prop": "pre_policy_category",
        "label": "上季度结算政策分类",
        "width": "200",
    },
    {
        "prop": "pre_grant",
        "label": "上季度非赠款竞价业绩",
        "width": "200",
        "sortable": "descending",
    }
];

export let lastQuarterIndustry = [
    {
        value: '一致'
    },
    {
        value: '不一致'
    },
];

export let lastQuarterPolicy = [
    {
        value: '一致'
    },
    {
        value: '不一致'
    },
];

export let quarterIndustry = [
    {
        value: '一致'
    },
    {
        value: '不一致'
    },
];

export let quarterPolicy = [
    {
        value: '一致'
    },
    {
        value: '不一致'
    },
];

export let quarterComplaint = [
    {
        value: '审批中'
    },
    {
        value: '审批通过'
    },
    {
        value: '审批驳回'
    },
];

export let selectType = [
    {
        id: 'advertiser',
        value: '广告主名称或ID'
    },
    {
        id: 'agent',
        value: '代理商账户或ID'
    },
    {
        id: 'company',
        value: '所属公司名或ID'
    },
    {
        id: 'customer',
        value: '广告主客户名称或ID'
    }
];
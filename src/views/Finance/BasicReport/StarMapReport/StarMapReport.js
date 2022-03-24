let date = (row) => {
    return row.stat_datetime.slice(0,10);
};

export let header = [
    {
        "prop": "stat_datetime",
        "label": "统计时间",
        "minWidth": "100",
        "sortable": "descending",
        "formatter": date,
    },
    {
        "prop": "star_id",
        "label": "星图账户ID",
        "minWidth": "160",
    },
    {
        "prop": "star_name",
        "label": "星图账户名称",
        "minWidth": "220",
    },
    {
        "prop": "consumer_name",
        "label": "广告主客户",
        "minWidth": "200",
    },
    {
        "prop": "first_industry",
        "label": "客户一级行业",
        "minWidth": "150",
    },
    {
        "prop": "second_industry",
        "label": "客户二级行业",
        "minWidth": "150",
    },
    {
        "prop": "task_type",
        "label": "任务类型",
        "minWidth": "120",
    },
    {
        "prop": "type",
        "label": "操作类型",
        "minWidth": "120",
    },
    {
        "prop": "status",
        "label": "任务状态",
        "minWidth": "120",
    },
    {
        "prop": "stat_datetime",
        "label": "操作时间",
        "minWidth": "150",
        "sortable": "descending",
    },
    {
        "prop": "balance",
        "label": "金钱",
        "minWidth": "120",
        "sortable": "descending",
    }
];
import common from "@/tools/common";

let date = (row) => {
    return common.getNewDay(Number(row.create_time * 1000))
};
export let header = [
    {
        "prop": "operation",
        "label": "状态",
        "fixed": true,
        "align": "center",
        "minWidth": "100",
        "showSlot": true,
        "slotName": "status",
    },
    {
        "prop": "ad_name",
        "label": "计划名称",
        "fixed": true,
        "minWidth": "160",
    },
    {
        "prop": "create_time",
        "label": "投放时间",
        "fixed": true,
        "minWidth": "160",
        "formatter": date
    },
    {
        "prop": "camp_name",
        "label": "所属广告组",
        "minWidth": "160",
    },
    {
        "prop": "cost",
        "label": "总花费",
        "minWidth": "160",
        "sortable": "descending",
    },
    {
        "prop": "show",
        "label": "展示数",
        "minWidth": "160",
        "sortable": "descending",
    },
    {
        "prop": "click",
        "label": "点击数",
        "minWidth": "160",
        "sortable": "descending",
    },
    {
        "prop": "avg_show_cost",
        "label": "平均千次展现费用",
        "minWidth": "160",
        "sortable": "descending",
    }, {
        "prop": "avg_1000_click_cost",
        "label": "平均千次点击费用",
        "minWidth": "160",
        "sortable": "descending",
    }, {
        "prop": "avg_click_cost",
        "label": "平均单次点击单价",
        "minWidth": "160",
        "sortable": "descending",
    }, {
        "prop": "ctr",
        "label": "点击率",
        "minWidth": "160",
        "sortable": "descending",
    },
];
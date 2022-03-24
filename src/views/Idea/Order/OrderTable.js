import {GET_ORDER_AUTH} from '@config/OrderAuthority';
import store from '@store/store.js';
import {IDEA_MEMBER_MASK} from "@config/RouteAuth";

let cost = (row) => {
    return row.status === '已投放' ? Number(row.cost) : '';
};
let creative_num = (row) => {
    return row.status === '已投放' ? Number(row.creative_num) : '';
};

//隐藏
let checkHideDisappear = (row) => {
    return row.is_hidden != 0
};
//取消隐藏
let checkCancelHideDisappear = (row) => {
    return row.is_hidden == 0
};

//隐藏
let checkOperateDisabled = (row,item) => {
    // 创意：
    if(store.state.global.userTypeRoute&IDEA_MEMBER_MASK)
        return (row.is_team_members == 0);
    return false;
};

//详情判断
let checkDetailOperateDisabled = (row,item) => {
    // 创意：
    if(store.state.global.userTypeRoute&IDEA_MEMBER_MASK)
        return (row.is_team_members == 0);
    return false;
};

//判断 管理员和运营的时候 接单和拒单 消失
let checkOperateDisappearCopy = (row,item) => {
    return !(store.state.global.userOrderAuth & item.mask && row.status === "待接单");
};

let HEADER = [
    {
        "prop": "order_name",
        "label": "订单名称",
        "width": "150",
        "className": "height-limit",
        "fixed": true,
        "showSlot": true,
        "slotName": "order_name"
    },
    {
        "prop": "media",
        "label": "媒体",
        "width": "120",
        "fixed": true
    },
    {
        "prop": "demand_type",
        "label": "需求类型",
        "width": "100"
    },
    {
        "prop": "order_type",
        "label": "视频类型",
        "width": "100"
    },
    {
        "prop": "operation_id",
        "label": "提单人",
        "width": "140",
        "showSlot": true,
        "slotName": "operation_id"
    },
    {
        "prop": "group_id",
        "label": "视频团队",
        "width": "150",
        "showSlot": true,
        "slotName": "group_id"
    },
    {
        "prop": "process",
        "label": "流程日期",
        "width": "320",
        "showSlot": true,
        "slotName": "timeline"
    },
    {
        "prop": "end_time",
        "label": "截稿日期",
        "width": "140",
        "sortable": "descending"
    },
    {
        "prop": "cost",
        "label": "累计消耗",
        "width": "150",
        "sortable": "descending",
        "formatter":cost
    },
    {
        "prop": "creative_num",
        "label": "创意数",
        "width": "150",
        "formatter":creative_num
    },
    {
        "prop": "status",
        "label": "状态",
        "width": "auto",
        "fixed": "right",
    },
    {
        "prop": "convert_cost",
        "label": "操作",
        "width": "155",
        "fixed": "right",
        "showSlot": true,
        "slotName": 'button',
        "childSlots":[
            {
                "slotName": 'buttonReceiveOrder',
                "buttonName": '接单',
                "mask": GET_ORDER_AUTH,
                "disappear": checkOperateDisappearCopy,
            },
            {
                "slotName": 'buttonOrderDetail',
                "buttonName": '详情',
                "disabled": checkDetailOperateDisabled,
            },
            {
                "slotName": 'buttonHideOrder',
                "buttonName": '隐藏',
                "disappear":checkHideDisappear,
                "disabled": checkOperateDisabled,
            },
            {
                "slotName": 'buttonHideOrder',
                "buttonName": '取消隐藏',
                "disappear": checkCancelHideDisappear,
                "disabled": checkOperateDisabled,
            },
        ]
    },
];

export {
    HEADER
}

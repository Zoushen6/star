import {ADMIN_ROUTE_MASK, MANAGERS_ROUTE_MASK} from "@config/RouteAuth";

let checkOperateDisappearCopy = (row, item) => {
    return (row.role_id !== 2)
};

let header = [
    {
        "prop": "username",
        "label": "账号",
        "auth": MANAGERS_ROUTE_MASK
    },
    {
        "prop": "name",
        "label": "姓名",
        "auth": MANAGERS_ROUTE_MASK
    },
    {
        "prop": "role_name",
        "label": "角色",
        "auth": MANAGERS_ROUTE_MASK
    },
    {
        "prop": "status",
        "label": "状态",
        "showSlot": true,
        "slotName": 'status',
        "auth": MANAGERS_ROUTE_MASK
    },
    {
        "prop": "department_name",
        "label": "部门",
        "auth": ADMIN_ROUTE_MASK
    },
    {
        "prop": "convert_cost",
        "label": "操作",
        "showSlot": true,
        "slotName": 'button',
        "auth": MANAGERS_ROUTE_MASK,
        "childSlots": [
            {
                "slotName": 'editAccount',
                "buttonName": '编辑',
                "auth": MANAGERS_ROUTE_MASK
            }, {
                "slotName": 'deleteAccount',
                "buttonName": '删除',
                "auth": MANAGERS_ROUTE_MASK
            }, {
                "slotName": 'resetPwd',
                "buttonName": '重置密码',
                "auth": MANAGERS_ROUTE_MASK
            }, {
                "slotName": 'configure',
                "buttonName": '配置广告主',
                "disappear": checkOperateDisappearCopy,
                "auth": MANAGERS_ROUTE_MASK
            },
        ]
    }

];

export default header;

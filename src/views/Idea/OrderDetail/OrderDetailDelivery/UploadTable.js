import store from "@store/store";
import {GET_BIND_AUTH, GET_NOT_AUDIT_AUTH, DELETE_RESOURCE_AUTH, GET_RESOURCE_AUTH,DELETE_TEMP_RESOURCE_AUTH} from "@/config/OrderAuthority";

let disappearOperate = (row, item) =>{
    return !(row.order_mask & item.mask & store.state.global.userOrderAuth);
};

let disappearDelete = (row, item) => {
    return (row.media_status && row.media_status === "3") || disappearOperate(row, item);
}

let disappearAccount = (row, item) => {
    return !row.advertiser || row.advertiser.length === 0 || disappearOperate(row, item);
}

//media_status 1正常 2拒签 3未过审 4删除
let disappearOverdueReason = (row, item) => {
    return !(row.media_status && row.media_status === "3") || disappearOperate(row, item);
}

export let newSubmitHeader = [
    {
        "prop": "resource_url",
        "label": "已上传文件",
        "align": "center",
        "showSlot": true,
        "slotName": 'video',
    },
    {
        "prop": "resource_name",
        "width": "160"
    },
    {
        "prop": "resource_user",
        "label": "上传人",
    },
    {
        "prop": "choreographer",
        "label": "编导",
    },
    {
        "prop": "photography",
        "label": "拍摄",
    },
    {
        "prop": "montage",
        "label": "剪辑",
    },
    {
        "prop": "design",
        "label": "平面",
    },
    {
        "prop": "operate",
        "label": "操作",
        "width": "380",
        "showSlot": true,
        "slotName": 'button',
        "childSlots": [
            {
                "slotName": 'delete',
                "buttonName": '删除',
                "mask": DELETE_RESOURCE_AUTH|DELETE_TEMP_RESOURCE_AUTH,
                "disappear": disappearDelete,
            },
            {
                "slotName": 'downLoadFile',
                "buttonName": '下载',
                "mask": GET_RESOURCE_AUTH,
                "disappear": disappearOperate,
            },
            {
                "slotName": 'copyFile',
                "buttonName": '复制链接',
                "mask": GET_RESOURCE_AUTH,
                "disappear": disappearOperate,
            },
            {
                "slotName": 'showAccount',
                "buttonName": '查看关联账户',
                "mask": GET_BIND_AUTH,
                "disappear": disappearAccount,
                "cellClass": "show-account"
            },
            {
                "slotName": 'overdueReason',
                "buttonName": '查看未过审原因',
                "mask": GET_NOT_AUDIT_AUTH,
                "disappear": disappearOverdueReason,
                "cellClass": "show-reason"
            }
        ]
    },
];

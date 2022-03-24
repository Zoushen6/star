export const STATUS_FULL = 0b11111111;  //所有状态
export const STATUS_NOT_ACCEPT = 0b00000001; //待接单
export const STATUS_MAKE_ING = 0b00000010;  //制作中
export const STATUS_NOT_SIGN = 0b00000100;  //待签收
export const STATUS_NOT_DELIVER = 0b00001000;  //待投放
export const STATUS_DELIVER_ING = 0b00010000;  //投放中
export const STATUS_OVERDUE = 0b00100000;  //已过期
export const STATUS_REJECT_ORDER = 0b01000000;  //拒单
export const STATUS_REJECT_VISA = 0b10000000;  //拒签
export const STATUS_NOT_AUDIT = 1<<9;  //未过审
export const STATUS_EMPTY = 0;  //空状态

export const TopStatus =
    [
        {
            icon: "unreceive",
            color: "#36BEFF",
            desc: "待接单",
            value:'1',
            mask: STATUS_NOT_ACCEPT,
            count: 0
        },
        {
            icon: "making",
            color: "#FF9B3A",
            desc: "制作中",
            value:'3',
            mask: STATUS_MAKE_ING,
            count: 0
        },
        {
            icon: "unapproved",
            color: "#ff6d6b",
            desc: "未过审",
            value:'9',
            mask: STATUS_NOT_AUDIT,
            count: 0
        },
        {
            icon: "unsign",
            color: "#5773FF",
            desc: "待签收",
            value:'4',
            mask: STATUS_NOT_SIGN,
            count: 0
        },
        {
            icon: "undeliver",
            color: "#FE763B",
            desc: "待投放",
            value:'5',
            mask: STATUS_NOT_DELIVER,
            count: 0
        },
        {
            icon: "deliver",
            color: "#40D2C4",
            desc: "已投放",
            value:'8',
            mask: STATUS_DELIVER_ING,
            count: 0
        }
    ];

export const StatusPool =
    [
        {
            desc: "待接单",
            mask: STATUS_NOT_ACCEPT,
            value:'1'
        },
        {
            desc: "制作中",
            value:'3',
            mask: STATUS_MAKE_ING,
        },
        {
            desc: "未过审",
            value:'9',
            mask: STATUS_NOT_AUDIT,
        },
        {
            desc: "待签收",
            value:'4',
            mask: STATUS_NOT_SIGN
        },
        {
            desc: "待投放",
            value:'5',
            mask: STATUS_NOT_DELIVER,
        },
        {
            desc: "已拒签",
            value:'6',
            mask: STATUS_REJECT_VISA,
        },
        {
            desc: "已过期",
            value:'7',
            mask: STATUS_OVERDUE,
        },
        {
            desc: "已投放",
            value:'8',
            mask: STATUS_DELIVER_ING,
        },
    ];

export const STATUS_MASK_LIST = {
    0: STATUS_EMPTY,
    1: STATUS_NOT_ACCEPT,
    2: STATUS_REJECT_ORDER,
    3: STATUS_MAKE_ING,
    4: STATUS_NOT_SIGN,
    5: STATUS_NOT_DELIVER,
    6: STATUS_REJECT_VISA,
    7: STATUS_OVERDUE,
    8: STATUS_DELIVER_ING,
    9: STATUS_NOT_AUDIT,
};

export const STATUS_VALUE_LIST = {
    [STATUS_EMPTY]: 0,
    [STATUS_NOT_ACCEPT]: 1,
    [STATUS_REJECT_ORDER]: 2,
    [STATUS_MAKE_ING]: 3,
    [STATUS_NOT_SIGN]: 4,
    [STATUS_NOT_DELIVER]: 5,
    [STATUS_REJECT_VISA]: 6,
    [STATUS_OVERDUE]: 7,
    [STATUS_DELIVER_ING]: 8,
    [STATUS_NOT_AUDIT]: 9,
};

export function GetStatusMask(roleId) {
    return STATUS_MASK_LIST[roleId];
}

/**
 * @return {number}
 */
export function GetStatusValue(mask) {
    return STATUS_VALUE_LIST[mask];
}

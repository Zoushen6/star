import {
    STATUS_FULL,
    STATUS_NOT_ACCEPT,
    STATUS_MAKE_ING,
    STATUS_NOT_SIGN,
    STATUS_NOT_DELIVER,
    STATUS_DELIVER_ING,
    STATUS_OVERDUE,
    STATUS_REJECT_ORDER,
    STATUS_REJECT_VISA,
    STATUS_NOT_AUDIT,
    StatusPool,
    STATUS_EMPTY
} from "@views/Idea/Order/StatusPool";
import {
    ADMIN_ROUTE_MASK,
    IDEA_DESIGN_ROUTE_MASK,
    IDEA_DIRECTOR_ROUTE_MASK,
    IDEA_MANAGE_ROUTE_MASK,
    IDEA_MONTAGE_ROUTE_MASK,
    IDEA_PHOTOGRAPHY_ROUTE_MASK,
    NONE_ROUTE_MASK,
    OPERATE_MANAGE_ROUTE_MASK,
    OPERATE_ROUTE_MASK
} from "@config/RouteAuth";

export const POST_ORDER_AUTH = 0b00000001;
export const GET_ORDER_AUTH = 0b00000010;
export const REJECT_ORDER_AUTH = 0b00000100;
export const SUBMIT_AUTH = 0b00001000;
export const SIGN_AUTH = 0b00010000;
export const REJECT_SIGN_AUTH = 0b00100000;
export const DELIVER_AUTH = 0b01000000;
export const COMMON_AUTH = 1<<8;
export const RE_SUBMIT_AUTH = 1<<9;
export const SHOW_UPLOAD_TEXT_AUTH = 1<<10;
export const DELETE_RESOURCE_AUTH = 1<<11;// 删除已交付上传文件
export const GET_RESOURCE_AUTH = 1<<12;// 复制下载已上传文件
export const GET_NOT_AUDIT_AUTH = 1<<13; //查看未过审原因
export const GET_BIND_AUTH = 1<<14;// 查看关联账户
export const DELETE_TEMP_RESOURCE_AUTH = 1<<15;// 创意删除已上传文件

export const BIND_ORDER_AUTH_ACCEPT = GET_ORDER_AUTH|REJECT_ORDER_AUTH;
export const BIND_SUBMIT_AUTH_ACCEPT = SUBMIT_AUTH|RE_SUBMIT_AUTH;
export const BIND_SIGN_AUTH_ACCEPT = SIGN_AUTH|REJECT_SIGN_AUTH;

export const ALL_USER_OP_MASK = COMMON_AUTH|GET_BIND_AUTH|GET_RESOURCE_AUTH|GET_NOT_AUDIT_AUTH;
export const NONE_OP_MASK = COMMON_AUTH;
export const ADMIN_OP_MASK = ALL_USER_OP_MASK;
export const OPERATE_OP_MASK = ALL_USER_OP_MASK|POST_ORDER_AUTH|SIGN_AUTH|REJECT_SIGN_AUTH|DELIVER_AUTH|DELETE_RESOURCE_AUTH;
export const OPERATE_MANAGE_OP_MASK = ALL_USER_OP_MASK|POST_ORDER_AUTH|SIGN_AUTH|REJECT_SIGN_AUTH|DELIVER_AUTH|DELETE_RESOURCE_AUTH;
export const IDEA_OP_MASK = ALL_USER_OP_MASK|DELETE_TEMP_RESOURCE_AUTH;
export const IDEA_DIRECTOR_OP_MASK = ALL_USER_OP_MASK|GET_ORDER_AUTH|REJECT_ORDER_AUTH|SUBMIT_AUTH|RE_SUBMIT_AUTH|SHOW_UPLOAD_TEXT_AUTH|DELETE_TEMP_RESOURCE_AUTH;
export const IDEA_PHOTOGRAPHY_OP_MASK = ALL_USER_OP_MASK|GET_ORDER_AUTH|REJECT_ORDER_AUTH|SUBMIT_AUTH|RE_SUBMIT_AUTH|SHOW_UPLOAD_TEXT_AUTH|DELETE_TEMP_RESOURCE_AUTH;
export const IDEA_MONTAGE_OP_MASK = ALL_USER_OP_MASK|GET_ORDER_AUTH|REJECT_ORDER_AUTH|SUBMIT_AUTH|RE_SUBMIT_AUTH|SHOW_UPLOAD_TEXT_AUTH|DELETE_TEMP_RESOURCE_AUTH;
export const IDEA_DESIGN_OP_MASK = ALL_USER_OP_MASK|GET_ORDER_AUTH|REJECT_ORDER_AUTH|SUBMIT_AUTH|RE_SUBMIT_AUTH|SHOW_UPLOAD_TEXT_AUTH|DELETE_TEMP_RESOURCE_AUTH;

export const STATUS_NOT_ACCEPT_ORDER_MASK = COMMON_AUTH|GET_ORDER_AUTH|REJECT_ORDER_AUTH; //待接单
export const STATUS_REJECTED_ORDER_MASK = COMMON_AUTH; //已拒单
export const STATUS_MAKE_ING_ORDER_MASK = COMMON_AUTH|SUBMIT_AUTH|SHOW_UPLOAD_TEXT_AUTH|DELETE_RESOURCE_AUTH|DELETE_TEMP_RESOURCE_AUTH; //制作中
export const STATUS_NOT_SIGN_ORDER_MASK = COMMON_AUTH|SIGN_AUTH|REJECT_SIGN_AUTH|SHOW_UPLOAD_TEXT_AUTH|DELETE_RESOURCE_AUTH|GET_RESOURCE_AUTH|GET_BIND_AUTH|GET_NOT_AUDIT_AUTH; //待签收
export const STATUS_NOT_DELIVER_ORDER_MASK = COMMON_AUTH|DELIVER_AUTH|GET_RESOURCE_AUTH|GET_BIND_AUTH; //待投放
export const STATUS_REJECTED_SIGN_ORDER_MASK = COMMON_AUTH|RE_SUBMIT_AUTH|SHOW_UPLOAD_TEXT_AUTH|GET_RESOURCE_AUTH|GET_BIND_AUTH|GET_NOT_AUDIT_AUTH; //已拒签
export const STATUS_OVERDUE_ORDER_MASK = COMMON_AUTH; //已过期
export const STATUS_DELIVER_ING_ORDER_MASK = COMMON_AUTH|GET_RESOURCE_AUTH|GET_BIND_AUTH; //已投放
export const STATUS_NOT_AUDIT_ORDER_MASK = COMMON_AUTH|GET_RESOURCE_AUTH|GET_BIND_AUTH|GET_NOT_AUDIT_AUTH|SUBMIT_AUTH|DELETE_RESOURCE_AUTH|DELETE_TEMP_RESOURCE_AUTH; //未过审

export const ORDER_STATUS_MASK_LIST = {
    [STATUS_NOT_ACCEPT]: STATUS_NOT_ACCEPT_ORDER_MASK,
    [STATUS_REJECT_ORDER]: STATUS_REJECTED_ORDER_MASK,
    [STATUS_MAKE_ING]: STATUS_MAKE_ING_ORDER_MASK,
    [STATUS_NOT_SIGN]: STATUS_NOT_SIGN_ORDER_MASK,
    [STATUS_NOT_DELIVER]: STATUS_NOT_DELIVER_ORDER_MASK,
    [STATUS_REJECT_VISA]: STATUS_REJECTED_SIGN_ORDER_MASK,
    [STATUS_OVERDUE]: STATUS_OVERDUE_ORDER_MASK,
    [STATUS_DELIVER_ING]: STATUS_DELIVER_ING_ORDER_MASK,
    [STATUS_NOT_AUDIT]: STATUS_NOT_AUDIT_ORDER_MASK,
};

export const USER_OP_MASK_LIST = {
    [NONE_ROUTE_MASK]: NONE_OP_MASK,
    [ADMIN_ROUTE_MASK]: ADMIN_OP_MASK,
    [OPERATE_ROUTE_MASK]: OPERATE_OP_MASK,
    [OPERATE_MANAGE_ROUTE_MASK]: OPERATE_MANAGE_OP_MASK,
    [IDEA_MANAGE_ROUTE_MASK]: IDEA_OP_MASK,
    [IDEA_DIRECTOR_ROUTE_MASK]: IDEA_DIRECTOR_OP_MASK,
    [IDEA_PHOTOGRAPHY_ROUTE_MASK]: IDEA_PHOTOGRAPHY_OP_MASK,
    [IDEA_MONTAGE_ROUTE_MASK]: IDEA_MONTAGE_OP_MASK,
    [IDEA_DESIGN_ROUTE_MASK]: IDEA_DESIGN_OP_MASK
};

/**
 * @return {number}
 */
export function GetOrderOpMask(orderType) {
    return ORDER_STATUS_MASK_LIST[orderType];
}


/**
 * @return {number}
 */
export function GetUserOpMask(role) {
    return USER_OP_MASK_LIST[role];
}

import {ADMIN_ROUTE_MASK, OPERATE_INTERGRATED_MASK} from "@config/RouteAuth";

import store from '@store/store.js';

let showPush = ()=> {
        return Boolean(store.state.global.userTypeRoute & OPERATE_INTERGRATED_MASK);
};

let showShare = () => {
        return !(store.state.global.userTypeRoute & ADMIN_ROUTE_MASK);
};

let showDelete = (row) => {
        return row.origin_id === 1 && !(store.state.global.userTypeRoute & ADMIN_ROUTE_MASK);
};


export {
    showPush,
    showShare,
    showDelete
}

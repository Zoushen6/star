import store from "@store/store";
import {FINANCE_ROUTE_MASK, ROUTE_MASK_LIST} from "@config/RouteAuth";

export const redirectIndex = function(){
    const name = store.state.global.userTypeRoute & FINANCE_ROUTE_MASK ? 'finance' : 'idea';
    return {name};
};

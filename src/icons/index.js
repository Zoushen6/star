import Vue from 'vue'
import SvgIcon from '@/icons/SvgIcon/SvgIcon'// svg组件

// register globally
Vue.component('svg-icon', SvgIcon);

const requireAll = requireContext => requireContext.keys().map(requireContext);
const req = require.context('./svg', false, /\.svg$/);
requireAll(req);
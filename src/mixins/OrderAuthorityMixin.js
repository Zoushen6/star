import * as OrderAuthority from "@config/OrderAuthority";

import * as orderStatus from "@views/Idea/Order/StatusPool";

import {mixinHelper} from "@tools/Mixin";

const mixinConfig = {data: 'number', methods: 'function'};

const objects = [OrderAuthority, orderStatus];

export default mixinHelper(objects, mixinConfig);

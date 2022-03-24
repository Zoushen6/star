import {TopStatus} from "@views/Idea/Order/StatusPool";

export default {
    data() {
        return {
            TopStatus,
            statusCount:{
                1:0, //待接单
                3:1, //制作中
                9:2, //未过审
                4:3, //待签收
                5:4, //待投放
                8:5, //已投放
            }
        }
    },
    methods: {
       GetStatusCount(status){
           return this.statusCount[status]
       }
    }
}

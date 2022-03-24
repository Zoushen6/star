export default {
    data(){
        return {
            crew_status:'',
            orderMask: 0,
            orderOpMask: 0,
            userOpMask: 0,
        }
    },

    activated: async function () {
        await this.orderDetailData();
    },

    methods:{
        //订单详情
        orderDetail() {
            return this.$http.get("order/order-detail", {
                params: {
                    order_id: this.$route.query.order_id,
                }
            })
        },

        //详情数据
        orderDetailData: async function () {
            const res = await this.orderDetail();
            if (res.data.code === 200) {
                let obj = res.data.data;
                this.addIDCode = obj.advertiser_ids;
                this.resource = obj.resource;
                if(this.resource){
                    this.resource.forEach(item => {
                        this.account = item.advertiser;
                    })
                }
                this.is_overdue = obj.is_overdue;
                this.isOptimizer = obj.is_optimizer;
                this.isOperation = obj.is_operation;
                this.jobID = obj.job_id;
                this.orderStatus = obj.status;
                this.creative_time = obj.create_time;
                this.needRuleForm.demand_name = obj.demand_name;
                this.needRuleForm.product_industry = obj.product_industry;
                this.needRuleForm.end_time = Number(obj.end_time * 1000);
                this.needRuleForm.order_type = Number(obj.order_type);
                this.needRuleForm.media = Number(obj.media);
                this.needRuleForm.demand_type = Number(obj.demand_type);
                this.needRuleForm.product_id = obj.product_id;
                this.needRuleForm.group_id = this.orderID_status?Number(obj.group_id):'';
                this.needRuleForm.link = obj.link;
                this.needRuleForm.product_description = obj.product_description;
                this.orderRuleForm.material_type = Number(obj.material_type);
                this.orderRuleForm.order_name = obj.order_name;
                this.orderRuleForm.special_requirement = obj.special_requirement;
                this.orderRuleForm.prompt = obj.prompt;
                this.scriptRuleForm.job_title = obj.job_title;
                this.scriptRuleForm.job_content_actor = obj.job_content_actor;
                this.scriptRuleForm.job_content_scenario = obj.job_content_scenario;
                this.scriptRuleForm.job_content_clothing = obj.job_content_clothing;
                this.scriptRuleForm.job_content_props = obj.job_content_props;
                this.scriptRuleForm.job_special_requirement = obj.job_special_requirement;
                this.crew_status = obj.crew_status;
                if(this.crew_status == false){
                    this.choreographer = "";
                    this.photography = "";
                    this.montage = "";
                    this.graphicDesign = "";
                }else{
                    this.choreographer = obj.choreographer.name;
                    this.photography = obj.photography.name;
                    this.montage = obj.montage.name;
                    this.graphicDesign = obj.design.name;
                }
                this.url = obj.url ? obj.url : "";
            }
            this.orderMask = this.GetStatusMask(this.orderStatus);
            this.orderOpMask = this.GetOrderOpMask(this.orderMask);
        },
    }
}
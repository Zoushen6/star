export default {

    data() {
        return {
            channels:[
                {
                    item:"头条数据",
                    id:1
                },
                {
                    item:"快手数据",
                    id:2
                },
            ],
            materialType: [],
            mediaType: [],
            orderType: [],
            operation:[],
            optimizer:[],
            material_optimizer:[],
            optimizerGroup:[],
            productNameType: [],
            isHidden: [
                {
                    label:"已隐藏",
                    value:"1"
                },
                {
                    label:"未隐藏",
                    value:"0"
                },
            ],
            productIndustry: [],
            groupType: [],
            demandType: [],
            productLineOptions: [
                {
                    label: "华为",
                    value: "华为"
                },
                {
                    label: "小米",
                    value: "小米"
                }
            ],
            departmentType:[],
            needRuleForm:{
                group_id:""
            },
            memberList:[],
            origins:[
                {
                    label:'订单',
                    value:0
                },
                {
                    label:'本地',
                    value:1
                }
            ],
            labelList:[],
        }
    },

    mounted() {
        this.handleProductID();
        this.handleGroupID();
        this.handleDepartment();
        this.handleOperation();
        this.handleOptimizer();
        this.handleOptimizerGroup();
        this.handleMemberList();
        this.handleLabelList();
        this.handleMaterialOptimizer();
    },

    methods: {

        handleLabelList(){
            return this.$http.get("/media/media/label-list", {
                params: {
                }
            }).then((res)=>{
                if(res){
                    this.labelList = res.data.data;
                }
            })
        },

        //产品名称下拉
        handleProductID() {
            this.$http.get("/order/order-dictionary", {
                params: {
                    order: "id",
                    sort: "asc"
                }
            }).then(res => {
                if (res.data.code === 200) {
                    this.materialType = res.data.data.material_type;
                    this.mediaType = res.data.data.media;
                    this.orderType = res.data.data.order_type;
                    this.productNameType = res.data.data.product_name;
                    this.productIndustry = res.data.data.product_industry;
                    this.demandType = res.data.data.demand_type;
                }
            })
        },

        //提单人下拉
        handleOperation(){
            this.$http.get("/role/operation-list").then(res => {
                if (res.data.code === 200) {
                   this.operation = res.data.data;
                }
            })
        },

        //上传人下拉
        handleOptimizer(){
            this.$http.get("/role/optimizer-list").then(res => {
                if (res.data.code === 200) {
                    this.optimizer = res.data.data;
                }
            })
        },

        //素材库上传人下拉
        handleMaterialOptimizer(){
            this.$http.get("/role/uploader-list").then(res => {
                if (res.data.code === 200) {
                    this.material_optimizer = res.data.data;
                }
            })
        },

        //创意人员下拉
        handleOptimizerGroup(){
            this.$http.get("/role/optimizer-group-list").then(res => {
                if (res.data.code === 200) {
                    this.optimizerGroup = res.data.data.list.options;
                }
            })
        },

        //接单团队下拉
        handleGroupID() {
            this.$http.get("/group/list",{
                params:{
                    order:'create_time',
                    sort:'desc',
                    page_size:100
                }
            }).then(res => {
                if (res.data.code === 200) {
                    this.groupType = res.data.data.list;
                }
            })
        },

        //视频部门
        handleDepartment(){
            this.$http.get("/department/list",).then(res=>{
                if(res.data.code === 200){
                    this.departmentType = res.data.data;
                }
            })
        },

        //全部用户角色
        handleMemberList(){
            this.$http.get("/role/list").then(res=>{
                if(res.data.code === 200){
                    this.memberList = res.data.data;
                }
            })
        }

    },

}
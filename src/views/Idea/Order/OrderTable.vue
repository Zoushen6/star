<template>
    <div class="flex-1 flex-vertical">
        <!-- 条件筛选区 -->
        <info-form @search="searchFn"></info-form>
        <!-- 条件筛选区 -->
        <!-- 表格区 -->
        <customized-table
            class="customized-table mini-table flex-1 without-pagination"
            :scroll-in-table="false"
            :loading="loading"
            :Data="tableData"
            :Header="header"
            :total="total"
            :page-size="pageSize"
            ref="customizedTable"
            :current-page="currentPage"
            @sort-change="sortChangeHandle"
            :show-summary="true"
            :summary-method="getSummary"
            @size-change="val=>{pageSizeChange(tableLoad,this,val)}"
            @current-change="val=>{pageChange(tableLoad,this,val)}"
            @buttonReceiveOrder="buttonReceiveOrder"
            @buttonOrderDetail="buttonOrderDetail"
            @buttonHideOrder="buttonHideOrder"
        >
            <template v-slot:order_name="{row}">
                    <el-popover
                        placement="top-start"
                        width="100"
                        trigger="hover"
                        :content="row.order_name"
                        :disabled="row.order_name.length < 20"
                    >
                        <span slot="reference" class="ell-2 pointer">{{ row.order_name }}</span>
                    </el-popover>
            </template>
            <template v-slot:operation_id="{row}">
                <el-popover
                    placement="top-start"
                    width="100"
                    trigger="hover"
                    :content="row.operation_id"
                    :disabled="true"
                >
                    <span slot="reference" class="ell-2 ">{{ row.operation_id }}</span>
                </el-popover>
            </template>
            <template v-slot:group_id="{row}">
                <el-popover
                    placement="top-start"
                    width="100"
                    trigger="hover"
                    :content="row.group_id"
                    :disabled="true"
                >
                    <span slot="reference" class="ell-2 ">{{ row.group_id }}</span>
                </el-popover>
            </template>

            <template v-slot:timeline="{row}">
<!--                <span>{{ row.process }}</span>-->
                <el-steps :active="row.process?row.process.length:0" align-center>
                    <el-step title="下单" :description="row.process&&row.process[0]?row.process[0]:'暂无'"></el-step>
                    <el-step title="接单" :description="row.process&&row.process[1]?row.process[1]:'暂无'"></el-step>
                    <el-step title="交付" :description="row.process&&row.process[2]?row.process[2]:'暂无'"></el-step>
                    <el-step title="签收" :description="row.process&&row.process[3]?row.process[3]:'暂无'"></el-step>
                    <el-step title="投放" :description="row.process&&row.process[4]?row.process[4]:'暂无'"></el-step>
                </el-steps>
            </template>
        </customized-table>
        <!-- /表格区 -->

        <!-- 接单弹窗 -->
        <div class="acceptOder">
        <customized-dialog
            title="接单"
            :visible="visibleOrderDialog"
            :width="400"
            :show-footer="true"
            @cancel="resetOrderDialog"
            @submit="acceptOder"
            @close="resetOrderDialog"
        >
            <p style="text-align:left">确定接单吗？</p>
        </customized-dialog>
        </div>
        <!-- 接单弹窗 -->

        <!-- 隐藏弹窗 -->
        <div class="hidden">
        <customized-dialog
            :visible="visibleHideDialog"
            :width="400"
            :show-footer="true"
            @close="resetOrderDialog"
            @submit="submitHide"
            @cancel="resetOrderDialog"
        >
            <span>确认{{isHidden}}</span>
        </customized-dialog>
        </div>
        <!-- 隐藏弹窗 -->
    </div>

</template>

<script>
    import PaginationMixin from "@mixins/PaginationMixin";
    import {HEADER} from "./OrderTable.js"
    import InfoForm from "./InfoForm";
    import {mapState} from 'vuex';
    import CustomizedClipboard from "@components/CustomizedClipboard";
    import TopStatusMixin from "@mixins/TopStatusMixin";

    export default {
        name: "OrderTable",
        components: {CustomizedClipboard, InfoForm},
        mixins: [PaginationMixin, TopStatusMixin],
        data(){
            return{
                searchData:{
                    is_hidden:"0",
                    status:''
                },
                isHidden:'',
                visibleOrderDialog:false,
                visibleHideDialog:false,
                row:'',
                status_count:[],
                summaryData: null,
                orderRuleForm: {
                    material_type: 1,
                    order_name: "",
                    special_requirement: "",
                    prompt: "",
                    reason: "",
                },
                orderRules: {
                    order_name: [
                        {required: true, message: "请输入订单名称"}
                    ],
                    material_type: [
                        {required: true, message: "请选择素材类型", trigger: 'change'}
                    ],
                    reason: [
                        {required: true, message: "请输入拒单理由"}
                    ]
                },
                order: null,
                sort: null,
            }
        },
        created() {
            this.header = HEADER; // 放在created中,beforeCreate时header等data数据还未创建
            //从别的路由进入本路由 清除上面的跑马灯状态
            this.$store.commit('setOrderStatus',0);
            this.$store.commit('setOrderStatusValue','');
        },
        activated() {
            this.tableLoad(1); //初次加载table
        },

        deactivated() {
            this.searchData=[]; //切换路由时清除searchData
        },

        // 数据格式化
        computed: {
            ...mapState({
                 curStatusValue: state => state.order.curStatusValue,
            })
        },
        watch:{
            curStatusValue(val){
                //保证点击状态框效果
                this.searchData.status = (val === 'null' ? '':val);
                if(val) this.tableLoad(1)
            }
        },
        methods:{

            //查询
            searchFn(param){
                this.searchData = param;
                this.tableLoad(1)
            },


            //点击接单
            buttonReceiveOrder(row){
                this.visibleOrderDialog = true;
                this.row = row;
            },

            //接单弹窗点击确定
            acceptOder(){
                this.receiveOrder(this.row.order_id).then((res) => {
                    if(res.data.code === 200){
                        this.tableLoad(this.currentPage);
                    }
                }).catch((error) => {
                    console.warn(error);
                }).finally(() => {
                    this.visibleOrderDialog = false
                });
            },

            //详情
            buttonOrderDetail(row){
                this.$router.push(`/idea/orderDetail?order_id=${row.order_id}`)
            },

            //点击隐藏
            buttonHideOrder(row){
                this.visibleHideDialog = true;
                this.row = row;
                this.isHidden = row.is_hidden == 0?'隐藏':'取消隐藏';
            },

            //隐藏弹窗确认
            submitHide(){
                this.oderHide(this.row.order_id).then((res) => {
                    if(res.data.code === 200){
                        this.tableLoad(this.currentPage);
                    }
                }).catch((error) => {
                    console.warn(error);
                }).finally(() => {
                    this.visibleHideDialog = false;
                    this.row = '';
                })
            },

            sortChangeHandle(data){
                if (data.order) {
                    this.order = data.prop;
                    this.sort = data.order === 'descending' ? 'desc' : 'asc';
                } else {
                    this.order = null;
                    this.sort = null;
                }
                this.tableLoad();
            },

            tableLoad(num){
                this.loading = true;
                this.requestOrderList(num).then((res)=>{
                    if(res.data.code === 200 && res.data.data.list.length !== 0){
                        this.tableData = res.data.data.list;
                        this.status_count = res.data.data.status_count;
                        this.summaryData = res.data.data.total_data;
                        this.total = res.data.data.pagination.total;
                        this.currentPage = num;
                    }else{
                        this.tableData =[];
                        this.total = 0;
                        this.TopStatus.forEach((item)=>item.count=0)
                    }
                }).catch((error) => {
                    this.loading = false;
                    console.warn(error);
                }).finally(() => {
                    this.status_count.forEach((item) => {
                        let id = this.GetStatusCount(item.status);
                        if (id !== undefined) this.TopStatus[id].count = Number(item.num);
                    })
                    //表格未挂载完成时doLayout会报错
                    if(this.$refs.customizedTable){
                        this.$nextTick(this.$refs.customizedTable.doLayout);
                    }
                    this.loading = false;
                });
            },

            //接单
            receiveOrder(order_id){
                return this.$http.get("order/accept", {
                    params: {
                        order_id:order_id
                    }
                })
            },

            //关闭弹窗
            resetOrderDialog() {
                this.visibleOrderDialog = false;
                this.visibleHideDialog = false;
            },

            //隐藏订单
            oderHide(order_id){
                return this.$http.get("order/hide", {
                    params: {
                        order_id:order_id
                    }
                })
            },

            //获取订单列表
            requestOrderList(page){
                return this.$http.get("order/order-list", {
                    params:{
                        media:this.searchData.media,
                        demand_type:this.searchData.demand_type,
                        order_type:this.searchData.order_type,
                        status:this.searchData.status,
                        department_id:this.searchData.department_id,
                        group_id:this.searchData.group_id,
                        operation_id:this.searchData.operation_id,
                        creatives:this.searchData.creatives,
                        product_industry:this.searchData.product_industry,
                        product_id:this.searchData.product_id,
                        // productLine:this.searchData.productLine,
                        original:this.searchData.original,
                        is_hidden:!this.searchData.is_hidden ? 0 : this.searchData.is_hidden,
                        create_time:this.searchData.create_time,
                        end_time:this.searchData.end_time,
                        order_name:this.searchData.order_name,
                        serial_number:this.searchData.serial_number,
                        order: this.order,
                        sort: this.sort,
                        page:page,
                        page_size:this.pageSize,
                        type:this.type,
                    }
                })
            },

            getSummary(param){
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '总计';
                        return;
                    }
                    if (column.property === 'cost' && this.summaryData){
                        sums[index] = this.summaryData.cost;
                        return;
                    }
                    if (column.property === 'creative_num' && this.summaryData){
                        sums[index] = this.summaryData.creative ? (this.summaryData.creative) : '';
                        return;
                    }
                });
                return sums;
            }

        }
    }
</script>

<style scoped lang="scss">

    /deep/.reject {
        margin-left: -6px;
        .el-textarea__inner {
            min-height: 78px !important;
        }
    }

    /deep/ .el-step__title{
        position: relative;
        top: -16px;
        font-size: 10px;
    }
    /deep/ .el-step__description{
        position: relative;
        bottom: 13px;
        font-size: 10px;
    }
    /deep/ .el-step__title.is-process {
        font-weight: 400;
        color: #C0C4CC;
    }
    /deep/.el-step__description.is-process {
        font-weight: 400;
        color: #C0C4CC;
    }
    /deep/.el-step__head.is-process {
        color: #C0C4CC;
    }
    /deep/ .el-step__icon-inner{
        display: none;
    }
    /deep/ .el-step__icon.is-text{
        width: 6px;
        height: 6px;
        border: 3px solid
    }
    /deep/ .el-step.is-center .el-step__description{
        padding-left: 0;
        padding-right: 0;
    }
    /deep/.el-step.is-horizontal .el-step__line {
        top: 50%;
    }
    /deep/ .el-step__head{
        top: 50%;
        transform: translateY(-50%);
    }

    /deep/.el-button.is-disabled {
        color: #999999;
    }

    /deep/.el-steps--horizontal {
        width: 300px;
        margin-left: -13px;
    }

    /deep/.el-dialog__body {
        padding: 17px 20px;
    }

    .hidden,.acceptOder{
        /deep/.el-dialog__body {
            padding: 17px 25px;
        }
    }

    //脚本
    /deep/ .firstLabel .el-textarea__inner {
        min-height: 78px !important;
    }
    /deep/ .firstLabel .el-form-item__label {
        padding-left: 29px !important;
    }
    /deep/ .firstLabel .el-form-item__content {
        margin-bottom: 6px;
    }

    /deep/.special .el-form-item__label {
        text-align: left!important;
        line-height: 20px !important;
        margin-top: 10px !important;
    }

    .firstLabel {
        margin-left: -25px;
    }

    .rejectButton {
        width: 88px;
        height: 32px;
        float: right;
        font-size: 12px;
        line-height: 9px;
        margin: 0 4px -14px 24px;
    }

    /deep/ .bts .el-form-item__content {
        margin-left: 306px !important;
        margin-bottom: -10px;
    }

    /deep/.el-pager li{
        font-weight: $font-weight-base;
    }

    /deep/.height-limit .cell{
        max-height: 46px;
    }
    /deep/ .el-button--small {
        width: 80px !important;
    }

    /deep/.el-steps {
        color: $theme-color;
    }


</style>

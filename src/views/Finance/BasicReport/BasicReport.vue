<template>
    <div class="m-l-r-16 flex-1 flex-vertical">
        <!-- 表格区 -->
        <div class="background-white m-t-b-20 table-box flex-vertical flex-1">
            <div class="report-title m-t-b-16 p-l-r-24 clear-float">
                <div class="inline-block">
                    <span v-if="showCost==='summary'">
                        <span class="inline-block iconfont icon-prompt m-r-10" title="数值汇总与数值筛选不联动"></span>
                        <span class="inline-block m-r-25">总消耗(计划)：{{ summaryCostSum.ad_cost_sum }}&nbsp;元</span>
                        <span class="inline-block m-r-25">总消耗(广告主)：{{ summaryCostSum.adv_cost_sum }}&nbsp;元</span>
                    </span>
                    <span v-if="showCost!=='summary'"
                          class="inline-block m-r-25">总消耗：{{ showCost === 'plan' ? planCostSum : consumeCostSum.cost }}&nbsp;元</span>
                    <span v-if="showCost!=='plan'">
                        <span class="inline-block m-r-25">非赠款消耗：{{ showCost === 'summary' ? summaryCostSum.un_grants_cost_sum : consumeCostSum.un_grants_cost }} 元</span>
                        <span class="inline-block m-r-25">赠款消耗：{{ showCost === 'summary' ? summaryCostSum.grants_cost_sum : consumeCostSum.grants_cost }} 元</span>
                        <span class="inline-block">代理商业绩消耗：{{ showCost === 'summary' ? summaryCostSum.agent_cost_sum : consumeCostSum.agent_cost }} 元</span>
                    </span>
                </div>
                <div class="inline-block f-r">
                    <el-button @click="select" class="customized-button iconfont icon-select">选择指标</el-button>
                    <el-button @click="downloadReport(1)" class="customized-button iconfont icon-download">下载报表
                    </el-button>
                </div>
            </div>

            <customized-table
                class="customized-table mini-table has-border flex-1 p-l-r-24"
                ref="customizedTable"
                :scroll-in-table="false"
                :loading="loading"
                :Header="header"
                :Data="tableData"
                :total="total"
                :page-size="pageSize"
                :current-page="currentPage"
                @size-change="val=>{pageSizeChange(tableLoad,this,val)}"
                @current-change="val=>{pageChange(tableLoad,this,val)}"
                @sort-change="sortChangeHandle"
            ></customized-table>
        </div>
        <!-- /表格区 -->

        <customized-dialog
            title="选择指标"
            :width="630"
            :visible="visibleDialog"
            @close="closeDialog"
            :showFooter="true"
            @submit="submitData"
            @cancel="closeDialog"
        >
            <el-row>
                <el-col :span="6" v-for="(item,idx) in tableHeader" :key="idx">
                    <el-checkbox-group v-model="fixedHeaderProp">
                        <el-checkbox
                            :disabled="item.checkBoxDisabled"
                            :label="item.prop"
                            :title="item.label"
                        >{{ item.label | handleLength(7) }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-col>
            </el-row>
        </customized-dialog>
    </div>
</template>

<script>
import CustomizedTable from "@components/CustomizedTable";
import CustomizedDialog from "@components/CustomizedDialog";
import PaginationMixin from "@mixins/PaginationMixin";
import FinanceReportMixin from "@views/Finance/FinanceReportMixin";

export default {
    name: "BasicReport",

    components: {CustomizedDialog, CustomizedTable},

    mixins: [PaginationMixin, FinanceReportMixin],

    props: {
        showCost: String,
        tableHeader: {
            type: Array
        },
        storageName: String,
        sumUrl: String,
        tableDataUrl: String,
        formData: {
            type: Object
        },
    },

    created() {
        this.costSumCopy = Object.assign({}, this.summaryCostSum);
        this.consumeCostSumCopy = Object.assign({},this.consumeCostSum);
    },

    watch: {
        tableHeader: {
            immediate: true,
            handler: function (val) {
                this.checkedValue = val.reduce((prev, next, idx) => {
                    next.index = idx;
                    prev[next.prop] = next;
                    return prev;
                }, {});
                this.getHeader();
            }
        }
    },

    activated() {
        const val = JSON.parse(this.$common.getLocalStorage(this.storageName, 3));
        this.fixedHeaderProp = val ? val : Object.keys(this.checkedValue);
        this.getHeader();
        this.tableLoad();
    },

    data() {
        return {
            fixedHeaderProp: [],
            visibleDialog: false,
            checkedValue: null,
            summaryCostSum: {
                ad_cost_sum: 0,
                adv_cost_sum: 0,
                agent_cost_sum: 0,
                grants_cost_sum: 0,
                un_grants_cost_sum: 0,
            },
            planCostSum: 0,
            consumeCostSum: {
                cost: 0,
                agent_cost: 0,
                grants_cost: 0,
                un_grants_cost: 0,
            },
            costSumCopy: null,
            consumeCostSumCopy: null,
            loading: false,
            header: null
        }
    },

    methods: {

        resetCostSum(){
            if(this.showCost === 'summary'){
                this.summaryCostSum = {...this.costSumCopy};
            }else if(this.showCost === 'plan'){
                this.planCostSum = 0;
            }else {
                this.consumeCostSum = {...this.consumeCostSumCopy};
            }
        },

        handleSum() {
            this.resetCostSum();
            this.$http.get(this.sumUrl, {
                params: {
                    start_date: this.$common.getNewDay(this.formData.dateValue[0]),
                    end_date: this.$common.getNewDay(this.formData.dateValue[1]),
                    [this.formData.selectValue]: this.formData.inputValue.trim(),
                    company_id: this.formData.agentCustomer,
                    agent_id: this.formData.agentAccount,
                    child_agent_id: this.formData.subAgentAccount,
                    inventory: this.formData.platform,
                    filter: this.formData.addOptionsFull ? JSON.stringify(this.formData.filterData) : "",
                }
            }).then(res => {
                if (res.data.code === 200) {
                    if(this.showCost === 'summary'){
                        this.summaryCostSum = {...res.data.data};
                    }else if(this.showCost === 'plan'){
                        this.planCostSum = res.data.data.cost;
                    }else {
                        this.consumeCostSum = {...res.data.data};
                    }
                }
            }).catch((error) => {
                console.warn(error);
            }).finally(() => {
            });
        },

        requestTable(page = 1) {
            return this.$http.get(this.tableDataUrl, {
                params: {
                    start_date: this.$common.getNewDay(this.formData.dateValue[0]),
                    end_date: this.$common.getNewDay(this.formData.dateValue[1]),
                    order: this.order,
                    sort: this.sort,
                    [this.formData.selectValue]: this.formData.inputValue.trim(),
                    company_id: this.formData.agentCustomer,
                    agent_id: this.formData.agentAccount,
                    child_agent_id: this.formData.subAgentAccount,
                    filter: this.formData.addOptionsFull ? JSON.stringify(this.formData.filterData) : "",
                    // 暂时用不到 先不删
                    // group: this.optionsForm.channel ? 'inventory' : '' || this.optionsForm.material ? 'image_mode' : '',
                    // image_mode: this.optionsForm.material,
                    inventory: this.formData.platform,
                    is_export: this.export ? this.export : '',
                    page: page,
                    page_size: this.pageSize,
                },
            })
        },

        tableLoad(num) {
            this.loading = true;
            this.requestTable(num).then(res => {
                if (res.data.code === 200) {
                    this.tableData = res.data.data.list;
                    this.total = Number(res.data.data.pagination.total);
                    this.currentPage = num;
                }
            }).catch((error) => {
                console.warn(error);
            }).finally(() => {
                this.$nextTick(this.$refs.customizedTable.doLayout);
                this.loading = false;
                this.handleSum();
            });
        },

        select() {
            this.visibleDialog = true;
        },

        closeDialog() {
            if (!this.fixedHeaderProp.length) {
                this.header = this.tableHeader;
                this.$nextTick(this.$refs.customizedTable.updateColumnsWidth);
                this.tableLoad();
            }
            this.visibleDialog = false;
        },

        getHeader() {
            this.header = this.fixedHeaderProp.map(key => this.checkedValue[key]).sort((a, b) => {
                return a.index - b.index;
            });
        },

        submitData() {
            this.$common.setLocalStorage(this.storageName, JSON.stringify(this.fixedHeaderProp));
            this.visibleDialog = false;
            this.getHeader();
            this.$nextTick(this.$refs.customizedTable.updateColumnsWidth);
        },

    }
}
</script>

<style scoped lang="scss">

@import "src/views/Finance/ReportCommon";

/deep/ .el-checkbox__label {
    color: $font-color-base;
    font-size: $font-size-base;
    line-height: 32px;
}

/deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
    color: $font-color-base;
}

.report-title {
    span {
        vertical-align: middle;
    }
    .customized-button {
        height: 32px;
        width: 98px;
        padding: 6px 10px;
    }
}

</style>

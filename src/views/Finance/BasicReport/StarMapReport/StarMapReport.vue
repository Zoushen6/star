<template>
    <div class="flex-vertical flex-1 m-l-r-16">
        <el-form class="customized-form padding-top background-white p-l-r-24" :inline="true" :model="starMapReportForm"
                 ref="starMapReportForm">
            <div class="flex">
                <span class="inline-block form-item-title">基础筛选</span>
                <div class="flex-1">
                    <el-form-item prop="dateValue">
                        <customized-time-picker
                            class="time-picker long-item"
                            :date.sync="starMapReportForm.dateValue"
                            :shortcutsSetting="shortcutsSetting"
                            :max-date="0"
                            :min-date="minDate"
                        ></customized-time-picker>
                    </el-form-item>
                    <el-form-item class="long-item" prop="agent">
                        <el-select v-model="starMapReportForm.agent" placeholder="全部代理商账户" clearable>
                            <el-option v-for="item in starMapReportForm.agentList" :key="item.agent_id" :label="item.agent_name"
                                       :value="item.agent_name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="long-item" prop="startMapAccount">
                        <el-select v-model="starMapReportForm.startMapAccount" placeholder="全部星图账户" clearable>
                            <el-option v-for="item in starMapReportForm.startMapAccountList" :key="item.star_id" :label="item.star_name"
                                       :value="item.star_id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="long-item" prop="operationType">
                        <el-select v-model="starMapReportForm.operationType" placeholder="操作类型" clearable>
                            <el-option v-for="(item,index) in starMapReportForm.operationTypeList" :key="index" :label="item"
                                       :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="f-r search-btn">
                        <el-button type="primary" @click="search">查询</el-button>
                        <el-button class="reset" @click="reset">重置</el-button>
                    </el-form-item>
                </div>
            </div>
        </el-form>

        <!-- 表格区 -->
        <div class="background-white m-t-b-20 flex-1 flex-vertical table-box">
            <div class="report-title p-l-r-24 m-t-b-16">
                <div class="inline-block f-r">
                    <el-button @click="downloadReport(1)" class="customized-button"><span
                        class="iconfont icon-download"></span>下载报表
                    </el-button>
                </div>
            </div>
            <customized-table
                class="flex-1 customized-table has-border mini-table p-l-r-24"
                ref="customizedTable"
                :scroll-in-table="false"
                :Header="header"
                :loading="loading"
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
    </div>
</template>

<script>
import common from "@tools/common";
import {LastSeveralDays} from "@tools/DateUtils.js";
import CustomizedTable from "@components/CustomizedTable.vue";
import PaginationMixin from "@mixins/PaginationMixin.js";
import {header} from "@views/Finance/BasicReport/StarMapReport/StarMapReport.js";
import FinanceReportMixin from "@views/Finance/FinanceReportMixin.js";

export default {
    name: "StarMapReport",

    components: {CustomizedTable},

    mixins: [PaginationMixin, FinanceReportMixin],

    created() {
        this.header = header;
    },

    activated() {
        this.getAgentAccount();
        this.getStarMapAccount();
        this.tableLoad();
    },

    deactivated() {
        this.reset();
    },

    data() {
        return {
            shortcutsSetting: ['yesterday', 'lastSeven', 'lastThirty', 'lastWeek', 'lastMonth'],
            starMapReportForm: {
                dateValue: LastSeveralDays(93, 0),
                agent: '',
                agentList: [],
                startMapAccount: '',
                startMapAccountList: [{value: '星图网络'}],
                operationType: '',
                operationTypeList: ['扣款金额', '冻结金额', '解冻金额']
            },
        }
    },

    methods: {
        getAgentAccount() {
            this.$http.get("/report/star/agent-list").then(res=>{
                if(res.data.code === 200) {
                    this.starMapReportForm.agentList = res.data.data.list;
                }
            })
        },

        getStarMapAccount() {
            this.$http.get('/report/star/account-list').then(res=>{
                if(res.data.code === 200) {
                    this.starMapReportForm.startMapAccountList = res.data.data.list;
                }
            })
        },

        requestTable(page = 1) {
            return this.$http.get("/report/star/index", {
                params: {
                    start_date: common.getNewDay(this.starMapReportForm.dateValue[0]),
                    end_date: common.getNewDay(this.starMapReportForm.dateValue[1]),
                    star_id: this.starMapReportForm.startMapAccount,
                    agent: this.starMapReportForm.agent,
                    type: this.starMapReportForm.operationType,
                    order: this.order,
                    sort: this.sort,
                    is_export: this.export,
                    page: page,
                    page_size: this.pageSize,
                },
            })
        },

        tableLoad(num) {
            this.loading = true;
            this.requestTable(num).then(res => {
                if (res.data.code === 200) {
                    this.date = res.data.data.date;
                    this.tableData = res.data.data.list;
                    this.total = Number(res.data.data.pagination.total);
                    this.currentPage = num;
                }
            }).catch((error) => {
                console.warn(error);
            }).finally(() => {
                this.loading = false;
            });
        },

        search() {
            this.tableLoad();
        },

        reset() {
            this.$refs.starMapReportForm.resetFields();
        }
    }
}
</script>

<style scoped lang="scss">
@import "src/views/Finance/ReportCommon";

/deep/ .customized-form {
    .search-btn {
        .reset {
            color: $font-color-auxiliary;
        }
    }

    .time-picker {
        .el-range-input {
            color: $font-color-auxiliary;
        }

        .el-range-separator {
            color: $font-color-base;
            opacity: 1;
        }
    }
}
</style>

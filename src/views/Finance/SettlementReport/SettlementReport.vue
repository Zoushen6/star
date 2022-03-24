<template>
    <div class="flex-vertical flex-1 m-l-r-16">
        <el-form class="customized-form padding-top background-white p-l-r-24" :inline="true" :model="settlementReportForm" ref="settlementReportForm">
            <div class="flex">
                <span class="inline-block form-item-title">基础筛选</span>
                <div class="flex-1">
                    <el-form-item prop="inputValue" :required="false" class="search-content">
                        <el-input placeholder="请输入所要查询的内容" v-model="settlementReportForm.inputValue" class="long-item input-with-select">
                            <el-select v-model="settlementReportForm.selectValue" slot="prepend" placeholder="选择类型" clearable>
                                <el-option v-for="item in selectType" :key="item.id" :label="item.value" :value="item.id"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="middle-item" prop="lastQuarterIndustry">
                        <el-select v-model="settlementReportForm.lastQuarterIndustry" placeholder="上季度行业是否一致" clearable>
                            <el-option v-for="item in lastQuarterIndustryType" :key="item.value" :label="item.value"
                                       :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="middle-item" prop="lastQuarterPolicy">
                        <el-select v-model="settlementReportForm.lastQuarterPolicy" placeholder="上季度政策是否一致" clearable>
                            <el-option v-for="item in lastQuarterPolicyType" :key="item.value" :label="item.value"
                                       :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="middle-item" prop="quarterIndustry">
                        <el-select v-model="settlementReportForm.quarterIndustry" placeholder="本季度行业是否一致" clearable>
                            <el-option v-for="item in quarterIndustryType" :key="item.value" :label="item.value"
                                       :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="middle-item" prop="quarterPolicy">
                        <el-select v-model="settlementReportForm.quarterPolicy" placeholder="本季度政策是否一致" clearable>
                            <el-option v-for="item in quarterPolicyType" :key="item.value" :label="item.value"
                                       :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="middle-item" prop="quarterComplaint">
                        <el-select v-model="settlementReportForm.quarterComplaint" placeholder="本季度申诉状态" clearable>
                            <el-option v-for="item in quarterComplaintType" :key="item.value" :label="item.value"
                                       :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="f-r search-btn">
                        <el-button type="primary" @click="search('addOptions')">查询</el-button>
                        <el-button class="reset" @click="reset">重置</el-button>
                    </el-form-item>
                </div>
            </div>
        </el-form>

        <!-- 表格区 -->
        <div class="background-white m-t-b-20 flex-1 flex-vertical table-box">
            <div class="report-title p-l-r-24 m-t-b-16">
                <div class="inline-block f-r">
                    <span class="iconfont icon-prompt m-r-25 pointer amount" :title="'最新产出数据为截至'+ date + '日的判定和申诉结果'"></span>
                    <el-button @click="downloadReport(1)" class="customized-button"><span class="iconfont icon-download"></span>下载报表</el-button>
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
import CustomizedTable from "@components/CustomizedTable";
import PaginationMixin from "@mixins/PaginationMixin";
import {lastQuarterIndustry,lastQuarterPolicy,quarterIndustry,quarterPolicy,quarterComplaint,header,selectType} from "./SettlementReport.js";
import FinanceReportMixin from "@views/Finance/FinanceReportMixin";

export default {
    name: "SettlementReport",

    components: {CustomizedTable},

    mixins:[PaginationMixin,FinanceReportMixin],

    created() {
        this.header = header;
    },

    activated() {
        this.tableLoad();
    },

    data() {
        return {
            date: '',
            selectType,
            lastQuarterIndustryType: lastQuarterIndustry,
            lastQuarterPolicyType: lastQuarterPolicy,
            quarterIndustryType: quarterIndustry,
            quarterPolicyType: quarterPolicy,
            quarterComplaintType: quarterComplaint,
            settlementReportForm: {
                selectValue: 'advertiser',
                inputValue: '',
                lastQuarterIndustry: '',
                lastQuarterPolicy: '',
                quarterIndustry: '',
                quarterPolicy: '',
                quarterComplaint: '',
            },
        }
    },

    methods: {
        requestTable(page = 1) {
            return this.$http.get("/report/industry/index", {
                params: {
                    order: this.order,
                    sort: this.sort,
                    [this.settlementReportForm.selectValue]: this.settlementReportForm.inputValue.trim(),
                    pre_industry_is_fit: this.settlementReportForm.lastQuarterIndustry,
                    pre_policy_is_fit: this.settlementReportForm.lastQuarterPolicy,
                    cur_industry_is_fit: this.settlementReportForm.quarterIndustry,
                    cur_policy_is_fit: this.settlementReportForm.quarterPolicy,
                    cur_status: this.settlementReportForm.quarterComplaint,
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

        reset() {
            this.settlementReportForm.selectValue = 'advertiser';
            this.$refs.settlementReportForm.resetFields();
        },

    }
}
</script>

<style scoped lang="scss">
    @import "src/views/Finance/ReportCommon";

    .search-content {
        /deep/ .el-select {
            width: 150px;

            .el-input--suffix .el-input__inner {
                width: 130px;
            }
        }
    }
</style>

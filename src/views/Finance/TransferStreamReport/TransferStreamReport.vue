<template>
    <div class="flex-vertical flex-1 m-l-r-16">
        <el-form class="customized-form padding-top background-white p-l-r-24" :inline="true" :model="transferForm" ref="transferForm">
            <div class="flex">
                <span class="inline-block form-item-title">基础筛选</span>
                <div class="flex-1">
                    <el-form-item prop="dateValue">
                        <customized-time-picker
                            class="time-picker long-item"
                            :date.sync="transferForm.dateValue"
                            :shortcutsSetting="shortcutsSetting"
                            :max-date="1"
                            :min-date="minDate"
                        ></customized-time-picker>
                    </el-form-item>
                    <el-form-item prop="transferInputValue" :required="false" class="search-content">
                        <el-input v-model="transferForm.transferInputValue" :placeholder="transferForm.transferSelectValue==='adv'?'请输入账户名称或ID':'请输入代理商账户名称或ID'" class="long-item input-with-select">
                            <el-select v-model="transferForm.transferSelectValue" slot="prepend" placeholder="选择类型" clearable>
                                <el-option v-for="item in transferSelectType" :key="item.id" :label="item.value" :value="item.id"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="transferAccount">
                        <el-select placeholder="转账类型" v-model="transferForm.transferAccount" clearable>
                            <el-option v-for="item in transferAccountType" :key="item.value" :label="item.value" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="operateName">
                        <el-input v-model="transferForm.operateName" placeholder="请输入操作人姓名"></el-input>
                    </el-form-item>
                    <el-form-item class="search-btn">
                        <el-button type="primary" @click="search('addOptions')">查询</el-button>
                        <el-button class="reset" @click="reset">重置</el-button>
                    </el-form-item>
                </div>
            </div>
            <span class="inline-block form-item-title middle-title">细分筛选：</span>
            <div class="flex">
                <span class="inline-block form-item-title">转入方筛选</span>
                <el-form-item class="middle-item search-content" prop="transferInInputValue">
                    <el-input v-model="transferForm.transferInInputValue" :placeholder="transferForm.transferInAccountValue==='transfer_in_adv_id'?'请输入账户名称或ID':'请输入代理商账户名称或ID'" class="long-item input-with-select">
                        <el-select v-model="transferForm.transferInAccountValue" slot="prepend" placeholder="选择类型" clearable>
                            <el-option v-for="item in transferInAccount" :key="item.id" :label="item.value" :value="item.id"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item class="middle-item" prop="transferInType">
                    <el-select v-model="transferForm.transferInType" placeholder="账户类型" clearable>
                        <el-option v-for="item in InAccountType" :key="item.value" :label="item.value"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div class="flex">
                <span class="inline-block form-item-title">转出方筛选</span>
                <el-form-item class="middle-item search-content" prop="transferOutInputValue">
                    <el-input v-model="transferForm.transferOutInputValue" :placeholder="transferForm.transferOutAccountValue==='transfer_out_adv_id'?'请输入账户名称或ID':'请输入代理商账户名称或ID'"  class="long-item input-with-select">
                        <el-select v-model="transferForm.transferOutAccountValue" slot="prepend" placeholder="选择类型" clearable>
                            <el-option v-for="item in transferOutAccount" :key="item.id" :label="item.value" :value="item.id"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item class="middle-item" prop="transferOutType">
                    <el-select v-model="transferForm.transferOutType" placeholder="账户类型" clearable>
                        <el-option v-for="item in OutAccountType" :key="item.value" :label="item.value"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </div>
        </el-form>

        <!-- 表格区 -->
        <div class="background-white m-t-b-20 flex-1 flex-vertical table-box">
            <div class="report-title p-l-r-24 m-t-b-16">
                <span class="inline-block m-r-25">总加款金额：{{addAmount ? addAmount : 0}}&nbsp;元</span>
                <span>总退款金额：{{amount ? amount : 0}}&nbsp;元</span>
                <div class="inline-block f-r">
                    <span class="iconfont icon-prompt m-r-25 pointer amount" :title="'最新产出数据为截至' + date + '日的转账流水数据'"></span>
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
import {LastSeveralDays} from "@tools/DateUtils";
import CustomizedTable from "@components/CustomizedTable";
import PaginationMixin from "@mixins/PaginationMixin";
import {accountType,transferInAccountType,transferOutAccountType,transferAccountType,InAccountType,OutAccountType,header} from "./TransferStreamReport.js";
import FinanceReportMixin from "@views/Finance/FinanceReportMixin";

export default {
    name: "TransferStreamReport",

    components: { CustomizedTable},

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
            addAmount: '',
            amount: '',
            //转入转出筛选账户选择
            transferInAccount: transferInAccountType,
            transferOutAccount: transferOutAccountType,
            //基础筛选筛选账户选择、转账类型
            transferSelectType: accountType,
            transferAccountType: transferAccountType,
            //转入转出账户类型
            InAccountType,
            OutAccountType,
            transferForm: {
                dateValue: LastSeveralDays(1, 1),
                //基础筛选绑定数据
                transferInputValue: '',
                transferSelectValue: 'adv',
                transferAccount: '',
                operateName: '',
                //细分筛选绑定数据
                transferInInputValue: '',
                transferInAccountValue: 'transfer_in_adv_id',
                transferInType: '',
                transferOutInputValue: '',
                transferOutAccountValue: 'transfer_out_adv_id',
                transferOutType: '',
            },
        }
    },

    methods: {
        requestTable(page = 1) {
            return this.$http.get("/report/transfer/index", {
                params: {
                    order: this.order,
                    sort: this.sort,
                    start_date: this.$common.getNewDay(this.transferForm.dateValue[0]),
                    end_date: this.$common.getNewDay(this.transferForm.dateValue[1]),
                    [this.transferForm.transferSelectValue]: this.transferForm.transferInputValue.trim(),
                    transfer_type: this.transferForm.transferAccount,
                    operator: this.transferForm.operateName,
                    [this.transferForm.transferOutAccountValue]: this.transferForm.transferOutInputValue.trim(),
                    transfer_out_adv_type: this.transferForm.transferOutType,
                    [this.transferForm.transferInAccountValue]: this.transferForm.transferInInputValue.trim(),
                    transfer_in_adv_type: this.transferForm.transferInType,
                    is_export: this.export,
                    page: page,
                    page_size: this.pageSize,
                },
            })
        },

        tableLoad(num) {
            this.loading = true;
            this.addAmount = '';
            this.amount = '';
            this.requestTable(num).then(res => {
                if (res.data.code === 200) {
                    this.date = res.data.data.date;
                    this.tableData = res.data.data.list;
                    this.addAmount = res.data.data.total.transfer_income;
                    this.amount = res.data.data.total.transfer_refund;
                    this.total = Number(res.data.data.pagination.total);
                    this.currentPage = num;
                }
            }).catch((error) => {
                console.warn(error);
            }).finally(() => {
                this.loading = false;
            });
        },

        reset(){
            this.transferForm.transferSelectValue = 'adv';
            this.transferForm.transferInAccountValue = 'transfer_in_adv_id';
            this.transferForm.transferOutAccountValue = 'transfer_out_adv_id';
            this.$refs.transferForm.resetFields();
        },

    }
}
</script>

<style scoped lang="scss">
    @import "src/views/Finance/ReportCommon";

    .search-content {
        /deep/ .el-select {
            width: 155px;

            .el-input--suffix .el-input__inner {
                padding-right: 0;
                width: 125px;
                min-width: initial;
            }
        }
    }

    .middle-title {
        margin-bottom: 16px;
    }
</style>

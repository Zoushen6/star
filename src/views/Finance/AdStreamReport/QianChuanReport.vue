<template>
    <div class="flex-vertical flex-1 m-l-r-16">
        <el-form class="customized-form padding-top background-white p-l-r-24" :inline="true" :model="optionsForm" ref="addOptions" >
            <div class="flex">
                <span class="inline-block form-item-title">基础筛选</span>
                <div class="flex-1">
                    <el-form-item prop="selectValue" :required="false" class="search-content">
                        <el-input :placeholder="optionsForm.selectValue==='advertise'?'请输入广告主账户或ID':'请输入代理商名称或ID'" v-model="optionsForm.inputValue" class="long-item input-with-select">
                            <el-select v-model="optionsForm.selectValue" slot="prepend" placeholder="选择类型">
                                <el-option v-for="item in selectType" :key="item.id" :label="item.value" :value="item.id"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="dateValue">
                        <customized-time-picker
                            class="time-picker long-item"
                            :date.sync="optionsForm.dateValue"
                            :shortcutsSetting="shortcutsSetting"
                            :max-date="1"
                            :min-date="minDate"
                        ></customized-time-picker>
                    </el-form-item>
                    <el-form-item class="search-btn">
                        <el-button type="primary" @click="search()">查询</el-button>
                        <el-button class="reset" @click="reset">重置</el-button>
                    </el-form-item>
                </div>
            </div>
        </el-form>

        <!-- 表格区 -->
        <div class="background-white m-t-b-20 flex-1 flex-vertical table-box">
            <div class="report-title p-l-r-24 m-t-b-16">
                <span class="update-time f-l">
                    <i>总支出：{{statistical.cost?statistical.cost:0}}&nbsp;元</i>
                    <i>总存入：{{statistical.income?statistical.income:0}}&nbsp;元</i>
                    <i>总转出：{{statistical.transfer_out?statistical.transfer_out:0}}&nbsp;元</i>
                    <i>总转入：{{statistical.transfer_in?statistical.transfer_in:0}}&nbsp;元</i>
                </span>
                <div class="inline-block f-r">
                    <el-button @click="downloadReport(1)" class="customized-button"><span class="iconfont icon-download"></span>下载报表</el-button>
                </div>
            </div>
            <customized-table
                class="customized-table mini-table flex-1 has-border p-l-r-24"
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
import PaginationMixin from "@mixins/PaginationMixin";
import {LastSeveralDays} from "@tools/DateUtils";
import {planList,header} from "@views/Finance/AdStreamReport/QianChuanReport.js";
import FinanceReportMixin from "@views/Finance/FinanceReportMixin";

export default {
    name: "QianChuanReport",

    mixins:[PaginationMixin,FinanceReportMixin],

    created() {
        this.header = header;
    },

    activated() {
        this.tableLoad();
    },

    deactivated(){
        this.reset()
    },

    data() {
        return {
            selectType: planList,
            statistical:{
                cost:'',
                transfer_in:'',
                transfer_out:'',
                income:'',
            },
            optionsForm: {
                dateValue: LastSeveralDays(1, 1),
                selectValue: 'advertiser',
                inputValue: '',
            },
        }
    },

    methods: {
        requestTable(page = 1) {
            return this.$http.get("report/qc/index", {
                params: {
                    start_date: this.$common.getNewDay(this.optionsForm.dateValue[0]),
                    end_date: this.$common.getNewDay(this.optionsForm.dateValue[1]),
                    [this.optionsForm.selectValue]: this.optionsForm.inputValue.trim(),
                    order: this.order,
                    sort: this.sort,
                    is_export: this.export?this.export:'',
                    page: page,
                    page_size: this.pageSize,
                },
            })
        },

        tableLoad(num) {
                this.loading = true;
                this.statistical = {};
                this.requestTable(num).then(res => {
                    if (res.data.code === 200) {
                        this.tableData = res.data.data.list;
                        this.statistical = res.data.data.total;
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
            this.optionsForm.inputValue = '';
            this.optionsForm.dateValue = LastSeveralDays(1,1)
        },

    }
}
</script>

<style scoped lang="scss">

    @import "src/views/Finance/ReportCommon";

    .search-content {
        /deep/ .el-select {
            width: 140px;
            .el-input--suffix .el-input__inner {
                width: 110px;
            }
        }
    }

    .update-time {
        color: $font-color-base;
        i {
          margin-right: 25px;
        }
    }

</style>

<template>
    <div class="flex-vertical flex-1 m-l-r-16">
        <el-form class="customized-form padding-top background-white p-l-r-24" :inline="true" :model="optionsForm"  >
            <div class="flex">
                <span class="inline-block form-item-title">基础筛选</span>
                <div class="flex-1">
                    <el-form-item prop="selectValue" :required="false" class="search-content">
                        <el-input :placeholder="optionsForm.selectValue==='advertiser'?'请输入广告主账户或ID':'请输入广告主公司名称或ID'" v-model="optionsForm.inputValue" class="long-item input-with-select">
                            <el-select v-model="optionsForm.selectValue" slot="prepend" placeholder="选择类型">
                                <el-option v-for="item in selectType" :key="item.id" :label="item.value" :value="item.id"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="search-btn">
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
                    <span class="update-time m-r-25">数据更新时间：{{dataUpdateDate}}</span>
                    <el-button @click="downloadReport(1)" class="customized-button"><span class="iconfont icon-download"></span>下载报表</el-button>
                </div>
            </div>
            <customized-table
                class="customized-table mini-table has-border flex-1 p-l-r-24"
                ref="customizedTable"
                :Header="header"
                :scroll-in-table="false"
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
import {planList,header} from "./BalanceQuery.js";
import FinanceReportMixin from "@views/Finance/FinanceReportMixin";

export default {
    name: "BalanceReport",

    components: {CustomizedTable},

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
            dataUpdateDate:'',
            value: '',
            selectType: planList,
            optionsForm: {
                selectValue: 'advertiser',
                inputValue: '',
            },
        }
    },

    methods: {

        requestTable(page = 1) {
            return this.$http.get("report/balance/index", {
                params: {
                    order: this.order,
                    sort: this.sort,
                    [this.optionsForm.selectValue]: this.optionsForm.inputValue.trim(),
                    is_export: this.export?this.export:'',
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
                        this.dataUpdateDate = res.data.data.date;
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

    .update-time {
        color: $font-color-secondary;
        margin-right: 24px;
    }

</style>

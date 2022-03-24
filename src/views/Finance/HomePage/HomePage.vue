<template>
        <div class="flex-1 flex-vertical m-l-r-16">
            <div class="basic-form">
                <el-form class="customized-form padding-top background-white p-l-r-24" :inline="true" ref="addOptions" >
                    <div class="flex basic">
                        <span class="inline-block form-title">基础筛选</span>
                        <div class="flex-1">
                            <el-form-item class="long-item">
                                <el-select v-model="company_id" placeholder="全部代理商客户 " clearable>
                                    <el-option v-for="item in agentCustomerList" :key="item.company_id" :label="item.company_name"
                                               :value="item.company_id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item class="search-btn">
                                <el-button type="primary" @click="search('addOptions')">查询</el-button>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>
            </div>

            <div class="data-board home-padding background-white m-t-16 m-b-16">
                <data-board ref="dataBoard" :company_id="company_id"></data-board>
            </div>

            <el-row :gutter="16">
                <el-col :span="12" :xs="24" class="m-b-16">
                    <common-cost-rank ref="accountRank" :company_id="company_id" :header="account_header" title="账户消耗排名" module="advertiser" xAxis_data="name" class="background-white home-padding"></common-cost-rank>
                </el-col>
                <el-col :span="12" :xs="24"  class="m-b-16">
                    <common-cost-rank ref="customerRank" :company_id="company_id" :header="customer_header" module="customer"  xAxis_data="customer_name" title="客户消耗排名" class="background-white home-padding"></common-cost-rank>
                </el-col>
            </el-row>

            <el-row :gutter="16">
                <el-col :span="14" :xs="24" class="data-trend-ratio m-b-16">
                    <data-trend-ratio ref="dataTrendRatio" :company_id="company_id" class="background-white home-padding"></data-trend-ratio>
                </el-col>
                <el-col :span="10" :xs="24" class="cost-slice m-b-16">
                    <cost-slice ref="costSlice" :company_id="company_id" class="background-white home-padding"></cost-slice>
                </el-col>
            </el-row>

            <el-row class="m-b-16" :gutter="16">
                <el-col :span="12" :xs="24" class="industry-compare">
                    <compare-analysis ref="compareTopAnalysis" module="industry" xAxis_data="first_industry_name" :company_id="company_id" class="home-padding background-white"></compare-analysis>
                </el-col>
                <el-col :span="12" :xs="24" class="industry-compare">
                    <compare-analysis ref="compareAnalysis" module="inventory" xAxis_data="inventory" :title="title" :company_id="company_id" class="home-padding background-white"></compare-analysis>
                </el-col>
            </el-row>
        </div>
</template>

<script>
import dataBoard from "@views/Finance/HomePage/DataBoard/DataBoard.vue";
import commonCostRank from "@views/Finance/HomePage/CommonCostRank/CommonCostRank.vue";
import dataTrendRatio from "@views/Finance/HomePage/DataTrendRatio/DataTrendRatio.vue";
import CostSlice from "@views/Finance/HomePage/CostSlice/CostSlice.vue";
import {account_header} from "@views/Finance/HomePage/CommonCostRank/AccountCostRank.js";
import {customer_header} from "@views/Finance/HomePage/CommonCostRank/CustomerCostRank.js";
import CompareAnalysis from "@views/Finance/HomePage/CompareAnalysis/CompareAnalysis.vue";
import HomePageMixin from "@views/Finance/HomePage/HomePageMixin";

export default {
    name: "HomePage",

    mixins:[HomePageMixin],

    components: {
        CostSlice,
        dataBoard,
        commonCostRank,
        dataTrendRatio,
        CompareAnalysis
    },

    mounted(){
        this.handleAgent()
    },

    data(){
        return{
            title: '投放平台对比分析',
            account_header,
            customer_header,
            agentCustomerList: {},
            company_id:'',
        }
    },


    methods: {

        handleAgent(){
            this.$http.get("/report/finance/get-labels").then(res=>{
                if(res.data.code === 200) {
                    this.agentCustomerList = res.data.data.company;
                }
            })
        },

        search(){
            Object.keys(this.$refs).forEach(key => {
                const component = this.$refs[key];
                if (component.searchFn && typeof component.searchFn === 'function') {
                    component.searchFn();
                }
            })
        },
    }
}
</script>

<style scoped lang="scss">
    .home-padding {
        padding: 16px 24px;
    }
</style>
<style lang="scss">
@import "HomePage";
</style>

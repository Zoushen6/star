<template>
    <div class="flex-vertical flex-1">
        <el-form class="customized-form padding-top background-white p-l-r-24 m-l-r-16" :inline="true"
                 :model="optionsForm"
                 :rules="addOptionsRule" ref="addOptions">
            <div class="flex">
                <span class="inline-block form-item-title">基础筛选</span>
                <div class="flex-1">
                    <el-form-item prop="dateValue">
                        <customized-time-picker
                            class="time-picker long-item"
                            :date.sync="optionsForm.dateValue"
                            :shortcutsSetting="shortcutsSetting"
                            :max-date="1"
                            :min-date="minDate"
                        ></customized-time-picker>
                    </el-form-item>
                    <el-form-item prop="selectValue" :required="false" class="search-content">
                        <el-input placeholder="请输入所要查询的内容" v-model="optionsForm.inputValue"
                                  class="long-item input-with-select">
                            <el-select v-model="optionsForm.selectValue" slot="prepend" placeholder="选择类型" clearable>
                                <el-option v-for="item in selectType" :key="item.id" :label="item.value"
                                           :value="item.id"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="long-item" prop="agentCustomer">
                        <el-select v-model="optionsForm.agentCustomer" placeholder="全部代理商客户" clearable
                                   @change="getAgentCustomer">
                            <el-option v-for="item in optionsForm.agentCustomerList" :key="item.company_id"
                                       :label="item.company_name"
                                       :value="item.company_id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="agent-account-item" prop="agentAccount">
                        <el-select v-model="optionsForm.agentAccount" placeholder="全部代理商账户" clearable
                                   @change="getAgentAccount">
                            <el-option v-for="item in optionsForm.agentAccountList" :key="item.agent_id"
                                       :label="item.agent_name"
                                       :value="item.agent_id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="agent-account-item" prop="subAgentAccount">
                        <el-select v-model="optionsForm.subAgentAccount" placeholder="全部子代理商账户" clearable
                                   @change="getSubAgentAccount">
                            <el-option v-for="item in optionsForm.subAgentAccountList" :key="item.agent_id"
                                       :label="item.agent_name"
                                       :value="item.agent_id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="long-item" prop="platform">
                        <el-select v-model="optionsForm.platform" placeholder="投放平台" clearable>
                            <el-option v-for="item in optionsForm.platFormList" :key="item.key" :label='item.value'
                                       :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="search-btn">
                        <el-button type="primary" @click="search('addOptions')">查询</el-button>
                        <el-button class="reset" @click="reset">重置</el-button>
                    </el-form-item>
                </div>
            </div>
        </el-form>
        <basic-report
            ref="basicReport"
            :tableHeader="header"
            showCost="consume"
            storageName="financeCenterConsumeReport"
            sumUrl="/report/finance/adv-by-inventory-sum"
            tableDataUrl="/report/finance/adv-by-inventory"
            :formData="optionsForm"
        ></basic-report>
    </div>
</template>

<script>
import {LastSeveralDays} from "@tools/DateUtils";
import FinanceReportMixin from "@views/Finance/FinanceReportMixin";
import BasicReport from "@views/Finance/BasicReport/BasicReport.vue";
import {planList, header} from "@views/Finance/BasicReport/ConsumeReport/ConsumeReport.js";

export default {
    name: "ConsumeReport",

    components: {BasicReport},

    mixins: [FinanceReportMixin],

    activated() {
        this.consumeReportPlatform();
        this.handleAgent();
    },

    deactivated() {
        this.reset();
    },

    data() {
        return {
            selectType: planList,
            header,
            shortcutsSetting: ['yesterday', 'lastSeven', 'lastThirty', 'lastWeek', 'lastMonth'],
            optionsForm: {
                selectValue: 'advertiser_id',
                inputValue: '',
                dateValue: LastSeveralDays(7, 1),
                agentCustomer: '',
                agentCustomerList: [],
                agentAccount: '',
                agentAccountList: [],
                subAgentAccount: '',
                subAgentAccountList: [],
                platform: '',
                platFormList: []
            },
            addOptionsRule: {
                dateValue: [
                    {validator: this.dateValueValidate, message: "单次查询时间跨度不能超过30天！"}
                ]
            },
        }
    },

    methods: {
        getAgentCustomer(company_id) {
            this.handleAgent({
                company_id,
                agent_id: this.optionsForm.agentAccount,
                child_agent_id: this.optionsForm.subAgentAccount
            });
        },

        getAgentAccount(agent_id) {
            this.handleAgent({
                agent_id,
                company_id: this.optionsForm.agentCustomer,
                child_agent_id: this.optionsForm.subAgentAccount
            });
        },

        getSubAgentAccount(child_agent_id) {
            this.handleAgent({
                child_agent_id,
                agent_id: this.optionsForm.agentAccount,
                company_id: this.optionsForm.agentCustomer
            })
        },

        search() {
            this.$refs.basicReport.tableLoad();
        },

        handleAgent(params) {
            this.$http.get("/report/finance/get-labels", {params}).then(res => {
                if (res.data.code === 200) {
                    this.optionsForm.agentCustomerList = res.data.data.company;
                    this.optionsForm.agentAccountList = res.data.data.agent;
                    this.optionsForm.subAgentAccountList = res.data.data.child_agent;
                }
            })
        },

        consumeReportPlatform() {
            this.$http.get("/report/finance/get-adv-inventory").then(res => {
                if (res.data.code === 200) {
                    this.optionsForm.platFormList = res.data.data.list;
                }
            })
        },

        reset() {
            this.optionsForm.inputValue = '';
            this.$refs.addOptions.resetFields();
            this.handleAgent();
        },

        dateValueValidate(rule, value, callback) {
            if (value.length !== 2) callback(new Error());
            const res = Math.ceil((value[1] - value[0]) / (24 * 3600 * 1000)) <= 30;
            if (res) callback()
            else callback(new Error());
        },

    }
}
</script>

<style scoped lang="scss">
@import "src/views/Finance/ReportCommon";
@import "src/views/Finance/BasicReport/BasicReport";
</style>

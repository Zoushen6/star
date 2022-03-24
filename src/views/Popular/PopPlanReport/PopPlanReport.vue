<template>
    <div class="flex-vertical flex-1 m-l-r-16">
        <el-form class="customized-form padding-top background-white p-l-r-24" :inline="true">
            <div class="flex">
                <div class="flex-1">
                    <el-form-item prop="inputValue" class="search-content" label="计划状态">
                        <el-input placeholder="请输入所要查询的内容" class="long-item input-with-select">
                            <el-select placeholder="选择类型" clearable>
                                <el-option label="" value=""></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="inputValue" class="search-content" label="关联用户">
                        <el-input placeholder="请输入所要查询的内容" class="long-item input-with-select">
                            <el-select placeholder="选择类型" clearable>
                                <el-option label="" value=""></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="inputValue" class="search-content" label="计划创建日期">
                        <el-input placeholder="请输入所要查询的内容" class="long-item input-with-select">
                            <el-select placeholder="选择类型" clearable>
                                <el-option label="" value=""></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="f-r search-btn">
                        <el-button type="primary" @click="searchFn">查询</el-button>
                        <el-button class="reset" @click="reset">重置</el-button>
                    </el-form-item>
                </div>
            </div>
        </el-form>

        <!-- 表格区 -->
        <div class="background-white m-t-b-20 flex-1 flex-vertical table-box">
            <customized-table
                class="flex-1 customized-table has-border mini-table p-l-r-24"
                ref="customizedTable"
                :scroll-in-table="false"
                :Selection="Selection"
                :Header="header"
                :loading="loading"
                :Data="tableData"
                :total="total"
                :page-size="pageSize"
                :current-page="currentPage"
                @size-change="val=>{pageSizeChange(tableLoad,this,val)}"
                @current-change="val=>{pageChange(tableLoad,this,val)}"
                @sort-change="sortChangeHandle"
            >
                <template v-slot:status="{row}">
                    <el-switch
                        v-model="row.status"
                        inactive-text=""
                        :active-value="0"
                        :inactive-value="1"
                        @change="val=>switchTheRoleStatus(val,row)"
                    >
                    </el-switch>
                </template>
            </customized-table>
        </div>
        <!-- /表格区 -->
    </div>
</template>

<script>
import PaginationMixin from "@mixins/PaginationMixin";
import {header} from '@views/Popular/PopPlanReport/PopPlanReport.js'

export default {
    name: "PopPlanReport",
    mixins: [PaginationMixin],
    created() {
        this.header = header;
    },
    data() {
        return {
            Selection: true,
            tableData:[
                {
                    status: '启用',
                    plan_name: 'A计划',
                    date: '2022-03-22',
                    advertiser_id: '上海新数网络',
                    cost: '1000',
                    show: '100',
                    click: '10000',
                    adv_show: '890',
                    adv_click: '200',
                    adv_price: '12',
                    clicks: '20%'
                },{
                    status: '启用',
                    plan_name: 'A计划',
                    date: '2022-03-22',
                    advertiser_id: '上海新数网络',
                    cost: '1000',
                    show: '100',
                    click: '10000',
                    adv_show: '890',
                    adv_click: '200',
                    adv_price: '12',
                    clicks: '20%'
                },{
                    status: '启用',
                    plan_name: 'A计划',
                    date: '2022-03-22',
                    advertiser_id: '上海新数网络',
                    cost: '1000',
                    show: '100',
                    click: '10000',
                    adv_show: '890',
                    adv_click: '200',
                    adv_price: '12',
                    clicks: '20%'
                }
            ]
        }
    },
    methods: {
        sortChangeHandle() {

        },

        switchTheRoleStatus() {

        },

        searchFn() {

        },

        reset() {

        }
    }
}
</script>

<style scoped lang="scss">
@import "src/views/Finance/ReportCommon";
.search-content {
    /deep/.el-form-item__label {
            line-height: 32px;
    }
}

.table-box {
    padding-top: 16px;
}
</style>
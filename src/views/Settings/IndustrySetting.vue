<template>
    <div class="flex-vertical flex-1 setting-box">
        <el-form :inline="true" class="customized-form padding-top">
            <el-form-item>
                <el-button type="primary" @click="addIndustry">添加行业</el-button>
            </el-form-item>
            <el-form-item class="middle-item">
                <el-input
                    placeholder="请输入关键词搜索"
                    v-model="industryQuery"
                    @input="handleSearch(industryQuery)"
                >
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </el-form-item>
        </el-form>
        <!-- 表格区 -->
        <customized-table
            class="flex-1 flex-vertical overflow-hidden customized-table"
            :scroll-in-table="false"
            :loading="loading"
            :Data="tableData"
            :Header="header"
            ref="customizedTable"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @size-change="val=>{pageSizeChange(tableLoad,this,val)}"
            @current-change="val=>{pageChange(tableLoad,this,val)}"
            @edit="handleEdit"
            @delete="handleDelete"
        >
        </customized-table>
        <!-- /表格区 -->

        <!-- 行业编辑弹窗 -->
        <customized-dialog
            class="customized-dialog"
            :title="title"
            :width="600"
            :visible="visibleIndustryDialog"
            @close="resetIndustryDialog('ruleForm')"
            :showFooter="show"
            @submit="title=='添加行业'?addSubmit('ruleForm'):editSubmit('ruleForm')"
            @cancel="resetIndustryDialog('ruleForm')"
        >
            <el-form label-width="80px" :model="ruleForm" :rules="rules" ref="ruleForm" class="dialog-form">
                <el-form-item label="行业名称" prop="industryName">
                    <el-input maxlength="10" show-word-limit v-model="ruleForm.industryName"
                              :placeholder="title=='添加行业'?'请输入一级行业名称':''"></el-input>
                </el-form-item>
                <el-form-item prop="industrySecondName">
                    <el-input maxlength="10" show-word-limit v-model="ruleForm.industrySecondName"
                              :placeholder="title=='添加行业'?'请输入二级行业名称':''"></el-input>
                </el-form-item>
                <el-form-item label="行业详情">
                    <el-input v-model="industryDetail" :placeholder="title=='添加行业'?'请填写内容，字数不超过50':''" class="dialog-textarea"
                              type="textarea" maxlength="50" show-word-limit></el-input>
                </el-form-item>
            </el-form>
        </customized-dialog>
        <!-- /行业编辑弹窗 -->

        <!-- 行业删除弹窗 -->
        <customized-dialog
            title="提示"
            :width="507"
            :visible="visibleIndustryDeleteDialog"
            @close="resetIndustryDeleteDialog"
            :showFooter="show"
            @submit="deleteSubmit"
            @cancel="deleteCancel"
        >
            <div class="deleteDialog">
                <p class="content">
                    确定删除行业信息吗？
                </p>
            </div>
        </customized-dialog>
        <!-- /行业删除弹窗 -->
    </div>
</template>

<script>

import PaginationMixin from "@mixins/PaginationMixin";
import HEADER from "@views/Settings/IndustrySetting.js"
import ThrottleMixin from "@mixins/ThrottleMixin";
import TableHeightHandleMixin from "@mixins/TableHeightHandleMixin";

export default {

    name: "industrySetting",

    mixins: [PaginationMixin, ThrottleMixin, TableHeightHandleMixin],

    created() {
        this.header = HEADER;
    },

    activated() {
        this.tableLoad();
    },

    deactivated() {
        this.resetSearch();
    },

    data() {
        return {
            id: '',
            title: '',
            industryQuery: '',
            industryDetail: '',
            visibleIndustryDialog: false,
            visibleIndustryDeleteDialog: false,
            show: true,
            ruleForm: {
                industryName: '',
                industrySecondName: '',
            },
            rules: {
                industryName: [
                    {required: true, message: "请输入一级行业名称"}
                ],
                industrySecondName: [
                    {required: true, message: "请输入二级行业名称"}
                ]
            },
            tableData: []
        }
    },

    methods: {

        resetSearch(){
            this.industryQuery = '';
        },

        resetIndustryData() {
            this.industryDetail = '';
            this.ruleForm.industryName = '';
            this.ruleForm.industrySecondName = '';
        },

        //添加行业
        addIndustry() {
            this.title = '添加行业';
            this.visibleIndustryDialog = true;
            this.resetIndustryData();
        },

        //搜索关键词
        handleSearch(val) {
            this.axiosTable();
            this.throttle(this.tableLoad, this, 500);
        },

        axiosTable(page) {
            return this.$http.get("/order/order-def/index", {
                params: {
                    type: 1,
                    search: this.industryQuery,
                    page: page,
                    page_size: this.pageSize,
                }
            });
        },

        //表格初次加载或reload
        tableLoad(numb) {
            this.loading = true;
            this.axiosTable(numb).then((res) => {
                if (res && res.data.code === 200) {
                    this.total = Number(res.data.data.pagination.total);
                    this.tableData = res.data.data.list;
                    this.currentPage = numb
                }
            }).catch((error) => {
                console.warn(error);
            }).finally(() => {
                this.loading = false;
            });
        },

        resetIndustryDialog() {
            this.visibleIndustryDialog = false;
            this.$refs["ruleForm"].resetFields();
            this.resetIndustryData();
        },

        handleEdit(row) {
            this.title = '行业编辑';
            this.visibleIndustryDialog = true;
            if (this.title == '行业编辑') {
                this.id = row.id;
                this.industryDetail = row.detail;
                this.ruleForm.industryName = row.item.split('/')[0];
                this.ruleForm.industrySecondName = row.item.split('/')[1];
            }
        },

        editSubmit() {
            this.$refs["ruleForm"].validate((valid) => {
                if (valid) {
                    this.$http.post("/order/order-def/update", {
                        type: 1,
                        id: this.id,
                        item: this.ruleForm.industryName + '/' + this.ruleForm.industrySecondName,
                        detail: this.industryDetail
                    }).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                message: "编辑成功",
                                type: "success"
                            })
                            this.tableLoad();
                            this.visibleIndustryDialog = false;
                            this.$refs["ruleForm"].resetFields();
                            this.resetIndustryData();
                        }
                    })
                }
            })
        },

        addSubmit() {
            this.$refs["ruleForm"].validate((valid) => {
                if (valid) {
                    this.$http.post("/order/order-def/create", {
                        type: 1,
                        item: this.ruleForm.industryName + '/' + this.ruleForm.industrySecondName,
                        detail: this.industryDetail
                    }).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                message: "添加成功",
                                type: "success"
                            })
                            this.tableLoad();
                            this.visibleIndustryDialog = false;
                            this.$refs["ruleForm"].resetFields();
                            this.resetIndustryData();
                        }
                    })
                }
            })
        },

        handleDelete(row) {
            this.visibleIndustryDeleteDialog = true;
        },

        resetIndustryDeleteDialog() {
            this.visibleIndustryDeleteDialog = false;
        },

        deleteSubmit() {

        },

        deleteCancel() {
            this.visibleIndustryDeleteDialog = false;
        },

    }
}
</script>

<style scoped lang="scss">
    @import "CommonStyle";
</style>

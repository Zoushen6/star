<template>
    <div class="setting-box flex-1 overflow-hidden flex-vertical">
        <el-form :inline="true" class="customized-form padding-top">
            <el-form-item>
                <el-button type="primary" @click="addMedia">添加媒体</el-button>
            </el-form-item>
            <el-form-item class="middle-item">
                <el-input
                    placeholder="请输入关键词搜索"
                    v-model="mediaQuery"
                    @input="handleSearch(mediaQuery)"
                >
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </el-form-item>
        </el-form>

        <!-- 表格区 -->
        <customized-table
            class="flex-1 overflow-hidden flex-vertical customized-table"
            :loading="loading"
            :Data="tableData"
            :Header="header"
            :total="total"
            ref="customizedTable"
            :page-size="pageSize"
            :current-page="currentPage"
            @size-change="val=>{pageSizeChange(tableLoad,this,val)}"
            @current-change="val=>{pageChange(tableLoad,this,val)}"
            @edit="handleEdit"
            @delete="handleDelete"
        >
        </customized-table>
        <!-- /表格区 -->

        <!-- 媒体编辑弹窗 -->
        <customized-dialog
            class="customized-dialog"
            :title="title"
            :width="600"
            :visible="visibleMediaDialog"
            @close="resetMediaDialog('ruleForm')"
            :showFooter="show"
            @submit="title=='添加媒体'?addSubmit('ruleForm'):editSubmit('ruleForm')"
            @cancel="resetMediaDialog('ruleForm')"
        >
            <el-form label-width="80px" :model="ruleForm" :rules="rules" ref="ruleForm" class="dialog-form">
                <el-form-item label="媒体名称" prop="mediaName">
                    <el-input
                        maxlength="20"
                        show-word-limit
                        v-model="ruleForm.mediaName"
                        :placeholder="title=='添加媒体'?'请输入媒体名称':''"
                    ></el-input>
                </el-form-item>
                <el-form-item label="媒体补充">
                    <el-input v-model="mediaDetail" :placeholder="title=='添加媒体'?'请填写内容，字数不超过50':''" type="textarea" class="dialog-textarea"
                              maxlength="50" show-word-limit></el-input>
                </el-form-item>
            </el-form>
        </customized-dialog>
        <!-- /媒体编辑弹窗 -->

        <!-- 媒体删除弹窗 -->
        <customized-dialog
            title="提示"
            :width="507"
            :visible="visibleMediaDeleteDialog"
            @close="resetMediaDeleteDialog"
            :showFooter="show"
            @submit="deleteSubmit"
            @cancel="deleteCancel"
        >
            <div class="deleteDialog">
                <p class="content">
                    确定删除媒体信息吗？
                </p>
            </div>
        </customized-dialog>
        <!-- /媒体删除弹窗 -->
    </div>
</template>

<script>

import PaginationMixin from "@mixins/PaginationMixin";
import HEADER from "@views/Settings/MediaSetting.js"
import ThrottleMixin from "@mixins/ThrottleMixin";

export default {

    name: "MediaSetting",

    mixins: [PaginationMixin, ThrottleMixin],

    created() {
        this.header = HEADER;
        this.tableLoad();
    },

    data() {
        return {
            id: '',
            title: '',
            mediaQuery: '',
            mediaDetail: '',
            visibleMediaDialog: false,
            visibleMediaDeleteDialog: false,
            show: true,
            ruleForm: {
                mediaName: '',
            },
            rules: {
                mediaName: [
                    {required: true, message: "请输入媒体名称"}
                ]
            },
            tableData: []
        }
    },

    methods: {

        resetMediaData() {
            this.ruleForm.mediaName = '';
            this.mediaDetail = '';
        },

        //添加媒体
        addMedia() {
            this.title = '添加媒体';
            this.visibleMediaDialog = true;
        },

        //搜索关键词
        handleSearch(val) {
            this.axiosTable();
            this.throttle(this.tableLoad, this, 500);
        },

        axiosTable(page) {
            return this.$http.get("/order/order-def/index", {
                params: {
                    search: this.mediaQuery,
                    type: 3,
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

        resetMediaDialog() {
            this.visibleMediaDialog = false;
            this.$refs["ruleForm"].resetFields();
            this.resetMediaData();
        },

        handleEdit(row) {
            this.title = '媒体编辑';
            this.visibleMediaDialog = true;
            this.id = row.id;
            this.ruleForm.mediaName = row.item;
            this.mediaDetail = row.detail;
        },

        addSubmit() {
            this.$refs["ruleForm"].validate((valid) => {
                if (valid) {
                    this.$http.post("/order/order-def/create", {
                        type: 3,
                        item: this.ruleForm.mediaName,
                        detail: this.mediaDetail,
                    }).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                message: "添加成功",
                                type: "success"
                            })
                            this.tableLoad();
                            this.resetMediaData();
                            this.$refs["ruleForm"].resetFields();
                            this.visibleMediaDialog = false;
                        }
                    })
                }
            })
        },

        editSubmit() {
            this.$refs["ruleForm"].validate((valid) => {
                if (valid) {
                    this.$http.post('/order/order-def/update', {
                        type: 3,
                        id: this.id,
                        item: this.ruleForm.mediaName,
                        detail: this.mediaDetail
                    }).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                message: "编辑成功",
                                type: "success"
                            })
                            this.tableLoad();
                            this.visibleMediaDialog = false;
                            this.$refs["ruleForm"].resetFields();
                            this.resetMediaData();
                        }
                    })
                }
            })
        },

        handleDelete(row) {
            this.visibleMediaDeleteDialog = true;
        },

        resetMediaDeleteDialog() {
            this.visibleMediaDeleteDialog = false;
        },

        deleteSubmit() {

        },

        deleteCancel() {
            this.visibleMediaDeleteDialog = false;
        },


    }
}
</script>

<style scoped lang="scss">
    @import "CommonStyle";
</style>

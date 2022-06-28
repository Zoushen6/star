<template>
    <div class="setting-box flex-1 flex-vertical">
        <el-form :inline="true" class="customized-form padding-top">
            <el-form-item>
                <el-button type="primary" @click="addProduct">添加产品</el-button>
            </el-form-item>
            <el-form-item class="middle-item">
                <el-input
                    placeholder="请输入关键词搜索"
                    v-model="productQuery"
                    @input="handleSearch(productQuery)"
                >
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </el-form-item>
        </el-form>

        <!-- 表格区 -->
        <customized-table
            class="flex-1 flex-vertical customized-table"
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

        <!-- 产品编辑弹窗 -->
        <customized-dialog
            class="customized-dialog"
            :title="title"
            :width="600"
            :visible="visibleProductDialog"
            @close="resetProductDialog('ruleForm')"
            :showFooter="show"
            @submit="title=='添加产品'?addSubmit('ruleForm'):editSubmit('ruleForm')"
            @cancel="resetProductDialog('ruleForm')"
        >
            <el-form label-width="80px" :model="ruleForm" :rules="rules" ref="ruleForm" class="dialog-form">
                <el-form-item label="产品名称" prop="productName">
                    <el-input
                        maxlength="20"
                        show-word-limit
                        v-model="ruleForm.productName"
                        :placeholder="title=='添加产品'?'请输入产品名称':''"
                    ></el-input>
                </el-form-item>
                <el-form-item label="产品补充">
                    <el-input v-model="productDetail" :placeholder="title=='添加产品'?'请填写内容，字数不超过50':''" class="dialog-textarea"
                              type="textarea" maxlength="50" show-word-limit></el-input>
                </el-form-item>
            </el-form>
        </customized-dialog>
        <!-- /产品编辑弹窗 -->

        <!-- 产品删除弹窗 -->
        <customized-dialog
            title="提示"
            :width="507"
            :visible="visibleProductDeleteDialog"
            @close="resetProductDeleteDialog"
            :showFooter="show"
            @submit="deleteSubmit"
            @cancel="deleteCancel"
        >
            <div class="deleteDialog">
                <p class="content">
                    确定删除产品信息吗？
                </p>
            </div>
        </customized-dialog>
        <!-- /产品删除弹窗 -->
    </div>
</template>

<script>

import PaginationMixin from "@mixins/PaginationMixin";
import HEADER from "@views/Settings/ProductionSetting.js"
import ThrottleMixin from "@mixins/ThrottleMixin";

export default {

    name: "ProductionSetting",

    mixins: [PaginationMixin, ThrottleMixin],

    created() {
        this.header = HEADER;
        this.tableLoad();
    },

    data() {
        return {
            id: '',
            title: '',
            productQuery: '',
            productDetail: '',
            visibleProductDialog: false,
            visibleProductDeleteDialog: false,
            show: true,
            ruleForm: {
                productName: '',
            },
            rules: {
                productName: [
                    {required: true, message: "请输入产品名称"}
                ]
            },
            tableData: []
        }
    },

    methods: {

        resetProductData() {
            this.ruleForm.productName = '';
            this.productDetail = '';
        },

        //添加产品
        addProduct() {
            this.title = '添加产品';
            this.visibleProductDialog = true;
            this.resetProductData();
        },

        //搜索关键词
        handleSearch(val) {
            this.axiosTable();
            this.throttle(this.tableLoad, this, 500);
        },

        axiosTable(page) {
            return this.$http.get("/order/order-def/index", {
                params: {
                    search: this.productQuery,
                    type: 2,
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

        resetProductDialog() {
            this.visibleProductDialog = false;
            this.$refs["ruleForm"].resetFields();
            this.resetProductData();
        },

        handleEdit(row) {
            this.title = '产品编辑';
            this.visibleProductDialog = true;
            if (this.title == '产品编辑') {
                this.id = row.id;
                this.ruleForm.productName = row.item;
                this.productDetail = row.detail;
            }
        },

        addSubmit() {
            this.$refs["ruleForm"].validate((valid) => {
                if (valid) {
                    this.$http.post("/order/order-def/create", {
                        type: 2,
                        item: this.ruleForm.productName,
                        detail: this.productDetail,
                    }).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                message: "添加成功",
                                type: "success"
                            })
                            this.resetProductData();
                            this.$refs["ruleForm"].resetFields();
                            this.visibleProductDialog = false;
                            this.tableLoad();
                        }
                    })
                }
            })
        },

        editSubmit() {
            this.$refs["ruleForm"].validate((valid) => {
                if (valid) {
                    this.$http.post('/order/order-def/update', {
                        type: 2,
                        id: this.id,
                        item: this.ruleForm.productName,
                        detail: this.productDetail
                    }).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                message: "编辑成功",
                                type: "success"
                            })
                            this.tableLoad();
                            this.visibleProductDialog = false;
                            this.$refs["ruleForm"].resetFields();
                            this.resetProductData();
                        }
                    })
                }
            })
        },

        handleDelete(row) {
            this.visibleProductDeleteDialog = true;
        },

        resetProductDeleteDialog() {
            this.visibleProductDeleteDialog = false;
        },

        deleteSubmit() {

        },

        deleteCancel() {
            this.visibleProductDeleteDialog = false;
        },


    }
}
</script>

<style scoped lang="scss">
    @import "CommonStyle";
</style>

<template>
    <div class="setting-box flex-1 overflow-hidden flex-vertical">
        <el-form :inline="true" class="customized-form padding-top">
            <el-form-item>
                <el-button size="small" type="primary" @click="addDepartment">添加部门</el-button>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="addTeam">添加团队</el-button>
            </el-form-item>
            <el-form-item class="middle-item">
                <el-input
                    placeholder="请输入关键词搜索"
                    v-model="departmentQuery"
                    @input="handleSearch(departmentQuery)"
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
            ref="customizedTable"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            @size-change="val=>{pageSizeChange(tableLoad,this,val)}"
            @current-change="val=>{pageChange(tableLoad,this,val)}"
        >
        </customized-table>
        <!-- /表格区 -->

        <!-- 添加部门弹窗 -->
        <customized-dialog
            class="customized-dialog"
            :title="title"
            :width="600"
            :visible="visibleDepartmentDialog"
            @close="resetDepartmentDialog"
            :showFooter="show"
            @submit="title=='添加部门'?departmentSubmit('ruleForm'):teamSubmit('ruleForm')"
            @cancel="departmentCancel"
        >
            <el-form label-width="80px" :model="ruleForm" :rules="rules" ref="ruleForm" class="dialog-form">
                <el-form-item :label="title=='添加部门'?'部门名称':'团队名称'"
                              :prop="title=='添加部门'?'departmentName':'teamName'">
                    <el-input maxlength="20" show-word-limit v-if="title=='添加部门'" v-model="ruleForm.departmentName"
                              placeholder="请输入部门名称"></el-input>
                    <el-input maxlength="20" show-word-limit v-else v-model="ruleForm.teamName"
                              placeholder="请输入团队名称"></el-input>
                </el-form-item>
                <el-form-item v-if="title=='添加团队'" label="分配部门" class="item" prop="optionTeam">
                    <el-select v-model="ruleForm.optionTeam" placeholder="请选择部门名称"
                               @change="handleTeam(ruleForm.optionTeam)">
                        <el-option
                            v-for="(item,index) in departmentType" :key="index"
                            :label="item.department_name"
                            :value="item.department_id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="title=='添加部门'?'部门详情':'团队详情'">
                    <el-input v-if="title=='添加部门'" v-model="departmentDetail" placeholder="请填写内容，字数不超过50" class="dialog-textarea"
                              type="textarea" maxlength="50" show-word-limit></el-input>
                    <el-input v-else v-model="teamDetail" placeholder="请填写内容，字数不超过50" type="textarea" maxlength="50" class="dialog-textarea"
                              show-word-limit></el-input>
                </el-form-item>
            </el-form>
        </customized-dialog>
        <!-- /添加部门弹窗 -->
    </div>
</template>

<script>

import PaginationMixin from "@mixins/PaginationMixin";
import InfoFormMixin from "../../mixins/InfoFormMixin";
import HEADER from "@views/Settings/TeamSetting.js"
import ThrottleMixin from "@mixins/ThrottleMixin";

export default {

    name: "TeamSetting",

    mixins: [PaginationMixin, InfoFormMixin, ThrottleMixin],

    created() {
        this.header = HEADER;
        this.tableLoad();
    },

    data() {
        return {
            ruleForm: {
                departmentName: '',
                teamName: '',
                optionTeam: '',
            },
            title: '',
            departmentQuery: '',
            departmentDetail: '',
            teamDetail: '',
            departmentID: '',
            visibleDepartmentDialog: false,
            tableData: [],
            show: true,
            rules: {
                departmentName: [
                    {required: true, message: "请输入部门名称"}
                ],
                optionTeam: [
                    {required: true, message: "请选择分配部门"}
                ],
                teamName: [
                    {required: true, message: "请输入团队名称"}
                ]
            }
        }
    },

    methods: {

        handleSearch() {
            this.axiosTable();
            this.throttle(this.tableLoad, this, 500);
        },

        resetDepartmentData() {
            this.ruleForm.departmentName = '';
            this.departmentDetail = '';
        },

        resetTeamData() {
            this.ruleForm.teamName = '';
            this.teamDetail = '';
            this.ruleForm.optionTeam = '';
        },

        handleTeam(id) {
            this.department_id = id;
        },

        axiosTable(page) {
            return this.$http.get("/group/list", {
                params: {
                    keyword: this.departmentQuery,
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

        addDepartment() {
            this.title = "添加部门";
            this.visibleDepartmentDialog = true;
        },

        resetDepartmentDialog() {
            this.resetDepartmentData();
            this.resetTeamData();
            this.visibleDepartmentDialog = false;
            this.$refs["ruleForm"].resetFields();
        },

        addTeam() {
            this.title = "添加团队";
            this.visibleDepartmentDialog = true;
        },

        departmentSubmit() {
            this.$refs["ruleForm"].validate((valid) => {
                if (valid) {
                    this.$http.post("/department/create", {
                        name: this.ruleForm.departmentName,
                        desc: this.ruleForm.departmentDetail
                    }).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                message: "添加成功",
                                type: "success"
                            })
                            this.visibleDepartmentDialog = false;
                            this.handleDepartment();
                            this.resetDepartmentData();
                            this.$refs["ruleForm"].resetFields();
                        }
                    })
                }
            })
        },

        teamSubmit() {
            this.$refs["ruleForm"].validate((valid) => {
                if (valid) {
                    this.$http.post("/group/create", {
                        name: this.ruleForm.teamName,
                        desc: this.teamDetail,
                        department_id: this.department_id
                    }).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                message: "添加成功",
                                type: "success"
                            })
                            this.visibleDepartmentDialog = false;
                            this.tableLoad();
                            this.resetTeamData();
                            this.$refs["ruleForm"].resetFields();
                        }
                    })
                }
            })
        },

        departmentCancel() {
            this.resetDepartmentData();
            this.resetTeamData();
            this.visibleDepartmentDialog = false;
            this.$refs["ruleForm"].resetFields();
        },

    }
}
</script>

<style scoped lang="scss">
    @import "CommonStyle";
</style>

<template>
    <div class="setting-box flex-1 overflow-hidden flex-vertical">
        <el-form :model="searchForm"  ref="searchForm" :inline="true" class="customized-form padding-top">
            <el-form-item prop="log_time">
                <customized-time-picker
                    class="date-range-without-close-icon time-picker long-item"
                    :date.sync="searchForm.value"
                    :shortcutsSetting="shortcutsSetting"
                    :max-date="0"
                ></customized-time-picker>
            </el-form-item>
            <el-form-item prop="all_videoDepartment">
                <el-select v-model="searchForm.all_videoDepartment" placeholder="选择部门" @change="getDepartment" clearable class="middle-item">
                    <el-option v-for="(item,idx) in departmentType" :key="idx" :label="item.department_name" :value="item.department_id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="all_videoTeam">
                <el-select v-model="searchForm.all_videoTeam" placeholder="选择团队" clearable class="middle-item">
                    <el-option v-for="(item,idx) in groupType" :key="idx" :label="item.group_name" :value="item.group_id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="dimension">
                <el-select v-model="searchForm.dimension" placeholder="选择角色维度" clearable class="middle-item">
                    <el-option v-for="(item,idx) in dimensionList" :key="idx" :label="item.role_name" :value="item.role_id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="user_id">
                <el-select v-model="searchForm.user_id" placeholder="选择用户名称" clearable class="middle-item">
                    <el-option v-for="(item,idx) in userList" :key="idx" :label="item.user_name" :value="item.user_id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="role">
                <el-select v-model="searchForm.role" placeholder="选择用户角色" clearable class="long-item">
                    <el-option v-for="(item,idx) in userRoleList" :key="idx" :label="item.role_name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="result">
                <el-select v-model="searchForm.result" placeholder="选择操作结果" clearable class="long-item">
                    <el-option v-for="(item,idx) in opResultList" :key="idx" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="operate_content">
                <el-input prefix-icon="el-icon-search" placeholder="请输入操作内容" v-model="searchForm.operate_content" class="middle-item" clearable>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchFn">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="resetForm('searchForm')">重置</el-button>
            </el-form-item>
            <el-form-item>
                <el-button class="blue-button" type="primary" @click="downloadReport">下载日志报表</el-button>
            </el-form-item>
        </el-form>
        <!-- 表格区 -->
        <customized-table
            class="flex-1 overflow-hidden flex-vertical customized-table"
            :loading="loading"
            :Data="logList"
            :Header="header"
            ref="customizedTable"
            :total="total"
            :row-style="{height: '80px'}"
            :page-size="pageSize"
            :current-page="currentPage"
            @size-change="val=>{pageSizeChange(tableLoad,this,val)}"
            @current-change="val=>{pageChange(tableLoad,this,val)}"
        >
            <template v-slot:opResult="{row}">
                <svg-icon :icon-name="row.status?'opsuccess':'opfail'"></svg-icon>
            </template>
        </customized-table>
        <!-- /表格区 -->
    </div>
</template>

<script>

    import PaginationMixin from "@mixins/PaginationMixin";
    import HEADER from "@views/Settings/OperateLog.js"
    import InfoFormMixin from "@mixins/InfoFormMixin";
    import TimePickerMixin from "@mixins/TimePickerMixin";
    import {LastSeveralDays} from "@tools/DateUtils";

    export default {
        name: "OperateLog",
        mixins: [PaginationMixin,InfoFormMixin,TimePickerMixin],
        created(){
            this.header = HEADER;
        },
        mounted() {
            this.tableLoad(1); //初次加载table
            this.getThreeList()
        },
        data() {
            return {
                logList:[],
                searchForm: {
                    value: LastSeveralDays(7,0),
                    all_videoDepartment:'',
                    all_videoTeam:'',
                    dimension:'',
                    user_id:'',
                    role:'',
                    result:'',
                    operate_content:''
                },
                opResultList:[
                    {
                        label:'操作成功',
                        value:1
                    },{
                        label:'操作失败',
                        value:0
                    },
                ],
                dimensionList:[],
                userList:[],
                userRoleList:[],
            }
        },
        methods:{
            axiosTable(page) {
                return this.$http.get("tool/log/index", {
                    params: {
                        stat_start_time: this.searchForm.value.length !== 0 ? this.$common.getNewDay(this.searchForm.value[0]) : '',
                        stat_end_time: this.searchForm.value.length !== 0 ? this.$common.getNewDay(this.searchForm.value[1]) : '',
                        group_id: this.searchForm.all_videoTeam,
                        department_id: this.searchForm.all_videoDepartment,
                        role_id: this.searchForm.dimension,
                        user_id:this.searchForm.user_id,
                        user_role_id: this.searchForm.role,
                        status:this.searchForm.result,
                        title:this.searchForm.operate_content,
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
                        this.logList = res.data.data.list;
                        this.currentPage = numb
                    }
                }).catch((error) => {
                    console.warn(error);
                }).finally(() => {
                    this.loading = false;
                });
            },

            getDepartment(val){
            },

            searchFn(){
                this.tableLoad(1);
            },

            resetForm(formName){
                this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                    this.searchForm.value = LastSeveralDays(7,0)
                })
            },

            downloadReport(){
                this.$http.get("/tool/log/index", {
                    params: {
                        stat_start_time: this.searchForm.value.length != 0 ? this.$common.getNewDay(this.searchForm.value[0]) : '',
                        stat_end_time: this.searchForm.value.length != 0 ? this.$common.getNewDay(this.searchForm.value[1]) : '',
                        group_id: this.searchForm.all_videoTeam,
                        department_id: this.searchForm.all_videoDepartment,
                        role_id: this.searchForm.dimension,
                        user_id:this.searchForm.user_id,
                        user_role_id: this.searchForm.role,
                        status:this.searchForm.result,
                        title:this.searchForm.operate_content,
                        is_export: 1,
                    },
                    responseType: 'blob'
                }).then(res => {
                    this.$common.downloadFileBlob(res);
                })
            },

            //获取三个列表
            getThreeList(){
                this.getDimensionist().then((res => {
                    this.dimensionList = res.data.data;
                }));
                this.getUserList().then((res => {
                    this.userList = res.data.data;
                }));
                this.getUseraRoleList().then((res => {
                    this.userRoleList = res.data.data;
                }))
            },

            //角色维度列表
            getDimensionist(){
                return this.$http.get("tool/log/role-dimension-list");
            },

            //用户名称列表
            getUserList(){
                return this.$http.get("tool/log/user-list");
            },

            //用户角色列表
            getUseraRoleList(){
                return this.$http.get("tool/log/user-role-list");
            },
        }
    }
</script>

<style scoped lang="scss">

    /deep/.el-table {
        .el-table__cell {
            padding: 15px 0;
        }
    }

</style>

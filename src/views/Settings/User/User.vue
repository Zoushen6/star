<template>
    <div class="setting-box flex-1 overflow-hidden flex-vertical">

            <!-- 筛选区 -->
                <el-form :inline="true" class="clear-float customized-form padding-top">
                    <el-form-item v-if="userTypeRoute & ADMIN_ROUTE_MASK" class="middle-item">
                        <el-select v-model="memberValue" placeholder="全部用户角色">
                            <el-option v-for="item in memberList" :key="item.role_id" :label="item.role_name"
                                       :value="item.role_id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="userTypeRoute & (ADMIN_ROUTE_MASK | IDEA_MANAGE_ROUTE_MASK | OPERATE_MANAGE_ROUTE_MASK)"  class="middle-item">
                        <el-select v-model="statusValue" placeholder="全部状态">
                            <el-option v-for="item in status" :key="item.id" :label="item.value"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="userTypeRoute & ADMIN_ROUTE_MASK" class="middle-item">
                        <el-select v-model="departmentValue" placeholder="全部部门">
                            <el-option v-for="item in departmentType" :key="item.department_id"
                                       :label="item.department_name" :value="item.department_id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="userTypeRoute & ADMIN_ROUTE_MASK" class="middle-item">
                        <el-select v-model="teamValue" placeholder="全部团队">
                            <el-option v-for="item in groupType" :key="item.group_id" :label="item.group_name"
                                       :value="item.group_id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="userTypeRoute & (ADMIN_ROUTE_MASK | IDEA_MANAGE_ROUTE_MASK | OPERATE_MANAGE_ROUTE_MASK)" class="middle-item">
                        <el-input placeholder="请输入搜索内容" v-model="inputValue" class="input-with-select">
                            <template slot="prepend">姓名</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="short-button" type="primary" size="small" @click="searchFn">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="short-button" size="small" @click="resetForm">重置</el-button>
                    </el-form-item>
                    <el-form-item class="f-r">
                        <el-button type="primary" @click="addNew" class="main-button" size="small">新增账号</el-button>
                    </el-form-item>
                </el-form>

            <!-- 筛选区 -->

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
                @editAccount="editAccount"
                @deleteAccount="deleteAccount"
                @resetPwd="resetPwd"
                @configure="configure"
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
            <!-- /表格区 -->


            <!-- 新增账号弹框 -->
            <customized-dialog
                class="add-new"
                :title="dialogTitle"
                :visible="dialogVisible"
                :show-footer="true"
                :width="600"
                @cancel="resetDialog('addForm')"
                @submit="submitAdd('addForm')"
                @close="resetDialog('addForm')"
            >
                <el-form v-loading="dialogLoading" element-loading-background="transparent" ref="addForm" :model="addForm" :rules="addRules" label-width="100px" label-position="right"
                         class="dialog-body">
                    <el-form-item label="账号名称" prop="username">
                        <el-input v-model="addForm.username" :disabled="isEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="用户姓名" prop="name">
                        <el-input v-model="addForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="用户角色"  prop="type">
                        <el-cascader
                            :disabled="!!(userTypeRoute & OPERATE_MANAGE_ROUTE_MASK)"
                            v-model="addForm.type"
                            :options="addOptions"
                            :props="{value:'role_id',label:'role_name', expandTrigger: 'hover'}"
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item label="所属部门" prop="department_id" v-if="addForm.type[0]==='2'||addForm.type[0]==='3' || userTypeRoute & (IDEA_MANAGE_ROUTE_MASK | OPERATE_MANAGE_ROUTE_MASK)" >
                        <el-select v-model="addForm.department_id" placeholder="请选择" @change="changeDepartment(addForm.department_id)" :disabled="!!(userTypeRoute & (IDEA_MANAGE_ROUTE_MASK | OPERATE_MANAGE_ROUTE_MASK))">
                            <el-option
                                v-for="item in addDepartmentOptions"
                                :key="item.department_id"
                                :label="item.department_name"
                                :value="item.department_id"
                                >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属团队" prop="group_id" v-if="addForm.type[0]==='3' || userTypeRoute & IDEA_MANAGE_ROUTE_MASK" >
                        <el-select @visible-change="handleVisibleChange" v-model="addForm.group_id" placeholder="请选择" :disabled="!!(userTypeRoute & IDEA_MANAGE_ROUTE_MASK)">
                            <el-option
                                v-for="item in addTeamOptions"
                                :key="item.group_id"
                                :label="item.group_name"
                                :value="item.group_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </customized-dialog>
            <!-- /新增账号弹框 -->

            <!-- 删除弹窗-->
            <div class="delete">
            <customized-dialog
                :title="deleteDialogTitle"
                :visible="deleteDialogVisible"
                :show-footer="true"
                :width="507"
                @cancel="resetDeleteDialog()"
                @submit="subDeleteAccount()"
                @close="resetDeleteDialog()"
            >
            <p style="text-align:left; margin:-6px 0 24px 0px">确定删除账号【{{currentRow.username}}】</p>
            </customized-dialog>
            </div>
            <!-- /删除弹窗-->

            <!-- 重置密码弹窗-->
            <div class="reset">
            <customized-dialog
                :title="resetDialogTitle"
                :visible="resetDialogVisible"
                :show-footer="true"
                :width="507"
                @cancel="resetPwdDialog()"
                @submit="subResetAccount()"
                @close="resetPwdDialog()"
            >
                <p style="text-align:left;margin:-6px 0 24px 0px">确定要重置该用户密码吗？</p>
            </customized-dialog>
            </div>
            <!-- /重置密码弹窗-->

            <!-- 重置密码成功弹窗-->
            <div class="resetSuccess">
            <customized-dialog
                :title="resetDialogTitleCopy"
                :visible="resetDialogVisibleCopy"
                :width="600"
                @cancel="resetPwdDialogCopy()"
                @close="resetPwdDialogCopy()"
            >
                <el-form :model="resetPwdForm" label-width="80px" label-position="left"
                         class="dialog-body">
                <el-form-item label="账号名称" prop="username">
                    <el-input v-model="resetPwdForm.username" readonly="readonly" ></el-input>
                </el-form-item>
                <el-form-item label="账号密码" prop="password">
                    <el-input v-model="resetPwdForm.password" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="用户角色" prop="role_name">
                    <el-input v-model="resetPwdForm.role_name" disabled></el-input>
                </el-form-item>
                </el-form>
            </customized-dialog>
            </div>
            <!-- /重置密码成功弹窗-->

            <!-- 配置广告主 -->
            <div class="advertiser-dialog">
            <customized-dialog
                title="配置广告主"
                :visible="advertiserDialogVisible"
                :width="800"
                :height="522"
                @cancel="resetAdvertiserDialog"
                @close="resetAdvertiserDialog"
            >
                <div class="advertiser-dialog-header font-16">
                    <span>账号：{{currentRow.username}}</span>
                    <span class="main-gutter"></span>
                    <span>角色：{{currentRow.role_name}}</span>
                    <el-input
                        class="search-account"
                        placeholder="请输入搜索的账户名称"
                        prefix-icon="el-icon-search"
                        v-model="advertiserKeyword"
                        @input="handleSearchChange"
                        clearable>
                    </el-input>
                </div>

                <!-- 表格区 -->
                <customized-table
                    class="customized-table"
                    :loading="loadingCopy"
                    :Data="tableDataCopy"
                    :Header="headerCopy"
                    :total="totalCopy"
                    :max-height="null"
                    table-height="522"
                    :page-size="pageSizeCopy"
                    :current-page="currentPageCopy"
                    pagination-layout="total, prev, pager, next, jumper"
                    @current-change="val=>{pageChangeCopy(tableAdLoad,this,val)}"
                >

                    <template v-slot:switch="{row}">
                        <el-switch
                            v-model="row.status"
                            inactive-text="关联"
                            :active-value="1"
                            :inactive-value="0"
                            @change="val=>switchTheStatus(val,row)"
                            >
                        </el-switch>
                    </template>
                    <template v-slot:channel="{row}">
                        <span>{{channel[row.channel]}}</span>
                    </template>
                </customized-table>
                <!-- /表格区 -->

            </customized-dialog>
            </div>
            <!-- /配置广告主 -->
        </div>
</template>

<script>
    import {mapState} from 'vuex';
    import PaginationMixin from "@/mixins/PaginationMixin";
    import DialogMixin from "@/mixins/DialogMixin";
    import TableMixin from "@mixins/TableMixin";
    import ThrottleMixin from "@mixins/ThrottleMixin";
    import InfoFormMixin from "@mixins/InfoFormMixin";
    import _header from "./User.js"
    import _headerCopy from "./UserAd.js"
    import {StatusPool} from "@/views/Idea/Order/StatusPool";
    import {RouteAuthMixin} from "@mixins/ConfigMixin";

    export default {
        mixins: [PaginationMixin, DialogMixin,TableMixin,ThrottleMixin,InfoFormMixin, RouteAuthMixin],

        // 初始化数据
        data() {
            let checkEmail = (rule, value, callback) => {
                const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
                if (!value) {
                    return callback(new Error('邮箱不能为空'))
                }
                    if (mailReg.test(value)) {
                        callback()
                    } else {
                        callback(new Error('请输入正确的邮箱格式'))
                    }
            };

            return {
                allStatus:null,
                memberValue: "",
                statusValue: "",
                departmentValue: "",
                teamValue: "",
                memberOptions:[],
                inputValue:"",
                department_id:0,
                group_id:0,
                status: [
                    {
                        value: "已启用",
                        id: 0,
                    },
                    {
                        value: "已禁用",
                        id: 1,
                    }
                ],
                isEdit:false,
                dialogLoading:false,
                deleteDialogTitle:'提示',
                deleteDialogVisible:false,
                resetDialogTitle:'提示',
                resetDialogVisible:false,
                resetDialogTitleCopy:'重置密码成功',
                resetDialogVisibleCopy:false,
                advertiserDialogVisible: false,
                advertiserKeyword: '',
                //新增弹框form数据
                addForm: {
                    username: '',
                    name:'',
                    user_id:'',
                    type:'',
                    role_id:'',
                    department_id:'',
                    group_id:''
                },
                channel:{
                  1:"头条",
                  2:"快手"
                },
                //新增弹框form条件规则
                addRules: {
                    username: [
                        {required: true, validator: checkEmail}
                    ],
                    name:[
                        {required: true, message: "姓名不能为空"}
                    ],
                    type: [
                        {required: true, message: "请选择角色"}
                    ],
                    department_id: [
                        {required: true, message: "请选择部门"}
                    ],
                    group_id: [
                        {required: true, message: "请选择团队"}
                    ],
                },
                //新增弹窗角色下拉框
                addOptions:[],
                addDepartmentOptions:[],
                addTeamOptions:[],
                currentRow:{
                    username: '',
                    // email: '',
                    role_name:'',
                    type:'',
                    role_id:'',
                    department_id:'',
                    group_id:'',
                    user_id:''
                },
                resetPwdForm:{
                    username:'',
                    password:'',
                    role_name:''
                },
            }

        },

        // 数据格式化
        computed: {
            ...mapState({
                userTypeRoute: state => state.global.userTypeRoute,
            }),
        },

        // 方法集合
        methods: {
            //查询
            searchFn(){
                this.tableLoad(1);
            },

            //重置
            resetForm(){
                this.memberValue = "";
                this.statusValue = "";
                this.departmentValue = "";
                this.teamValue = "";
                this.inputValue = "";
            },

            //下拉选择团队
            handleVisibleChange(){},

            //点击编辑
            editAccount(row){
                this.dialogTitle = '编辑';
                this.isEdit = true;
                this.addForm.user_id = row.user_id;
                this.dialogVisible = true;
                this.dialogLoading = true;
                // 请求用户信息（所在部门和团队）
                this.axiosUserInfo(row.user_id).then((res) => {
                    if (res && res.data.code === 200){
                        this.addForm.department_id = res.data.data.department_id;
                        this.addForm.group_id = res.data.data.group_id;
                        this.addForm.name = res.data.data.name;
                        this.addForm.type = res.data.data.role_id;
                        this.addForm.username = res.data.data.username;
                    }
                }).catch((error) => {
                    console.log(error)
                }).finally(()=>{
                    if(this.addForm.group_id) {
                    this.getGroupList().then((res) => {
                        this.addTeamOptions = res.data.data;
                    }).finally(() =>{
                        this.dialogLoading = false;
                    })
                    }
                    this.dialogLoading = false;
                })
            },

            //点击删除
            deleteAccount(row){
                this.deleteDialogVisible = true
                this.currentRow = row
            },

            //确认删除
            subDeleteAccount(){
                this.axiosDelete(this.currentRow.user_id).then((res) => {
                    if (res.data.code === 200) {
                        this.$message({
                            message:"删除账号成功",
                            type:"success"
                        })
                    }
                }).catch((error) => {
                    console.warn(error);
                }).finally(() =>{
                    Object.keys(this.currentRow).forEach(key=>{this.currentRow[key]=''})
                    this.tableLoad(1);//重新加载表格
                })
                this.deleteDialogVisible = false;
            },

            //点击重置密码
            resetPwd(row){
                this.resetDialogVisible = true;
                this.currentRow = row;
            },

            subResetAccount(){
                this.axiosReset(this.currentRow.user_id).then((res) => {
                    if (res.data.code === 200) {
                        this.resetPwdForm = res.data.data;
                    }
                }).catch((error) => {
                    console.warn(error);
                }).finally(() => {
                    this.resetDialogVisible = false
                })
                this.resetDialogVisibleCopy = true
            },

            //点击配置广告主
            configure(row){
                this.advertiserDialogVisible = true;
                this.currentRow = row;
                this.tableAdLoad(1);
            },

            //关联
            switchTheStatus(val,row){
                let status = row.status ? 1 : 0;
                this.axiosSwitchStatus(row.advertiser_id, row.channel, status).then(res => {
                    if (res.data.code === 200) {
                        // this.tableAdLoad(this.currentPageCopy);
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },

            switchTheRoleStatus(val,row){
                let status = row.status;
                this.axiosSwitchRoleStatus(row.user_id, status).then(res => {
                    if (res.data.code === 200) {
                        if(status === 1){
                            this.$message({message:'账号：' + row.username + ' 已禁用', type: 'error'});
                        }else {
                            this.$message({message:'账号：' + row.username + ' 已启用', type: 'success'});
                        }
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },

            //配置广告主搜索节流
            handleSearchChange() {
                this.throttle(this.tableAdLoad, this, 500, this.currentPageCopy);
            },

            //表格数据请求
            /**
             *
             * @param page
             * @returns {Promise<AxiosResponse<any>>}
             */
            axiosTable(page) {
                return this.$http.get("user/list", {
                    params: {
                        page: page,
                        page_size: this.pageSize,
                        role_id: this.memberValue,
                        status: this.statusValue,
                        department_id: this.departmentValue,
                        group_id: this.teamValue,
                        name: this.inputValue,
                    }
                });
            },

            //点击编辑请求用户信息
            axiosUserInfo(id){
                return this.$http.get("user/info", {
                    params:{
                        user_id:id,
                    }
                });
            },

            //添加用户
            axiosAdd() {
                return this.$http.post("user/register", {
                    username: this.addForm.username,
                    name: this.addForm.name,
                    type: this.addForm.role_id,
                    role_id: this.addForm.role_id,
                    role_duty_id: this.addForm.type[1] ? this.addForm.type[1] : '',
                    group_duty_id: this.addForm.type[2] ? this.addForm.type[2] : '0',
                    department_id: this.userTypeRoute&this.ADMIN_ROUTE_MASK?this.addForm.department_id:this.department_id,
                    group_id: this.userTypeRoute&this.ADMIN_ROUTE_MASK?this.addForm.group_id:this.group_id,
                });
            },

            //编辑用户
            axiosEdit() {
                return this.$http.post("user/edit", {
                    user_id: this.addForm.user_id,
                    name: this.addForm.name,
                    type: this.addForm.role_id,
                    role_id: this.addForm.role_id,
                    role_duty_id:this.addForm.type[1]?this.addForm.type[1]:'',
                    group_duty_id:this.addForm.type[2]?this.addForm.type[2]:'0',
                    department_id: this.addForm.department_id,
                    group_id: this.addForm.group_id,
                });
            },

            //删除用户
            axiosDelete(id) {
                return this.$http.post("user/delete", {
                    user_id:id,
                });
            },

            axiosReset(id){
                return this.$http.post("user/reset-passwd-by-admin", {
                    user_id:id,
                });
            },

            //广告主列表
            axiosAdTable(page) {
                return this.$http.get("user/advertiser/list",{
                    params:{
                    page_size: this.pageSizeCopy,
                    user_id:this.currentRow.user_id,
                    bind:1,
                    page: page,
                    search: this.advertiserKeyword
                    }
                }
                );
            },

            //关联
            axiosSwitchStatus(advertiser_id, channel, status) {
                return this.$http.post("user/advertiser/bind", {
                    user_id: this.currentRow.user_id,
                    advertiser_id,
                    channel,
                    action:status
                });
            },

             //禁用
            axiosSwitchRoleStatus(user_id, status) {
                return this.$http.post("user/state", {
                    user_id: user_id,
                    status:status
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

            //配置广告主表格初次加载或reload
            tableAdLoad(numb) {
                this.loadingCopy = true;
                this.axiosAdTable(numb).then((res) => {
                    if (res && res.data.code === 200) {
                        this.totalCopy = Number(res.data.data.pagination.total);
                        this.tableDataCopy = res.data.data.list;
                        this.currentPageCopy = numb;
                    }
                }).catch((error) => {
                    console.warn(error);
                }).finally(() => {
                    this.loadingCopy = false;
                });
            },

            //打开新增弹框
            addNew() {
                this.$http.get("/user/profile").then(res=>{
                    this.addForm.type = (this.userTypeRoute&this.OPERATE_MANAGE_ROUTE_MASK)?['2','2']:[];
                    this.department_id = res.data.data.department_id;
                    this.addForm.department_id = res.data.data.department_name;
                    this.group_id = res.data.data.group_id;
                    this.addForm.group_id = res.data.data.group_name;
                })
                this.dialogVisible = true;
                this.dialogTitle = '新增账号';
            },

            //获取三个列表
            getThreeList(){
                this.getRoleList().then((res => {
                    this.addOptions = res.data.data;
                }));
                this.getDepartmentList().then((res => {
                    this.addDepartmentOptions = res.data.data;
                }));
            },

            //获取角色列表
            getRoleList(){
                return this.$http.get("role/list");
            },

            //获取部门列表
            getDepartmentList(){
                return this.$http.get("department/list");
            },

            changeDepartment(department_id){
                this.addForm.department_id = department_id;
                this.addForm.group_id = '';
                this.getGroupList().then((res) => {
                    this.addTeamOptions = res.data.data;
                })
            },

            //获取团队列表
            getGroupList(){
                return this.$http.get("group/list-by-department",{
                    params:{
                        department_id:this.addForm.department_id
                    }
                });
            },


            submitFormAdd(){
                this.axiosAdd().then((res) => {
                    if (res.data.code === 200) {
                        this.$message({
                            message:"已成功添加账号,密码已发送邮箱",
                            type:"success"
                        })
                    }
                }).catch(res => {
                    console.warn(res);
                }).finally(() => {
                    this.resetDialog('addForm')
                    this.tableLoad(1);//重新加载表格
                });
            },

            submitFormEdit(){
                this.axiosEdit().then((res) => {
                    if (res.data.code === 200) {
                        this.$message({
                            message:"编辑账号成功",
                            type:"success"
                        })
                    }
                }).catch((error) => {
                    console.warn(error);
                }).finally(() =>{
                    this.resetDialog('addForm')
                    this.isEdit = false;
                    this.tableLoad(1);//重新加载表格
                })
            },

            //添加账号提交
            submitAdd(formName) {
                //role_id的值与type[0]相同
                this.addForm.role_id =  this.addForm.type[0],
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.dialogVisible = false;
                        if(this.dialogTitle == "新增账号")
                            this.submitFormAdd();
                        else
                            this.submitFormEdit();
                    }else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            //关闭弹框后，删除验证
            resetDialog(formName) {
                if (this.$refs[formName]) this.$refs[formName].resetFields();
                this.dialogVisible = false;
                this.isEdit = false;
                Object.keys(this.addForm).forEach(key=>{this.addForm[key]=''})
            },

            resetDeleteDialog(){
                this.deleteDialogVisible = false
            },

            resetPwdDialog(){
                this.resetDialogVisible = false
            },

            resetPwdDialogCopy(){
                this.resetDialogVisibleCopy = false
            },

            resetAdvertiserDialog() {
                this.advertiserDialogVisible = false
            },

            getTitle(titles){
                let arr = [];
                titles.forEach(item=>{
                    if(item.auth & this.userTypeRoute){
                        if(item.childSlots){
                            item.childSlots = this.getTitle(item.childSlots);
                        }
                        arr.push(item)
                    }
                })
                return arr;
            }
        },

        // 生命周期-准备创建dom
        created() {
            // 放在created中,beforeCreate时header等data数据还未创建
            this.header = this.getTitle(_header);
            this.headerCopy = _headerCopy;
            this.allStatus = StatusPool;
        },

        // 生命周期-dom创建之后
        activated() {
            //初次加载table
            this.tableLoad(1);
            this.getThreeList();
        },
    }
</script>

<style lang="scss" scoped>

    /deep/ .dialog-body .el-form-item__label {
        font-size: $font-size-base;
    }

    /deep/.el-dialog__body{
        padding: 33px 109px 0 85px
    }
    .delete,.reset {
        /deep/.el-dialog__body{
        padding: 28px 109px 0 24px
    }
    }
    .resetSuccess {
        /deep/.el-dialog__body{
            padding: 33px 109px 32px 101px
        }
    }
    .advertiser-dialog {
        /deep/.el-dialog__body{
            padding: 17px 24px 17px 24px
        }
    }

    .advertiser-dialog-header {
        box-sizing: border-box;
        margin-bottom: 17px;
        /deep/.el-input__inner {
            width: 225px;
            height: 32px;
        }
        .search-account {
            width: auto;
            float: right;
            font-size: $font-size-addition;
            margin-top: -4px;
        }
        /deep/.el-input__icon {
            line-height: 34px;
        }
    }

    /deep/.el-switch {
        left: -4.5px;
    }

    /deep/.el-switch__label.is-active {
        color: #333333;
    }

    /deep/.el-dialog__footer {
        padding: 24px;
        padding-top: 0px;
    }

    /deep/.el-pagination .el-select .el-input .el-input__inner{
        width: 100px;
        height: 28px;
    }
    /deep/.el-pagination__editor.el-input .el-input__inner {
        width: 47px;
    }

    /deep/.el-pager li{
        font-weight: $font-weight-base;
    }

    /*新增弹窗formItem宽度没有百分百*/
    /deep/ .add-new {
        .el-cascader, .el-select {
            display: block;
        }
    }
</style>

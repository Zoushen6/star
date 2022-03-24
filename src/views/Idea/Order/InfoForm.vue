<template>
    <el-form :model="searchForm"  ref="searchForm" :inline="true" label-width="90px" class="customized-form padding-top">
        <el-form-item  v-show="sign == 2" prop="value2" class="item-with-span">
            <span>素材上传时间</span>
            <customized-time-picker
                class="time-picker date-range-without-close-icon"
                :date.sync="searchForm.value2"
                :shortcutsSetting="shortcutsSetting"
                :max-date="0"
            ></customized-time-picker>
        </el-form-item>
        <el-form-item  v-show="sign == 2" prop="value3" class="item-with-span">
            <span>数据统计时间</span>
            <customized-time-picker
                class="time-picker date-range-without-close-icon"
                :date.sync="searchForm.value3"
                :shortcutsSetting="shortcutsSetting"
                :max-date="0"
            ></customized-time-picker>
        </el-form-item>
        <el-form-item v-show="sign==2" prop="channel">
            <el-select v-model="searchForm.channel" placeholder="头条数据" @change="" class="short-item" >
                <el-option v-for="(item,idx) in channels" :key="idx" :label="item.item" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item v-show="sign==1" prop="media">
            <el-select v-model="searchForm.media" placeholder="全部媒体" @change="" multiple collapse-tags clearable class="long-item">
                <el-option v-for="(item,idx) in mediaType" :key="idx" :label="item.item" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item v-show="sign==1" prop="demand_type">
            <el-select v-model="searchForm.demand_type" placeholder="需求类型" @change="" clearable class="short-item">
                <el-option v-for="(item,idx) in demandType" :key="idx" :label="item.item" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item v-show="sign==1" prop="video_type">
            <el-select v-model="searchForm.video_type" placeholder="视频类型" @change="" clearable class="short-item">
                <el-option v-for="(item,idx) in orderType" :key="idx" :label="item.item" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item v-show="sign==1" prop="all_status" class="all_status">
            <el-select v-model="searchForm.all_status" placeholder="全部状态" @change="statusChange" multiple collapse-tags clearable class="short-item">
                <el-option v-for="(item,idx) in allStatusPool" :key="idx" :label="item.desc" :value="item.mask"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="all_videoDepartment">
            <el-select v-model="searchForm.all_videoDepartment" placeholder="全部视频部门" @change="" multiple collapse-tags clearable class="middle-item">
                <el-option v-for="(item,idx) in departmentType" :key="idx" :label="item.department_name" :value="item.department_id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="all_videoTeam">
            <el-select v-model="searchForm.all_videoTeam" placeholder="全部视频团队" @change="" multiple collapse-tags clearable class="long-item">
                <el-option v-for="(item,idx) in groupType" :key="idx" :label="item.group_name" :value="item.group_id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="push_order">
            <el-select v-model="searchForm.push_order" placeholder="提单人" @change="" multiple collapse-tags clearable class="short-item">
                <el-option v-for="(item,idx) in operation" :key="idx" :label="item.name?item.name:item.username" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item v-show="sign==2" prop="optimizer_id">
            <el-select v-model="searchForm.optimizer_id" placeholder="上传人" @change="" multiple collapse-tags clearable class="short-item">
                <el-option v-for="(item,idx) in optimizer" :key="idx" :label="item.name?item.name:item.username" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="creatives">
            <el-select v-model="searchForm.creatives" placeholder="创意人员" multiple collapse-tags  @change="" popper-class="creatives" clearable class="long-item">
                <el-option-group v-for="(item,idx) in optimizerGroup" :key="idx" :label="item.duty" >
                    <el-option
                        v-for="item in item.options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-option-group>
            </el-select>
        </el-form-item>
        <el-form-item prop="product_industry">
            <el-select v-model="searchForm.product_industry" placeholder="全部行业" @change="" multiple collapse-tags clearable class="middle-item">
                <el-option v-for="(item,idx) in productIndustry" :key="idx" :label="item.item" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item v-show="sign==1" prop="product">
            <el-select v-model="searchForm.product" placeholder="产品" @change="" multiple collapse-tags clearable class="short-item">
                <el-option v-for="(item,idx) in productNameType" :key="idx" :label="item.item" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="productLine">
            <div class="isDisabled">
            <el-select v-model="searchForm.productLine" placeholder="产品线" @change="" disabled clearable class="short-item">
                <el-option v-for="(item,idx) in allStatusPool" :key="idx" :label="item.desc" :value="item.mask"></el-option>
            </el-select>
            </div>
        </el-form-item>
        <el-form-item prop="original">
            <div class="isDisabled">
            <el-select v-model="searchForm.original" placeholder="是否原创" @change="" disabled clearable class="short-item">
                <el-option v-for="(item,idx) in allStatusPool" :key="idx" :label="item.desc" :value="item.mask"></el-option>
            </el-select>
            </div>
        </el-form-item>
        <el-form-item prop="value1" v-show="sign == 1">
            <customized-time-picker
                class="time-picker date-range-without-close-icon long-item"
                :date.sync="searchForm.value1"
                :shortcutsSetting="shortcutsSetting"
                start-placeholder="下单开始日期"
                end-placeholder="下单结束日期"
                :max-date="0"
            ></customized-time-picker>
        </el-form-item>
        <el-form-item v-show="sign==1" prop="notHidden_Order">
            <el-select class="short-item" v-model="searchForm.notHidden_Order" placeholder="未隐藏订单" clearable>
                <el-option v-for="(item,idx) in isHidden" :key="idx" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item v-show="sign==1" prop="orderNameValue">
            <el-input placeholder="请输入搜索内容" v-model="searchForm.orderName" class="input-with-select middle-item">
                <el-select v-model="searchForm.orderNameValue" slot="prepend">
                    <el-option label="订单名称" value="1"></el-option>
                    <el-option label="订单ID" value="2"></el-option>
                </el-select>
            </el-input>
        </el-form-item>
        <el-form-item v-show="sign==2" prop="videoOrderValue">
            <el-input placeholder="请输入搜索内容" v-model="searchForm.videoOrder" class="input-with-select middle-item">
                <el-select v-model="searchForm.videoOrderValue" slot="prepend">
                    <el-option label="视频名称" value="1"></el-option>
                    <el-option label="素材ID" value="2"></el-option>
                </el-select>
            </el-input>
        </el-form-item>
        <el-form-item class="search">
            <el-button type="primary" @click="searchFn">查询</el-button>
        </el-form-item>
        <el-form-item>
            <el-button class="search" @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
        <el-form-item   v-if="(userTypeRoute&OPERATE_INTERGRATED_MASK) && sign == 1" >
            <el-button type="warning" icon="el-icon-plus" @click="goToDetail">发布需求</el-button>
        </el-form-item>
        <el-form-item v-show="sign==2">
            <el-button type="primary" @click="downloadReport">下载报表</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import TimePickerMixin from "@mixins/TimePickerMixin";
    import InfoFormMixin from "@mixins/InfoFormMixin";
    import {OPERATE_INTERGRATED_MASK} from "@config/RouteAuth";
    import {StatusPool,GetStatusValue} from "./StatusPool.js"
    import {mapState} from "vuex";
    import {LastSeveralDays} from "@tools/DateUtils";

    export default {
        name: "InfoForm",
        mixins:[TimePickerMixin,InfoFormMixin],
        computed: {
            curStatus:{
                // getter
                get: function () {
                    return this.$store.state.order.curStatus;
                },
                // setter
                set: function (newValue) {
                    this.$store.commit('setOrderStatus', newValue);
                }
            },
            ...mapState({
                userTypeRoute: state => state.global.userTypeRoute
            })
        },

        deactivated() {
            this.resetForm('searchForm');
        },

        data(){
            return {
                OPERATE_INTERGRATED_MASK,
                searchForm:{
                    channel: 1,
                    orderName: null,
                    orderNameValue: '1',
                    videoOrder:'',
                    videoOrderValue:'1',
                    media: "",
                    demand_type: "",
                    video_type: "",
                    status:'',
                    all_status: "",
                    all_videoDepartment: "",
                    all_videoTeam: "",
                    push_order: "",
                    optimizer_id:"",
                    creatives:[],
                    product_industry: "",
                    product: "",
                    productLine: "",
                    original: "",
                    notHidden_Order: "",
                    value1: [
                    ],
                    value2: LastSeveralDays(90,0),
                    value3: LastSeveralDays(7,0),
                },
                //标志 决定两个列表显示的搜索条件
                sign: this.$route.name === "orderTable"? 1: 2,
                allStatusPool: null,
            }
        },

        created() {
            this.allStatusPool = StatusPool;
        },

        methods:{

            downloadReport(){
                this.$http.get("/report/material-video/index", {
                    params: {
                        stat_start_time: this.searchForm.value3.length != 0?this.$common.getNewDay(this.searchForm.value3[0]):'',
                        stat_end_time: this.searchForm.value3.length != 0?this.$common.getNewDay(this.searchForm.value3[1]):'',
                        //素材上传开始结束时间
                        upload_start_time:this.searchForm.value2.length !== 0?this.$common.getNewDay(this.searchForm.value2[0]):'',
                        upload_end_time:this.searchForm.value2.length !== 0?this.$common.getNewDay(this.searchForm.value2[1]):'',
                        group_id:this.searchForm.all_videoTeam,
                        department_id:this.searchForm.all_videoDepartment,
                        optimizer_id:this.searchForm.optimizer_id,
                        operation_id:this.searchForm.push_order,
                        product_industry:this.searchForm.product_industry,
                        order_name:this.searchForm.orderNameValue != 2?this.searchForm.orderName:'',
                        serial_number:this.searchForm.orderNameValue == 2?this.searchForm.orderName:'',
                        is_export: 1,
                        channel:this.searchForm.channel,
                    },
                    responseType: 'blob'
                }).then(res => {
                    this.$common.downloadFileBlob(res);
                })
            },

            goToDetail(){
                this.$router.push({name: "orderDetail"});
            },

            statusChange(val){
                this.status = GetStatusValue(val);
                this.$store.commit('setOrderStatus', val);
            },

            searchFn(){
                //浅拷贝
                let all_status = this.searchForm.all_status.slice();
                all_status.forEach((item,index,arr) => {
                    arr[index] = GetStatusValue(item);
                });
                //查询时清除上面的跑马灯状态
                this.$store.commit('setOrderStatus',0);
                this.$store.commit('setOrderStatusValue','');
                this.$emit('search',{
                    media:this.searchForm.media.join(","),
                    demand_type:this.searchForm.demand_type,
                    order_type:this.searchForm.video_type,
                    status:this.status?this.status:all_status.join(","),
                    department_id:this.searchForm.all_videoDepartment.join(","),
                    //下单开始结束时间
                    create_time:this.searchForm.value1.length !== 0?this.$common.getNewDay(this.searchForm.value1[0]):'',
                    end_time:this.searchForm.value1 !== 0?this.$common.getNewDay(this.searchForm.value1[1]):'',
                    //统计开始结束时间
                    stat_start_time:this.searchForm.value3.length !== 0?this.$common.getNewDay(this.searchForm.value3[0]):'',
                    stat_end_time:this.searchForm.value3.length !== 0?this.$common.getNewDay(this.searchForm.value3[1]):'',
                    //素材上传开始结束时间
                    upload_start_time:this.searchForm.value2.length !== 0?this.$common.getNewDay(this.searchForm.value2[0]):'',
                    upload_end_time:this.searchForm.value2.length !== 0?this.$common.getNewDay(this.searchForm.value2[1]):'',
                    group_id:this.searchForm.all_videoTeam.join(","),
                    operation_id:this.searchForm.push_order.join(","),
                    optimizer_id:this.searchForm.optimizer_id.join(","),
                    creatives:this.searchForm.creatives.join(","),
                    product_industry:this.searchForm.product_industry.join(","),
                    product_id:this.searchForm.product.join(","),
                    productLine:this.searchForm.productLine,
                    // original:this.searchForm.original,
                    is_hidden:this.searchForm.notHidden_Order,
                    order_name:this.searchForm.orderNameValue != 2?this.searchForm.orderName:'',
                    serial_number:this.searchForm.orderNameValue == 2?this.searchForm.orderName:'',
                    resource_name:this.searchForm.videoOrderValue != 2?this.searchForm.videoOrder:'',
                    material_id:this.searchForm.videoOrderValue == 2?this.searchForm.videoOrder:'',
                    channel:this.searchForm.channel,
                });
            },

            resetForm(formName) {
                this.status = ''
                this.$store.commit('setOrderStatus',0);
                this.$refs[formName].resetFields();
                this.searchForm.orderName = '';
                this.searchForm.videoOrder = '';
                this.searchForm.operation_id = '';
            }
        }

    }
</script>

<style scoped lang="scss">

    .customized-form {
        &.el-form--inline .el-form-item {
            margin-right: 8px;
            margin-bottom: 16px;
        }
    }

</style>

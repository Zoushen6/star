<template>
    <div class="h-100 flex-vertical">
        <div class="background-white w-100"><span class="customized-title uniform-title">视频消耗排行榜</span></div>
        <div class="content flex-vertical flex-1">
            <span class="tip"><svg-icon icon-name="exclamatory"></svg-icon>数据更新频次：默认展示昨日消费排名，支持切换日期查看</span>
            <div class="rank-content background-white flex-1 flex-vertical overflow-hidden">
                <el-form :model="searchForm" ref="searchForm" :inline="true" label-width="90px" class="customized-form">
                    <el-form-item  prop="media">
                        <el-select v-model="searchForm.media" placeholder="全部媒体" @change="" multiple collapse-tags clearable class="long-item" >
                            <el-option v-for="(item,idx) in mediaType" :key="idx" :label="item.item" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="product">
                        <el-select v-model="searchForm.product" placeholder="全部产品" @change="" multiple collapse-tags clearable class="middle-item">
                            <el-option v-for="(item,idx) in productNameType" :key="idx" :label="item.item" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="all_videoDepartment">
                        <el-select v-model="searchForm.all_videoDepartment" placeholder="全部部门" @change="" multiple collapse-tags clearable class="middle-item">
                            <el-option v-for="(item,idx) in departmentType" :key="idx" :label="item.department_name" :value="item.department_id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="all_videoTeam">
                        <el-select v-model="searchForm.all_videoTeam" placeholder="全部团队" @change="" multiple collapse-tags clearable class="long-item">
                            <el-option v-for="(item,idx) in groupType" :key="idx" :label="item.group_name" :value="item.group_id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="product_industry">
                        <el-select v-model="searchForm.product_industry" placeholder="全部行业" @change="" multiple collapse-tags clearable class="long-item">
                            <el-option v-for="(item,idx) in productIndustry" :key="idx" :label="item.item" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="demand_type">
                        <el-select v-model="searchForm.demand_type" placeholder="需求类型" @change="" clearable class="long-item">
                            <el-option v-for="(item,idx) in demandType" :key="idx" :label="item.item" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="sortValue">
                        <el-select v-model="searchForm.sortValue" placeholder="按消费降序排序" @change="handleSort()" clearable class="long-item">
                            <el-option v-for="(item,idx) in orderSortRule" :key="idx" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="log_time">
                        <customized-time-picker
                            class="time-picker long-item"
                            :date.sync="searchForm.value"
                            :shortcutsSetting="shortcutsSetting"
                            :max-date="0"
                            @change="dataChange"
                        ></customized-time-picker>
                    </el-form-item>
                    <el-form-item prop="videoOrderValue" class="search-content ordername">
                        <el-input placeholder="请输入搜索内容" v-model="searchForm.orderName" class="input-with-select">
                            <el-select v-model="searchForm.orderNameValue" slot="prepend" class="search-select">
                                <el-option label="订单名称" value="1"></el-option>
                                <el-option label="订单ID" value="2"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="searchFn">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="resetForm('searchForm')">重置</el-button>
                    </el-form-item>
                    <el-form-item class="rankRange">
                      <el-button  v-for="(item,idx) in rankRange" size="small" :key="idx"  :class="rankButtonStyle == item.value ? 'button-active':''"  @click="getRangList(idx)">{{item.label}}</el-button>
                    </el-form-item>
                </el-form>

                <el-row type="flex" :gutter="16" class="rank-list overflow-auto flex-1" v-loading="rankListLoading" :key="total">
                    <div v-if="rankList.length === 0" class="noData"><span>暂无数据</span></div>
                    <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6" v-for="(item,idx) in rankList" :key="idx" class="rank-item">
                        <div class="rank-item-wrapper">
                            <el-row type="flex" justify="center" class="video-box position-relative">
                                <video height="170" :ref="'video'+idx" @click="playVideo(item)" :key="item.url" class="video-isPlay"  :src="item.url" >
                                    您的浏览器不支持 HTML5 video 标签。
                                </video>
                                <el-row class="video-title">
                                    <el-tooltip class="titleName" disabled effect="dark" :content="item.resource_name" placement="top">
                                        <el-col :span="12">
                                            {{item.resource_name}}
                                        </el-col>
                                    </el-tooltip>
                                    <el-col :span="2" :offset="10" class="medal" v-if="isShow">
                                        <svg-icon v-if="showRankIcon(idx)" :icon-name="iconList[idx+1 < 4 ? idx+1 : 4]"></svg-icon>
                                        <span :class="idx==9?'two':''" v-if="showRankIcon(idx)">{{idx+1}}</span>
                                    </el-col>
                                </el-row>
                                <el-row class="video-operate">
                                    <el-col :span="12">
                                        <svg-icon icon-name="team"></svg-icon>{{item.group_name}}
                                    </el-col>
                                    <el-col :span="2" :offset="10" class="play" >
                                        <div @click="playVideo(item)"><svg-icon icon-name="play"></svg-icon></div>
                                    </el-col>
                                </el-row>
                            </el-row>
                            <el-row class="rank-title">
                                <el-col :span="8" class="uniform-title">
                                    <svg-icon icon-name="proxy"></svg-icon>{{item.product_name}}
                                </el-col>
                                <el-col :span="2" :offset="14" class="copyLink pointer">
                                    <div @click="buttonCopyLink(item)"><svg-icon icon-name="copy"></svg-icon>复制</div>
                                </el-col>
                            </el-row>
                            <el-row class="rank-desc">
                                <el-col :span="6" :xs="12" :sm="12">消耗：￥{{item.cost}}</el-col>
                                <el-col :span="6" :xs="12" :sm="12">转化成本：￥{{item.oe_convert_cost}}</el-col>
                            </el-row>
                        </div>
                    </el-col>
                </el-row>
                <!-- 分页 -->
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="val=>{rankPageSizeChange(rankListLoad,this,val)}"
                    @current-change="val=>{pageChange(rankListLoad,this,val)}"
                    :page-sizes="pageSizes"
                    :page-size="rankPageSize"
                    :current-page="currentPage"
                    :total="total" class="m-t-30 text-center">
                </el-pagination>
                <!-- /分页 -->

                <!-- 预览弹窗 -->
                <div class="showVideo">
                <customized-dialog
                    title="视频预览"
                    :width="dialogWidth"
                    :visible.sync="visiblePreviewDialog"
                    v-loading="videoLoading"
                    @opened="handleDialogOpened"
                    @after-close="resetPreviewDialog"
                >
                    <video ref="previewVideo" :src="this.videoUrl" controls autoplay class="video"></video>
                    <div style="font-size: 12px" class="videoInfoStyle">
                        <span>提单人：{{this.videoInfo.operation_id?this.videoInfo.operation_id:'无'}}</span>
                        <span>编导：{{this.videoInfo.choreographer?this.videoInfo.choreographer:'无'}}</span>
                        <span>剪辑：{{this.videoInfo.montage?this.videoInfo.montage:'无'}}</span>
                        <span>拍摄：{{this.videoInfo.photography?this.videoInfo.photography:'无'}}</span>
                        <span>平面：{{this.videoInfo.design?this.videoInfo.design:'无'}}</span>
                    </div>
                </customized-dialog>
                </div>
                <!-- 预览弹窗 -->
            </div>

        </div>
    </div>
</template>

<script>
    import InfoFormMixin from "@mixins/InfoFormMixin";
    import PaginationMixin from "@mixins/PaginationMixin";
    import {LastSeveralDays} from "@tools/DateUtils";
    import TimePickerMixin from "@mixins/TimePickerMixin";
    import DialogMixin from "@mixins/DialogMixin";
    import {paginationLayout,iconList,orderSortRule,rankRange,videoOrderSort} from "@views/Rank/Rank.js"
    import {CopyContent} from "@tools/Copy";
    import VideoDialogMixin from "@mixins/VideoDialogMixin";

    export default {
        name: "Rank",

        mixins:[InfoFormMixin,PaginationMixin,TimePickerMixin,DialogMixin,VideoDialogMixin],

        mounted() {
            this.rankListLoad(1); //初次加载table
            this.resetForm('searchForm');
            if(this.$route.params.channel){
                this.playVideo()
            }
        },

        data() {
            return {
                paginationLayout,
                channel:this.$route.params.channel,
                advertiser_id:this.$route.params.advertiser_id,
                material_id:this.$route.params.material_id,
                photo_id:this.$route.params.photo_id,
                rankPageSize:12,
                rankListLoading:false,
                pageSizes:[12,20,30,40,50,100],
                searchForm: {
                    media:'',
                    product:'',
                    all_videoDepartment:'',
                    all_videoTeam:'',
                    product_industry:'',
                    demand_type:'',
                    orderName:'',
                    orderNameValue:'1',
                    order: null,
                    sort: null,
                    sortValue:'',
                    value: LastSeveralDays(1,1),
                },
                rankList:[],
                rankRangeList:{
                    1:LastSeveralDays(1,1),
                    7:LastSeveralDays(7,0),
                    30:LastSeveralDays(30,1),
                },
                iconList,
                orderSortRule,
                rankButtonStyle:1,
                rankRange,
                videoOrderSort,
                videoInfo:{},
                isShow:true,
            }
        },
        methods:{
            CopyContent,

            playVideo(item) {
                this.dialogWidth = 1200;
                if(item && item.channel === 1){
                    this.advertiser_id = item.advertiser_id;
                    this.material_id = item.material_id;
                    this.channel = item.channel;
                }
                if(item && item.channel === 2){
                    this.advertiser_id = item.advertiser_id;
                    this.photo_id = item.photo_id;
                    this.channel = item.channel;
                }
                this.axiosGetUrl().then((res) => {
                    if(res.data.code === 200){
                        if(res.data.data.data){
                            this.videoInfo = res.data.data.data;
                            this.dialogUrl = res.data.data.data.url;
                        }
                    }
                }).catch((error) => {
                    console.warn(error);
                }).finally(() => {
                    this.visiblePreviewDialog = true;
                });
            },

            showRankIcon(idx){
                return this.currentPage === 1 && idx < 10;
            },

            dataChange(val){
                this.rankButtonStyle = 0;
            },

            //三个排行
            getRangList(idx){
              this.rankButtonStyle = this.rankRange[idx].value;
              this.searchForm.value = this.rankRangeList[this.rankRange[idx].value];
              this.rankListLoad(1);
            },

            //排序方式
            handleSort(){
                this.searchForm.order = this.videoOrderSort[this.searchForm.sortValue][0];
                this.searchForm.sort = this.videoOrderSort[this.searchForm.sortValue][1];
            },

            //查询
            searchFn(){
                this.isShow = this.searchForm.sort !== 'asc' ? true : false;
                this.rankListLoad(1);
            },

            //重置
            resetForm(formName) {
                this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                    this.searchForm.value = this.rankRangeList[1];
                    this.rankButtonStyle = 1;
                    this.searchForm.orderName = '';
                    this.searchForm.orderNameValue = '1';
                })
            },

            rankListLoad(num){
                this.rankList=[];
                this.rankListLoading = true;
                this.axiosRankList(num).then((res)=>{
                    if(res.data.code === 200 && res.data.data.list.length !== 0){
                        this.rankList = res.data.data.list;
                        this.total = res.data.data.pagination.total;
                        this.currentPage = num;
                    }else{
                        this.rankList =[];
                        this.total = 0;
                    }
                }).catch((error) => {
                    console.warn(error);
                }).finally(() => {
                    this.rankListLoading = false;
                })
            },

            //创意消耗列表
            axiosRankList(page){
                return this.$http.get("report/creative/cost-rank",{
                        params:{
                            start_time:this.searchForm.value.length?this.$common.getNewDay(this.searchForm.value[0]):'',
                            end_time:this.searchForm.value.length?this.$common.getNewDay(this.searchForm.value[1]):'',
                            channel:this.searchForm.media.length === 1 ? this.searchForm.media.join(",") : JSON.stringify(this.searchForm.media),
                            product_id:this.searchForm.product.join(","),
                            department_id:this.searchForm.all_videoDepartment.join(","),
                            group_id:this.searchForm.all_videoTeam.join(","),
                            product_industry:this.searchForm.product_industry.join(","),
                            demand_type:this.searchForm.demand_type,
                            serial_number:this.searchForm.orderNameValue == 2?this.searchForm.orderName:'',
                            order_name:this.searchForm.orderNameValue != 2?this.searchForm.orderName:'',
                            order:this.searchForm.order,
                            sort:this.searchForm.sort,
                            page_size: this.rankPageSize,
                            page: page,
                        }
                    }
                );
            },

            //跳转后请求视频url
            axiosGetUrl(){
                return this.$http.get("report/creative/detail",{
                        params:{
                            channel:this.channel,
                            advertiser_id:this.advertiser_id,
                            material_id:this.material_id,
                            photo_id:this.photo_id
                        }
                    }
                );
            },

            buttonCopyLink(item){
                this.CopyContent(item.url);
            },

            //ranklist pageSize改变回调
            rankPageSizeChange(method, context, size) {
                this.rankPageSize = size;
                this.pageChange(method, context, 1);
            },

        }
    }
</script>

<style scoped lang="scss">

    //创意消耗排行榜固定定位
    .w-100 {
        position: fixed;
        z-index:4
    }

    .customized-title {
        height: $line-height-large;
        line-height: $line-height-large;
        padding: 0 $margin-size-base;
    }

    .content {
        padding: 48px $margin-size-base $margin-size-base;
        box-sizing: border-box;
        height: 100%;
        .tip {
            font-size: $font-size-addition;
            line-height: 34px;
            color: $font-color-secondary;
            .icon {
                margin-right: 5px;
                margin-bottom: 0.5px;
            }
        }
    }

    .videoInfoStyle {
        span {
            margin-right: 10px;
        }
    }

    .showVideo {

        /deep/.el-dialog {
            transition: width 0.5s;
        }

        /deep/.el-dialog__body{
            padding: 15px 20px;
            .video {
                //width: 100%;
                //max-width: 52vh;
                height: 60vh;
                position: relative;
                left: 50%;
                transform: translateX(-50%);
                object-fit: contain;
            }
        }
    }


    .rank-content {
        padding: 20px $margin-size-base 32px;

        .rank-list {
            flex-wrap: wrap;
        }

        .rank-item {
            border-radius: $border-radius-base;
            margin-bottom: 20px;
        }
        .rank-item-wrapper {
            box-shadow: 0px 0px 12px 0px rgba(0,0,0,0.09);
        }
        .rank-title {
            line-height: $line-height-large;
            height: $line-height-large;
            .uniform-title {
                line-height: 46px;
            }
            .icon {
                width: 0.88em;
                padding: 0 5px 0 11px;
            }
            //复制按钮
            .el-col-offset-14 {
                margin-left: 49.33333%;
            }
            .el-col-2 {
                width: 15.33333%;
                font-size: 13px;
            }
            .copyLink {
                color: $theme-color;
            }
        }
        .rank-desc {
            padding-bottom: 8px;
            .el-col-sm-12 {
                padding-left: 11px;
                position: relative;
                top: -5px;
            }
        }
        .video-box {
            background: #3E3E3E;
            border-radius: $border-radius-base $border-radius-base 0 0;
            .video-title, .video-operate {
                position: absolute;
                left: 0;
                color: $font-color-white;
                width: 100%;
            }
            .video-title {
                top: 0;
                height: 48px;
                .el-col-offset-10 {
                    margin-left: 38.5%;
                }
                .el-col-2 {
                    width: 33px;
                }
                .medal {
                    position: relative;
                    .icon {
                        font-size: 33px;
                    }
                    span {
                        position: absolute;
                        font-size: 13px;
                        top: 7px;
                        right: 40%;
                    }
                    //两位数
                    .two {
                        right: 31%;
                    }
                }
                .titleName {
                    float: left;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    padding:8px 0 0px 10px;
                    overflow: hidden;
                }
            }
            .video-operate {
                bottom: 0;
                .el-col-offset-10 {
                    margin-left: 39%;
                }
                .icon {
                    width: 0.88em;
                    padding-right: 4px;
                }
                .play {
                    .icon {
                        cursor: pointer;
                        font-size: 30px;
                        padding-top: 7px;
                    }
                }
            }
            .el-col-12 {
                padding:8px 0 14px 10px
            }
        }

      .rankRange {
        float: right;
        margin-right: 25px;
        margin-bottom: 0px;
        margin-top: 6px;
          .el-button {
            font-size: $font-size-addition;
            padding: 7px 11px 0 0;
            border: 0;
            background-color: $font-color-white;
          }
          .el-button--text {
            color: $font-color-base;
          }
      }
      .button-active {
          color: $theme-color;
      }

        .noData {
            text-align: center;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            span {
                color: #909399;
                font-size: 12px;
            }
        }
    }
</style>

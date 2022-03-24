<template>
    <div class="flex-1 flex-vertical">
        <!-- 条件筛选区 -->
        <el-form :inline="true" label-width="90px">
            <div class="absolute-top-60">
                <el-form-item style="display: none">
                    <el-button type="warning" @click="downloadAll" class="downloadButton">下载分天报表</el-button>
                </el-form-item>
            </div>
        </el-form>
        <info-form @search="searchFn"></info-form>
        <!-- 条件筛选区 -->
        <!-- 表格区 -->
        <customized-table
            class="customized-table mini-table flex-1 without-pagination"
            ref="customizedTable"
            :scroll-in-table="false"
            :loading="loading"
            :Data="tableData"
            :Header="header"
            :total="total"
            :key="this.searchVideoData.channel"
            :page-size="pageSize"
            :current-page="currentPage"
            :show-summary="true"
            :summary-method="getSummary"
            @sort-change="sortChangeHandle"
            @size-change="val=>{pageSizeChange(tableLoad,this,val)}"
            @current-change="val=>{pageChange(tableLoad,this,val)}"
            @buttonCopyLink="buttonCopyLink"
            @buttonDataTrend="showDataTrend"
        >
            <template v-slot:video="{row}">
                <div class="videoColumn">
                    <div class="left" @click="handlePreview(row.url)">
                            <video :src="row.url" width="53" height="94"></video>
                    </div>
                    <div class="right">
                        <div class="videoName" v-if="row.url">{{row.resource_name?row.resource_name:row.url.substring(row.url.lastIndexOf('/')+1)}}</div>
                        <div class="material">媒体素材ID：{{row.material_id}}</div>
                        <div class="groupName">{{row.group_name}}</div>

                    </div>
                </div>
            </template>
        </customized-table>
        <!-- /表格区 -->

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
                <video ref="previewVideo" :src="this.videoUrl" controls autoplay class="video-preview"></video>
            </customized-dialog>
        </div>
        <!-- 预览弹窗 -->

        <!-- 数据趋势弹窗-->
        <customized-dialog
            :width="850"
            :title="dataTrendTittle"
            :visible="dataTrendDialogVisible"
            :show-footer="false"
            @cancel="resetDataTrendDialog()"
            @close="resetDataTrendDialog()"
            class="delete-dialog"
        >
            <div class="video">
            <span>数据统计时间段：</span>
            <customized-time-picker
                :date.sync="statisticsTime"
                :shortcutsSetting="shortcutsSetting"
                :max-date="0"
                @change="dateChange"
            ></customized-time-picker>
            </div>
            <div ref="chart" class="chart" style="height: 400px;width: 820px">
            </div>
        </customized-dialog>
        <!-- /数据趋势弹窗-->
    </div>
</template>

<script>
    import InfoForm from "./InfoForm";
    import * as echarts from 'echarts';
    import PaginationMixin from "@mixins/PaginationMixin";
    import TimePickerMixin from "@mixins/TimePickerMixin";
    import {HEADER,option,VIDEOHEADER} from "./VideoTable.js"
    import TopStatusMixin from "@mixins/TopStatusMixin";
    import {LastSeveralDays} from "@tools/DateUtils";
    import DialogMixin from "@mixins/DialogMixin";
    import {CopyContent} from "@tools/Copy";
    import VideoDialogMixin from "@mixins/VideoDialogMixin";

    export default {
        name: "VideoTable",
        components: {InfoForm},
        mixins: [PaginationMixin,TimePickerMixin,TopStatusMixin,DialogMixin,VideoDialogMixin],
        data(){
            return{
                maxDate:0,
                //默认素材上传时间
                value2: LastSeveralDays(90,0),
                //默认数据统计时间
                value3: LastSeveralDays(7,0),
                currentRow:'',
                searchVideoData:{
                },
                dataTrendTittle:'',
                dataTrendDialogVisible: false,
                chart: null,
                option,
                status_count:[],
                tableCost: 0,
                order:null,
                sort:null,
            }
        },
        created() {
            this.header = HEADER; // 放在created中,beforeCreate时header等data数据还未创建
        },
        activated() {
            this.tableLoad(1); //初次加载table
        },
        deactivated() {
            this.searchVideoData=[]; //切换路由时清除searchData
        },

        methods:{
            CopyContent,

            sortChangeHandle(data){
                if (data.order) {
                    this.order = data.prop;
                    this.sort = data.order === 'descending' ? 'desc' : 'asc';
                } else {
                    this.order = null;
                    this.sort = null;
                }
                this.tableLoad();
            },

            getHeader(id){
                return id === 2 ? VIDEOHEADER : HEADER;
            },

            searchFn(param){
                this.searchVideoData = param;
                this.header = this.getHeader(this.searchVideoData.channel);
                this.tableData = [];
                this.tableLoad(1);
            },

            buttonCopyLink(row){
                this.CopyContent(row.url);
            },

            handlePreview(url){
                this.dialogWidth = 1200;
                this.dialogUrl = url;
                this.visiblePreviewDialog = true;
            },

            initChart() {
                if(this.chart)
                    this.chart.dispose();
                this.chart = echarts.init(this.$refs.chart);
                this.chart.clear();
                let Option = this.option;
                this.chart.setOption(Option, true);
            },

            //点击数据趋势
            showDataTrend(row){
                this.dataTrendDialogVisible = true;
                this.dataTrendTittle = "数据统计 (订单ID:"+row.serial_number+")";
                this.currentRow=row;
                this.requestDataTrend(row.material_id,row.photo_id).then((res) => {
                    if(res.data.code === 200){
                        this.optionData(res.data.data.list)
                    }
                }).finally(() => {
                    this.$nextTick(() => {
                        this.initChart()
                    });
                })
            },

            //数据趋势选择时间
            dateChange(value){
                this.$http.get("/report/material-video/trend-data", {
                    params: {
                        stat_start_time: this.$common.getNewDay(value[0]),
                        stat_end_time: this.$common.getNewDay(value[1]),
                        material_id:this.currentRow.material_id,
                        photo_id:this.currentRow.photo_id,
                    }
                }).then((res) => {
                    if(res.data.code === 200){
                        this.optionData(res.data.data.list)
                    }
                }).finally(() => {
                    this.$nextTick(() => {
                        this.initChart()
                    });
                })
            },

            //数据处理
            optionData(data){
                this.resetOptionData();
                if(data.length) {
                    data.forEach((item) => {
                        this.option.xAxis.data.push(item['stat_datetime']);
                        this.option.series[0].data.push(item['oe_cost']);
                        this.option.series[1].data.push(item['oe_convert_rate']);
                    })
                }else {
                    this.option.xAxis.data = [0];
                    this.option.series[0].data = [0];
                    this.option.series[1].data = [0];
                }
            },

            resetOptionData(){
                this.option.xAxis.data = [];
                this.option.series[0].data = [];
                this.option.series[1].data = [];
            },

            tableLoad(num){
                this.loading = true;
                this.requestVideoList(num).then((res)=>{
                    if(res.data.code === 200 && res.data.data.list.length !== 0){
                        this.tableData = res.data.data.list;
                        this.total = Number(res.data.data.pagination.total);
                        this.tableCost = Number(res.data.data.cost);
                        this.currentPage = num;
                        this.status_count = res.data.data.status_count;
                    }else{
                        this.status_count = res.data.data.status_count;
                        this.tableData =[];
                        this.total = 0;
                        this.tableCost = 0;
                    }
                }).catch((error) => {
                    this.loading = false;
                    console.warn(error);
                }).finally(() => {
                    this.status_count.forEach((item) => {
                        let id = this.GetStatusCount(item.status);
                        if (id !== undefined) this.TopStatus[id].count = Number(item.num);
                    })
                    this.loading = false;
                });
            },

            getSummary(param){
                const { columns, data } = param;
                const sums = columns.map((column, index) => {
                    if (index === 0) {
                        return '总计';
                    }
                    if (column.property === 'cost'){
                        return this.tableCost;
                    }
                    return "";
                });
                this.$nextTick(() => {
                   this.$refs.customizedTable.doLayout();
                });
                return sums;
            },

            downloadAll(){
                // this.$common.downloadFileBlob(1);
            },

            requestVideoList(page){
                return this.$http.get("/report/material-video/index", {
                    params: {
                        stat_start_time: this.searchVideoData.stat_start_time?this.searchVideoData.stat_start_time:this.$common.getNewDay(this.value3[0]),
                        stat_end_time: this.searchVideoData.stat_end_time?this.searchVideoData.stat_end_time:this.$common.getNewDay(this.value3[1]),
                        upload_start_time:this.searchVideoData.upload_start_time?this.searchVideoData.upload_start_time:this.$common.getNewDay(this.value2[0]),
                        upload_end_time:this.searchVideoData.upload_end_time?this.searchVideoData.upload_end_time:this.$common.getNewDay(this.value2[1]),
                        product_industry:this.searchVideoData.product_industry,
                        product_id:this.searchVideoData.product_id,
                        department_id:this.searchVideoData.department_id,
                        group_id:this.searchVideoData.group_id,
                        operation_id:this.searchVideoData.operation_id,
                        optimizer_id:this.searchVideoData.optimizer_id,
                        creatives:this.searchVideoData.creatives,
                        media:this.searchVideoData.media,
                        resource_name:this.searchVideoData.resource_name,
                        material_id:this.searchVideoData.material_id,
                        channel:this.searchVideoData.channel,
                        page:page,
                        page_size:this.pageSize,
                        type:this.type,
                        order:this.order,
                        sort:this.sort,
                    }
                })
            },

            requestDataTrend(material_id,photo_id){
                return this.$http.get("/report/material-video/trend-data", {
                    params: {
                        stat_start_time: this.$common.getNewDay(this.statisticsTime[0]),
                        stat_end_time: this.$common.getNewDay(this.statisticsTime[1]),
                        material_id:material_id,
                        photo_id:photo_id,
                    }
                })
            },

            resetDataTrendDialog(){
                this.dataTrendDialogVisible = false
                this.chart.clear();
            },

        }
    }
</script>

<style scoped lang="scss">

    /deep/.el-dialog__body {
        padding: 2px 20px
    }

    .showVideo {
        /deep/.el-dialog {
            transition: width 0.5s;
        }

        /deep/.el-dialog__body{
            max-height: 60vh;
            padding: 30px 20px;
            .video-preview {
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

    .absolute-top-60{
        position: absolute;
        top: -52px;
        right: 24px;
    }

    .videoColumn {
        display: flex;
    }

    .videoColumn .left{
        width: 53px;
        height: 94px;
    }

    .videoColumn .right {
        margin-left: 5px;
    }
    .videoColumn .right .groupName{
        margin-top: 20px;
        font-size: 10px;
        color: #999999;
    }

    .video{
        width: 363px;
        padding-left: 15px;
        margin-top: 22px;
        /deep/.el-input__inner{
            width: 250px;
            height: 30px;
            font-size: $font-size-base;
            border: initial;
        }
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        /deep/.span {
            line-height: 32px;
            display: inline-block;
            padding-left: 5px;
        }
        /deep/.el-date-editor .el-range__close-icon {
            display: inline-block;
            width: 0px;
        }
        /deep/.el-date-editor .el-range__icon {
            line-height: 27px;
        }
        /deep/.el-date-editor .el-range-separator {
            line-height: 23px;
        }
    }

    /deep/.downloadButton {
        padding: 8px 18px;
    }

    /deep/ .showpicture .el-image__inner, .el-image__placeholder, .el-image__error {
        width: 50% !important;
    }
    /deep/.el-pager li{
        font-weight: $font-weight-base;
    }

    .chart {
        margin-bottom: 20px;
    }
</style>

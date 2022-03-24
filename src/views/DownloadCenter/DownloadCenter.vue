<template>
    <div class="overflow-scroll-y flex-1 flex-vertical">
        <div class="flex-vertical flex-1 m-l-r-16">
            <div class="breadcrumb background-white font-bold">下载中心<span class="mind-text">(下载中心仅保存30天数据,请及时下载报表内容)</span></div>
            <el-form class="customized-form padding-top background-white p-l-r-32" :inline="true" :model="optionsForm" ref="addOptions" >
                <div class="flex">
                    <span class="inline-block form-item-title">时间筛选</span>
                    <div class="flex-1">
                        <el-form-item prop="dateValue">
                            <customized-time-picker
                                class="time-picker long-item"
                                :date.sync="optionsForm.dateValue"
                                :shortcutsSetting="shortcutsSetting"
                                :max-date="0"
                                :min-date="minDate"
                            ></customized-time-picker>
                        </el-form-item>
                        <el-form-item prop="inputValue" :required="false" class="search-content">
                            <el-input prefix-icon="el-icon-search" placeholder="请输入下载文件信息" v-model="optionsForm.inputValue" class="long-item" clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item class="search-btn">
                            <el-button type="primary" @click="search()">查询</el-button>
                            <el-button class="reset" @click="reset">重置</el-button>
                        </el-form-item>
                    </div>
                </div>
            </el-form>


            <div v-loading="loading" class="flex-1 flex-vertical">
                <!-- 无数据 -->
                <div class="background-white p-l-r-32 m-t-20 flex-1 flex-vertical table-box" v-if="tableData.length === 0">
                    <span class="empty-text">暂无数据</span>
                </div>
                <!-- 无数据 -->
                <!-- 表格区 -->
                <div class="background-white m-p" v-for="(item,idx) in tableData" :key="item.date_time">
                    <span class="date-time">{{item.date_time}}</span>
                    <div class="flex file-item" v-for="(it,id) in item.children" :key="item.id">
                        <div class="excel"><svg-icon icon-name="excel"></svg-icon></div>
                        <div>
                            <p class="file-name">{{it.file_name}}</p>
                            <el-progress :percentage="getPercentage(it)" status="success"></el-progress>
                        </div>
                        <div class="message">
                            <span>
<!--                                <svg-icon v-if="statusIcon[it.status]" :icon-name="statusIcon[it.status]"></svg-icon>-->
                                <svg-icon v-if="it.status === '2'||it.status === '3'" :icon-name="statusIcon[it.status]"></svg-icon>
                                <i class="loading-status">{{statusShow(it)}}</i>
                            </span>
                        </div>
                        <el-button type="primary" :disabled="it.status !== '2'" @click="downloadReport(it.id)">下载到本地</el-button>
                    </div>
                </div>
                <!-- /表格区 -->
            </div>
        </div>
    </div>
</template>

<script>
import {LastSeveralDays} from "@tools/DateUtils";
import PaginationMixin from "@mixins/PaginationMixin";

export default {
    name: "DownloadCenter",

    components: {},

    mixins:[PaginationMixin],

    created() {
    },

    mounted() {
        this.tableLoad();
    },

    destroyed(){
        clearInterval(this.interval)
    },

    data() {
        return {
            interval:'',
            statusIcon:{
                2:'opsuccess',
                3:'opfail'
            },
            statistical:{
                cost:'',
                transfer_in:'',
                transfer_out:'',
                income:'',
            },
            optionsForm: {
                dateValue: LastSeveralDays(1, 0),
                inputValue: '',
            },
            minDate: Math.ceil((new Date - new Date("2018-1-1")) / (3600 * 24 * 1000)),
            shortcutsSetting: ['yesterday', 'lastSeven', 'lastThirty', 'lastWeek'],
            tableDataMap: null,
            // downloadFinish: false
        }
    },

    methods: {

        statusShow(it){
            if(it.status === "0"){
                return "准备中"
            }
            if(it.status === "1"){
                return "云端加载" + this.getPercentage(it) + "%，请稍等"
            }
            if(it.status === "2"){
                return "云端加载完成"
            }
            if(it.status === "3"){
                return "下载失败，请重新下载"
            }
        },

        getPercentage(item){
            if(item.status === '0' || item.status === '3')
                return 0
            if(item.status === '2')
                return 100
            let num = (item.current_num / item.total_num) * 100;
            return item ? parseInt(num.toString()) : ''
        },

        requestTable(page = 1) {
            return this.$http.get("tool/download/index", {
                params: {
                    start_date: this.$common.getNewDay(this.optionsForm.dateValue[0]),
                    end_date: this.$common.getNewDay(this.optionsForm.dateValue[1]),
                    filename: this.optionsForm.inputValue.trim(),
                    page: page,
                    page_size: this.pageSize,
                }
            })
        },

        requestProgress(){
            return this.$http.get("tool/download/progress-bar", {
                params: {
                    start_date: this.$common.getNewDay(this.optionsForm.dateValue[0]),
                    end_date: this.$common.getNewDay(this.optionsForm.dateValue[1]),
                },
            })
        },
        intervalHelper() {
            this.interval = setInterval(() => {
                this.requestProgress().then(res => {
                    if (res.data.code === 200 && res.data.data.list.length !== 0) {
                        //停止计时器
                        let hasUncompleted = false;
                        res.data.data.list.forEach(item => {
                            if(this.tableDataMap[item.id]){
                                Object.assign(this.tableDataMap[item.id], item);
                                hasUncompleted ||= (item.status === "0" || item.status === "1")
                            }
                        })
                        if(!hasUncompleted)
                            clearInterval(this.interval)
                    }
                }).catch((error) => {
                    console.warn(error);
                }).finally(() => {
                });
            },2000);
        },

        tableLoad(num) {
                this.loading = true;
                this.requestTable(num).then(res => {
                    if (res.data.code === 200) {
                        this.tableData = res.data.data.list;
                        if(res.data.data.list.length !== 0) {
                            this.tableDataMap = this.tableData.reduce((res, next) => {
                                next.children.reduce((result, it) => {
                                    result[it.id] = it;
                                    return result;
                                }, res)
                                return res;
                            }, {});
                            this.intervalHelper()
                        }
                    }
                }).catch((error) => {
                    console.warn(error);
                }).finally(() => {
                    this.loading = false;
                });
        },

        search() {
            //清除还未清除的定时器
            if(this.interval)
                clearInterval(this.interval)
            this.tableLoad();
        },

        reset() {
            this.optionsForm.inputValue = '';
            this.optionsForm.dateValue = LastSeveralDays(1,0)
        },

        requestDownload(id){
            return this.$http.get("tool/download/download", {
                params: {
                    id:id
                },
                responseType:'blob'
            })
        },

        downloadReport(val){
            this.requestDownload(val).then(res => {
                if(!res.data.type.includes('json')){
                    this.$common.downloadFileBlob(res);
                }
            })
        },
    }
}
</script>

<style scoped lang="scss">

    @import "src/views/Finance/ReportCommon";

    .mind-text {
        margin-left: 5px;
        font-weight: normal;
        font-size: $font-size-addition;
        color: $font-color-auxiliary;
    }

    .search-content {
        /deep/ .el-select {
            width: 140px;
            .el-input--suffix .el-input__inner {
                width: 110px;
            }
        }
    }

    .empty-text {
        color: #909399;
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: center;
    }

    .breadcrumb {
        height: $line-height-large;
        line-height: $line-height-large;
        font-size: $font-size-base;
        padding: 0 $margin-size-large;
        border-bottom: 1px solid $bg-color-divider;
        box-sizing: border-box;
    }

    .m-p {
        margin-top: 20px;
        padding-top: 24px;
    }

    .date-time {
        margin-left: 32px;
    }

    .file-item {
        padding:22px 5% 27px 32px;

        &:not(:last-of-type) {
            border-bottom: 1px solid  $bg-color-divider;
        }

        .file-name ,.loading-status {
            color: $font-color-secondary;
            vertical-align: bottom;
        }

        .loading-status {
            font-size: $font-size-addition;
        }

        .excel{
            .icon {
                font-size: 30px;
                margin-top: 5px;
                margin-right: 9px;
            }
        }
        .message {
            margin-top: 20px;
            margin-left: -32px;
            .icon {
                font-size: 14px;
                margin-right: 3px;
            }
        }

        .el-button {
            height: 32px;
            padding: 8px 16px;
            margin-left: auto;
            margin-top: 9px;
        }

        /deep/.el-button--primary.is-disabled, .el-button--primary.is-disabled:hover {
            background-color: #D8D8D8;
            border-color: #D9D9D9;
        }

        .el-progress {
            width: 74vw;
        }

        @media screen and (max-width: 1366px) {
                .el-progress {
                    width: 69vw;
                }
        }

        /deep/.el-progress__text i {
            display: none;
        }
    }

</style>

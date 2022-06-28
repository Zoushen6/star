<template>
    <div class="flex-vertical">
<!--        <div class="operation-box m-b-15">-->
<!--            <span class="numbers m-l-16">{{ totalNum }}</span>-->
<!--        </div>-->
        <div class="pointer m-l-15 refresh" style="color: #4063DF">
            <div class="box" @click="handleRefresh">
                <span class="iconfont icon-refresh" :class="ListLoading?'refresh-rotate':''"></span>
                <span style="margin-left: 3px;">刷新</span>
            </div>
        </div>
        <el-row type="flex" :gutter="24" class="rank-list flex-1 content" v-loading="ListLoading">
            <div v-if="List.length === 0" class="noData"><span>暂无数据</span></div>
            <el-col :span="4" v-for="(item,idx) in List" :key="idx" class="rank-item">
                <div class="rank-item-wrapper">
                    <el-row type="flex" justify="center" class="video-box position-relative">
                        <el-row class="video-title">
                            <el-col :span="2" :offset="21" class="medal">
                                <el-checkbox v-model="item.checkboxValue" :disabled="item.disabled" @change="val=>{handleCheck(val, item)}">{{''}}</el-checkbox>
                            </el-col>
                        </el-row>
                        <video v-if="isVideo" height="170" :ref="'video'+item.resource_url + idx" @click="$emit('itemClick',item, 'detailInfo')"
                               :key="item.url" class="video-isPlay" :src="item.resource_url">
                            您的浏览器不支持 HTML5 video 标签。
                        </video>

                        <el-image v-else :src="item.resource_url" height="170" :ref="'pic'+idx" fit="fill"
                                  @click="$emit('itemClick', item, 'detailInfo')" class="video-isPlay">
                        </el-image>
                        <el-row class="video-play" v-if="isVideo">
                            <el-col :span="24">
                                <div @click="$emit('itemClick', item, 'detailInfo')" class="pointer">
                                    <svg-icon icon-name="play"></svg-icon>
                                </div>
                            </el-col>
                        </el-row>
                    </el-row>
                    <el-row class="rank-title">
                        <el-col :span="24" class="uniform-title pointer" >
                            <div v-show="!item.isClickEdit" class="file-name">
                                <span class="m-r-24" :title="item.filename">{{item.filename | handleLength(15)}}</span>
                            </div>
                            <div v-show="!item.isClickEdit" class="file-label">
                                <span class="m-r-24" :title="item.label">{{item.label_ids.length?item.label:'无标签' | handleLength(20)}}</span>
                            </div>
                            <div v-show="!item.isClickEdit" class="file-name">
                                <span class="m-r-24" :title="item.create_time">{{item.create_time.substr(0,10)}}</span>
                            </div>
                        </el-col>
                    </el-row>
<!--                    <el-row class="rank-label rank-title">-->
<!--                        <el-col :span="24" class="uniform-title pointer" >-->
<!--                           -->
<!--                        </el-col>-->
<!--                    </el-row>-->
                </div>
            </el-col>
        </el-row>
        <!--分页-->
        <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="val=>{$emit('size-change',val);$emit('page-size:update',val);}"
            @current-change="val=>{$emit('current-change',val);$emit('current-page:update',val);}"
            :current-page="currentPage"
            :page-size="pageSize"
            :page-sizes="pageSizes"
            :total="totalNum" class="m-t-20 text-center">
        </el-pagination>
        <!-- /分页 -->
    </div>
</template>

<script>

    export default {
        name: "MaterialContent",

        props: {
            List: {
                type: Array,
                default: null
            },
            ListLoading: {
                type: Boolean,
                default: false
            },
            isVideo: {
                type: Boolean,
                default: true
            },
            checkedList:{
                type: Array,
            },
            totalNum: Number,
            currentPage: Number,
            pageSize: Number,
        },

        watch:{
            checkedList: {
                handler(val) {
                    if(this.isVideo) {
                        this.checkSet.clear();
                        val.forEach(item => {
                            this.checkSet.add(item)
                        })
                    }else {
                        this.picCheckSet.clear();
                        val.forEach(item => {
                            this.picCheckSet.add(item)
                        })
                    }
                }
            },
            immediate:true
        },

        data() {
            return {
                checkSet: new Set(),
                picCheckSet:new Set(),
                pageSizes: [12, 20, 30, 40, 50, 100],
            }
        },

        // 数据格式化
        computed: {
        },

        methods: {

            handleCheck(val, item) {
                if(this.isVideo) {
                    this.operation(val,item,this.checkSet)
                }else {
                    this.operation(val,item,this.picCheckSet)
                }
            },

            operation(val,item,checkSet) {
                if(checkSet.size === 50) {
                    this.$message({
                        message: "最多添加50个",
                        type: "warning"
                    });
                    return;
                }
                item.checkboxValue = val;
                if (val) {
                    let has = false
                    //判断checklist 也就是父组件传来的checkedList中是否已经有当前item了
                    checkSet.forEach(it => {if(it.id === item.id) has=true});
                    if(!has)checkSet.add(item);
                } else {
                    checkSet.delete(item);
                }
                const list = [];
                checkSet.forEach(val => {
                    list.push(val);
                });
                this.$emit("checkChange", list);
            },

            cancelChecked() {
                //弹窗点取消  发送原checkedList  重置checkSet
                if(this.isVideo) {
                    this.resetSet(this.checkSet)
                }else {
                    this.resetSet(this.picCheckSet)
                }
                this.$emit("checkChange", this.checkedList);
            },

            handleRefresh() {
                this.$emit('handleRefresh')
                this.cancelChecked()
            },

            resetSet(checkSet) {
                checkSet.clear();
                this.checkedList.forEach(item => {
                    checkSet.add(item)
                })
            },
        },
    }
</script>

<style scoped lang="scss">


    .rank-list {
        overflow: hidden auto;
        flex-wrap: wrap;
    }

    .content {
    }

    .rank-item {
        border-radius: $border-radius-base;
        margin-bottom: 24px;
    }

    .rank-item-wrapper {
        box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.09);
    }

    .rank-title {
        //line-height: $line-height-large;
        //height: $line-height-large;

        .uniform-title {
            width: auto;
            margin: 6px 0;
            font-size: $font-size-base;
            font-weight: 500;
            margin-left: 12px;
            font-size: 12px;
            .file-label {
                color: $font-color-auxiliary;
            }
        }

        .name-input {
            /deep/input::-webkit-input-placeholder {
                color: $font-color-auxiliary;
            }
            /deep/.el-input--small .el-input__inner {
                color: $font-color-base;
                width: 13vw;
                height: 18px;
                padding: 0 8px;
                border: 0;
                border-bottom: 1px solid $font-color-disabled;
                border-radius: 0;
            }
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
            padding-right: 2%;
            display: flex;
            justify-content: flex-end;
            position: relative;
            top: -5px;
        }

        .icon {
            font-size: 20px;
            margin: 0 13px;
        }

        .push-icon {
            margin-top: -1px;

            .icon {
                font-size: 22px;
            }
        }

        .operationDiv {
            display: inline-block;
        }
    }

    /deep/ .el-image__inner, /deep/ .el-image__placeholder, /deep/ .el-image__error {
        height: 18vh;
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

        .video-isPlay {
            width: 100%;
        }

        .video-play {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            color: $font-color-white;
            width: 100%;

            .icon {
                font-size: 30px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }

        .video-title {
            top: 0;
            height: 48px;

            .el-col-2 {
                line-height: 32px;
            }

            .titleName {
                float: left;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                padding: 8px 0 0px 10px;
                overflow: hidden;
            }
        }

        .el-col-12 {
            padding: 8px 0 14px 10px
        }
    }


    /deep/ .el-button {
        padding: 7px 29px;
    }

    @media screen and (max-width: 1440px) {
        .rank-desc {
            .el-col-sm-12 {
                padding-left: 3%;
            }
        }
    }

    /deep/ .el-checkbox__inner {
        width: 16px;
        height: 16px;
    }

    /deep/ .el-checkbox__inner::after {
        border-color: $theme-color;
        height: 7px;
        left: 4.5px;
        top: 1px;
        border-width: 2px;
    }

    /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
        background: #fff;
    }


    //下拉框文字大小
    /deep/ .el-select-dropdown__item.hover, .el-select-dropdown__item {
        font-size: $font-size-addition !important;
    }

    /deep/ .el-range-editor .el-range-input {
        font-size: $font-size-addition;
    }

    /deep/ .customized-table.el-table th.el-table__cell {
        color: $font-color-base;
    }

    /deep/ .el-table td.el-table__cell div {
        color: $font-color-secondary;
    }

    //下拉框文字
    /deep/ input::-webkit-input-placeholder {
        color: #333333;
    }

    //下拉框禁用状态文字
    /deep/ input:disabled {
        //#999999半透明
        -webkit-text-fill-color: rgba(153, 153, 153, 0.5);
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

    @keyframes rotate{
        0%{
            transform: rotateZ(0deg);/*从0度开始*/
        }
        100%{
            transform: rotateZ(360deg);/*360度结束*/
        }
    }

    .refresh {
        display: flex;
        margin-bottom: 20px;
        .box {
            margin-left: auto;
            .refresh-rotate {
                display: inline-block;
                animation: rotate 1s linear infinite;
            }
        }
    }
</style>

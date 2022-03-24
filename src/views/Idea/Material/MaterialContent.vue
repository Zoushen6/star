<template>
    <div class="flex-vertical">
        <el-row type="flex" :gutter="16" class="rank-list flex-1 content" v-loading="ListLoading">
            <div v-if="List.length === 0" class="noData"><span>暂无数据</span></div>
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6" v-for="(item,idx) in List" :key="idx" class="rank-item">
                <div class="rank-item-wrapper">
                    <el-row type="flex" justify="center" class="video-box position-relative">
                        <el-row class="video-title">
                            <el-col :span="2" :offset="22" class="medal" v-if="showShare">
                                <el-checkbox v-model="item.checkboxValue" @change="val=>{handleCheck(val, item)}">{{''}}</el-checkbox>
                            </el-col>
                        </el-row>
                        <video v-if="isVideo" height="170" :ref="'video'+idx" @click="$emit('itemClick',item, 'detailInfo')"
                               :key="item.url" class="video-isPlay" :src="item.resource_url">
                            您的浏览器不支持 HTML5 video 标签。
                        </video>

                        <el-image v-else :src="item.resource_url" height="170" :ref="'pic'+idx"
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
<!--                                暂时不上-->
<!--                                <i class="iconfont icon-edit icon-show" @click="() => {item.isClickEdit = true}"></i>-->
                            </div>
                            <div v-show="item.isClickEdit" class="name-input" >
                                <el-input v-model="item.filename" size="small" placeholder="请输入文件名"
                                          @keyup.enter.native="$event => $event.target.blur()"
                                          @blur="() => {if(item.filename.trim()){item.isClickEdit = false;editFileName(item.id,item.filename)}}">
                                </el-input>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row class="rank-desc">
                        <el-col :span="6" :xs="12" :sm="12">
                            <div style="height: 1px"></div>
                        </el-col>
                        <el-col :span="6" :xs="12" :sm="12">
                            <div @click="$emit('itemClick', item, 'messagePush')" title="推送"
                                 class="operationDiv pointer push-icon" v-show="showPush">
                                <svg-icon icon-name="messagepush"></svg-icon>
                            </div>
                            <div @click="$emit('itemClick', item, 'share')" title="分享" class="operationDiv pointer"
                                 v-show="isVideo&&showShare">
                                <svg-icon icon-name="share"></svg-icon>
                            </div>
                            <div @click="$emit('itemClick', item, 'deleteMaterial')" title="删除" class="operationDiv pointer"
                                 v-show="showDelete(item)">
                                <svg-icon icon-name="deletematerial"></svg-icon>
                            </div>
                        </el-col>
                    </el-row>
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
            :total="totalNum" class="m-t-30 text-center">
        </el-pagination>
        <!-- /分页 -->
    </div>
</template>

<script>
    import {showPush, showShare, showDelete} from "./MaterialAuth"

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
            totalNum: Number,
            currentPage: Number,
            pageSize: Number,
        },

        deactivated() {
            this.clearCheck();
        },

        data() {
            return {
                checkSet: new Set(),
                pageSizes: [12, 20, 30, 40, 50, 100],
                isClickEdit: false,
            }
        },

        // 数据格式化
        computed: {
            showPush,
            showShare,
        },

        methods: {

            showDelete,

            editFileName(id,filename){
                this.axiosRename(id,filename).then((res) => {
                    if(res && res.data.code === 200) {

                    }
                }).catch((error) => {
                    console.warn(error)
                }).finally(() => {
                });
            },

            handleCheck(val, item) {
                const {id} = item;
                item.checkboxValue = val;
                if (val) {
                    this.checkSet.add(id);
                } else {
                    this.checkSet.delete(id);
                }
                const list = [];
                this.checkSet.forEach(val => {
                    list.push(val);
                });
                this.$emit("checkChange", list);
            },

            clearCheck() {
                this.checkSet.clear();
                this.List.forEach((item) => {
                    item.checkboxValue = false;
                });
                this.$emit("checkChange", []);
            },

            axiosRename(id,filename){
                return this.$http.post("/media/media/update-media-name", {
                    media_id: id,
                    file_name: filename
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
        margin: 0 !important;
    }

    .rank-item {
        border-radius: $border-radius-base;
        margin-bottom: 20px;
    }

    .rank-item-wrapper {
        box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.09);
    }

    .rank-title {
        line-height: $line-height-large;
        height: $line-height-large;

        .uniform-title {
            width: auto;
            line-height: 43px;
            font-size: $font-size-base;
            font-weight: 500;
            margin-left: 12px;
            .icon-show {
                vertical-align: bottom;
                display: none;
            }
            .file-name:hover{
                .icon-show {
                    display: inline-block;
                }
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
                line-height: $line-height-large;
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
</style>

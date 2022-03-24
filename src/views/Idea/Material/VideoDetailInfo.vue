<template>
    <!--抽屉-->
    <el-drawer
        :title="info.filename"
        :visible.sync="dialogVisible"
        @closed="closeDialog"
        direction="rtl">
        <div class="video">
            <video class="video-preview" :ref="'videoPlay'" :key="info.resource_url" controls :src="info.resource_url">
            </video>
        </div>
        <div class="info">
            <div class="info-overflow" v-for="(item,key) in videoItem">{{item + '：' + info[key] }}</div>
            <div v-show="showShare">
                <span>标签：</span>
                <span>{{info.label}}</span>
                <span class="add-label pointer" @click="()=>{$emit('addLabel')}">+添加标签</span>
            </div>
        </div>
    </el-drawer>
    <!--/抽屉-->
</template>

<script>
    import {showShare} from "./MaterialAuth";
    import DialogMixin from "@mixins/DialogMixin";

    export default {
        name: "VideoDetailInfo",

        mixins: [DialogMixin],

        data() {
            return {
                videoItem: {
                    "filename": "视频名称",
                    "proportion": "视频尺寸",
                    "size": "视频大小",
                    "duration": "视频时长",
                    "aspect_ratio": "视频比例",
                    "create_time": "创建时间",
                    "origin_name": "来源",
                    "user_name": "上传人",
                    "operation_name": "运营",
                    "choreographer_name": "编导",
                    "montage_name": "剪辑",
                    "photography_name": "拍摄",
                    "product": "产品",
                    "industry": "行业"
                }
            }
        },

        computed: {
            showShare
        },

        watch: {
            info: {
                handler: function (val) {
                    val.proportion = val.width + "*" + val.height;
                }
            }
        },

        props: {
            info: {
                type: Object,
                default: function () {
                    return {
                        filename: "",
                        resource_url: "",
                        label: ""
                    };
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .video {
        background: #3E3E3E;
        height: calc(29%);

        .video-preview {
            height: 100%;
            position: relative;
            left: 50%;
            transform: translateX(-50%);
            object-fit: contain;
        }
    }

    /deep/.el-drawer__body {
        overflow-x: hidden;
    }

    /deep/.el-drawer {
        width: 23.5% !important;
    }

    /deep/ .el-drawer__header {
        margin-bottom: 20px;
    }

    /deep/ .el-drawer__header > :first-child {
        font-size: 16px;
        color: $font-color-base;
        font-weight: 600;
    }

    .info {
        margin: 18px 0 0 16px;
        font-size: $font-size-base;

        div {
            margin-bottom: 17px;
            word-break: break-all;
        }

        .add-label {
            color: $theme-color;
        }

        .info-overflow {
            color: $font-color-secondary;
        }
    }
</style>

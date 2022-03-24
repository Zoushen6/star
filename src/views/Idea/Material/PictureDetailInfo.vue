<template>
    <!--点击图片-->
    <customized-dialog
        title=""
        class="dialog-without-title customized-dialog"
        :visible="dialogVisible"
        :width="600"
        @close="closeDialog"
    >
        <div class="info">
            <el-image :src="info.resource_url"  class="video-isPlay" :key="info.resource_url">
            </el-image>
            <div>来源: <span >{{info.origin_name}}</span></div>
            <div>上传人: <span >{{info.user_name}}</span></div>
            <div>行业: <span >{{info.industry}}</span></div>
            <div v-show="showShare">标签：<span>{{info.label}}</span><span class="addLabel pointer" @click="()=>{$emit('addLabel')}">+添加标签</span></div>
        </div>
    </customized-dialog>
    <!--/点击图片-->
</template>

<script>
    import {showShare} from "./MaterialAuth";
    import DialogMixin from "@mixins/DialogMixin";

    export default {
        name: "PictureDetailInfo",

        mixins: [DialogMixin],

        computed: {
            showShare
        },

        props: {
            info: {
                type: Object,
                default: function () {
                    return {
                        resource_url: "",
                        origin_name: "",
                        user_name: "",
                        label: ""
                    };
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .info {

        div {
            line-height: 40px;
        }

        .addLabel {
            color: $theme-color;
        }
    }

    /deep/ .el-image__inner {
        height: 34vh;
    }

    .el-image {
        left: 50%;
        transform: translateX(-50%);
    }
</style>

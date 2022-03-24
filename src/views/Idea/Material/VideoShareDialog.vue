<template>
    <!--分享弹窗-->
    <customized-dialog
        title="分享视频"
        :visible="dialogVisible"
        :width="600"
        @cancel="closeDialog"
        @close="closeDialog"
    >
        <p v-if="isMultiOp">链接已经全部复制到剪切板，粘贴分享给他人~</p>
        <div v-else class="flex">
            <video height="128" width="128" :key="url" :src="url">
            </video>
            <div>
                <p style="font-size: 16px;color: #333333; margin: 9px 0 14px 14px;">链接已复制到剪切板，粘贴分享给他人吧！</p>
                <p class="text-overflow">{{url}}</p>
                <div @click="CopyContent(url)" class="copy-link pointer"><svg-icon icon-name="copy1"></svg-icon><span>复制链接</span></div>
            </div>
        </div>

    </customized-dialog>
    <!--/分享弹窗-->
</template>

<script>
    import {CopyContent} from "@tools/Copy";

    import DialogMixin from "@mixins/DialogMixin";
    export default {
        name: "VideoShareDialog",

        mixins: [DialogMixin],

        watch: {
           dialogVisible: {
               handler(val) {
                   if (val) {
                       const map = this.materialList.reduce((prev, next) => {prev[next.id] = next; return prev;}, {});
                       const list = this.materialId.map(key => map[key].resource_url);
                       this.CopyContent(list.join("\n"), "", "");
                   }
               }
           }
        },

        props: {
            materialId: Array,
            materialList: Array,
            url: String,
            isMultiOp: {
                type: Boolean,
                default: false
            }
        },

        methods: {
            CopyContent
        }
    }
</script>

<style scoped lang="scss">
    .text-overflow {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;

        margin: 0 0 14px 14px;
    }


    .copy-link {
        color: $theme-color;
        margin-left: 14px;
        span {
            margin-left: 3px;
        }
    }
</style>

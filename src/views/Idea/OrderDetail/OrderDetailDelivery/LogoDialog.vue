<template>
    <customized-dialog
        title="产品LOGO"
        :width="600"
        :visible="dialogVisible"
        @close="closeDialog"
    >
        <p class="image">
            <el-image style="width: 240px;height: 240px;" :src="url"></el-image>
        </p>
        <p class="downloadLogo">
            <el-button size="small" type="primary" @click="downLoad()">点击下载</el-button>
        </p>
    </customized-dialog>
</template>

<script>
import DialogMixin from "@mixins/DialogMixin";

export default {
    name: "LogoDialog",

    mixins: [DialogMixin],

    props: {
      url: {
          type:String
      }
    },

    methods: {
        downLoad(){
            this.$common.downLoadPicture(this.url)
        }
    }
}
</script>

<style scoped lang="scss">
    .downloadLogo, .image {
        text-align: center;
    }
</style>
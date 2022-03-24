<template>
    <!-- 查看关联账户弹窗 -->
    <customized-dialog
        class="customized-dialog"
        title="关联账户"
        :width="507"
        :visible="dialogVisible"
        @close="closeDialog"
    >
        <div v-for="(it,idx) in info.advertiser" :key="idx">
            <p>账户{{idx+1}}</p>
            <p>关联账户ID：{{it.advertiser_id}}</p>
            <p>关联账户名：{{it.advertiser_name}}</p>
        </div>
    </customized-dialog>
    <!-- 查看关联账户弹窗 -->
</template>

<script>
import DialogMixin from "@mixins/DialogMixin";
export default {
    name: "AccountDialog",
    mixins: [DialogMixin],
    props: {
        info: {
            type: Object,
            default(){
                return {
                    advertiser: []
                }
            }
        }
    },
}
</script>

<style scoped>

</style>
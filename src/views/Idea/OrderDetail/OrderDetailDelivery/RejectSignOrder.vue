<template>
    <!-- 已拒签 -->
    <el-form label-width="100px">
        <el-form-item label="被拒文件链接">
            <el-input type="textarea" :value="info.rejectFileName" disabled></el-input>
        </el-form-item>
        <el-form-item label="拒签原因">
            <el-input type="textarea" :value="info.refusal" disabled></el-input>
        </el-form-item>
        <el-form-item>
            <el-button size="small" type="primary" v-if="resubmit" @click="$emit('resubmit')">重新交付
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    name: "RejectSignOrder",
    props: {
        orderId: Number,
        resubmit: Boolean,
        info: {
            type: Object,
            default(){
                return {
                    rejectFileName: "",
                    refusal: ""
                }
            }
        }
    }
}
</script>

<style scoped lang="scss">
.el-form {
    width: 600px;
    margin: 20px auto 0;
}
</style>
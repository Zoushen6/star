<template>
    <customized-menu :menu="MATERIAL_LIST" :breadcrumb="false">
        <keep-alive>
            <router-view :key="fullPath"></router-view>
        </keep-alive>
    </customized-menu>
</template>

<script>
import {MATERIAL_LIST} from "@config/AuthMenu";
import CustomizedMenu from "@components/menu/CustomizedMenu";

export default {
    name: "Material",

    data(){
        return {
            MATERIAL_LIST,
            abc:123
        }
    },

    computed:{
        fullPath(){
            //绑定key 触发MaterialLibrary实例变化
            return this.$route.fullPath;
        }
    },

    components: {
        CustomizedMenu
    },

}
</script>

<style scoped lang="scss">
</style>

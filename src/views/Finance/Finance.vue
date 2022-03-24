<template>
    <customized-menu :menu="FINANCE_CENTER_LIST">
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </customized-menu>
</template>

<script>
    import {FINANCE_CENTER_LIST} from "@config/AuthMenu";
    import CustomizedMenu from "@components/menu/CustomizedMenu";

    export default {
        name: "Finance",

        components: {CustomizedMenu},

        data() {
            return {
                FINANCE_CENTER_LIST,
            };
        }
    }
</script>

<style scoped lang="scss">

</style>
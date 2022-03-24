<template>
    <customized-menu :menu="POPULAR_LIST">
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </customized-menu>
</template>

<script>
    import {POPULAR_LIST} from "@config/AuthMenu";
    import CustomizedMenu from "@components/menu/CustomizedMenu";

    export default {
        name: "Popular",

        components: {CustomizedMenu},

        data() {
            return {
                POPULAR_LIST,
            };
        }
    }
</script>

<style scoped lang="scss">

</style>
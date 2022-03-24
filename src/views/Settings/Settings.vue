<template>
    <customized-menu :menu="SETTINGS_MENU_LIST">
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </customized-menu>
</template>

<script>
    import {SETTINGS_MENU_LIST} from "@config/AuthMenu";
    import CustomizedMenu from "@components/menu/CustomizedMenu";

    export default {
        name: "Settings",
        components: {CustomizedMenu},
        data() {
            return {
                SETTINGS_MENU_LIST,
            };
        }
    }
</script>

<style scoped lang="scss">
</style>



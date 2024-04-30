<template>
    <el-menu :router="true" @open="handleOpen" @close="handleClose">
        <el-menu-item index="/playgrounds/case5-prod/playground">
            <el-icon>
                <SwitchFilled />
            </el-icon>
            <span>Playground</span>
        </el-menu-item>
        <el-sub-menu index="2">
            <template #title>
                <el-icon>
                    <Checked />
                </el-icon>
                <span>Demo Play</span>
            </template>
            <el-menu-item-group title="コンポーネント提案">
                <el-menu-item index="/playgrounds/case5-prod/demos/EmailRegister">　メールアドレス登録</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="コンテキスト理解">
                <el-menu-item index="/playgrounds/case5-prod/demos/PCorMobile">　PC or Mobile</el-menu-item>
                <el-menu-item index="/playgrounds/case5-prod/demos/InlineValidation">　Inline Validation</el-menu-item>
            </el-menu-item-group>
        </el-sub-menu>
        <el-menu-item index="/playgrounds/case5-prod">
            <el-icon><icon-menu /></el-icon>
            <span>Readme</span>
        </el-menu-item>
    </el-menu>
</template>

<script lang="ts" setup>
import {
    Menu as IconMenu,
    Checked,
    SwitchFilled
} from '@element-plus/icons-vue'
const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
</script>
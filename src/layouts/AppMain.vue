<template>
    <main>
        <router-view v-slot="{ Component, route }">
            <keep-alive>
                <component :is="Component" />
            </keep-alive>
        </router-view>
    </main>
</template>

<script setup lang="ts"></script>

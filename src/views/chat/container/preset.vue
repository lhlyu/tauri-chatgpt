<template>
    <transition name="fade">
        <div v-if="show" id="preset">
            <List>
                <ListItem v-for="v in presets" :key="v.label" :label="v.label" :desc="v.desc" @click="() => click(v.desc)"></ListItem>
            </List>
        </div>
    </transition>
</template>

<script setup lang="ts">
import List from '../../../components/list/index.vue'
import ListItem from '../../../components/list/item.vue'
import presets from './presets'

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['pick'])

const click = (desc: string) => {
    emit('pick', desc)
}
</script>

<style scoped lang="scss">
#preset {
    position: fixed;
    bottom: 300px;
    left: 325px;
    width: calc(100% - 350px);
    height: 400px;
    border-radius: 10px;
    background-color: rgb(var(--preset-bg-color));
    z-index: 9;
    overflow-y: auto;

    .list-item {
        &:hover {
            background-color: rgb(var(--preset-item-bg-color));
        }
    }
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s;
}
</style>

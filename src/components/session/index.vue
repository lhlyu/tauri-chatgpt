<template>
    <div class="session" :class="{ 'session-active': active }">
        <div class="left">
            <img :src="avatar" alt="avatar" />
        </div>
        <div class="right">
            <div class="top">
                <div class="title">
                    {{ name }}
                </div>
                <div class="time">
                    {{ t }}
                </div>
            </div>
            <div class="bottom">
                <div class="desc">{{ desc }}</div>
                <div class="close" @click.stop="deleteHandler">
                    <IconClose></IconClose>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import IconClose from '../../assets/icons/close.svg?component'
import dayjs from 'dayjs'

const props = defineProps<{
    id: string
    avatar: string
    name: string
    desc: string
    ts: number
    active: boolean
}>()

const t = computed(() => {
    const now = new Date()
    const tt = new Date(props.ts as number)
    let format = 'YY/MM/DD'
    if (tt.getFullYear() === now.getFullYear() && tt.getMonth() === now.getMonth() && tt.getDate() === now.getDate()) {
        format = 'HH:mm:ss'
    }
    return dayjs(props.ts).format(format)
})

const emit = defineEmits(['delete'])

const deleteHandler = () => {
    emit('delete', props.id)
}
</script>

<style scoped lang="scss"></style>

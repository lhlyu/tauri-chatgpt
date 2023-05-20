<template>
    <div class="bubble">
        <div class="header">
            <div class="left">
                <img :src="avatar" alt="avatar" />
                <time>{{ dayjs(ts).format('YYYY-MM-DD HH:mm:ss') }}</time>
            </div>
            <div class="right">
                <div class="icon" @click="deleteMessage">
                    <IconDelete></IconDelete>
                </div>
                <div class="icon" @click.stop="copyContent">
                    <IconContentCopy></IconContentCopy>
                </div>
            </div>
        </div>
        <div class="body">
            <div class="markdown-body" v-if="markdown" v-html="text"></div>
            <div class="markdown-body" v-else>
                <pre>{{ text }}</pre>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import IconContentCopy from '../../assets/icons/content_copy.svg?component'
import IconDelete from '../../assets/icons/delete.svg?component'
import md from './md'
import demo from './demo'

const props = defineProps({
    id: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: 'Wait...'
    },
    markdown: {
        type: Boolean,
        default: true
    },
    ts: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String,
        default: '/openai.png'
    }
})

const text = computed(() => {
    if (props.markdown && props.content) {
        return md(props.content)
    }
    return props.content
})

const emit = defineEmits(['copy', 'delete'])

const copyContent = () => {
    emit('copy', props.content)
}

const deleteMessage = () => {
    emit('delete', props.id)
}
</script>

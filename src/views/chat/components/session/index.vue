<template>
    <div :id="id" class="session" :class="{ active }" @click="activeSession">
        <div class="avatar">
            <img :src="avatar" alt="avatar" />
        </div>
        <div class="info">
            <div class="top">
                <div class="title">{{ title }}</div>
                <div class="time">{{ t }}</div>
            </div>
            <div class="bottom">
                <div class="desc">
                    {{ desc }}
                </div>
                <div class="action">
                    <i @click.stop="deleteSession" v-tippy="$t('iconDeleteSession')">
                        <IconDelete></IconDelete>
                    </i>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { IconDelete } from '../../../../components/icons'
import useSessionsStrore from '../../../../stores/sessions'

const props = defineProps({
    id: {
        type: String,
        default: ''
    },
    active: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: '/avatar.jpg'
    },
    title: {
        type: String,
        default: ''
    },
    desc: {
        type: String,
        default: ''
    },
    ts: {
        type: Number,
        default: 0
    }
})

const t = computed(() => {
    const now = new Date()
    const tt = new Date(props.ts as number)
    let format = 'YY/MM/DD'
    if (tt.getFullYear() === now.getFullYear() && tt.getMonth() === now.getMonth() && tt.getDate() === now.getDate()) {
        format = 'HH:mm:ss'
    }
    return dayjs(props.ts).format(format)
})

const store = useSessionsStrore()

const deleteSession = () => {
    store.remove(props.id as string)
}

const activeSession = (event: MouseEvent) => {
    event.stopPropagation()
    event.preventDefault()
    if (store.id !== props.id) {
        store.active(props.id as string)
    }
}
</script>

<style scoped lang="scss">
.session {
    display: flex;
    height: 70px;
    width: 100%;
    padding: 15px;
    scroll-snap-align: start;

    &:hover:not(.active) {
        background-color: rgb(var(--session-hover-bg-color));
    }

    .avatar {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        width: 40px;
        height: 100%;

        img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }
    }
    .info {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding-left: 10px;

        .top {
            display: flex;
            justify-content: space-between;
            line-height: 1.5;
            font-size: 14px;

            .title {
                flex: 1;
                font-weight: 500;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 155px;
            }

            .time {
                flex-shrink: 0;
                max-width: 50px;
                font-size: 12px;
                color: rgb(var(--session-time-color));
            }
        }

        .bottom {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            line-height: 1.8;
            color: rgb(var(--session-bottom-color));

            .desc {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 180px;
            }

            .action {
                i {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 21px;
                    height: 21px;
                    cursor: pointer;
                    border-radius: 2px;
                    //background-color: rgb(243, 244, 246);
                    transition: background-color 0.2s ease-in-out;

                    &:hover {
                        background-color: rgb(229, 231, 235);
                    }
                }
            }
        }
    }
}

.active {
    background-color: rgb(var(--primary-color));
    color: white;

    .info {
        .top {
            .time {
                color: white;
            }
        }
        .bottom {
            color: white;
        }
    }

    .bottom {
        .action {
            i {
                &:hover {
                    background-color: transparent !important;
                }
            }
        }
    }
}
</style>

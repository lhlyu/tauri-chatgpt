<template>
    <div class="dropdown-container">
        <button class="dropdown-button" @click.stop="triggle">
            <span class="dropdown-title text-truncate">{{ modelValue }}</span>
            <span class="dropdown-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                </svg>
            </span>
        </button>
        <div class="dropdown-list-container">
            <div class="dropdown-list-wrapper">
                <ul class="dropdown-list" ref="dropdownListWrapper">
                    <li class="dropdown-list-item" v-for="(m, i) in items" :key="m" :data-translate-value="`${i * 100}%`" @click.stop="() => select(m)">
                        <span class="text-truncate">{{ m }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'

const props = defineProps({
    items: {
        type: Array as PropType<string[]>,
        default: () => []
    },
    modelValue: {
        type: String,
        default: ''
    }
})

const arrowRotate = ref<string>('0')
const dropdownHeight = ref<string>('0')
const listOpacity = ref<number>(0)

const dropdownListWrapper = ref<HTMLUListElement>()
const translateValue = ref<string>('0')

const triggle = () => {
    const dropdownOpenHeight = 40 * props.items?.length + 12
    const currDropdownHeight = dropdownHeight.value

    const out = document.querySelector(':not(.dropdown-container)')

    if (currDropdownHeight === '0') {
        arrowRotate.value = '180deg'
        dropdownHeight.value = dropdownOpenHeight + 'px'
        listOpacity.value = 1

        if (out && 'addEventListener' in out) {
            out.addEventListener('click', triggle)
        }
    } else {
        arrowRotate.value = '0'
        dropdownHeight.value = '0'
        listOpacity.value = 0

        if (out && 'removeEventListener' in out) {
            out.removeEventListener('click', triggle)
        }
    }
}

const emit = defineEmits(['update:modelValue'])

const select = (val: string) => {
    emit('update:modelValue', val)
    triggle()
}

onMounted(() => {
    if (dropdownListWrapper.value && 'addEventListener' in dropdownListWrapper.value) {
        dropdownListWrapper.value.addEventListener('mouseover', (e: Event) => {
            const target = e.target as HTMLUListElement
            translateValue.value = target.dataset.translateValue ?? '0'
        })
    }
})
</script>

<style lang="scss" scoped>
.dropdown-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    font-size: 14px;
    line-height: 1.4;

    button {
        color: inherit;
        background-color: transparent;
        border: none;
        outline: none;
        cursor: pointer;
    }

    .text-truncate {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
        user-select: none;
        pointer-events: none;
    }

    .dropdown-button {
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 12px;
        border: 1px solid var($line-color);
        border-radius: 4px;
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

        span {
            pointer-events: none;
        }

        .dropdown-arrow {
            display: inline-flex;
            transform: rotate(v-bind(arrowRotate));
            transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

            svg {
                width: 16px;
                height: 16px;
                transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                pointer-events: none;
                fill: #b1b8ca;
            }
        }
    }

    .dropdown-list-container {
        box-sizing: border-box;
        max-height: v-bind(dropdownHeight);
        overflow: hidden;
        transition: max-height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

        .dropdown-list-wrapper {
            position: relative;
            box-sizing: border-box;
            margin-top: 10px;
            padding: 0;
            border: 1px solid var($line-color);
            border-radius: 4px;

            .dropdown-list {
                position: relative;
                box-sizing: border-box;
                margin: 0;
                padding: 0;
                list-style-type: none;

                &:hover {
                    &::before {
                        opacity: 1;
                    }
                }

                &::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 40px;
                    background: var($dropdown-hover-bg);
                    border-radius: 4px;
                    transform: translateY(v-bind(translateValue));
                    opacity: 0;
                    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    pointer-events: none;
                }

                .dropdown-list-item {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    box-sizing: border-box;
                    height: 40px;
                    padding: 0 12px;
                    cursor: pointer;
                    opacity: v-bind(listOpacity);
                    transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
            }
        }
    }
}
</style>

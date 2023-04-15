<template>
    <Modal v-model="chat.modal">
        <section class="modal-content">
            <div class="sidebar">
                <ul>
                    <li @click="onActive(menus[0])" :class="{ active: chat.setting === 'global' }">
                        <span>{{ $t('setting') }}</span>
                    </li>
                    <li @click="onActive(menus[1])" :class="{ active: chat.setting === 'about' }">
                        <span>{{ $t('about') }}</span>
                    </li>
                </ul>
            </div>
            <div class="container">
                <div class="lists" v-if="chat.setting === 'global'">
                    <List>
                        <ListItem label="Host" :desc="$t('hostDesc')">
                            <InputBox v-model="chat.host" />
                        </ListItem>
                        <ListItem label="ApiKey" desc="openai api key">
                            <InputBox type="password" v-model="chat.api_key" />
                        </ListItem>
                        <ListItem :label="$t('enableMarkdown')">
                            <Switch v-model="chat.markdown" name="markdown" />
                        </ListItem>
                        <ListItem :label="$t('enableEnter')">
                            <Switch v-model="chat.enter" name="enter" />
                        </ListItem>
                        <ListItem :label="$t('requestTimeoutTitle')" :desc="$t('requestTimeoutDesc')">
                            <InputBox type="number" v-model="chat.timeout" />
                        </ListItem>
                    </List>

                    <List>
                        <ListItem :label="$t('modelTitle')">
                            <SelectBox v-model="chat.model">
                                <option v-for="v in models" :value="v" :key="v">{{ v }}</option>
                            </SelectBox>
                        </ListItem>
                        <ListItem :label="$t('contextCountTitle')">
                            <Slider v-model="chat.context_count" />
                        </ListItem>
                        <ListItem :label="$t('maxTokenTitle')">
                            <InputBox type="number" v-model="chat.max_tokens" />
                        </ListItem>
                        <ListItem :label="$t('temperatureTitle')" :desc="$t('temperatureDesc')">
                            <Slider :min="0.0" :max="2.0" :step="0.1" v-model="chat.temperature" />
                        </ListItem>
                        <ListItem :label="$t('presencePenaltyTitle')" :desc="$t('presencePenaltyDesc')">
                            <Slider :min="-2.0" :max="2.0" :step="0.1" v-model="chat.presence_penalty" />
                        </ListItem>
                    </List>
                </div>

                <div class="lists" v-if="chat.setting === 'about'">
                    <List>
                        <ListItem :label="$t('version')">{{ pkg.version }}</ListItem>
                        <ListItem :label="$t('source')">
                            <IconLink></IconLink>
                        </ListItem>
                    </List>
                </div>
            </div>
        </section>
    </Modal>
</template>

<script setup lang="ts">
import Modal from '../../components/modal/index.vue'
import List from '../../components/list/index.vue'
import ListItem from '../../components/list/item.vue'
import Switch from '../../components/inputx/switch.vue'
import InputBox from '../../components/inputx/input.vue'
import Slider from '../../components/inputx/slider.vue'
import SelectBox from '../../components/inputx/select.vue'
import useChatStore from '../../stores/chat'
import pkg from '../../../package.json'
import { IconLink } from '../../components/icons/index'

const chat = useChatStore()

const menus = ['global', 'about']

const models = ['gpt-4', 'gpt-4-0314', 'gpt-4-32k', 'gpt-4-32k-0314', 'gpt-3.5-turbo', 'gpt-3.5-turbo-0301']

// 单击
const onActive = (menu: string) => {
    chat.setting = menu
}
</script>

<style scoped lang="scss">
.modal-content {
    display: flex;
    width: 900px;
    height: 90%;
    border-radius: 10px;
    overflow: hidden;
    z-index: 100;
    background-color: rgb(var(--modal-bg-color));
    user-select: none;
    border: 1px solid rgb(var(--border-color));

    .sidebar {
        width: 300px;
        padding: 20px;
        background-color: rgb(var(--sidebar-bg-color));
        user-select: none;

        ul {
            list-style-type: none;
            margin: 0;

            li {
                display: flex;
                align-items: center;
                height: 40px;
                line-height: 40px;
                margin-bottom: 8px;
                padding: 0 16px;
                font-size: 0.875rem;
                border-radius: 4px;
                cursor: pointer;
                border: 1px solid rgba(var(--primary-color), 0.8);
                span {
                    margin-right: 8px;
                }
            }
            .active {
                background-color: rgba(var(--primary-color), 0.8);
                color: white;
            }
        }
    }

    .container {
        width: 100%;
        padding: 20px;
        overflow: auto;
        scroll-behavior: smooth;
    }
}
</style>

<template>
    <Modal v-model="chat.modal">
        <section class="modal-content">
            <div class="sidebar">
                <ul>
                    <li @click="onActive(menus[0])" :class="{ active: chat.setting === 'global' }">
                        <span>通用设置</span>
                    </li>
                    <li @click="onActive(menus[1])" :class="{ active: chat.setting === 'about' }">
                        <span>关于我们</span>
                    </li>
                </ul>
            </div>
            <div class="container">
                <div class="lists" v-if="chat.setting === 'global'">
                    <List>
                        <ListItem label="头像" desc="可以使用网络地址">
                            <InputBox v-model="chat.avatar" />
                        </ListItem>
                        <ListItem label="Host" desc="可以使用自己的代理服务器">
                            <InputBox v-model="chat.host" />
                        </ListItem>
                        <ListItem label="ApiKey" desc="openai api key">
                            <InputBox type="password" v-model="chat.api_key" />
                        </ListItem>
                        <ListItem label="启用Markdown">
                            <Switch v-model="chat.markdown" />
                        </ListItem>
                    </List>

                    <List>
                        <ListItem label="模型">
                            <SelectBox v-model="chat.model">
                                <option v-for="v in models" :value="v" :key="v">{{ v }}</option>
                            </SelectBox>
                        </ListItem>
                        <ListItem label="附带的上下文条数">
                            <Slider v-model="chat.context_count" />
                        </ListItem>
                        <ListItem label="回复最大tokens数量">
                            <InputBox type="number" v-model="chat.max_tokens" />
                        </ListItem>
                        <ListItem label="随机性" desc="值越大，回复越随机">
                            <Slider :min="0.0" :max="2.0" :step="0.1" v-model="chat.temperature" />
                        </ListItem>
                        <ListItem label="话题新鲜度" desc="值越大，回复偏向新鲜">
                            <Slider :min="-2.0" :max="2.0" :step="0.1" v-model="chat.presence_penalty" />
                        </ListItem>
                    </List>
                </div>

                <div class="lists" v-if="chat.setting === 'about'">
                    <List>
                        <ListItem label="版本">{{ pkg.version }}</ListItem>
                        <ListItem label="源码">
                            <IconGithubOne :size="20" :strokeWidth="2" />
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
    background-color: #fff;
    user-select: none;
    border: 1px solid rgb(229, 231, 235);

    .sidebar {
        width: 300px;
        padding: 20px;
        background-color: rgb(243, 244, 246);
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
                border: 1px solid rgba(0, 154, 255, 0.8);
                span {
                    margin-right: 8px;
                }
            }
            .active {
                background-color: rgba(0, 154, 255, 0.8);
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

<template>
    <aside class="openai-setting" v-if="openai.setting_open">
        <h3>{{ $t('setting') }}</h3>
        <div class="field">
            <Inputz label="Host" v-model="openai.host"></Inputz>
        </div>
        <div class="field">
            <Inputz :label="$t('timeout')" type="number" v-model="openai.timeout"></Inputz>
        </div>
        <div class="field">
            <Inputz :label="$t('openai_api_key')" v-model="openai.key"></Inputz>
        </div>
        <div class="field">
            <Inputz :label="$t('auth_code')" v-model="openai.code"></Inputz>
        </div>
        <div class="field">
            <Selectz :label="$t('model')" v-model="openai.model" :options="models"></Selectz>
        </div>
        <div class="field">
            <Inputz :label="$t('context_count')" type="number" v-model="openai.context_count"></Inputz>
        </div>
        <div class="field">
            <Inputz label="Max Tokens" type="number" v-model="openai.max_tokens"></Inputz>
        </div>
        <div class="field">
            <Inputz label="Temperature" type="number" v-model="openai.temperature"></Inputz>
        </div>
        <div class="field">
            <Inputz label="Presence Penalty" type="number" v-model="openai.presence_penalty"></Inputz>
        </div>
    </aside>
</template>

<script setup lang="ts">
import Inputz from '../../components/inputz/index.vue'
import Selectz from '../../components/selectz/index.vue'
import useOpenaiStore from '../../stores/openai'

const openai = useOpenaiStore()

const models: string[] = ['gpt-4', 'gpt-4-0314', 'gpt-4-32k', 'gpt-4-32k-0314', 'gpt-3.5-turbo', 'gpt-3.5-turbo-0301']
</script>

<style scoped lang="scss"></style>

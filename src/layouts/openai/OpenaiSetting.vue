<template>
    <aside class="openai-setting" v-if="openai.setting_open">
        <h3>{{ $t('setting') }}</h3>
        <Field label="Host">
            <InputBox v-model="openai.host"></InputBox>
        </Field>
        <Field :label="$t('timeout')">
            <InputBox v-model.number="openai.timeout" type="number"></InputBox>
        </Field>
        <Field :label="$t('openai_api_key')">
            <InputBox v-model="openai.key"></InputBox>
        </Field>
        <Field :label="$t('auth_code')">
            <InputBox v-model="openai.code"></InputBox>
        </Field>
        <Field :label="$t('model')">
            <Dropdown v-model="openai.model" :items="models"></Dropdown>
        </Field>
        <Field :label="$t('context_count')" :desc="`${openai.context_count ?? 0}`">
            <Slider v-model="openai.context_count" :min="1" :max="20"></Slider>
        </Field>
        <Field label="Max Tokens" :desc="`${openai.max_tokens ?? 0}`">
            <Slider v-model="openai.max_tokens" :min="64" :max="2048" :step="64"></Slider>
        </Field>

        <Field label="Temperature" :desc="`${openai.temperature ?? 0}`">
            <Slider v-model="openai.temperature" :min="0" :max="2" :step="0.1"></Slider>
        </Field>

        <Field label="Presence Penalty" :desc="`${openai.presence_penalty ?? 0}`">
            <Slider v-model="openai.presence_penalty" :min="-2" :max="2" :step="0.1"></Slider>
        </Field>
    </aside>
</template>

<script setup lang="ts">
import Field from '../../components/field/index.vue'
import Dropdown from '../../components/dropdown/index.vue'
import InputBox from '../../components/input-box/index.vue'
import Slider from '../../components/slider/index.vue'
import useOpenaiStore from '../../stores/openai'

const openai = useOpenaiStore()

const models: string[] = ['gpt-4', 'gpt-4-0314', 'gpt-4-32k', 'gpt-4-32k-0314', 'gpt-3.5-turbo', 'gpt-3.5-turbo-0301']
</script>

<style scoped lang="scss"></style>

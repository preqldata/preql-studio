<template>
    <div v-if="loading" class="results-loading"><v-progress-linear height="10" indeterminate
            color="primary"></v-progress-linear>
    </div>
    <ErrorComponent v-else-if="error" :error="error"></ErrorComponent>
    <HintsComponent v-else-if="!editorData.executed"></HintsComponent>
    <QueryResult v-else :editor="editorData" :headers="editorData.results.headers" :results="editorData.results.data">
    </QueryResult>
    <EditorFooter class='footer'  :loading="loading" :executed="editorData.executed" :length="editorData.results.data.length"
        :duration="editorData.duration" />
</template>

<style scoped>

.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.results-loading {
    height: 100%;
}
</style>
<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

// import ModelConceptList from '@/components/model/ModelConceptList.vue';
import QueryResult from './QueryResult.vue';
import HintsComponent from './HintsComponent.vue';
import ErrorComponent from './ErrorComponent.vue';
import EditorFooter from './EditorFooter.vue';
import { Editor, RawEditor } from '/src/models/Editor'

export default defineComponent({
    name: 'EditorResults',
    props: {
        editorData: {
            type: [Editor, RawEditor],
            required: true,
        }
    },
    data() {
        return {
            last_passed_query_text: null,
            form: null,
            prompt: '',
            generatingPrompt: false,
            info: 'Query processing...',
        }
    },
    components: {
        // ModelConceptList, 
        HintsComponent,
        QueryResult,
        ErrorComponent,
        EditorFooter
    },
    mounted() {
    },
    computed: {
        ...mapGetters(['models', 'activeConnection']),
        error() {
            return this.editorData.error
        },
        loading() {
            return this.editorData.loading
        },
        splitElements() {
            return [
                this.$refs.editor,
                this.$refs.results
            ];
        },
        computedHeight() {
            return `${this.editorY}px`
        },
        computedWidth() {
            return `${this.editorX}px`
        },
        passedQuery() {
            return this.editorData.contents === this.last_passed_query_text
        },
        mobile() {
            return this.$vuetify.display.mobile
        },
        defaultRows() {
            if (this.$vuetify.display.mobile) {
                return 10;
            }
            return 20;
        },
        generateOverlayVisible() {
            return this.prompt.length > 1 || this.generatingPrompt
        }

    },
    methods: {

    }
})
</script>
  
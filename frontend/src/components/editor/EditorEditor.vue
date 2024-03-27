<template>
    <div ref="editor" id="editor" class="editor-fix-styles">
        <!-- <div id="editor" > </div> -->
    </div>
</template>
<style scoped>
.editor-fix-styles {
    text-align: left;
    border: none;
}
</style>
<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import editorMap from '/src/store/modules/monaco';
import axiosHelpers from '/src/api/helpers.ts';
import instance from '/src/api/instance';
import { Editor, RawEditor } from '/src/models/Editor'
import * as monaco from 'monaco-editor';


export default defineComponent({
    name: 'EditorEditor',
    props: {
        editorData: {
            type: [Editor, RawEditor],
        }
    },
    data() {
        return {
            // result: null,
            // error: null,
            // loading: false,
            last_passed_query_text: null,
            form: null,
            prompt: '',
            generatingPrompt: false,
            info: 'Query processing...',
            editor: null,
            editorX: 400,
            editorY: 400,

        }
    },
    components: {
    },
    mounted() {
        this.createEditor()
    },
    computed: {
        ...mapGetters(['getConnectionByName']),
        connection() {
            return this.getConnectionByName(this.editorData.connection)
        },
        error() {
            return this.editorData.error
        },
        loading() {
            return this.editorData.loading
        },
        result() {
            return this.editorData.results
        },
        passedQuery() {
            return this.editorData.contents === this.last_passed_query_text
        },
        generateOverlayVisible() {
            return this.prompt.length > 1 || this.generatingPrompt
        }

    },
    methods: {
        ...mapActions(['saveEditors', 'saveEditorText', 'connectConnection', 'addMonacoEditor',
            'setConnectionInactive', 'addHistory','setEditorError']),
        async generate() {
            this.loading = true;
            this.info = 'Generating query from prompt...'
            this.error = null;
            var self = this;
            await instance.post('parse_question', {
                model: this.query.model,
                text: this.prompt
            }).then(function (resp) {
                self.query.query = '# generated from prompt: ' + self.prompt + '\n' + resp.data.query_text;
                self.prompt = '';
                self.submit();
            }).catch((error) => {
                self.error = axiosHelpers.getErrorMessage(error);
                self.loading = false;
                self.generatingPrompt = false;
            })
        },
        async submit(retry = false) {
            // this.loading = true;
            this.info = 'Executing query...'
            const start = new Date()
            // this.error = null;
            let current_query = this.editorData.contents;
            if (!this.connection) {
                this.setEditorError({ name: this.editorData.name, error: 'No connection selected for this editor.' })
                return
                // throw new Error('No connection selected for this editor')
            }
            if (!this.connection.active) {
                await this.connectConnection(this.connection)
            }
            await this.editorData.runQuery();
            
            // TODO: move this into query execution in editor?
            if (this.editorData.status_code === 403) {
                console.log('403 error, automatically setting connection inactive and retrying.')
                await this.setConnectionInactive({ name: this.editorData.connection })
                // immediately force reconnection
                await this.connectConnection(this.connection)
                // automatically retry
                if (!retry) {
                    return await this.submit(true)
                }
                
            }
            this.addHistory({ 
                connection: this.editorData.connection,
                text: this.editorData.contents, 
                editor: this.editorData.name, 
                timestamp: start, 
                duration: this.editorData.duration, 
                executed: this.editorData.executed, 
                error: this.editorData.error
            })

            this.last_passed_query_text = current_query;
        },
        async format() {
            this.loading = true;
            this.info = 'Formatting query...'
            this.error = null;
            var self = this;
            await instance.post('format_query', { model: this.query.model, query: this.editorData.contents, id: this.query.id }).then(function (resp) {
                self.query.query = resp.data.new_text;
                self.loading = false;
            }).catch((error) => {
                self.error = axiosHelpers.getErrorMessage(error);
                self.loading = false;
            })
        },
        querySaveComplete() {
            this.$emit('querySaveComplete')
        },
        clearPrompt() {
            this.prompt = '';
        },
        createEditor() {
            let editorElement = document.getElementById('editor')
            if (!editorElement) {
                return
            }
            const editor = monaco.editor.create(editorElement, {
                value: this.editorData.contents,
                language: 'sql',
                automaticLayout: true,
            })
            this.editor = editor;
            editorMap.set(this.editorData.name, editor)
            // this.addMonacoEditor({ editor: editor, name: this.editorData.name })
            // editor.layout({ height: 400, width:400 });
            monaco.editor.defineTheme('preqlStudio', {
                base: 'vs-dark', // can also be vs-dark or hc-black
                inherit: true, // can also be false to completely replace the builtin rules
                rules: [
                    { token: 'comment', foreground: 'ffa500', fontStyle: 'italic underline' },
                    { token: 'comment.js', foreground: '008800', fontStyle: 'bold' },
                    { token: 'comment.css', foreground: '0000ff' } // will inherit fontStyle from `comment` above
                ],
                colors: {
                    // 'editor.foreground': '#F8F8F8',
                    // 'editor.background': '#000000',
                    // 'editorCursor.foreground': '#8B0000',
                    // 'editor.lineHighlightBackground': '#0000FF20',
                    // 'editorLineNumber.foreground': '#008800',
                    // 'editor.selectionBackground': '#88000030',
                    // 'editor.inactiveSelectionBackground': '#88000015'
                }
            });
            monaco.editor.setTheme('preqlStudio');
            editor.onDidChangeModelContent(() => {
                this.editorData.contents = editor.getValue();
            });

            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
                if (!this.loading) {
                    this.submit();
                }
            });

            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
                this.saveEditorText({ contents: editor.getValue(), name: this.editorData.name,
                connection:this.editorData.connection }).then( ()=> {
                    this.saveEditors()
                }).catch((error) => {
                    this.error = axiosHelpers.getErrorMessage(error);
                })
                
            });

            // loader.init().then((monaco) => {
            //     const editorOptions = {
            //         language: "python",
            //         minimap: { enabled: false },
            //     };

            //     monaco.editor.create(document.getElementById("editor"), editorOptions);

            // });

            //   monaco.editor.create(document.getElementById("editor"),   editorOptions);
            //     loader.init().then(monaco => {

            //         var editor = monaco.editor.create(document.getElementById('editor'), {
            //             value: this.editorData.contents,
            //             language: 'sql',
            //             theme: 'myCustomTheme',
            //             automaticLayout: true,
            //             minimap: {
            //                 enabled: false
            //             }
            //         });
            //         editor.onDidChangeModelContent(() => {
            //             this.editorData.contents = editor.getValue();
            //         });
            //     });

        }
    }
})
</script>
  
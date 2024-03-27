<template>
    <div class="connection-manager py-0">
        <div v-if="activeModelFromConnection" class="header">
            {{ activeModelFromConnection.name }}
        </div>
        <div v-else class="header">
            No active model
        </div>
        <v-select theme="dark" variant="solo" density="compact" 
        class="minimal-select" v-model="selectedModel"
            label="Change Connection Model" :items="models" item-title="name" @update:modelValue="changeConnectionModel">
        </v-select>

        <div class="connection-list py-0">
            <v-expansion-panels theme="dark" variant="accordion">
                <v-expansion-panel class="py-0">
                    <v-expansion-panel-title>
                        <div class="pl-4">Editor Sources</div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text class="px-0">
                        <template v-if="activeModelFromConnection">
                            <v-list-item @click="setActiveEditor(editor.name)" v-for="editor in editors"
                                class="editor-list">
                                {{ editor.editor }} ({{ editor.alias }})
                            </v-list-item>
                        </template>
                        <div class="connection-list-item" v-else>No active model</div>
                        <div class="d-flex flex-column align-center  pa-0">
                            <v-toolbar height="24" extension-height="24" class="sidebar-button-list">
                                <AddEditorToModelPopup :model="activeModelFromConnection" />
                                <!-- <v-btn icon="mdi-format-align-left"></v-btn>
                                <v-btn density="compact" icon="mdi-format-align-center"></v-btn> -->
                                <!-- <v-btn @click="removeConnection(connection)"  density="compact" icon="mdi-cancel"></v-btn>
                                <EditConnectionPopup :connection="connection" />
                                <RemoveConnectionPopup :connection="connection" />
                                <NewEditorPopup :defaultConnection="connection.name" /> -->
                            </v-toolbar>
                        </div>
                    </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel>
                    <v-expansion-panel-title>
                        <div class="pl-4">Concepts </div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text class="px-0 py-0">
                        <ModelConceptList v-if="activeModelFromConnection" class="px-0"
                            :model="activeModelFromConnection.name" :editor="activeEditor.name"
                            :height="sidebarHeight - 260" />
                        <div class="connection-list-item" v-else>No active model</div>
                    </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel>
                    <v-expansion-panel-title>
                        <div class="pl-4">Datasources</div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text class="px-0">
                        <div class="connection-list-item">No datasources</div>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </div>

        <div class="footer">
            <NewModelPopup />
        </div>
    </div>
</template>
<style local>
.header {
    color: var(--text-lighter);
    font-size: .8rem;
    height: 30px;
    min-height: 30px;
    line-height: 30px;
}

/* .minimal-select {
    font-size: 1.0rem;
    height:50px;
} */

.footer {
    --height: 20px;
    font-size: 0.8rem;
    background-color: black;
    height: var(--height);
    min-height: var(--height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    color: var(--text-lighter);

}



.editor-list {
    align-items: right;
    text-align: center;
    height: 25px;

}

.connection-list {
    display: 'flex';
    align-items: left;
    text-align: left;
    width: 100%;
    height: 100%;
    background-color: var(--light-bg-color-2);

}

.connection-list-item {
    height: 10px;
    font-size: 80%;
}

.connection-manager {
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    flex-grow: 1;
    flex-shrink: 1;
    flex: 1 1 100%;
    flex-wrap: nowrap;
    width: 100%;
    font-size: .8rem;
}

.connection-list {
    background-color: var(--main-bg-color);
}
</style>
<script lang="ts">
import ModelConceptList from '/src/components/sidebar/model/ModelConceptList.vue'
import NewModelPopup from './model/NewModelPopup.vue';
import AddEditorToModelPopup from './model/AddEditorToModelPopup.vue';
import { mapActions, mapGetters } from 'vuex';
export default {
    name: "ModelManager",
    components: {
        ModelConceptList,
        NewModelPopup,
        AddEditorToModelPopup,
    },
    data() {

        return {
            selectedModel: null
        };
    },
    computed: {
        ...mapGetters(['models', 'editors', 'getConnectionByName', 'activeEditor', 'sidebarHeight',]),

        activeConnection() {
            return this.getConnectionByName(this.activeEditor.connection)
        },
        activeModelFromConnection() {
            if (!this.activeConnection) {
                return
            }
            return this.models.find(todo => todo.name === this.activeConnection.model)

        },
        editors() {
            console.log(this.activeModelFromConnection)
            if (!this.activeModelFromConnection) {
                return []
            }
            return this.activeModelFromConnection.sources.map((source) => {
                return source
            })
        }
    },
    methods: {
        ...mapActions(['editConnection', 'setActiveEditor']),
        changeConnectionModel(model) {
            this.editConnection({
                name: this.activeConnection.name,
                type: this.activeConnection.type,
                model: model,
                extra: this.activeConnection.extra,
            })
        },
    },
};
</script>

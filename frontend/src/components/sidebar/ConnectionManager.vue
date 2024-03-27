<template>
    <div class="connection-manager py-0">
        <div class="header">
            Connections
        </div>
        <div class="connection-list">

            <v-expansion-panels theme="dark">
                <v-expansion-panel class="square-corner" v-for="connection in connections" :key="connection.name">
                    <v-expansion-panel-title>
                        <GlowingDot class="" v-if="connection.active" />
                        <div v-if="connection.model" class="pl-4">{{ connection.name }}
                            <span class="opacity-light">({{ connection.model }})</span>
                        </div>
                        <div v-else class="pl-4">{{ connection.name }}</div>

                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <v-list-item @click="setActiveEditor(editor.name)" v-for="editor in editors[connection.name]"
                            class="editor-list">

                            {{ editor.name }}
                            <span></span>
                            <v-btn v-if="editor.visible" @click="closeEditor(editor)" icon="mdi-close"
                                class="sidebar-detail-btn square-corner" density="compact">Close</v-btn>

                            <EditEditorPopup class="sidebar-detail-btn square-corner" :name="editor.name"
                                density="compact" :defaultConnection="connection.name" />

                        </v-list-item>
                        <div v-if="connection.name != unconnectedLabel" class="d-flex flex-column align-center pa-0">

                            <v-toolbar height="24" extension-height="24" class="sidebar-button-list align-center">
                                <EditConnectionPopup :connection="connection" />
                                <RemoveConnectionPopup :connection="connection" />
                                <NewEditorPopup :defaultConnection="connection.name" />
                                <v-btn @click="_ => refresh(connection)" icon="mdi-refresh"
                                    class="sidebar-action-button pa-0 ba-0" density="compact">
                                </v-btn>
                            </v-toolbar>

                        </div>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </div>

        <div class="footer">
            <NewConnectionPopup />
            <!-- <v-btn class="tab-btn pa-0 ba-0" v-bind="props" density="compact" block>Add Connection</v-btn> -->
        </div>
    </div>
</template>
<style scoped>
.opacity-light {
    opacity: 0.6;
    font-size: .6rem;
}

.header {
    color: var(--text-lighter);
    font-size: 1.0rem;
    height: 30px;
    min-height: 30px;
    line-height: 30px;
}

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
    height: 20px;
    font-size: .6rem;

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
// @ts-ignore
import GlowingDot from '/src/components/generic/GlowingDot.vue';
import NewConnectionPopup from '/src/components/sidebar/connections/NewConnectionPopup.vue';
import NewEditorPopup from '/src/components/editor/NewEditorPopup.vue'
import EditEditorPopup from '/src/components/editor/EditEditorPopup.vue'
import RemoveConnectionPopup from '/src/components/sidebar/connections/RemoveConnectionPopup.vue'
import EditConnectionPopup from '/src/components/sidebar/connections/EditConnectionPopup.vue'
import { Connection } from '/src/models/Connection'
import { mapActions, mapGetters } from 'vuex';
export default {
    name: "ConnectionManager",
    components: {
        GlowingDot,
        NewConnectionPopup,
        NewEditorPopup,
        RemoveConnectionPopup,
        EditConnectionPopup,
        EditEditorPopup,
    },
    data() {
        return {
        };
    },
    computed: {
        ...mapGetters(['activeEditor', 'connections', 'unconnectedLabel']),
        editors() {
            let editors = {}
            this.connections.forEach((conn) => {
                editors[conn.name] = this.$store.getters.editors.filter((editor) => {
                    return editor.connection == conn.name
                })
                editors[this.unconnectedLabel] = this.$store.getters.editors.filter((editor) => {
                    return this.connections.map((conn) => conn.name).includes(editor.connection) == false
                })
            })
            return editors
        }
    },
    methods: {
        ...mapActions(['setActiveEditor', 'loadConnections', 'removeConnection', 'editConnection', 'closeEditor']),
        refresh(connection: Connection) {
            this.editConnection({
                name: connection.name,
                type: connection.type,
                model: connection.model,
                extra: connection.extra,

            })
        },
    },
    mounted() {
        this.loadConnections()
    },
};
</script>

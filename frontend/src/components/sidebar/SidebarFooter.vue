<template>
    <FooterComponent>
        <span v-if="connection" class="connection-display flex-item">
            {{ name }} — <strong>{{ type }}</strong>
        </span>
    </FooterComponent>
</template>
<style scoped>
.flex-item {
    flex: 1;
    /* Distribute available space evenly among the spans */
    margin-right: 10px;
    /* Optional: Add some spacing between spans */
}
.connection-display {
    font-size: 0.6rem;
}
</style>
<script lang="ts">
import { mapGetters } from 'vuex';
import FooterComponent from '/src/components/generic/FooterComponent.vue';
import { Connection } from '/src/models/Connection';
export default {
    name: "EditorFooter",
    components: { FooterComponent },
    computed: {
        ...mapGetters(['activeEditor', 'getConnectionByName']),
        connection() {
            // @ts-ignore
            let conn = this.activeEditor.connection
            if (!conn) return null;
            // @ts-ignore
            let connection: Connection = this.getConnectionByName(conn) as Connection
            return connection
        },
        name() {
            if (this.connection) {
                return this.connection.name
            }
        },
        type() {
            if (this.connection) {
                return this.connection.type
            }
        }
    },
}
</script>
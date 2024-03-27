<template>
    <v-dialog v-model="dialog" width="auto">
        <template v-slot:activator="{ props }">
            <v-btn class="sidebar-action-button ph-4 ba-0" density="compact" icon="mdi-cancel" v-bind="props">
            </v-btn>
        </template>
        <v-card>
            <v-card-text>
                Are you sure you want to remove this connection? This will remove any associated editors.
            </v-card-text>
            <v-card-actions>
                <v-btn @click="localRemoveConnection(connection)" color="primary" block>Submit</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<style scoped>

</style>
<script lang="ts">
import { mapActions } from 'vuex'
export default {
    data() {
        return {
            dialog: false,
        }
    },
    props: {
        connection: {
            type: Object,
            required: true
        }

    },
    methods: {
        ...mapActions(['removeConnection']),
        localRemoveConnection() {
            this.removeConnection(this.connection)
            this.dialog = false;
        }
    }
}
</script>
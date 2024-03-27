

<template>
    <v-dialog v-model="dialog" max-width="500" min-width=400>
        <template v-slot:activator="{ props }">
            <v-btn class="sidebar-action-button pa-0 ba-0" density="compact" icon="mdi-pencil" v-bind="props">
            </v-btn>
        </template>
        <v-card theme="dark" class="mx-auto" min-width="344" title="Edit Connection">
            <v-form v-model="form">
                <v-container>
                    <v-form v-model="form">
                        <v-divider />
                        <v-select variant="solo" density="compact" :readonly="loading" :rules="[required]"
                            v-model="selectedType" label="Type" :items="connectionTypes">
                        </v-select>
                        <v-divider />
                        <v-select variant="solo" density="compact" :readonly="loading" v-model="model" label="Model"
                            :items="models" item-title="name">
                        </v-select>
                        <v-text-field v-for="field in extra" variant="solo" density="compact" :readonly="loading"
                            v-model="extraValues[field]" :label="field">
                        </v-text-field>

                    </v-form>
                </v-container>
                <v-divider></v-divider>
                <v-alert class="mx-auto square-corners" color="warning" v-if="error">{{ error }}</v-alert>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="!form" :loading="loading" color="success" @click="localEditConnection">
                        Save
                        <v-icon icon="mdi-chevron-right" end></v-icon>
                    </v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>
<style scoped></style>

<script lang="ts">
import { mapActions, mapGetters } from 'vuex';
import { getConnectionExtras } from './utility';
import { Connection } from '/src/models/Connection'

export default {
    name: "EditConnectionPopup",
    data() {
        return {
            form: false,
            loading: false,
            error: '',
            dialog: false,
            model: this.connection.model,
            selectedType: this.connection.type,
            connectionTypes: ['duck_db', 'bigquery', 'sql_server'],
            extraValues: this.connection.extra ? { ...this.connection.extra } : {},

        };
    },
    props: {
        connection: {
            type: Connection,
            required: true
        }
    },
    computed: {
        ...mapGetters(['models', 'getModelByName']),
        extra() {
            return getConnectionExtras(this.selectedType)
        },
    },
    mounted: () => {
        // console.log(this.connections)
    },
    methods: {
        ...mapActions(['editConnection']),
        showPopup() {
            this.dialog = true;
        },
        localEditConnection() {
            // let fullModel = null;
            // console.log(this.model)
            // if (this.model) {
            //     fullModel = this.getModelByName(this.model)
            // }
            this.editConnection({
                name: this.connection.name,
                type: this.selectedType,
                model: this.model,
                extra: this.extraValues,
            }).then(() => {
                this.dialog = false;
            }).catch((e) => {
                this.error = e.message;
                throw e
            });
        },
        required(v) {
            return !!v || 'Field is required'
        },
    },
};
</script>
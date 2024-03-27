

<template>
    <v-dialog v-model="dialog" max-width="500" min-width=400>
        <template v-slot:activator="{ props }">
            <v-btn class="tab-btn pa-0 ba-0 sidebar-create-button" v-bind="props" density="compact" block>
                Create New Model
            </v-btn>
        </template>
        <v-card theme="dark" class="mx-auto" min-width="344" title="New Model">
            <v-form v-model="form" @submit.prevent="submit">
                <v-container>
                    <v-text-field variant="solo" density="compact" :readonly="loading" :rules="[required]" v-model="name"
                        label="Name">
                    </v-text-field>
                    <v-divider />
                </v-container>
                <v-divider></v-divider>
                <v-alert class="mx-auto square-corners" color="warning" v-if="error">{{ error }}</v-alert>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="!form" :loading="loading" color="success"  type="submit">
                        Create
                        <v-icon icon="mdi-chevron-right" end></v-icon>
                    </v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>
<style scoped>
.square-corners {
    border-radius: 0 !important;
}

.sidebar-create-button {
    height: 25px;
    text-transform: none;
    color: var(--text-lighter);
    background-color: var(--main-bg-color);
    border-radius: 0 !important;
}


</style>
<script lang="ts">
import { mapActions, mapGetters } from 'vuex';
export default {
    name: "AddModel",
    data() {
        return {
            form: false,
            loading: false,
            error: '',
            dialog: false,
            name: '',
            extraValues: {},
        };
    },
    props: {
    },
    computed: {
        ...mapGetters(['models', 'addNewLocalModel']),
    },
    mounted: () => {
        // console.log(this.connections)
    },
    methods: {
        ...mapActions(['addNewModel']),
        showPopup() {
            this.dialog = true;
        },
        submit() {
            this.localAddNewModel();
        },
        localAddNewModel() {
            this.addNewModel({
                name: this.name,
                type: this.selectedType,
                model: this.model,
                extra: this.extraValues,
            }).then(() => {
                this.dialog = false;
                this.error = false;
                this.name = '';
            }).catch((e) => {
                this.error = e.message;
            });
        },
        required(v) {
            return !!v || 'Field is required'
        },
    },
};
</script>
<template>
    <div class="sidebar-selectors py-2 px-0">
        <template v-for="link in links">
            <div class="sidebar-selector-nav-item py-2 px-0">
                <v-tooltip bottom>
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" size="small" variant="outlined" @click.prevent="click(link.address)" :icon="link.icon">
                        </v-btn>
                    </template>
                    <span>{{ link.name }}</span>
                </v-tooltip>
            </div>
        </template>

    </div>
</template>
<style scoped>
.sidebar-selectors {
    display: flex;
    flex-direction: column;
    font-size: 110%;
    color: var(--text-lighter);
}

.sidebar-selector-nav-item {
    flex: 1;
    width: 100%;
}
</style>
  
<script lang="ts">
import { mapActions, mapGetters } from 'vuex';

export default {
    props: ['activeItem'],
    data() {
        return {
            links: [{ 'name': 'Connections', 'address': 'connections', 'icon': 'mdi-database' },
            { 'name': 'History', 'address': 'history', 'icon': 'mdi-history' },
            { 'name': "Models", 'address': 'models', 'icon': 'mdi-table' },
            { 'name': 'Other', 'address': 'other', 'icon': 'mdi-dots-horizontal' },
            { 'name': 'Natural Language', 'address': 'nlp', 'icon': 'mdi-dots-horizontal' },

            ],
            selectedItem: 'connections'
        }
    },
    components: {},
    computed: {
        ...mapGetters(['activeSidebar']),
    },
    methods: {
        ...mapActions(['setSidebar']),
        click(item) {
            if (this.activeSidebar === item) {
                return
            } else {
                this.setSidebar(item)
            }
        }
    }
}
</script>
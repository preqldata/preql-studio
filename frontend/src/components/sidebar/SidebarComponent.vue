<template>
    <div class="sidebar">
        <div class="upper-parent">
            <div class="selector-sidebar py-0 px-0">
                <SidebarSelector />
            </div>
            <div class="content-sidebar pa-0">
                <ConnectionManager v-if="activeSidebar == 'connections'" />
                <HistoryManager v-if="activeSidebar == 'history'" />
                <ModelManager v-if="activeSidebar == 'models'" />
            </div>
        </div>
        <SidebarFooter class="footer" />
    </div>
</template>

<style scoped>

.footer {
  width: 100%;
  min-height: 25;
  z-index: 2;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.selector-sidebar {
    background-color: rgba(0, 0, 0, 0.695);
    width: 40px;
}

.content-sidebar {
    flex: 1;
}

.upper-parent {
    display: flex;
    height: 100%;
}

.sidebar {
    background-color: var(--main-bg-color);
    display: flex;
    flex-direction: column;
    flex-grow: 0;
    flex-shrink: 1;
    /* flex-wrap: wrap; */
    height: 100%;
    width: 100%;
}
</style>

<script lang="ts">
import ConnectionManager from './ConnectionManager.vue'
import HistoryManager from './HistoryManager.vue'
import ModelManager from './ModelManager.vue'
import SidebarFooter from './SidebarFooter.vue'
import SidebarSelector from './SidebarSelector.vue'
import { mapGetters } from 'vuex';


export default {
    name: "SidebarComponent",
    data() {
        return {
        };
    },
    components: { ConnectionManager, HistoryManager, SidebarFooter, SidebarSelector, ModelManager },
    computed: {
        ...mapGetters(['activeSidebar'])

    }
};
</script>
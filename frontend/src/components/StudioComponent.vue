<template>
  <div id="interface" class="interface-2">
    <div class="interface-wrap row">
      <div ref="sidebar" class="sidebar">
        <SidebarComponent class="sidebar-content" />
      </div>
      <div ref="content" class="nested-page-content pa-0" id="page-content">
        <EditorTabs />
      </div>
    </div>
  </div>
</template>
<style>
.interface-2 {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
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
    z-index: 2;
}

.nested-page-content {
  flex: 1 1 auto;
  max-height: 100%;
  min-width: 350px;
  z-index: 1;
  overflow: hidden;
}



.interface-wrap {
  display: flex;
  flex-wrap: nowrap;
  flex: 1 1 auto;
  max-height: 100%;
}



</style>
<script lang="ts">
import EditorTabs from '/src/components/editor/EditorTabs.vue';
import SidebarComponent from '/src/components/sidebar/SidebarComponent.vue';
import Split from 'split.js';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: "StudioView",
  data() {
    return {
      split: null,
      queryText: "",
      form: false,
      loading: false,
      error: "",
      results: [],
      models: [],
      tab: "models",
      sidebarShown: true
    };
  },
  components: {
    SidebarComponent, EditorTabs
  },
  computed: {
    ...mapGetters(['activeConnection']),
    splitElements() {
      return [
        this.$refs.sidebar,
        this.$refs.content
      ];
    }
  },
  methods: {
    ...mapActions(['getCommunityModels'])
  },
  beforeDestroy() {
    if (this.split) {
      this.split.destroy();
    }
  },
  mounted() {
    this.getCommunityModels();

    this.split = Split(this.splitElements, {
      elementStyle: (_dimension, size) => ({
        "flex-basis": `calc(${size}%)`,
      }),
      sizes: [25, 75],
      minSize: 300,
      expandToMin: true,
      gutterSize: 0,
    });
  }
};
</script>

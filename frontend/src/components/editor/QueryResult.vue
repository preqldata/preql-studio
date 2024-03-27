

<template>
    <div class="query-result">
        <v-tabs class="editor-tabs pa-0 ba-0" v-model="activeTab">
            <v-tab class="editor-tab" value="results">Results</v-tab>
            <v-tab v-if="editor.syntax === 'preql'" class="editor-tab" value="sql">SQL</v-tab>
        </v-tabs>
        <ROEditor class="sub-component-content" v-if="activeTab === 'sql'" :content="generated_sql" />
        <DataTableV2 class="sub-component-content" v-else-if="activeTab === 'results'" id="rdisplay" :headers="headers"
            :results="results" />
    </div>
</template>
<style>
.editor-tabs {
    height: 30px;
    background-color: var(--main-bg-color);
    border-radius: 0;
}

.editor-tab {
    height: 10px;
    font-size: .8rem;
    color: var(--text-lighter);
    border-radius: 0;
}


.editor-tab-add.v-slide-group {
    width: 20px
}

.editor-tab.v-slide-group {
    height: 30px;
}

.tab-icon {
    height: 20px;
}

.editor-tab.v-btn {
    height: 30px;
    text-transform: none;
    color: var(--text-lighter);
    background-color: var(--main-bg-color);
    border-radius: 0;

}

.sub-component {
    display: 'flex';
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
}

.sub-component-content {
    display: flex;
    flex-direction: column;
    flex: 1 1 100%;
    height: 100%;
}

.query-result {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    flex: 1 1 100%;
    height: 100%;
}

.result-table {
    display: flex;
    flex-direction: row;
    flex-basis: 100%;
    flex-grow: 1;
    flex-shrink: 1;
    flex: 1 1 100%;
    flex-wrap: nowrap;
    width: 100%;

}
</style>
<script lang="ts">
import DataTableV2 from '/src/components/editor/DataTableV2.vue'
import charts from '/src/helpers/charts'
import ROEditor from '/src/components/editor/ReadOnlyEditor.vue'
import { ResultColumn } from '../../models/Results';
let Display = charts.Display()
const DisplayMap = new Map();

// Figure out how to not have to synchronize this with backend
DisplayMap.set(1, Display.TABLE);
DisplayMap.set(2, Display.BAR_CHART);
DisplayMap.set(3, Display.LINE_CHART);
DisplayMap.set(4, Display.GENERATED_QUERY);

export default {
    props: {
        'headers': {
            type: Map<String, ResultColumn>,
            required: true,
        },
        'results': {
            type: Array,
            required: true,
        },
        'defaultMode': {
            required: false,
            default: Display.TABLE
        },
        'editor': {
            type: Object,
            required: true
        }

    }, //['headers', 'results', 'columns', 'defaultMode'],
    components: {
        // DataTable,
        DataTableV2,
        ROEditor
    },
    data() {

        var mode = Display.TABLE;
        if (this.defaultMode) {
            mode = DisplayMap.get(this.defaultMode);
        }
        return {
            chips: [Display.TABLE, Display.GENERATED_QUERY],
            mode: mode,
            activeTab: 'results',
            Display

        }
    },

    computed: {
        /*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }]*/
        generated_sql() {
            return this.editor.generated_sql
        },
        // safe_columns() {
        //     if (this.columns) {
        //         return Object.entries(this.columns).map(([_k, v]) => v);
        //     }
        //     return []
        // },
        // tableHeaders() {
        //     return this.safe_columns.map(v => ({ title: v.name, key: v.name }));
        // },

        // validChartTypes() {
        //     return charts.validChartTypes(this.safe_columns);
        // },
        // chartOptions() {
        //     let dimension = ''
        //     let type = 'category';
        //     if (this.mode === charts.Display().BAR_CHART) {
        //         dimension = charts.getDimensions(this.safe_columns)[0];
        //     }
        //     else if (this.mode === charts.Display().LINE_CHART) {
        //         dimension = charts.getDateDimensions(this.safe_columns)[0];
        //         type = 'datetime';
        //     }
        //     else {
        //         return {}
        //     }
        //     let x_axis = this.results.map(y => y[dimension.name]);
        //     let output = {
        //         chart: {
        //             id: 'query_display',
        //             background: '#15141A',
        //             animations: {
        //                 enabled: false,
        //                 // easing: 'easeinout',
        //                 // speed: 800,
        //                 // animateGradually: {
        //                 //     enabled: true,
        //                 //     delay: 150
        //                 // },
        //                 // dynamicAnimation: {
        //                 //     enabled: true,
        //                 //     speed: 350
        //                 // }
        //             }
        //         },
        //         xaxis: {
        //             type: type,
        //             categories: x_axis,
        //         },
        //         yaxis: {
        //             forceNiceScale: true,
        //         },
        //         theme: {
        //             mode: 'dark',
        //         },

        //     };
        //     return output
        // },
        // series() {
        //     let metrics = charts.getMetrics(this.safe_columns);
        //     let values = metrics.map(x =>
        //     ({
        //         name: x.name,
        //         data: this.results.map(y => y[x.name]),
        //     })
        //     );
        //     return values
        // }
    },

};
</script>
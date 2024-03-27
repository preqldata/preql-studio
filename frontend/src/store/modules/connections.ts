// Temporary store for stitching together dev functionality
// not intended for long-term use

// import instance from '/src/api/instance'

import { Connection } from '/src/models/Connection'
import { LocalModel } from '/src/models/Model'
import Store from 'electron-store'
import instance from '/src/api/instance'

// import editorMap from '/src/store/modules/monaco'


const unconnectedLabel = 'Unconnected';

const store = new Store<Record<string, Object>>({
    name: 'connections',
    watch: true,
});


const storageAPI = {
    setConnections(value: Array<Connection>) {
        // const buffer = safeStorage.encryptString(value);
        store.set('connections', value);
        // store.set(key, buffer.toString(encoding));
    },


    getConnections(): Array<Connection> {
        const data = store.get('connections', []) as Array<any>
        const parsed = data.map(dict => {
            return Connection.fromJSON(dict)
        });
        return parsed
    },
};

// function findMatchingValue(arr, condition) {
//     const foundElement = arr.find(element => condition(element));
//     return foundElement !== undefined ? foundElement : null;
// }


const state = {
    connections: [new Connection('duckdb_demo', 'duck_db', false, 'duckdb_demo'),
    new Connection('bigquery_demo', 'bigquery', false, 'bigquery_demo')],
};

function addDefault(connections) {
    return connections.concat([new Connection(unconnectedLabel, '', false, null)])
}

const getters = {
    connections: state => addDefault(state.connections),
    getConnectionByName: (state) => (name) => {
        return state.connections.find(conn => conn.name === name)
    },
    unconnectedLabel: () => unconnectedLabel

};

function getConnectionArgument(rootGetters, data) {
    let modelArgs = {
        model: data.model,
        full_model: null
    } as { model: any; full_model: any; }
    let model = rootGetters.getModelByName(data.model)
    if (model instanceof LocalModel) {
        const enrichedSources = model.sources.map(source => {
            let editor = rootGetters.editors.find(editor => editor.name === source.editor)
            if (!editor) {
                return { alias: source.alias, contents: '' }
            }
            return { alias: source.alias, contents:editor.contents  }
        })
        modelArgs = {
            model: data.model,
            full_model: { name: data.model, sources: enrichedSources }
        }
    }
    return {
        type: data.type,
        name: data.name, dialect: data.type, extra: data.extra, ...modelArgs
        //let session = context.rootState.instance.session;
    }
}

const actions = {
    async connectConnection({ commit, rootGetters }, data) {
        const apiArgs = getConnectionArgument(rootGetters, data)
        instance.post('/connection', apiArgs).then(() => {
            commit('setConnectionActive', data)
        })
    },
    async updateConnectionSourceText({ commit, rootGetters }, data) {
        const conn = rootGetters.getConnectionByName(data.name)
        const apiArgs = getConnectionArgument(rootGetters, conn)
        return instance.post('/connection', apiArgs).then(() => {
            commit('setConnectionActive', data)
        })
    },
    async setConnectionInactive({ commit }, connection) {
        commit('setConnectionInactive', connection)
    },
    async addConnection({ commit, rootGetters }, data) {
        const apiArgs = getConnectionArgument(rootGetters, data)
        return instance.post('/connection', apiArgs).then(() => {
            const connection = new Connection(apiArgs.name, apiArgs.type,
                true, apiArgs.model, apiArgs.extra)
            commit('addConnection', connection)
        })

    },
    async editConnection({ commit, rootGetters }, data) {
        const apiArgs = getConnectionArgument(rootGetters, data)
        return instance.put('/connection', apiArgs).then(() => {
            const connection = new Connection(apiArgs.name, apiArgs.type,
                true, apiArgs.model, apiArgs.extra)
            commit('editConnection', connection)
            
        })
    },
    async removeConnection({ commit }, data) {
        commit('removeConnection', data)
    },
    async loadConnections({ commit }, _) {
        commit('setConnections', storageAPI.getConnections())
    }

};


const mutations = {
    async setConnectionActive(state, connection) {
        const index = state.connections.findIndex(c => c.name === connection.name)
        state.connections[index].active = true
    },
    async setConnectionInactive(state, connection) {
        const index = state.connections.findIndex(c => c.name === connection.name)
        if (!index) {
            return
        }
        state.connections[index].active = false
    },
    async editConnection(state, connection) {
        const index = state.connections.findIndex(c => c.name === connection.name)
        state.connections[index] = connection
        storageAPI.setConnections(state.connections)
    },
    async addConnection(state, connection) {
        state.connections.push(connection)
        storageAPI.setConnections(state.connections)
    },
    async removeConnection(state, connection) {
        state.connections = state.connections.filter(c => c.name !== connection.name)
        storageAPI.setConnections(state.connections)
    },
    async setConnections(state, connections) {
        state.connections = connections
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};

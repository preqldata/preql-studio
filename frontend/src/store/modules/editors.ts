// Temporary store for stitching together dev functionality
// not intended for long-term use

// import instance from '/src/api/instance'

import { Editor, RawEditor } from '/src/models/Editor'
import Store from 'electron-store'
import axiosHelpers from '/src/api/helpers';

function findMatchingValue(arr, condition) {
    const foundElement = arr.find(element => condition(element));
    return foundElement !== undefined ? foundElement : null;
}

const store = new Store<Record<string, Object>>({
    name: 'editors',
    watch: true,
});

const storageAPI = {
    setEditors(value: Array<Editor | RawEditor>) {
        // const buffer = safeStorage.encryptString(value);
        const parsed = value.map(editor => {
            return JSON.stringify(editor, (key, value) => {
                if (key === 'monaco') {
                    return undefined; // Exclude the property from the JSON output
                }
                return value; // Include other properties as is
            });
        });
        store.set('editors', parsed);
        // store.set(key, buffer.toString(encoding));
    },


    getEditors(): Array<Editor | RawEditor> {
        let data = store.get('editors', []) as Array<any>
        data = data.filter(editor => editor !== null)
        const parsed = data.map(dict => {
            let subParsed = JSON.parse(dict)
            if (subParsed.syntax === 'preql') { return Editor.fromJSON(subParsed) }
            else if (subParsed.syntax === 'sql') {
                return RawEditor.fromJSON(subParsed)
            }
        }) as Array<Editor | RawEditor>;
        return parsed
    },
};


function getInitialEditors() {
    let editors = storageAPI.getEditors();
    editors = editors.filter(editor => (typeof editor.name === 'string' && editor.connection))
    if (editors.length === 0) {
        editors = [new Editor('demo-editor', 'duckdb', 'duckdb_demo')]
    }
    return editors
}
const initialEditors: Array<Editor | RawEditor> = getInitialEditors();


const state = {
    editors: initialEditors,
    activeEditor: initialEditors[0].name
};

const getters = {
    editors: state => state.editors,
    getEditorByName: (state) => (name) => {
        return state.editors.find(conn => conn.name === name)
    },
    openEditors: state => state.editors.filter(editor => editor.visible),
    activeEditor: state => findMatchingValue(state.editors, (editor) => editor.name === state.activeEditor),
};

const actions = {
    async setEditorError({ commit }, data) {
        commit('setEditorError', data)
    },
    async saveEditorText({ commit, dispatch }, data) {
        commit('saveEditorText', data)
        return dispatch('updateConnectionSourceText', { name: data.connection },
            { root: true }).then(() => {
                dispatch('setEditorError', { name: data.name, error: null })
            }).catch((e) => {
                dispatch('setEditorError', { name: data.name, error: axiosHelpers.getErrorMessage(e) })
            })
    },
    async setActiveEditor({ commit, rootGetters }, data) {
        if (data) {
            commit('setActiveEditor', data);
        }
        else {
            const editor = rootGetters.editors[0]
            if (editor) { commit('setActiveEditor', editor.name); }

        }

    },
    async addMonacoEditor({ commit }, data) {
        commit('addMonacoEditor', data)
    },    
    async editEditor({ commit, rootGetters }, data) {
        const existing = rootGetters.getEditorByName(data.name)
        if (!existing) {
            throw Error(`Editor with the name ${data.name} does not exist!`)
        }
        commit('updateEditor', data);
        commit('saveEditors', data)
    },
    async newEditor({ commit, rootGetters }, data) {
        const existing = rootGetters.getEditorByName(data.name)
        if (existing) {
            throw Error(`Editor with the name ${data.name} already exists!`)
        }
        commit('newEditor', data);
        commit('saveEditors', data)
    },
    async removeEditor({ commit }, data) {
        commit('removeEditor', data)

        commit('saveEditors', data)
    },
    // unique from remove in case we want to prompt for save here 
    async closeEditor({ commit, dispatch }, data) {
        commit('hideEditor', data)
        // commit('removeEditor', data)
        dispatch('setActiveEditor', null)
        commit('saveEditors', data)
    },
    async setActiveConnection({ commit }, data) {
        commit('setActiveConnection', data);
    },
    async changeEditorModel({ commit }, data) {
        commit('changeEditorModel', data);
    },
    async saveEditors({ commit }, data) {
        commit('saveEditors', data)
    }
};


const mutations = {
    setEditorError(state, data) {
        const editor = findMatchingValue(state.editors, (editor) => editor.name === data.name)
        editor.error = data.error
    },
    addMonacoEditor(state, data) {
        const editor = findMatchingValue(state.editors, (editor) => editor.name === data.name)
        editor.monaco = data.editor
    },

    setActiveEditor(state, data) {
        const editor = findMatchingValue(state.editors, (editor) => editor.name === data)
        if(!editor) { return }
        editor.visible = true;
        state.activeEditor = data;
    },
    setActiveConnection(state, data) {
        state.activeConnection = data;
    },
    removeEditor(state, data) {
        const newEditors = state.editors.filter(editor => editor.name !== data.name)
        if (data.name === state.activeEditor) {
            state.activeEditor = newEditors[0].name
        }
        state.editors = newEditors
    },
    hideEditor(state, data) {
        const editor = state.editors.filter(editor => editor.name === data.name)
        const otherEditors = state.editors.filter(editor => editor.name !== data.name)
        editor[0].visible = false
        if (data.name === state.activeEditor) {
            state.activeEditor = otherEditors[0].name
        }
    },
    saveEditors(state, _) {
        storageAPI.setEditors(state.editors)
    },
    saveEditorText(state, data) {
        const editor = findMatchingValue(state.editors, (editor) => editor.name === data.name)
        editor.contents = data.contents
    },
    loadEditors(state, _) {
        state.editors = storageAPI.getEditors()
    },
    updateEditor(state, data) {
        const newEditor = findMatchingValue(state.editors, (editor) => editor.name === data.name)
        newEditor.connection = data.connection.name;
        state.editors = state.editors.map(editor => editor.name === data.name ? newEditor : editor)
    },
    newEditor(state, data) {
        let newEd: Editor | RawEditor | null = null
        if (data.syntax === 'preql') {
            newEd = new Editor(data.name, data.connection.type, data.connection.name,);
        }
        else {
            newEd = new RawEditor(data.name, data.connection.type, data.connection.name,);
        }
        if (newEd) {
            state.editors.push(newEd)
        }

    }
};

export default {
    state,
    getters,
    actions,
    mutations
};

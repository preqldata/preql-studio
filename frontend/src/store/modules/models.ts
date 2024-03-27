
import { Model, LocalModel } from '/src/models/Model'
import {ModelSource} from '/src/models/ModelSource'

import Store from 'electron-store'
import instance from '/src/api/instance'


const storageName = 'models';

const store = new Store<Record<string, Object>>({
  name: storageName,
  watch: true,
});


const storageAPI = {
  setModels(value: Array<Model>) {
    // const buffer = safeStorage.encryptString(value);
    store.set(storageName, value);
    // store.set(key, buffer.toString(encoding));
  },


  getModels(): Array<Model> {
    const data = store.get(storageName, []) as Array<any>
    const parsed = data.map(dict => {
      return LocalModel.fromJSON(dict)
    });
    return parsed
  },
};

const state = {
  localModels: storageAPI.getModels(),
  communityModels: [],
};

const getters = {
  models: state => state.localModels.concat(state.communityModels),
  getModelByName: (_, getters) => (name) => {
    return getters.models.find(todo => todo.name === name)
  },
};

const actions = {
  async getCommunityModels({ commit }) {
    const { data } = await instance.get('models');
    const parsed = data.models.map(dict => {
      return Model.fromJSON(dict)
    });
    commit('setCommunityModels', parsed);
  },
  async addNewModel({ commit }, data) {
    commit('addNewModel', data);
  },
  async addEditorToModel({ commit }, data) {
    commit('addEditorToModel', data);
  }
};


const mutations = {
  // setModels(state, models) {
  //   state.models = models;
  // },
  setCommunityModels(state, models) {
    state.communityModels = models;
  },
  addNewModel(state, data) {
    state.localModels.push(new LocalModel(data.name, [], []))
    storageAPI.setModels(state.localModels)
    console.log(state.localModels)
  },
  addEditorToModel(state, data) {
    const model = state.localModels.find(todo => todo.name === data.model)
    console.log(data)
    if (model) {
      model.sources.push(new ModelSource(data.editor, data.alias))
    }
    else {
      throw new Error(`Model ${data.model} not found`)
    }
    console.log(state.localModels)
    storageAPI.setModels(state.localModels)
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};

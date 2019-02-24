import Vue from 'vue'
import Vuex from 'vuex'
import accountApi from '../../api/account'
import usersApi from '../../api/users'

Vue.use(Vuex)

/**
 * State
 */
const state = {
    billingAddress: null,
    currentUser: null,
    currentUserLoaded: false,
}

/**
 * Getters
 */
const getters = {
    userIsInGroup(state) {
        return handle => {
            return state.currentUser.groups.find(g => g.handle === handle)
        }
    },
}

/**
 * Actions
 */
const actions = {
    deleteUserPhoto({commit}) {
        return new Promise((resolve, reject) => {
            accountApi.deleteUserPhoto()
                .then((response) => {
                    commit('deleteUserPhoto', {response});
                    resolve(response);
                })
                .catch((response) => {
                    reject(response);
                })
        })
    },

    saveUser({commit}, user) {
        return new Promise((resolve, reject) => {
            usersApi.saveUser(user)
                .then((response) => {
                    if (!response.data.errors) {
                        commit('saveUser', {user, response});
                        resolve(response);
                    } else {
                        reject(response);
                    }
                })
                .catch((response) => {
                    reject(response);
                })
        })
    },

    uploadUserPhoto({commit}, data) {
        return new Promise((resolve, reject) => {
            accountApi.uploadUserPhoto(data)
                .then((response) => {
                    commit('uploadUserPhoto', {response})
                    resolve(response)
                })
                .then((response) => {
                    reject(response)
                })
        })
    },

    saveBillingInfo({commit}, data) {
        return new Promise((resolve, reject) => {
            accountApi.saveBillingInfo(data)
                .then((response) => {
                    if (!response.data.errors) {
                        commit('updateBillingAddress', {billingAddress: response.data.address})
                        resolve(response)
                    } else {
                        reject(response)
                    }
                })
                .catch((response) => {
                    reject(response)
                })
        })
    },
}

/**
 * Mutations
 */
const mutations = {
    uploadUserPhoto(state, {response}) {
        state.currentUser.photoId = response.data.photoId;
        state.currentUser.photoUrl = response.data.photoUrl;
    },

    deleteUserPhoto(state, {response}) {
        state.currentUser.photoId = response.data.photoId;
        state.currentUser.photoUrl = response.data.photoUrl;
    },

    saveUser(state, {user}) {
        for (let attribute in user) {
            if (attribute === 'id' || attribute === 'email') {
                continue;
            }

            state.currentUser[attribute] = user[attribute];

            if (user.enablePluginDeveloperFeatures) {
                let groupExists = state.currentUser.groups.find(g => g.handle === 'developers');

                if (!groupExists) {
                    state.currentUser.groups.push({
                        id: 1,
                        name: 'Developers',
                        handle: 'developers',
                    })
                }
            }
        }
    },

    updateBillingAddress(state, {billingAddress}) {
        state.billingAddress = billingAddress
    },

    updateCurrentUser(state, {currentUser}) {
        state.currentUser = currentUser
    },

    updateCurrentUserLoaded(state, loaded) {
        state.currentUserLoaded = loaded
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}

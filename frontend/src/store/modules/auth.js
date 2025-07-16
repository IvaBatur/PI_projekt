const state = {
  token: localStorage.getItem('token') || '',
  role: localStorage.getItem('role') || '',
  email: localStorage.getItem('email') || ''
};

const mutations = {
  SET_USER(state, { token, role, email }) {
    state.token = token;
    state.role = role;
    state.email = email;

    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('email', email);
  },
  LOGOUT(state) {
    state.token = '';
    state.role = '';
    state.email = '';

    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
  }
};

const actions = {
  login({ commit }, payload) {
    commit('SET_USER', payload);
  },
  logout({ commit }) {
    commit('LOGOUT');
  }
};

const getters = {
  isLoggedIn: (state) => !!state.token,
  userRole: (state) => state.role,
  userEmail: (state) => state.email
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

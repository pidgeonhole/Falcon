var storex = new Vuex.Store({
    state: {
        id: -1,
        title: "",
        categories: []
    },
    getters: {
        id: state => state.id,
        title: state => state.title
    },
    mutations: {
        change_question_parameter(state, id, title) {
            state.id = id;
            state.title = title;
        },
        update_cat_list(state, categories){
            state.categories = categories;
        }
    }
});
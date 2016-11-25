function url(endpoint) {
    return `http://139.59.241.214:3000/v1/${endpoint}`;
}

var store = {};

var baseMixin = {
    delimiters: ["[[", "]]"],
};

var problems = new Vue({
    mixins: [baseMixin],
    el: '#problems',
    store,
    template: `
<ul class="collapsible" data-collapsible="expandable">
        <li v-for="c in categories">
            <div class="collapsible-header mdc-bg-blue-grey-600 mdc-text-grey-100"> [[ c.name ]] </div> 
            <div class="collapsible-body">
                <div v-if="c.problems.length === 0">
                    <p> Coming soon! </p>
                </div>
                <div v-else>
                    <ul class="collection">
                        <li v-for="p in c.problems" class="collection-item waves-effect waves-purple layout-fill"
                        @click="redirect(p.title, p.id)">
                            <span> [[ p.title ]] </span>
                        </li>
                    </ul>
                </div>
            </div>
        </li>
</ul>
    `,
    data: {
        categories: [],
        calls: 0
    },
    methods: {
        problem_url: function (string, replace = /\s/, replacement = "-") {
            return 'problems/' + string.toString().replace(new RegExp(replace, 'g'), replacement);
        },
        redirect: function (title, id) {
            store["pid"] = id;
            store["title"] = title;
            // window.location.href = location.href + this.problem_url(title);
            window.location.href = location.href + this.problem_url(id);
        }
    },
    created: function () {
        this.$http.get(url("categories"))
            .then((response) => {
                this.categories = response.body;

                this.categories.forEach((e, i) => {
                    this.categories[i]['problems'] = []
                }, this);
                this.calls += 1;

                return this.$http.get(url("problems"));
            }, (response) => {
                console.error("Error in getting categories")
            })
            .then((response) => {
                let problems = response.body;

                problems.forEach(e => {
                    let i = e.category_id - 1;
                    e.url = this.problem_url(e.title);
                    this.categories[i].problems.push(e);

                });
                store["categories"] = this.categories;
                this.calls += 1;
            }, (response) => {
                console.error("Error in getting problems");
            })
    },
    updated: function () {
        // Need to initiate collapsible after rendering the item
        if (this.calls > 0) this.calls -= 1; // random line to force update
        $('.collapsible').collapsible();
    }
});




Vue.component('Editor', {
    template: '<div :id="editorId" style="width: 100%; height: 100%;"></div>',
    props: ['editorId', 'content', 'lang', 'theme'],
    data: function () {
        return {
            editor: Object,
            beforeContent: ''
        }
    },
    watch: {
        content: function (value) {
            if (this.beforeContent !== value) this.editor.setValue(value, 1);
        }
    },
    mounted() {
        let lang = this.lang || 'python';
        let theme = this.theme || 'xcode';

        this.editor = window.ace.edit(this.editorId);
        this.editor.setValue(this.content, 1);

        this.editor.getSession().setMode(`ace/mode/${lang}`);
        this.editor.setTheme(`ace/theme/${theme}`);

        this.editor.on('change', () => {
            this.beforeContent = this.editor.getValue();
            this.$emit('change-content', this.editor.getValue());
        });
    }
});


var codeMaster = new Vue({
    mixin: [baseMixin],
    el: "#codeMaster",
    store,
    data: {
        // I'll maintain 2 copies of the same elements as a hack for materialize to work 
        // nicely with Vue
    },
    methods: {
        reset() {
            // Will add a function to reset later
            store.code = 'reset content for Editor';
            this.code = store.code;
        },
        changeCode(val) {
            if (store.code !== val) {
                store.code = val;
                this.code = store.code;
                this.lang = store.lang;
            }
        },
        submit() {
            console.log("This: ", this.code);
            console.log("Store: ", store.code);
            
            if (!this.lang && store.lang) this.lang = store.lang;
            else if (!store.lang && this.lang) store.lang = this.lang;
            else if (!store.lang && this.lang) store.lang = this.lang;
            this.lang = store.lang;

            console.log("This: ", this.lang);
            console.log("Store: ", store.lang);
        }
    },
    created: function () {
        if (!store.code) store.code = "N = int(input())";
        if (!store.lang) store.lang = "python"
        this.code = store.code;
        this.lang = store.lang;
    },
    updated: function () {
        $('select').material_select(); // Initializes the select for material css
        $('#lang-select').on('change', function (e) {
            // grabs the selected data through jQuery
            let selected = $('#lang-select').find(":selected").text();
            store.lang = selected.toLowerCase();
            this.lang = store.lang;
            console.log(store.lang, this.lang);
        });
    }
});


var mdViewer = new Vue({
    mixin: [baseMixin],
    el: "md-preview",
    store,
    data: {
        desc: "",
    },
    created: function() {
        let id = location.href.split("/").pop();
        this.$http.get(url(`problems/${id}`))
            .then((response) => {
                console.log(response);
            }, (response) => {
                console.error(`Problem getting question ${id}`);
            })
    }
})

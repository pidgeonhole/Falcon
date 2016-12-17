function url(endpoint, obj = {}) {
    let link = `http://139.59.241.214/v3/${endpoint}`;
    if (obj.expand) link = `${link}?expand=problems`;
    // console.log(link);
    return link;
}

var store = {};


var problems = new Vue({
    el: '#problems',
    store,
    template: `
<div id="all-probs" role="tablist" aria-multiselectable="true">
    <div v-for="c in categories" class="card shadow-depth-1">
        <div class="card-header problem-card" role="tab" :id="c.name" data-toggle="collapse" data-parent="#all-probs" v-bind:href="c.href_id">
            <h4>{{ c.name }}</h4>
            <small>{{ c.description}}</small>
        </div>
        <div :id="c.ref_id" class="collapse" role="tabpanel">
            <div v-if="c.problems.length === 0" class="card-block shadow-depth-1">
                <p> Coming soon! </p>
            </div>
            <div v-else class="card-block shadow-depth-1 no-pad">
                <ul class="problem-list">
                    <li class="problem-item" v-for="p in c.problems" @click="redirect(p.title, p.id)">
                        <h5> {{ p.title }} </h5>
                    </li>
                    <hr class="mdc-bg-grey-300" style="margin: 0">
                </ul>
            </div>
        </div>
    </div>
</div>
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

        let configs = {
            expand: true
        };

        this.$http.get(url("categories", configs))
            .then((response) => {
                this.categories = response.body;
                this.calls += 1;

                this.categories.forEach((cat, i) => {
                    cat.ref_id = `category${i}`;
                    cat.href_id = `#category${i}`;
                    cat.problems = cat.problems.map((e, j) => {
                        e.ref_id = `category${j}`;
                        e.href_id = `#category${j}`;
                        return e;
                    })
                }, this);
            }, (response) => {
                console.error("Error in getting categories")
            });
    },
    updated: function () {
        // Need to initiate collapsible after rendering the item
        if (this.calls > 0) this.calls -= 1; // random line to force update
        $('.collapse').collapse();
    }
});


var codeMaster = new Vue({
    el: "#codeMaster",
    store,
    template: `
<div>
    <div style="height: 30em">
        <editor editor-id="editor" :content="code" v-on:change-content="changeCode" :lang="lang"></editor>
    </div>
    <div id="settings" role="tablist" aria-multiselectable="true" style="margin-top:1.5rem">
        <div class="card">
            <div class="card-header mdc-bg-indigo-600 mdc-text-grey-100 hover-pointer" role="tab">
                <h5 style="margin-bottom: 0">
                    <div data-toggle="collapse" data-parent="#settings" href="#settings-1">
                        <i class="material-icons icon-text-align-1">settings_applications</i>
                        <span class="icon-text-align-1">Settings</span>
                    </div>
                </h5>
            </div>
            <div id="settings-1" class="collapse" role="tabpanel">
                <div class="card-block">
                    <div class="form-group">
                        <label>Language</label>
                        <select id="lang-select" class="form-control">
                            <option value="python">Python</option>
                            <option value="r">R</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <button class="mbtn btn-block" @click="submit" :class="submitButtonClass" :disabled="this.loading">
        <div v-if="!this.loading">
            <i class="material-icons icon-text-align-3">cloud</i>
            <span class="icon-text-align-3"> Submit </span>
        </div>
        <div v-else>
            <span class="icon-text-align-3"> Loading </span>
        </div>
    </button>
    <div class="modal fade" id="resultsModal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 class="modal-title">Results</h4>
                </div>
                <div class="modal-body">
                    <p>
                        Name: {{ name }} <br>
                        Score: {{ results.tests_passed }} / {{ results.num_tests}}
                    </p>
                    <div>
                        <ul>
                            <li v-for="(item, index) in results.results">
                                Test Case {{ index + 1 }}: 
                                <span v-if="item.result==='passed'" class="mdc-text-teal-800"> Passed </span>
                                <span v-else class="mdc-text-red-800"> Failed </span>
                            </li>
                        </ul>
                    </div>
                    <p v-if="results.tests_errored > 0" class="mdc-text-red-600">
                        There has been some errors. Check if your code is correct or that you selected the right
                        language in the settings.
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</div>
    `,
    data: {
        // I'll maintain 2 copies of the same elements as a hack for materialize to work 
        // nicely with Vue
        code: "Hello world",
        lang: "java",
        loading: false,
        results: {}
    },
    methods: {
        reset() {
            // Will add a function to reset later
            //            store.code = 'reset content for Editor';
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
            // Making sure that all info are aligned
            if (!this.store && this.code) store.code = this.code;
            else if (!this.code && this.store) this.code = store.code;

            if (!store.lang && this.lang) store.lang = this.lang;
            else if (!store.lang && !this.lang) store.lang = "python";
            this.lang = store.lang;

            let id = location.href.split("/").pop();

            this.loading = true;
            this.$http.post(url(`problems/${id}/submissions`), {
                    name: this.name,
                    source_code: this.code,
                    language: this.lang
                })
                .then((res) => {
                    console.log(res.body);
                    this.results = res.body;
                    this.loading = false;
                    $('#resultsModal').modal();
                }, (res) => {
                    console.error("Error posting data")
                    this.loading = false;
                })
        }
    },
    computed: {
        submitButtonClass: function () {
            return {
                grey: this.loading,
            };
        },
        mainWaiting: function () {
            return {
                visible: !this.loading,
                "not-visible": this.loading
            };
        },
        transWaiting: function () {
            return {
                visible: this.loading,
                "not-visible": !this.loading
            };
        }
    },
    created: function () {
        if (!store.code) store.code = "N = int(input())";
        if (!store.lang) store.lang = "python"
        this.code = store.code;
        this.lang = store.lang;
    },
    beforeUpdate: function () {
        $('#lang-select').on('change', function (e) {
            // grabs the selected data through jQuery
            let selected = $('#lang-select').find(":selected").text();
            store.lang = selected.toLowerCase();
            this.lang = store.lang;
        });
    }
});


var mdViewer = new Vue({
    el: "#md-preview",
    data: {
        desc: "",
        qtitle: ""
    },
    template: `
<div class="card shadow-depth-1">
    <div class="card-block">
        <h4 class="card-title"> {{ qtitle }} </h4>
        <div id="innerMD" v-html="markdown" class="card-text"></div>
    </div>
</div>
`,
    computed: {
        markdown: function () {
<<<<<<< HEAD:CodeQuiz/static/vue/hugefile.js
            var converter = new showdown.Converter({extensions: ['sdkatex'] });
            var html = converter.makeHtml(this.desc);
            return html;
=======
            try {
                var converter = new showdown.Converter({
                    extensions: ['sdkatex']
                })
                var html = converter.makeHtml(this.desc)
                return html
            } catch (e) { /* When showdown.js script not loaded, skip this */ }
>>>>>>> client:CodeQuiz/static/vue/apps.js
        }
    },
    created: function () {
        let split = location.pathname.split('/')
        let id = split.pop()

        if (split[1] !== 'problems') {
            return // Not in page where we need to call questions description
        }

        this.$http.get(url(`problems/${id}`))
            .then((res) => {
                let body = res.body
                this.desc = body.description
                this.qtitle = body.title
            }, (response) => {
                console.error(`Problem getting question ${id}`)
            })
    }
})
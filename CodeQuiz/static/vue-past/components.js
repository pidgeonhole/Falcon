// Code Editor where users type/paste in their code
Vue.component('Editor', {
    template: '<div :id="editorId" style="width: 100%; height: 100%;"></div>',
    props: ['editorId', 'content', 'lang', 'theme'],
    data: function () {
        return {
            editor: Object,
            beforeContent: '',
            ace: null
        }
    },
    watch: {
        content: function (value) {
            if (this.beforeContent !== value) this.editor.setValue(value, 1)
        }
    },
    mounted() {
        let lang = this.lang || 'python'
        let theme = this.theme || 'xcode'

        if (!window.ace) {
            return
        }

        this.editor = window.ace.edit(this.editorId)
        this.editor.setValue(this.content, 1)

        this.editor.getSession().setMode(`ace/mode/${lang}`)
        this.editor.setTheme(`ace/theme/${theme}`)

        this.editor.on('change', () => {
            this.beforeContent = this.editor.getValue()
            this.$emit('change-content', this.editor.getValue())
        })
    }
})

// Live editor for admin to set/edit questions
Vue.component('LiveEditor', {
    
})
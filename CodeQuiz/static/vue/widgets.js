var store = {
    
};

var baseMixin = {
    delimiters: ["[[", "]]"],
};


var app1 = new Vue({
    mixins: [baseMixin],
    el: '#ex1',
    data: {
        category: "",
        testCases: "asdasda",
        title: "Random Title"
    },
    methods: {
        speak: function(args) {
            console.log('hello ' + args);
            var t1 = $("article#preview").html();
            console.log(t1);
            console.log(this.category, this.title);
            
        }
    }
});

/* 
```python
def string():
    return "str"
```
*/
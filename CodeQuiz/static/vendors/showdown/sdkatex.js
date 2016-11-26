(function (extension) {
    if (typeof showdown !== 'undefined') {
        // global (browser or nodejs global)
        extension(showdown);
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(['showdown'], extension);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = extension(require('showdown'));
    } else {
        // showdown was not found so we throw
        throw Error('Could not find showdown library');
    }
}(function (showdown) {
    // ```katex\n([\S]+)\n```
    showdown.extension('sdkatex', function () {
        // console.log('extended');
        return [{
            type: 'lang',
            filter: function (text) {
                return text.replace(/\s$([\S]+)$\s/, function (flag, match, end) {
                    console.log(match);
                    return katex.renderToString(match);
                })
            }
        }]
    });
}));
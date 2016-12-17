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
    showdown.extension('sdkatex', function () {
        // Katex extensions
        return [{
            type: 'lang',
            filter: function (text) {
                return text.replace(/\`katex\s([\S ]*)[\s]?\`/g, function (flag, match, end) {
                    return katex.renderToString(match)
                })
            }
        }, {
            type: 'lang',
            filter: function (text) {
                return text.replace(/```katex\n([\S]+)\n```/g, function (flag, match, end) {
                    return katex.renderToString(match)
                })
            }
        }]
    });
}));
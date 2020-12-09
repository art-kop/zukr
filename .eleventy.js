const fs = require('fs');
const { lastRun } = require('gulp');
const htmlmin = require('html-minifier');
const markdown = require('markdown-it')({ html: true });
const prettydata = require('pretty-data');
const { start } = require('repl');

module.exports = (config) => {
    // config.addPassthroughCopy('src/favicon.ico');
    // config.addPassthroughCopy('src/fonts');
    config.addPassthroughCopy('src/img');
    config.addPassthroughCopy('src/**/img');
    config.addPassthroughCopy('src/scripts');
    config.addPassthroughCopy('src/styles');

    config.addFilter("h1", function(value) {
        return value.slice(value.indexOf('<h1>') + 4, value.indexOf('</h1>'))
    });

    const getSlice = (input, startAt, endAt, isSavePWrap) => {
        let startIndex = input.indexOf(startAt) + (isSavePWrap ? 0 : 3)
        let endIndex = input.indexOf(endAt, startIndex) + endAt.length
        return input.slice(startIndex, endIndex)
    }

    config.addFilter("getImages", function(input) {
        let image = getSlice(input,'<p><img', '"></p>', true )
        return image
    });

    config.addFilter("h1Toh2", function(input) {
        return input.replace(/h1/g, 'h2')
    });

    config.addFilter("getFirstImage", function(input, atr, value) {
        let image = getSlice(input,'<p><img', '">', false );
        return  image.substring(0, 4) + " " + atr + "=\"" + value + "\" " + image.substring(4)
    });

    config.addPairedShortcode('markdown', (content) => {
        return markdown.render(content);
    });

    config.addFilter('length', (path) => {
        const stats = fs.statSync(path);

        return stats.size;
    });
    
    config.addFilter('htmlmin', (value) => {
        return htmlmin.minify(
            value, {
                removeComments: true,
                collapseWhitespace: true
            }
        );
    });

    config.addTransform('htmlmin', (content, outputPath) => {
        if(outputPath && outputPath.endsWith('.html')) {
            const result = htmlmin.minify(
                content, {
                    removeComments: true,
                    collapseWhitespace: true
                }
            );

            return result;
        }

        return content;
    });

    config.addTransform('xmlmin', (content, outputPath) => {
        if(outputPath && outputPath.endsWith('.xml')) {
            return prettydata.pd.xmlmin(content);
        }

        return content;
    });

    return {
        dir: {
            input: 'src',
            output: 'dist',
            includes: 'includes',
            layouts: 'layouts'
        },
        dataTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        passthroughFileCopy: true,
        templateFormats: [
            'md', 'njk', 'jpg'
        ],
    };
};
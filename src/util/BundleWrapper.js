/**
 * Created by godsong on 16/7/7.
 */
var injectedGlobals = [
    // ES
    'Promise',
    // W3C
    'window',
    'weex',
    'service',
    'Rax',
    'services',
    'global',
    'screen',
    'document',
    'navigator',
    'location',
    'fetch',
    'Headers',
    'Response',
    'Request',
    'URL',
    'URLSearchParams',
    'setTimeout',
    'clearTimeout',
    'setInterval',
    'clearInterval',
    'requestAnimationFrame',
    'cancelAnimationFrame',
    'alert',
    // ModuleJS
    'define',
    'require',
    // Weex
    'bootstrap',
    'register',
    'render',
    '__d',
    '__r',
    '__DEV__',
    '__weex_define__',
    '__weex_require__',
    '__weex_viewmodel__',
    '__weex_document__',
    '__weex_bootstrap__',
    '__weex_options__',
    '__weex_data__',
    '__weex_downgrade__',
    '__weex_require_module__',
    'Vue'

];
const bundleWrapper = 'function __weex_bundle_entry__('+injectedGlobals.join(',')+'){';
const rearRegexp = /\/\/#\s*sourceMappingURL(?!.*?\s+.)|$/;
module.exports = function (code,sourceUrl) {
    var match=/^\s*(\/\/.+)\n/.exec(code);
    var anno='';
    if(match){
        anno='$$frameworkFlag["'+(sourceUrl||'@')+'"]="'+match[1].replace(/"/g,'\\"')+'";';
    }
    return anno+bundleWrapper + code.replace(rearRegexp, '}\n$&');
}

/**
 * Created by godsong on 16/7/7.
 */
var injectedGlobals = [
    'define',
    'require',
    'document',
    'bootstrap',
    'register',
    'render',
    '__d',
    '__r',
    '__DEV__',
    '__weex_define__',
    '__weex_bootstrap__',
    '__weex_document__',
    '__weex_viewmodel__',
    '__weex_options__',
    '__weex_data__',
    'setTimeout',
    'clearTimeout',
    'setInterval',
    'clearInterval',
    'global'
];
const bundleWrapper = 'function __weex_bundle_entry__('+injectedGlobals.join(',')+'){';
const rearRegexp = /\/\/#\s*sourceMappingURL|$/;

module.exports = function (code,sourceUrl) {
    var match=/^\s*(\/\/.+)\n/.exec(code);
    var anno='';
    if(match){
        anno='$$frameworkFlag["'+sourceUrl+'"]="'+match[1].replace(/"/g,'\\"')+'";';
    }
    return anno+bundleWrapper + code.replace(rearRegexp, '}\n$&');
}

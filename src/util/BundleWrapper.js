/**
 * Created by godsong on 16/7/7.
 */
const bundleWrapper = 'function __weex_bundle_entry__(define, require, document, bootstrap,register, render, __weex_define__, __weex_bootstrap__,__weex_document__,__weex_viewmodel__){';
const rearRegexp = /\/\/#\s*sourceMappingURL|$/;

module.exports = function (code) {
    return bundleWrapper + code.replace(rearRegexp, '}\n$&');
}
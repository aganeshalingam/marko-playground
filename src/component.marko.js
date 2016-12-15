function create(__helpers) {
  var loadTemplate = __helpers.l,
      playground_layout_template = loadTemplate(require.resolve("./playground-layout.marko")),
      str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      __browser_json = require.resolve("./browser.json"),
      __loadTag = __helpers.t,
      lasso_page_tag = __loadTag(require("lasso/taglib/page-tag")),
      layout_use_tag = __loadTag(require("marko/taglibs/layout/use-tag")),
      layout_put_tag = __loadTag(require("marko/taglibs/layout/put-tag"));

  return function render(data, out) {
    lasso_page_tag({
        packagePath: __browser_json,
        dirname: __dirname,
        filename: __filename
      }, out);

    layout_use_tag({
        __data: data,
        __template: playground_layout_template,
        getContent: function getContent(__layoutHelper) {
          layout_put_tag({
              into: "main",
              layout: __layoutHelper,
              renderBody: function renderBody(out) {
                data.renderer(data.fixture, out);
              }
            }, out);
        }
      }, out);
  };
}

(module.exports = require("marko").c(__filename)).c(create);

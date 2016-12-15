function create(__helpers) {
  var str = __helpers.s,
      empty = __helpers.e,
      notEmpty = __helpers.ne,
      escapeXml = __helpers.x,
      __loadTag = __helpers.t,
      lasso_head_tag = __loadTag(require("lasso/taglib/head-tag")),
      forEach = __helpers.f,
      attr = __helpers.a,
      layout_placeholder_tag = __loadTag(require("marko/taglibs/layout/placeholder-tag")),
      lasso_body_tag = __loadTag(require("lasso/taglib/body-tag")),
      init_widgets_tag = __loadTag(require("marko-widgets/taglib/init-widgets-tag")),
      browser_refresh_tag = __loadTag(require("browser-refresh-taglib/refresh-tag"));

  return function render(data, out) {
    out.w("<html><head>");

    lasso_head_tag({}, out);

    out.w("</head><body><header class=\"playground\"><h1>Marko Components Playground</h1>");

    if (data.name) {
      out.w("<div><h2>" +
        escapeXml(data.name) +
        "</h2><a href=\"/\">back to components list</a><select>");

      forEach(data.fixtureNames, function(fixtureName) {
        out.w("<option" +
          attr("selected", fixtureName === data.fixtureName) +
          ">" +
          escapeXml(fixtureName) +
          "</option>");
      });

      out.w("</select></div>");
    }

    out.w("</header><div class=\"playground-content\"><div>");

    layout_placeholder_tag({
        name: "main",
        content: data.layoutContent
      }, out);

    out.w("</div></div>");

    lasso_body_tag({}, out);

    init_widgets_tag({}, out);

    browser_refresh_tag({}, out);

    out.w("</body></html>");
  };
}

(module.exports = require("marko").c(__filename)).c(create);

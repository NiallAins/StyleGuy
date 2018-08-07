define({
  "theme" : {
    "color" : [
      {"ref" : "c-prim", "hex" : "#000000"}
    ],
    "typography" : [
      {"selector" : "body", "props" : [], "markup" : '<span> Some text in default font </span>' } 
    ]
  },
  "text" : {
    "paragraph" : [
      { "selector": "p", "markup": "<p> A paragraph of text </p>" }
    ],
    "headers" : [
      { "selector": "h1, h2, h3, h4, h5, h6", "markup": "<h1> A Header </h1>" },
      { "selector": "h1", "markup": "<h1> Header One </h1>" },
      { "selector": "h2", "markup": "<h2> Header Two </h2>" },
      { "selector": "h3", "markup": "<h3> Header Three </h3>" },
      { "selector": "h4", "markup": "<h4> Header Four </h4>" },
      { "selector": "h5", "markup": "<h5> Header Five </h5>" },
      { "selector": "h6", "markup": "<h6> Header Six </h6>" }
    ],
    "hyperlink" : [
      { "selector": "a", "markup": "This is <a> a hyperlink </a>" }
    ],
    "list" : [
      { "selector": "ul", "markup": '<ul>\n  <li> Item One </li>\n  <li> Item Two </li>\n  <li> Item Three </li>\n</ul>' },
      { "selector": "li", "markup": "" }
    ],
    "formatting tags" : [
      { "selector": "strong", "markup": "This is <strong> strong text </strong>" },
      { "selector": "em", "markup": "This is <em> emphasised text </em>" },
      { "selector": "code", "markup": "This is <code> () => { a snippet of code } </code>" },
      { "selector": "super", "markup": "This is text is <sup> super-script</sup>" },
      { "selector": "sub", "markup": "This is text is <sub> sub-script </sub>" }
    ]
  },
  "layout": {
    "header" : [
      { "selector": "header", "markup": "<header> Header Content </header>" }
    ],
    "nav" : [
      { "selector": "nav", "markup": "<nav> Nav Content </nav>" }
    ],
    "main" : [
      { "selector": "main", "markup": "<main> Main Content </main>" }
    ],
    "section" : [
      { "selector": "section", "markup": "<section> Section Content </section>" }
    ],
    "article" : [
      { "selector": "article", "markup": "<article> Article Content </article>" }
    ],
    "aside" : [
      { "selector": "aside", "markup": "<aside> Aside Content </aside>" }
    ],
    "footer" : [
      { "selector": "footer", "markup": "<footer> Footer Content </footer>" }
    ],
    "horizonal rule" : [
      { "selector": "hr", "markup": "<hr />" }
    ]
  },
  "inputs" : {
    "label" : [
      { "selector": "label", "markup": "<label> Input Label </label>" }
    ],
    "button" : [
      { "selector": "button", "markup": "<button> Button </button>" }
    ],
    "inline text" : [
      { "selector": "input[type=\"text\"]", "markup": "<input type=\"text\" placeholder=\"Type here...\" />" }
    ],
    "textarea" : [
      { "selector": "textarea", "markup": "<textarea placeholder=\"Type here...\"></textarea>" }
    ],
    "radio buttons" : [
      { "selector": "input[type=\"radio\"]", "markup": "<input type=\"radio\" name=\"a\" /> Option One\n<br/>\n<input type=\"radio\" name=\"a\" /> Option Two" }
    ],
    "checkbox" : [
      { "selector": "input[type=\"checkbox\"]",
        "markup": '<input type=\"checkbox\" /> Option One\n<br/>\n<input type=\"checkbox\" /> Option Two' }
    ],
    "dropdown menu" : [
      { "selector": "select", "markup": "<select>\n  <option> First Option  </option>\n  <option> Second Option </option>\n  <option> Third Option  </option>\n</select>" }
    ],
    "number" : [
      { "selector": "input[type=\"number\"]", "markup": "<input type=\"number\" />" }
    ],
    "color" : [
      { "selector": "input[type=\"color\"]", "markup": "<input type=\"color\" />" }
    ],
    "date" : [
      { "selector": "input[type=\"date\"]", "markup": "<input type=\"date\" />" }
    ],
    "range" : [
      { "selector": "input[type=\"range\"]", "markup": "<input type=\"range\" />" }
    ]
  },
  "graphics" :{
    "image" : [
      { "selector": "img", "markup": "<img src=\"sample.png\" />" }
    ],
    "icons" : [
      { "selector": "i.fa", "markup": "<i class=\"fa fa-calendar\"></i>" }
    ]
  }
});
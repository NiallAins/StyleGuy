# About
StyleGuy is an application for creating live style guides which automatically push changes made to the guide straight to your application or website.

# Use
### Creating a style guide
Upon creating and naming a new project, each standard HTML element can styled using either CSS, SCSS, or with out in-built WYSISYG element editor.
Additional classes of element can be defined to cover any variation with your project.
Additional HTML component can also be defined to cover components that may be needed in your applicaiton.

Colour palattes can be designed within StyleGuy as well as standard font stack. This ensures consistent branding and design within your application.

### Sharing a style guide
A link to the view mode of your style guide can be shared amoungst developers. This read-only version displays all your components and elements with their styling along with the HTML snippet needed by the developer to insert them into pages.
This link is stay up to date with any changes designs make to the style guide.

### Implementing a styleguide in production
Every time you edit the style guide, your changes are converted into css and saved to the server. By linking your applciaion to this css file, any changes made to the style guide will automatically appear in your application; no build required.
If you would like a less continuous integration of styles, this css can similer be downloaded and add to your project manualy on each release.

# Development
StyleGuy is devleoped in Vue.js with require.js for module and component control.

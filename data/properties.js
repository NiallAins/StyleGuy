define({
    "dimensions" : {
        "width" : {
            "width" : ['px'],
            "min-width" : ['px'],
            "max-width" : ['px']
        },
        "height" : {
            "height" : ['px'],
            "min-height" : ['px'],
            "max-height" : ['px']
        },
        "margin" : {
            "margin" : ['px'],
            "margin-top" : ['px'],
            "margin-right" : ['px'],
            "margin-bottom" : ['px'],
            "margin-left" : ['px']
        },
        "padding" : {
            "padding" : ['px'],
            "padding-top" : ['px'],
            "padding-right" : ['px'],
            "padding-bottom" : ['px'],
            "padding-left" : ['px']
        }
    },
    "borders" : {
        "border-width" : {
            "border-width" : ['px'],
            "border-top-width" : ['px'],
            "border-right-width" : ['px'],
            "border-bottom-width" : ['px'],
            "border-left-width" : ['px']
        },
        "border-style" : {
            "border-style" : ['op', ['none', 'solid', 'dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset']],
            "border-top-style" : ['op', ['none', 'solid', 'dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset']],
            "border-right-style" : ['op', ['none', 'solid', 'dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset']],
            "border-bottom-style" : ['op', ['none', 'solid', 'dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset']],
            "border-left-style" : ['op', ['none', 'solid', 'dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset']]
        },
        "border-color" : {
            "border-color" : ['hex'],
            "border-top-color" : ['hex'],
            "border-right-color" : ['hex'],
            "border-bottom-color" : ['hex'],
            "border-left-color" : ['hex'],
        },
        "border-radius" : {
            "border-radius" : ['px'],
            "border-top-left-radius" : ['px'],
            "border-top-right-radius" : ['px'],
            "border-bottom-right-radius" : ['px'],
            "border-bottom-left-radius" : ['px']
        },
        "border-image-source" : ['url'],
        "border-image-width" : ['px'],
        "border-image-outset" : ['multi', ['px', 'px', 'px', 'px']],
        "border-image-repeat" :{
            "border-image-repeat" : ['op', ['stretch', 'repeat', 'round', 'square']],
            "border-image-repeat-x" : ['op', ['stretch', 'repeat', 'round', 'square']],
            "border-image-repeat-y" : ['op', ['stretch', 'repeat', 'round', 'square']]
        }
    },
    "layout" : {
        "display" : ['op', ['none', 'inline', 'block', 'inline-block', 'list-item', 'table', 'inline-table', 'table-row-group', 'table-header-group', 'table-footer-group', 'table-row', 'table-column', 'table-column', 'table-cell', 'table-captio']],
        "position" : {
            "position" : ['op', ['static', 'relative', 'absolute', 'fixed', 'sticky']],
            "top" : ['px'],
            "right" : ['px'],
            "bottom" : ['px'],
            "left" : ['px'],
            "z-index" : ['num']
        },
        "overflow" : {
            "overflow" : ['op', ['visible', 'hidden', 'scroll', 'auto']],
            "overflow-x" : ['op', ['visible', 'hidden', 'scroll', 'auto']],
            "overflow-y" : ['op', ['visible', 'hidden', 'scroll', 'auto']]
        },
        "float" : ['op', ['none', 'left', 'right']],
        "clear" : ['op', ['none', 'left', 'right', 'both']],
        "visibility" : ['op', ['visible', 'hidden']],
        "transform" : ['op', ['none', 'matrix(n,n,n,n,n,n)', 'matrix3d(n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n)', 'translate(x,y)', 'translate3d(x,y,z)', 'translateX(x)', 'translateY(y)', 'translateZ(z)', 'scale(x,y)', 'scale3d(x,y,z)', 'scaleX(x)', 'scaleY(y)', 'scaleZ(z)', 'rotate(angle)', 'rotate3d(x,y,z,angle)', 'rotateX(angle)', 'rotateY(angle)', 'rotateZ(angle)', 'skew(x-angle,y-angle)', 'skewX(angle)', 'skewY(angle)', 'perspective(n)']],
        "transform-origin" : ['multi', ['px','px']]
    },
    "text" : {
        "font" : ['font'],
        "color" : ['hex'],
        "line-height" : ['px'],
        "text-align" : ['op', ['left','right','center','justify']],
        "text-indent" : ['px'],
        "vertical-align" : ['op', ['baseline', 'sub', 'super', 'top', 'text-top', 'middle', 'bottom', 'text-bottom', 'px']],
        "white-space" : ['op', ['normal', 'pre', 'no-wrap', 'pre-wrap', 'pre-line']]
    },
    "typography" : {
        'font-family' : ['str'],
        'font-weight' : ['op', ['lighter', 'bold', 'bolder', '100', '200', '300', '400', '500', '600', '700', '800', '900']],
        'font-style' : ['op', ['italic']],
        'text-decoration' : ['op', ['underline', 'overline', 'line-through']],
        'font-size' : ['px'],
        'color' : ['hex'],
        'text-transform' : ['op', ['capitalize', 'uppercase', 'lowercase']],
        'letter-spacing' : ['px'],
        'word-spacing' : ['px'],
        'text-shadow' : ['multi', ['px', 'px', 'px', 'hex']]
    },
    "background" : {
        "background-color" : ['hex'],
        "background-image" : ['url'],
        "background-repeat" : ['multi', ['px', 'px']],
        "background-position" : ['multi', ['px', 'px']],
        "background-attachment" : ['op', ['scroll', 'fixed', 'local']],
        "background-size" : ['multi', ['px', 'px']],
    },
    "effects" : {
        "outline-style" : ['op', ['none', 'solid', 'dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset']],
        "outline-color" : ['hex'],
        "outline-width" : ['px'],
        "box-shadow" : ['multi', ['px', 'px', 'px', 'px', 'hex']],
        "cursor" : ['op', ['default', 'crosshair', 'help', 'move', 'n-resize', 'ne-resize', 'e-resize', 'se-resize', 's-resize', 'sw-resize', 'w-resize', 'nw-resize', 'text', 'pointer', 'progress', 'wait', 'auto', 'url']],
        "opacity" : ['num', 0.05]
    },
    "list-style" : {
        "list-style-type" : ['op', ['disc', 'circle', 'square', 'decimal', 'decimal-leading-zero', 'lower-roman', 'upper-roman', 'lower-greek', 'lower-latin', 'upper-latin', 'armenian', 'georgian', 'lower-alpha', 'upper-alpha', 'none']],
        "list-style-image" : ['url'],
        "list-style-position" : ['multi', ['px', 'px']]
    },
    "tables" : {
        "table-layout" : ['op', ['fixed', 'auto']], 
        "border-collapse" : ['op', ['collapse', 'seperate']],
        "border-spacing" : ['multi', ['px', 'px']]
    },
    "transitions" : {
        "transition-property" : ['str'],
        "transition-duration" : ['sec'],
        "transition-timing-function" : ['op', ['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out', 'cublic-bezier()']],
        "transition-delay" : ['sec']
    }
});
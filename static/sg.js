
console.info('Loading segmanta dynamic embed script')

!(function (e, t, s, k, l, p) {

    if (!e.getElementById(s)) {

        var a = e.getElementsByTagName(t)[0],

            r = document.createElement(t)

        r.setAttribute(s, k),

        r.setAttribute(l, p),

        (r.src = 'https://pge.segmanta.com/widget_embed_js/dynamicEmbed-0.1.min.js'),

        a.parentNode.insertBefore(r, a)

    }

})(document, 'script', 'data-segmanta-universal-tag-id', 6, 'data-segmanta-host', 'https://pge.segmanta.com')

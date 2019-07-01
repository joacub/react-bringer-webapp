import React, { Component } from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
// eslint-disable-next-line
export default class Html extends Component {
  static propTypes = {
    assets: PropTypes.shape({
      styles: PropTypes.object,
      javascript: PropTypes.object
    }),
    bundles: PropTypes.objectOf(PropTypes.any),
    content: PropTypes.string,
    originalUrl: PropTypes.string,
    styles: PropTypes.objectOf(PropTypes.any),
    helmetContext: PropTypes.objectOf(PropTypes.any),
    intl: PropTypes.objectOf(PropTypes.any),
    store: PropTypes.shape({
      getState: PropTypes.func
    }).isRequired
  };

  static defaultProps = {
    assets: {},
    bundles: {},
    content: '',
    originalUrl: '',
    styles: null,
    helmetContext: {},
    intl: { locale: 'en', messages: {} },
  };

  render() {
    const {
      assets, store, content, bundles, styles, helmetContext, intl, originalUrl
    } = this.props;

    const intlObject = intl || { locale: 'en', messages: {} };

    const { helmet } = helmetContext;
    const htmlAttrs = helmet && helmet.htmlAttributes.toComponent();

    /* eslint-disable react/no-danger,jsx-a11y/html-has-lang */
    return (
      <html className="no-js" {...htmlAttrs}>
        <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# Bringer-com: http://ogp.me/ns/fb/Bringer-com#">
          <script dangerouslySetInnerHTML={{
            __html: `!function(e,A,n){function a(e,A){return typeof e===A}function t(){var e,A,n,t,o,i,s;for(var l in d)if(d.hasOwnProperty(l)){if(e=[],A=d[l],A.name&&(e.push(A.name.toLowerCase()),A.options&&A.options.aliases&&A.options.aliases.length))for(n=0;n<A.options.aliases.length;n++)e.push(A.options.aliases[n].toLowerCase());for(t=a(A.fn,"function")?A.fn():A.fn,o=0;o<e.length;o++)i=e[o],s=i.split("."),1===s.length?Modernizr[s[0]]=t:(!Modernizr[s[0]]||Modernizr[s[0]]instanceof Boolean||(Modernizr[s[0]]=new Boolean(Modernizr[s[0]])),Modernizr[s[0]][s[1]]=t),f.push((t?"":"no-")+s.join("-"))}}function o(e){var A=u.className,n=Modernizr._config.classPrefix||"";if(h&&(A=A.baseVal),Modernizr._config.enableJSClass){var a=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");A=A.replace(a,"$1"+n+"js$2")}Modernizr._config.enableClasses&&(A+=" "+n+e.join(" "+n),h?u.className.baseVal=A:u.className=A)}function i(e,A){if("object"==typeof e)for(var n in e)p(e,n)&&i(n,e[n]);else{e=e.toLowerCase();var a=e.split("."),t=Modernizr[a[0]];if(2==a.length&&(t=t[a[1]]),"undefined"!=typeof t)return Modernizr;A="function"==typeof A?A():A,1==a.length?Modernizr[a[0]]=A:(!Modernizr[a[0]]||Modernizr[a[0]]instanceof Boolean||(Modernizr[a[0]]=new Boolean(Modernizr[a[0]])),Modernizr[a[0]][a[1]]=A),o([(A&&0!=A?"":"no-")+a.join("-")]),Modernizr._trigger(e,A)}return Modernizr}function s(){return"function"!=typeof A.createElement?A.createElement(arguments[0]):h?A.createElementNS.call(A,"http://www.w3.org/2000/svg",arguments[0]):A.createElement.apply(A,arguments)}function l(){var e=A.body;return e||(e=s(h?"svg":"body"),e.fake=!0),e}function r(e,n,a,t){var o,i,r,f,d="modernizr",c=s("div"),p=l();if(parseInt(a,10))for(;a--;)r=s("div"),r.id=t?t[a]:d+(a+1),c.appendChild(r);return o=s("style"),o.type="text/css",o.id="s"+d,(p.fake?p:c).appendChild(o),p.appendChild(c),o.styleSheet?o.styleSheet.cssText=e:o.appendChild(A.createTextNode(e)),c.id=d,p.fake&&(p.style.background="",p.style.overflow="hidden",f=u.style.overflow,u.style.overflow="hidden",u.appendChild(p)),i=n(c,e),p.fake?(p.parentNode.removeChild(p),u.style.overflow=f,u.offsetHeight):c.parentNode.removeChild(c),!!i}var f=[],d=[],c={_version:"3.6.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,A){var n=this;setTimeout(function(){A(n[e])},0)},addTest:function(e,A,n){d.push({name:e,fn:A,options:n})},addAsyncTest:function(e){d.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=c,Modernizr=new Modernizr;var p,u=A.documentElement,h="svg"===u.nodeName.toLowerCase();!function(){var e={}.hasOwnProperty;p=a(e,"undefined")||a(e.call,"undefined")?function(e,A){return A in e&&a(e.constructor.prototype[A],"undefined")}:function(A,n){return e.call(A,n)}}(),c._l={},c.on=function(e,A){this._l[e]||(this._l[e]=[]),this._l[e].push(A),Modernizr.hasOwnProperty(e)&&setTimeout(function(){Modernizr._trigger(e,Modernizr[e])},0)},c._trigger=function(e,A){if(this._l[e]){var n=this._l[e];setTimeout(function(){var e,a;for(e=0;e<n.length;e++)(a=n[e])(A)},0),delete this._l[e]}},Modernizr._q.push(function(){c.addTest=i}),Modernizr.addAsyncTest(function(){var e=new Image;e.onerror=function(){i("webpalpha",!1,{aliases:["webp-alpha"]})},e.onload=function(){i("webpalpha",1==e.width,{aliases:["webp-alpha"]})},e.src="data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA=="}),Modernizr.addAsyncTest(function(){var e=new Image;e.onerror=function(){i("webpanimation",!1,{aliases:["webp-animation"]})},e.onload=function(){i("webpanimation",1==e.width,{aliases:["webp-animation"]})},e.src="data:image/webp;base64,UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"}),Modernizr.addAsyncTest(function(){var e=new Image;e.onerror=function(){i("webplossless",!1,{aliases:["webp-lossless"]})},e.onload=function(){i("webplossless",1==e.width,{aliases:["webp-lossless"]})},e.src="data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA="}),Modernizr.addAsyncTest(function(){function e(e,A,n){function a(A){var a=A&&"load"===A.type?1==t.width:!1,o="webp"===e;i(e,o&&a?new Boolean(a):a),n&&n(A)}var t=new Image;t.onerror=a,t.onload=a,t.src=A}var A=[{uri:"data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=",name:"webp"},{uri:"data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==",name:"webp.alpha"},{uri:"data:image/webp;base64,UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA",name:"webp.animation"},{uri:"data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=",name:"webp.lossless"}],n=A.shift();e(n.name,n.uri,function(n){if(n&&"load"===n.type)for(var a=0;a<A.length;a++)e(A[a].name,A[a].uri)})});var w=c.testStyles=r;Modernizr.addTest("hiddenscroll",function(){return w("#modernizr {width:100px;height:100px;overflow:scroll}",function(e){return e.offsetWidth===e.clientWidth})}),t(),o(f),delete c.addTest,delete c.addAsyncTest;for(var g=0;g<Modernizr._q.length;g++)Modernizr._q[g]();e.Modernizr=Modernizr}(window,document);${
              __DEVELOPMENT__ ? '' : 'function __wm_injectImgEvent(msg) { var src = document.getElementById("content"); var img = document.createElement("img"); img.src = "https://www.google-analytics.com/collect?v=1&t=exception&tid=UA-EXAMPLE_GA-1&cid=555&exd="+encodeURIComponent(msg)+"&exf=1"; src.appendChild(img); } window.__wm_injectImgEvent = __wm_injectImgEvent; function __wm_sendException(msg) { window.ga(\'create\', \'UA-EXAMPLE_GA-1\', \'auto\'); window.ga(\'send\', \'pageview\'); window.ga(\'send\', \'exception\', { exDescription: msg, exFatal: true }); } window.addEventListener(\'error\', function(e) { if(!e.filename && e.message === \'Script error.\') { return; } var msg = e.filename+\':\'+e.lineno+\' -> \'+e.type + \': \' + e.message + \' => \' + window.location.host + window.location.pathname; if(window.ga) { __wm_sendException(msg); } else { __wm_injectImgEvent(msg); } }); window.addEventListener(\'unhandledrejection\', function(e) { var msg = e.reason + \' => \' + window.location.host + window.location.pathname; if(window.ga) { __wm_sendException(msg); } else { __wm_injectImgEvent(msg); } });'}`
          }}
          />
          {helmet && helmet.base.toComponent()}
          {helmet && helmet.title.toComponent()}
          {helmet && helmet.meta.toComponent()}

          <meta property="fb:pages" content="419884231449669" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=contain" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="application-name" content="Bringer" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black" />
          <meta name="apple-mobile-web-app-title" content="Bringer" />

          {helmet && helmet.link.toComponent()}

          {/* {!!originalUrl && originalUrl.indexOf('/me/') === -1 && ( */}
          {/* <> */}
          {/* <link rel="preconnect" href="https://bringeraircargo.com" crossOrigin="true" /> */}
          {/* <link rel="preconnect" href="https://cdn.bringeraircargo.com" crossOrigin /> */}
          {/* <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="true" /> */}

          {/* <link rel="preconnect" href="https://www.googletagservices.com" crossOrigin="true" /> */}
          {/* <link rel="preconnect" href="https://adservice.google.com" crossOrigin="true" /> */}
          {/* <link rel="preconnect" href="https://tpc.googlesyndication.com" crossOrigin="true" /> */}
          {/* <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="true" /> */}
          {/* <link rel="preconnect" href="https://securepubads.g.doubleclick.net" crossOrigin="true" /> */}
          {/* </> */}
          {/* )} */}

          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          {/* <link rel="manifest" href="/manifest.json" /> */}
          <link rel="publisher" href="https://plus.google.com/106050275494399925140" />

          {helmet && helmet.script.toComponent()}
          <link rel="apple-touch-icon" sizes="114x114" href="/dist/assets/apple-touch-icon-114x114.png" />
          <link rel="apple-touch-icon" sizes="120x120" href="/dist/assets/apple-touch-icon-120x120.png" />
          <link rel="apple-touch-icon" sizes="144x144" href="/dist/assets/apple-touch-icon-144x144.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/dist/assets/apple-touch-icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/dist/assets/apple-touch-icon-180x180.png" />
          <link rel="apple-touch-icon" sizes="57x57" href="/dist/assets/apple-touch-icon-57x57.png" />
          <link rel="apple-touch-icon" sizes="60x60" href="/dist/assets/apple-touch-icon-60x60.png" />
          <link rel="apple-touch-icon" sizes="72x72" href="/dist/assets/apple-touch-icon-72x72.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="/dist/assets/apple-touch-icon-76x76.png" />
          <link
            rel="apple-touch-startup-image"
            media="(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 1)"
            href="/dist/assets/apple-touch-startup-image-320x460.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 2)"
            href="/dist/assets/apple-touch-startup-image-640x920.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
            href="/dist/assets/apple-touch-startup-image-640x1096.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
            href="/dist/assets/apple-touch-startup-image-750x1294.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="(device-width: 414px) and (device-height: 736px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 3)"
            href="/dist/assets/apple-touch-startup-image-1182x2208.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="(device-width: 414px) and (device-height: 736px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 3)"
            href="/dist/assets/apple-touch-startup-image-1242x2148.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="(device-width: 768px) and (device-height: 1024px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 1)"
            href="/dist/assets/apple-touch-startup-image-748x1024.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="(device-width: 768px) and (device-height: 1024px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2)"
            href="/dist/assets/apple-touch-startup-image-1496x2048.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="(device-width: 768px) and (device-height: 1024px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 1)"
            href="/dist/assets/apple-touch-startup-image-768x1004.png"
          />
          <link
            rel="apple-touch-startup-image"
            media="(device-width: 768px) and (device-height: 1024px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)"
            href="/dist/assets/apple-touch-startup-image-1536x2008.png"
          />
          <link rel="icon" type="image/png" sizes="16x16" href="/dist/assets/favicon-16x16.png" />
          <link rel="icon" type="image/png" sizes="228x228" href="/dist/assets/coast-228x228.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/dist/assets/favicon-32x32.png" />
          <link rel="manifest" href="/dist/assets/manifest.json" />
          <link rel="shortcut icon" href="/dist/assets/favicon.ico" />
          <link rel="yandex-tableau-widget" href="/dist/assets/yandex-browser-manifest.json" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="Bringer" />
          <meta name="application-name" content="Bringer" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content="#fff" />
          <meta name="msapplication-TileImage" content="/dist/assets/mstile-144x144.png" />
          <meta name="msapplication-config" content="/dist/assets/browserconfig.xml" />
          <meta name="theme-color" content="#fff" />
          <link rel="search" type="application/opensearchdescription+xml" title="Bringer" href="/osd.xml" />

          {/* styles (will be present only in production with webpack extract text plugin) */}
          {/* {assets.styles
            && Object.keys(assets.styles)
              .map(style => style === 'main'
                ? (
                  <link
                    href={assets.styles[style]}
                    key={style}
                    rel="stylesheet"
                    charSet="UTF-8"
                  />
                )
                : null)
          } */}

          {!__DEVELOPMENT__ && bundles.linkElements && bundles.linkElements.map(ele => ele.props.as === 'style' && ele)}
          {bundles.styleElements && bundles.styleElements.map(ele => ele)}

          {/* (will be present only in development mode) */}
          {assets.styles && Object.keys(assets.styles).length === 0 && __DEVELOPMENT__ ? (
            <style dangerouslySetInnerHTML={{ __html: '#content{display:none}' }} />
          ) : null}

          <noscript id="jss-insertion-point" />
          {!!styles && (
            <style
              type="text/css"
              id="server-side-styles"
              dangerouslySetInnerHTML={{ __html: styles }}
            />
          )}

          {!content && (
            <style
              type="text/css"
              id="server-side-styles-blank-page"
              dangerouslySetInnerHTML={{
                __html:
                  '.NoScriptForm-content {'
                  // eslint-disable-next-line
                  + 'font-family: -apple-system,system-ui,BlinkMacSystemFont, "Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif ;' +
                  '            font-size: 18px;'
                  + '            line-height: 24px;'
                  + '            margin: 10%;'
                  + '            width: 80%'
                  + '          }'
                  + '/* line 17, ../src/please-wait.scss */'
                  + 'body.pg-loading {'
                  + '  overflow: hidden;'
                  + '}'
                  + ''
                  + '/* line 21, ../src/please-wait.scss */'
                  + '.pg-loading-screen {'
                  + '  position: fixed;'
                  + '  bottom: 0;'
                  + '  left: 0;'
                  + '  right: 0;'
                  + '  top: 0;'
                  + '  z-index: 1000000;'
                  + '  opacity: 1;'
                  + '  background-color: #FFF;'
                  + '  -webkit-transition: background-color 0.6s ease-in-out 0s;'
                  + '  -moz-transition: background-color 0.6s ease-in-out 0s;'
                  + '  -ms-transition: background-color 0.6s ease-in-out 0s;'
                  + '  -o-transition: background-color 0.6s ease-in-out 0s;'
                  + '  transition: background-color 0.6s ease-in-out 0s;'
                  + '}'
                  + '/* line 32, ../src/please-wait.scss */'
                  + '.pg-loading-screen.pg-loaded {'
                  + '  opacity: 0;'
                  + '  -webkit-animation: pgAnimLoaded 0.5s cubic-bezier(0.7, 0, 0.3, 1) both;'
                  + '  -moz-animation: pgAnimLoaded 0.5s cubic-bezier(0.7, 0, 0.3, 1) both;'
                  + '  -ms-animation: pgAnimLoaded 0.5s cubic-bezier(0.7, 0, 0.3, 1) both;'
                  + '  -o-animation: pgAnimLoaded 0.5s cubic-bezier(0.7, 0, 0.3, 1) both;'
                  + '  animation: pgAnimLoaded 0.5s cubic-bezier(0.7, 0, 0.3, 1) both;'
                  + '}'
                  + '/* line 38, ../src/please-wait.scss */'
                  + '.pg-loading-logo-header '
                  // eslint-disable-next-line
                  + '{ font-family: -apple-system,system-ui,BlinkMacSystemFont, "Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif ; } ' +
                  '.pg-loading-screen.pg-loading .pg-loading-logo-header, '
                  + '.pg-loading-screen.pg-loading .pg-loading-html {'
                  + '  opacity: 1;'
                  + '}'
                  + '/* line 42, ../src/please-wait.scss */'
                  + '.pg-loading-screen.pg-loading .pg-loading-logo-header, '
                  + '.pg-loading-screen.pg-loading .pg-loading-html:not(.pg-loaded) {'
                  + '  -webkit-animation: pgAnimLoading 1s cubic-bezier(0.7, 0, 0.3, 1) both;'
                  + '  -moz-animation: pgAnimLoading 1s cubic-bezier(0.7, 0, 0.3, 1) both;'
                  + '  -ms-animation: pgAnimLoading 1s cubic-bezier(0.7, 0, 0.3, 1) both;'
                  + '  -o-animation: pgAnimLoading 1s cubic-bezier(0.7, 0, 0.3, 1) both;'
                  + '  animation: pgAnimLoading 1s cubic-bezier(0.7, 0, 0.3, 1) both;'
                  + '}'
                  + '/* line 46, ../src/please-wait.scss */'
                  + '.pg-loading-screen.pg-loading .pg-loading-html:not(.pg-loaded) {'
                  + '  -webkit-animation-delay: 0.3s;'
                  + '  -moz-animation-delay: 0.3s;'
                  + '  -ms-animation-delay: 0.3s;'
                  + '  -o-animation-delay: 0.3s;'
                  + '  animation-delay: 0.3s;'
                  + '}'
                  + '/* line 51, ../src/please-wait.scss */'
                  + '.pg-loading-screen .pg-loading-inner {'
                  + '  height: 100%;'
                  + '  width: 100%;'
                  + '  margin: 0;'
                  + '  padding: 0;'
                  + '  position: static;'
                  + '}'
                  + '/* line 59, ../src/please-wait.scss */'
                  + '.pg-loading-screen .pg-loading-center-outer {'
                  + '  width: 100%;'
                  + '  padding: 0;'
                  + '  display: table !important;'
                  + '  height: 100%;'
                  + '  position: absolute;'
                  + '  top: 0;'
                  + '  left: 0;'
                  + '  margin: 0;'
                  + '}'
                  + '/* line 70, ../src/please-wait.scss */'
                  + '.pg-loading-screen .pg-loading-center-middle {'
                  + '  padding: 0;'
                  + '  vertical-align: middle;'
                  + '  display: table-cell  !important;'
                  + '  margin: 0;'
                  + '  text-align: center;'
                  + '}'
                  + '/* line 78, ../src/please-wait.scss */'
                  + '.pg-loading-screen .pg-loading-logo-header, .pg-loading-screen .pg-loading-html {'
                  + '  width: 100%;'
                  + '  opacity: 0;'
                  + '}'
                  + '/* line 83, ../src/please-wait.scss */'
                  + '.pg-loading-screen .pg-loading-logo-header {'
                  + '  text-align: center;'
                  + '}'
                  + '/* line 86, ../src/please-wait.scss */'
                  + '.pg-loading-screen .pg-loading-logo-header img {'
                  + '  display: inline-block !important;'
                  + '}'
                  + '/* line 91, ../src/please-wait.scss */'
                  + '.pg-loading-screen .pg-loading-html {'
                  + '  margin-top: 90px;'
                  + '}'
                  + '/* line 94, ../src/please-wait.scss */'
                  + '.pg-loading-screen .pg-loading-html.pg-loaded {'
                  + '  -webkit-transition: opacity 0.5s cubic-bezier(0.7, 0, 0.3, 1);'
                  + '  -moz-transition: opacity 0.5s cubic-bezier(0.7, 0, 0.3, 1);'
                  + '  -ms-transition: opacity 0.5s cubic-bezier(0.7, 0, 0.3, 1);'
                  + '  -o-transition: opacity 0.5s cubic-bezier(0.7, 0, 0.3, 1);'
                  + '  transition: opacity 0.5s cubic-bezier(0.7, 0, 0.3, 1);'
                  + '}'
                  + '/* line 97, ../src/please-wait.scss */'
                  + '.pg-loading-screen .pg-loading-html.pg-loaded.pg-removing {'
                  + '  opacity: 0;'
                  + '}'
                  + '/* line 101, ../src/please-wait.scss */'
                  + '.pg-loading-screen .pg-loading-html.pg-loaded.pg-loading {'
                  + '  opacity: 1;'
                  + '}'
                  + ''
                  + '@-webkit-keyframes pgAnimLoading {'
                  + '  from {'
                  + '    opacity: 0;'
                  + '  }'
                  + '}'
                  + '@-moz-keyframes pgAnimLoading {'
                  + '  from {'
                  + '    opacity: 0;'
                  + '  }'
                  + '}'
                  + '@-o-keyframes pgAnimLoading {'
                  + '  from {'
                  + '    opacity: 0;'
                  + '  }'
                  + '}'
                  + '@-ms-keyframes pgAnimLoading {'
                  + '  from {'
                  + '    opacity: 0;'
                  + '  }'
                  + '}'
                  + '@keyframes pgAnimLoading {'
                  + '  from {'
                  + '    opacity: 0;'
                  + '  }'
                  + '}'
                  + '@-webkit-keyframes pgAnimLoaded {'
                  + '  from {'
                  + '    opacity: 1;'
                  + '  }'
                  + '}'
                  + '@-moz-keyframes pgAnimLoaded {'
                  + '  from {'
                  + '    opacity: 1;'
                  + '  }'
                  + '}'
                  + '@-o-keyframes pgAnimLoaded {'
                  + '  from {'
                  + '    opacity: 1;'
                  + '  }'
                  + '}'
                  + '@-ms-keyframes pgAnimLoaded {'
                  + '  from {'
                  + '    opacity: 1;'
                  + '  }'
                  + '}'
                  + '@keyframes pgAnimLoaded {'
                  + '  from {'
                  + '    opacity: 1;'
                  + '  }'
                  + '} .sk-spinner-double-bounce .sk-double-bounce1, .sk-spinner-double-bounce .sk-double-bounce2 {'
                  + '  width: 100%;'
                  + '  height: 100%;'
                  + '  border-radius: 50%;'
                  + '  background-color: #dcdcdc;'
                  + '  opacity: 0.6;'
                  + '  position: absolute;'
                  + '  top: 0;'
                  + '  left: 0;'
                  + '  -webkit-animation: sk-doubleBounce 2s infinite ease-in-out;'
                  + '          animation: sk-doubleBounce 2s infinite ease-in-out; }'
                  + '.sk-spinner-double-bounce .sk-double-bounce2 {'
                  + '  -webkit-animation-delay: -1s;'
                  + '          animation-delay: -1s; }'
                  + ''
                  + '@-webkit-keyframes sk-doubleBounce {'
                  + '  0%, 100% {'
                  + '    -webkit-transform: scale(0);'
                  + '            transform: scale(0); }'
                  + ''
                  + '  50% {'
                  + '    -webkit-transform: scale(1);'
                  + '            transform: scale(1); } }'
                  + ''
                  + '@keyframes sk-doubleBounce {'
                  + '  0%, 100% {'
                  + '    -webkit-transform: scale(0);'
                  + '            transform: scale(0); }'
                  + ''
                  + '  50% {'
                  + '    -webkit-transform: scale(1);'
                  + '            transform: scale(1); } } .sk-spinner-double-bounce.sk-spinner { width: 40px;'
                  + 'height: 40px;'
                  + 'position: relative;'
                  + 'margin: 0 auto; }'
              }}
            />
          )}
        </head>
        <body>
          <div id="content" disable-lazy-test="true" dangerouslySetInnerHTML={{ __html: content }} />
          {!content && (
            <div id="pg-loading-screen" style={{ display: 'none' }} className="pg-loading-screen pg-loading">
              <div className="pg-loading-inner">
                <div className="pg-loading-center-outer">
                  <div className="pg-loading-center-middle">
                    <h3 className="pg-loading-logo-header">bringeraircargo.com</h3>
                    <div className="pg-loading-html pg-loaded">
                      <p className="loading-message" />
                      <div className="sk-spinner sk-spinner-double-bounce">
                        <div className="sk-double-bounce1" />
                        <div className="sk-double-bounce2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {!content && (
            <noscript>
              <div className="pg-loading-screen pg-loading">
                <div className="pg-loading-inner">
                  <div className="pg-loading-center-outer">
                    <div className="pg-loading-center-middle">
                      <h3 className="pg-loading-logo-header">bringeraircargo.com</h3>
                      <div className="pg-loading-html pg-loaded">
                        <p className="loading-message">
                          <div className="NoScriptForm-content">
                            <p>
                              We've detected that JavaScript is disabled in your browser. bringeraircargo.com need JavaScript
                              for work, please active and reload this page.
                            </p>
                          </div>
                        </p>
                        <div className="sk-spinner sk-spinner-double-bounce">
                          <div className="sk-double-bounce1" />
                          <div className="sk-double-bounce2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </noscript>
          )}
          {store && (
            <script
              dangerouslySetInnerHTML={{
                __html: `window.__PRELOADED__=true;window.__data=${serialize(store.getState())};`
              }}
              charSet="UTF-8"
            />
          )}
          <script dangerouslySetInnerHTML={{
            __html: `window.App = ${serialize({ locale: intlObject.lang, messages: intlObject.messages })};`
          }}
          />
          {/* {assets.javascript && <script async src={assets.javascript.main} charSet="UTF-8" />}
          {assets.javascript && <script async src={assets.javascript.vendor} charSet="UTF-8" />} */}
          {bundles.scriptElements && bundles.scriptElements.map(ele => ele)}
          {!__DEVELOPMENT__ && bundles.linkElements && bundles.linkElements.map(ele => ele.props.as !== 'style' && ele)}
          {/* {bundles.styleElements && bundles.styleElements.map(ele => ele)} */}

          {/* (will be present only in development mode) */}
          {assets.styles && Object.keys(assets.styles).length === 0 && __DEVELOPMENT__ ? (
            <script
              dangerouslySetInnerHTML={{
                __html: 'document.getElementById("content").style.display="block";'
              }}
            />
          ) : null}
          {!content && (
            <script
              dangerouslySetInnerHTML={{
                __html:
                  // eslint-disable-next-line
                  'if(document.getElementById("pg-loading-screen")) { document.getElementById("pg-loading-screen").style.display="block"; }'
              }}
            />
          )}
          <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />
        </body>
      </html>
    );
    /* eslint-enable react/no-danger */
  }
}

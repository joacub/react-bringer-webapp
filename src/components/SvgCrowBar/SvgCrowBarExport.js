/* eslint-disable */
const svgCrowbar = function(svg_el, options) {
  // TODO: should probably do some checking to make sure that svg_el is
  // actually a <svg> and throw a friendly error otherwise

  // get options passed to svg_crowbar
  const filename = options.filename || 'download.png';
  const width = options.width; // TODO: add fallback value based on svg attributes
  const height = options.height; // TODO: add fallback value based on svg attributes
  const crowbar_el = options.crowbar_el; // TODO: element for preparing the canvas element

  // apply the stylesheet to the svg to be sure to capture all of the stylings
  applyStylesheets(svg_el);

  // grab the html from the svg and encode the svg in a data url
  const html = svg_el.outerHTML;
  const imgsrc = `data:image/svg+xml;base64,${btoa(html)}`;

  // create a canvas element that has the right dimensions
  crowbar_el.innerHTML = `<canvas width="${width}" height="${height}"></canvas>`;
  const canvas = crowbar_el.querySelector('canvas');
  const context = canvas.getContext('2d');
  const image = new Image();
  image.src = imgsrc;
  image.onload = function() {
    // draw the image in the context of the canvas and then get the
    // image data from the canvas
    //
    // TODO: the resulting canvas image is a little on the grainy side.
    // up until this point the image is lossless, so it definitely has
    // something to do with the imgsrc getting lost when embedding in
    // the canvas. this appears to be a problem with just about
    // anything i've seen
    context.drawImage(image, 0, 0);
    const canvasdata = canvas.toDataURL('image/png');

    // download the data
    const a = document.createElement('a');
    a.download = filename;
    a.href = canvasdata;
    a.click();
  };

  // this is adapted (barely) from svg-crowbar
  // https://github.com/NYTimes/svg-crowbar/blob/gh-pages/svg-crowbar-2.js#L211-L250
  function applyStylesheets(svgEl) {
    // use an empty svg to compute the browser applied stylesheets
    const emptySvg = window.document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    window.document.body.appendChild(emptySvg);
    const emptySvgDeclarationComputed = getComputedStyle(emptySvg);
    emptySvg.parentNode.removeChild(emptySvg);

    // traverse the element tree and explicitly set all stylesheet values
    // on an element. this is ripped from svg-crowbar
    const allElements = traverse(svgEl); // eslint-disable-line
    let i = allElements.length;
    while (i--) {
      explicitlySetStyle(allElements[i], emptySvgDeclarationComputed);
    }
  }

  function explicitlySetStyle(element, emptySvgDeclarationComputed) {
    const cSSStyleDeclarationComputed = getComputedStyle(element);
    let i, len, key, value;
    let computedStyleStr = '';
    for (i = 0, len = cSSStyleDeclarationComputed.length; i < len; i++) {
      key = cSSStyleDeclarationComputed[i];
      value = cSSStyleDeclarationComputed.getPropertyValue(key);
      if (value !== emptySvgDeclarationComputed.getPropertyValue(key)) {
        computedStyleStr += `${key}:${value};`;
      }
    }
    element.setAttribute('style', computedStyleStr);
  }

  // traverse an svg and append all of the elements to the tree array. This
  // ignores some elements that can appear in <svg> elements but whose
  // children's styles should not be tweaked
  function traverse(obj) {
    const tree = [];
    const ignoreElements = {
      script: undefined,
      defs: undefined
    };
    tree.push(obj);
    visit(obj);

    function visit(node) {
      if (node && node.hasChildNodes() && !(node.nodeName.toLowerCase() in ignoreElements)) {
        let child = node.firstChild;
        while (child) {
          if (child.nodeType === 1) {
            tree.push(child);
            visit(child);
          }
          child = child.nextSibling;
        }
      }
    }

    return tree;
  }
};

export default svgCrowbar;

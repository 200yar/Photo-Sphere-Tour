(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['Photo-Sphere-Viewer', 'D.js', 'uevent'], factory);
  }
  else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('Photo-Sphere-Viewer'), require('d.js'), require('uevent'));
  }
  else {
    root.PhotoSphereTour = factory(root.PhotoSphereViewer, root.D, root.uEvent);
  }
}(this, function(PhotoSphereViewer, D, uEvent) {
"use strict";

var PSVUtils = PhotoSphereViewer.Utils;

@@js

return PhotoSphereTour;
}));

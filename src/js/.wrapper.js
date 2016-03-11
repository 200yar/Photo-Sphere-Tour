(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['Photo-Sphere-Viewer'], factory);
  }
  else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('Photo-Sphere-Viewer'));
  }
  else {
    root.PhotoSphereTour = factory(root.PhotoSphereViewer);
  }
}(this, function(PhotoSphereViewer) {
"use strict";

var PSVUtils = PhotoSphereViewer.Utils;
var PSVError = PhotoSphereViewer.Error;

@@js

return PhotoSphereTour;
}));

/**
 * Tour class
 * @param options {Object} Tour settings
 */
function PhotoSphereTour(options) {
  if (!(this instanceof PhotoSphereTour)) {
    return new PhotoSphereTour(options);
  }

  this.config = PSVUtils.clone(PhotoSphereTour.DEFAULTS);
  PSVUtils.deepmerge(this.config, options);

  // check config
  if (!this.config.container) {
    throw new PSTError('No value given for container.');
  }

  // normalize config
  if (this.config.link_marker.image === null && this.config.link_marker.html === null) {
    this.config.link_marker.html = PhotoSphereTour.ICONS['link.svg'];
  }
  if (this.config.link_marker.width === null || this.config.link_marker.height === null) {
    this.config.link_marker.width = this.config.link_marker.height = 128;
  }

  this.config.viewer_options.container = this.config.container;
  this.config.viewer_options.autoload = false;

  // references to components
  this.container = (typeof this.config.container == 'string') ? document.getElementById(this.config.container) : this.config.container;
  this.viewer = null;
  this.nodes = null;

  this.prop = {
    current_node: null
  };

  // init
  this.container.photoSphereTour = this;

  this.viewer = new PhotoSphereViewer(this.config.viewer_options);

  this._bindEvents();

  if (this.config.nodes && this.config.nodes.length > 0) {
    this.setNodes(this.config.nodes);
  }
}

/**
 * SVG icons sources
 * @type {Object}
 */
PhotoSphereTour.ICONS = {};

/**
 * PhotoSphereTour defaults
 * @type {Object}
 */
PhotoSphereTour.DEFAULTS = {
  container: null,
  link_marker: {
    image: null,
    html: null,
    width: null,
    height: null,
    className: 'psv-link-marker'
  },
  nodes: null,
  start_node: null,
  show_nodes_list: true,
  viewer_options: {
    autoload: false, // always overwritten
    time_anim: false
  }
};

uEvent.mixin(PhotoSphereTour);

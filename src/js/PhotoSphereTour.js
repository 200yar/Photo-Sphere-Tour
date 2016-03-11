/**
 * Tour class
 * @param options {Object} Tour settings
 */
function PhotoSphereTour(options) {
  if (!(this instanceof PhotoSphereTour)) {
    return new PhotoSphereTour(options);
  }

  this.config = PSVUtils.deepmerge(PhotoSphereTour.DEFAULTS, options);

  // check config
  if (!this.config.container) {
    throw new PSTError('No value given for container.');
  }

  if (!this.config.nodes || this.config.nodes.length === 0) {
    throw new PSTError('No value given for nodes.');
  }

  this._checkNodes();

  // normalize config
  if (!this.config.start_node) this.config.start_node = Object.keys(this.config.nodes)[0];

  if (this.config.link_marker.image === null && this.config.link_marker.html === null) {
    this.config.link_marker.html = PhotoSphereTour.ICONS['link.svg'];
  }
  if (this.config.link_marker.width === null || this.config.link_marker.height === null) {
    this.config.link_marker.width = this.config.link_marker.height = 128;
  }

  // references to components
  this.container = (typeof this.config.container == 'string') ? document.getElementById(this.config.container) : this.config.container;
  this.viewer = null;

  this.prop = {
    current_node: null
  };

  // init
  this.config.viewer_options.container = this.container;
  this.config.viewer_options.autoload = false;

  console.log(this.config.viewer_options);
  this.viewer = new PhotoSphereViewer(this.config.viewer_options);

  this.viewer.on('select-marker', function(marker) {
    if (marker.pstLink) {
      this.setNode(marker.pstLink.target_id, marker.pstLink.target_position);
    }
  }.bind(this));

  this.setNode(this.config.start_node);
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
    time_anim: false
  }
};

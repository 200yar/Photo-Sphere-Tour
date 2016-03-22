/**
 * Destroy the viewer
 */
PhotoSphereTour.prototype.destroy = function() {
  this.viewer.destroy();

  delete this.container.photoSphereTour;

  delete this.container;
  delete this.viewer;
  delete this.config;
  delete this.prop;
  delete this.nodes;
};

/**
 * Loads a new set of nodes
 * @param nodes {Object[]}
 */
PhotoSphereTour.prototype.setNodes = function(nodes) {
  if (!nodes || nodes.length === 0) {
    throw new PSTError('No value given for nodes.');
  }

  this.config.nodes = nodes;
  this.nodes = this._checkNodes(nodes);

  if (!this.config.start_node || !this.nodes[this.config.start_node]) {
    this.config.start_node = this.config.nodes[0].id;
    console.warn('PhotoSphereTour: start_node not found in list of nodes, resetted to #' + this.config.start_node);
  }

  this.setCurrentNode(this.config.start_node);
};

/**
 * Changes the current displayed node
 * @param node_id {String}
 * @param position (Object)
 */
PhotoSphereTour.prototype.setCurrentNode = function(node_id, position) {
  var node = this.nodes[node_id];

  if (!node) {
    throw new PSTError('Node "' + node_id + '" does not exist.');
  }

  this.prop.current_node = node;

  this.viewer.clearMarkers();

  this.viewer.setCaption(node.caption);

  this.viewer.setPanorama(node.panorama, position)
    .then(function() {
      return this.change('current-node-loaded', node);
    }.bind(this))
    .then(function() {
      if (node.markers) {
        node.markers.forEach(function(marker) {
          this.viewer.addMarker(marker, false);
        }, this);
      }

      if (node.links) {
        node.links.forEach(function(link) {
          link.id = 'link-' + link.target_id;

          var marker = this.viewer.addMarker(PSVUtils.deepmerge(
            PSVUtils.clone(this.config.link_marker),
            link
          ));

          marker.pstLink = link;
        }, this);
      }

      this.viewer.render();

      this.trigger('current-node-changed', node);
    }.bind(this));
};

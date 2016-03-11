/**
 * Changes the current displayed node
 * @param node_id {String}
 * @param position (Object)
 */
PhotoSphereTour.prototype.setNode = function(node_id, position) {
  var node = this.config.nodes[node_id];

  if (!node) {
    throw new PSTError('Node "' + node_id + '" does not exist.');
  }

  this.prop.current_node = node;

  if (this.viewer.scene) {
    this.viewer.resetMarkers();

    this.viewer.setCaption(node.caption);
  }

  this.viewer.setPanorama(node.panorama, position)
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
            this.config.link_marker,
            link
          ));

          marker.pstLink = link;
        }, this);
      }

      this.viewer.render();
    }.bind(this));
};

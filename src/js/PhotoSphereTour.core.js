/**
 * Add all needed event listeners
 * @private
 */
PhotoSphereTour.prototype._bindEvents = function() {
  this.viewer.on('select-marker', function(marker) {
    if (marker.pstLink) {
      this.setCurrentNode(marker.pstLink.target_id, marker.pstLink.target_position);
    }
  }.bind(this));
};


/**
 * Check the config of all nodes and store them in an hashmap
 * @param rawNodes {Object[]}
 * @private
 */
PhotoSphereTour.prototype._checkNodes = function(rawNodes) {
  var nodes = {};

  rawNodes.forEach(function(node, i) {
    if (!node.id) {
      throw new PSTError('No id given for node #' + i + '.');
    }

    if (nodes[node.id] !== undefined) {
      throw new PSTError('Node id "' + node.id +'" already used.');
    }

    if (!node.panorama) {
      throw new PSTError('No panorama given for node "' + node.id + '".');
    }

    nodes[node.id] = node;
  });

  rawNodes.forEach(function(node) {
    if (node.links) {
      node.links.forEach(function(link, i) {
        if (!link.target_id) {
          throw new PSTError('No target_id given for link #' + i + ' of node "' + node.id + '".');
        }
        if (!nodes[link.target_id]) {
          throw new PSTError('Target "' + link.target_id + '" of link #' + i + ' of node "' + node.id + '" does not exist.');
        }

        if ((!link.hasOwnProperty('x') || !link.hasOwnProperty('y')) && (!link.hasOwnProperty('latitude') || !link.hasOwnProperty('longitude'))) {
          throw new PSTError('Missing position for link #' + i + ' of node "' + node.id + '", latitude/longitude or x/y.');
        }

        link.tooltip = {
          content: nodes[link.target_id].caption
        };
      });
    }
  });

  return nodes;
};

/**
 * Check the config of all nodes and store them in an hashmap
 * @private
 */
PhotoSphereTour.prototype._checkNodes = function() {
  var nodes = {};

  this.config.nodes.forEach(function(node, i) {
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

  this.config.nodes.forEach(function(node) {
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
      });
    }
  });

  this.config.nodes = nodes;
};

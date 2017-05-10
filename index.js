var normalize = require('unist-util-transform').normalize;

module.exports = function createStack(condition, init, pass) {
  pass = normalize(pass);

  if (typeof condition === 'string') {
    condition = function(type, node) {
      return node.type === type;
    }.bind(null, condition);
  }

  var stack = [];

  return {
    enter: function(node, index, parent) {
      if (condition(node, index, parent)) stack.push(init(node, index, parent));
      return pass.enter(node, index, parent, stack[stack.length - 1]);
    },
    exit: function(node, index, parent) {
      var item = stack[stack.length - 1];
      if (condition(node, index, parent)) item = stack.pop();
      return pass.exit(node, index, parent, item);
    }
  };
};

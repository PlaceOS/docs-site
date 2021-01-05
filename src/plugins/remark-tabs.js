const visit = require('unist-util-visit')

module.exports = () => (tree, file) => {
  visit(tree, 'jsx', node => {
    console.log(node)
  })
}

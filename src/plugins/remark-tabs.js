const visit = require('unist-util-visit')
const parse5 = require('parse5')
const Slugger = require('github-slugger')

// Insert an import node to a mdast tree
const injectImport = (tree, value) => {
  let seen = false
  visit(tree, 'import', node => (node.value == value) ? seen = true : null)
  if (!seen) { tree.children.push({type: 'import', value}) }
}

// Rewrite jsx nodes containing a set of <details> elements as <Tab> components
module.exports = () => (tree, file) => {
  visit(tree, 'jsx', node => {
    let details = parse5.parseFragment(node.value).childNodes.filter(n => n.nodeName == 'details')

    if (details.length < 2) { return }

    let slugger = new Slugger()

    let tabs = details.map((elem) => {
      let summary = elem.childNodes.findIndex(n => n.nodeName == 'summary')

      let label, value, body

      [label, ] = elem.childNodes.splice(summary, 1)
      label = parse5.serialize(label)

      value = slugger.slug(label)

      body = parse5.serialize(elem)

      return {label, value, body}
    })

    injectImport(tree, "import Tabs from '@theme/Tabs';")
    injectImport(tree, "import TabItem from '@theme/TabItem';")
    node.value = `
      <Tabs
        values={[
        ${tabs.map(({label, value}) =>
          `{label: '${label}', value: '${value}'}`
        ).join(',')}
        ]}>
        ${tabs.map(({value, body}) =>
          `<TabItem value="${value}">${body}</TabItem>`
        ).join('\n')}
      </Tabs>
    `
  })
}

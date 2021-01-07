const visit = require('unist-util-visit')
const parse5 = require('parse5')
const Slugger = require('github-slugger')

// Insert an import node to a mdast tree
const injectImport = (tree, value) => {
  let node = {type: 'import', value}
  if (!tree.children.includes(node)) {
    tree.children.push(node)
  }
}

module.exports = () => (tree, file) => {
  visit(tree, 'jsx', node => {
    let details = parse5.parseFragment(node.value).childNodes.filter(n => n.nodeName == 'details')

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

    if (tabs.length > 0) {
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
      console.log(node.value)
    }
  })
}

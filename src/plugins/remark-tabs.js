const visit = require('unist-util-visit')
const fromParse5 = require('hast-util-from-parse5')
const parse5 = require('parse5')

// Parse a mdast jsx node to a hast tree
const toHast = (node) => fromParse5(parse5.parseFragment(node.value))

const injectImports = (tree) => {
  tree.children.push({type: 'import', value: "import Tabs from '@theme/Tabs';"})
  tree.children.push({type: 'import', value: "import TabItem from '@theme/TabItem';"})
}

module.exports = () => (tree, file) => {
  visit(tree, 'jsx', node => {
    let hast = toHast(node)
    console.log(hast)

    visit(hast, {tagName: 'details'}, node => {
       console.log(node.children)
    })

    node.value = `
      <Tabs
        defaultValue="apple"
        values={[
          {label: 'Apple', value: 'apple'},
          {label: 'Orange', value: 'orange'},
          {label: 'Banana', value: 'banana'},
        ]}>
        <TabItem value="apple">This is an apple 🍎</TabItem>
        <TabItem value="orange">This is an orange 🍊</TabItem>
        <TabItem value="banana">This is a banana 🍌</TabItem>
      </Tabs>
    `
    injectImports(tree)
  })
}

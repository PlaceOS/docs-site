/**
 * Generates sidebar nav based on content file structure.
 *
 * The following frontmatter can be used to override the default behaviour on
 * all documents:
 *
 *   sidebar_label
 *   sidebar_order
 *
 * Additionaly, the first document (after sorting) within each category can
 * control the category appearance and ordering via:
 *
 *   sidebar_category_label
 *   sidebar_category_order
 *
 */

const fs = require('fs')
const path = require('path')

const { parseMarkdownString } = require('@docusaurus/utils')

// Ignore `.` files and directories, anything that isn't markdown and readme's
const ignored = /(^\.)|(\.(?!md$))|(^readme\.md$)|^node_modules$/i

// Relative path from CWD to the site renderer
const siteDir = process.env.npm_package_config_site_dir || "."

// Relative path from siteDir to the docs content
const docsPath = process.env.npm_package_config_docs_path

const content_path = path.join(siteDir, docsPath)

function parseFrontMatter(path) {
  const content = fs.readFileSync(path, 'utf8')
  const parsed = parseMarkdownString(content)
  return parsed.frontMatter || {}
}

function generateDocItem(baseDir, docPath) {
  const {
    sidebar_order : order = Infinity,
    id : docId = path.parse(docPath).name
  } = parseFrontMatter(path.join(baseDir, docPath))

  const id = path.join(path.dirname(docPath), docId)

  return { type: 'doc', id, order }
}

function generateCategoryItem(baseDir, categoryPath) {
  const items = generateItems({ baseDir, sourceDir: categoryPath })
  const introItem = items.find(item => typeof item === 'string')

  let label = path.basename(categoryPath)
  let order = Infinity

  if (introItem) {
    const {
      sidebar_category_label = label,
      sidebar_category_order = order
    } = parseFrontMatter(path.join(baseDir, `${introItem}.md`))
    label = sidebar_category_label
    order = sidebar_category_order
  }

  return { type: 'category', label, order, items }
}

function generateItems({ baseDir, sourceDir }) {
  const searchIn = path.join(baseDir, sourceDir)
  const files = fs.readdirSync(searchIn, { withFileTypes: true })

  const include = dirent => !dirent.name.match(ignored)

  const toItem = dirent => {
    const { name } = dirent
    const itemPath = path.join(sourceDir, name)
    if (dirent.isDirectory()) {
      return generateCategoryItem(baseDir, itemPath)
    } else {
      return generateDocItem(baseDir, itemPath)
    }
  }

  return files
    .filter(include)
    .map(toItem)
    .sort((a, b) => a.order - b.order)
    .map(({ id, order, ...item }) => id || item)
}

const sidebar = generateItems({ baseDir: content_path, sourceDir: '' });

module.exports = { sidebar };

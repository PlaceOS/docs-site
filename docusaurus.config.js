module.exports = {
  title: 'PlaceOS',
  url: 'https://docs.placeos.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'placeos',
  projectName: 'docs-site',
  themeConfig: {
    colorMode: {
      defaultMode: "dark",
      switchConfig: {
        darkIcon: '●',
        lightIcon: '●',
      },
    },
    image: 'img/meta.png',
    announcementBar: {
      id: 'wip',
      content: "<b>PlaceOS</b> is currently in early preview. If you are stuck and in need of a human, come say hi at <a href=\"mailto:support@place.technology\">support@place.technology</a>",
      backgroundColor: '#24Cdfd',
      textColor: '#0a0d2e',
    },
    navbar: {
      hideOnScroll: true,
      logo: {
        alt: 'PlaceOS',
        src: 'img/logo.svg',
        srcDark: 'img/logo_dark.svg',
      },
      items: [
        {
          to: 'overview',
          label: 'Docs',
          activeBaseRegex: '^(?!\/?reference\/(api|supported-integrations)).+$',
        },
        {
          to: 'reference/supported-integrations',
          label: 'Drivers',
        },
        {
          to: 'reference/api',
          label: 'API',
        },
        {
          href: 'https://github.com/PlaceOS/PlaceOS/discussions',
          label: 'Community',
        }
      ],
    },
    hideableSidebar: true,
    footer: {
      style: 'light',
      links: [
      ],
    },
    prism: {
      additionalLanguages: [
        'ruby',
        'crystal'
      ],
    },
  },
  stylesheets: [
    '/fonts/fonts.css'
  ],
  plugins: [
    [
      require.resolve('@cmfcmf/docusaurus-search-local'),
      {
        docsRouteBasePath: '/',
      }
    ],
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: process.env.npm_package_config_docs_path || 'docs',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          include: [
            './!(README).md',
            './!(node_modules)/**/!(README).md'
          ],
          showLastUpdateTime: true,
          beforeDefaultRemarkPlugins: [
            require('./src/plugins/remark-tabs.js')
          ],
          remarkPlugins: [
            require('remark-abbr')
          ],
        },
        blog: false,
        pages: false,
        theme: {
          customCss: [require.resolve('./src/css/custom.css')],
        },
      },
    ],
  ],
};

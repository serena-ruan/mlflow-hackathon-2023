import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '85a'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '58a'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', '715'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'b22'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '6dc'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '338'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '881'),
    exact: true
  },
  {
    path: '/apply',
    component: ComponentCreator('/apply', '4c6'),
    exact: true
  },
  {
    path: '/search',
    component: ComponentCreator('/search', '860'),
    exact: true
  },
  {
    path: '/docs/legacy',
    component: ComponentCreator('/docs/legacy', 'bb5'),
    routes: [
      {
        path: '/docs/legacy/behavior',
        component: ComponentCreator('/docs/legacy/behavior', '44a'),
        exact: true,
        sidebar: "version-legacy/docs"
      },
      {
        path: '/docs/legacy/config-file',
        component: ComponentCreator('/docs/legacy/config-file', '1f7'),
        exact: true,
        sidebar: "version-legacy/docs"
      },
      {
        path: '/docs/legacy/dropdown',
        component: ComponentCreator('/docs/legacy/dropdown', 'ca6'),
        exact: true,
        sidebar: "version-legacy/docs"
      },
      {
        path: '/docs/legacy/faq',
        component: ComponentCreator('/docs/legacy/faq', '3ab'),
        exact: true,
        sidebar: "version-legacy/docs"
      },
      {
        path: '/docs/legacy/how-do-we-build-an-index',
        component: ComponentCreator('/docs/legacy/how-do-we-build-an-index', '002'),
        exact: true,
        sidebar: "version-legacy/docs"
      },
      {
        path: '/docs/legacy/inside-the-engine',
        component: ComponentCreator('/docs/legacy/inside-the-engine', '4a3'),
        exact: true,
        sidebar: "version-legacy/docs"
      },
      {
        path: '/docs/legacy/integrations',
        component: ComponentCreator('/docs/legacy/integrations', 'ba3'),
        exact: true,
        sidebar: "version-legacy/docs"
      },
      {
        path: '/docs/legacy/required-configuration',
        component: ComponentCreator('/docs/legacy/required-configuration', '36a'),
        exact: true,
        sidebar: "version-legacy/docs"
      },
      {
        path: '/docs/legacy/run-your-own',
        component: ComponentCreator('/docs/legacy/run-your-own', '8cd'),
        exact: true,
        sidebar: "version-legacy/docs"
      },
      {
        path: '/docs/legacy/scraper-overview',
        component: ComponentCreator('/docs/legacy/scraper-overview', 'e38'),
        exact: true
      },
      {
        path: '/docs/legacy/styling',
        component: ComponentCreator('/docs/legacy/styling', '3c6'),
        exact: true,
        sidebar: "version-legacy/docs"
      },
      {
        path: '/docs/legacy/tips',
        component: ComponentCreator('/docs/legacy/tips', '021'),
        exact: true,
        sidebar: "version-legacy/docs"
      }
    ]
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'a56'),
    routes: [
      {
        path: '/docs/api',
        component: ComponentCreator('/docs/api', '2f6'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/crawler',
        component: ComponentCreator('/docs/crawler', 'e5c'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/DocSearch-program',
        component: ComponentCreator('/docs/DocSearch-program', 'a19'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/DocSearch-v3',
        component: ComponentCreator('/docs/DocSearch-v3', '209'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/getting-started/quickstart-1/',
        component: ComponentCreator('/docs/getting-started/quickstart-1/', '355'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/how-does-it-work',
        component: ComponentCreator('/docs/how-does-it-work', 'caf'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/integrations',
        component: ComponentCreator('/docs/integrations', '6e6'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/manage-your-crawls',
        component: ComponentCreator('/docs/manage-your-crawls', '633'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/migrating-from-legacy',
        component: ComponentCreator('/docs/migrating-from-legacy', 'c76'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/migrating-from-v2',
        component: ComponentCreator('/docs/migrating-from-v2', 'f66'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/mlflow-doc-main',
        component: ComponentCreator('/docs/mlflow-doc-main', '2d4'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/record-extractor',
        component: ComponentCreator('/docs/record-extractor', '33c'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/required-configuration',
        component: ComponentCreator('/docs/required-configuration', '1e7'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/styling',
        component: ComponentCreator('/docs/styling', '1ec'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/templates',
        component: ComponentCreator('/docs/templates', '25b'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/tips',
        component: ComponentCreator('/docs/tips', '086'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/what-is-docsearch',
        component: ComponentCreator('/docs/what-is-docsearch', 'c80'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/who-can-apply',
        component: ComponentCreator('/docs/who-can-apply', '84a'),
        exact: true,
        sidebar: "docs"
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'ae3'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];

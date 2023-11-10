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
    component: ComponentCreator('/docs', '4b4'),
    routes: [
      {
        path: '/docs/getting-started/',
        component: ComponentCreator('/docs/getting-started/', '3c7'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/getting-started/intro-quickstart/',
        component: ComponentCreator('/docs/getting-started/intro-quickstart/', 'a6a'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/getting-started/intro-quickstart/notebooks/',
        component: ComponentCreator('/docs/getting-started/intro-quickstart/notebooks/', 'b1f'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/getting-started/logging-first-model/',
        component: ComponentCreator('/docs/getting-started/logging-first-model/', '941'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/getting-started/logging-first-model/notebooks/',
        component: ComponentCreator('/docs/getting-started/logging-first-model/notebooks/', 'a7f'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/getting-started/logging-first-model/step1-tracking-server',
        component: ComponentCreator('/docs/getting-started/logging-first-model/step1-tracking-server', '31f'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/getting-started/logging-first-model/step2-mlflow-client',
        component: ComponentCreator('/docs/getting-started/logging-first-model/step2-mlflow-client', 'e71'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/getting-started/logging-first-model/step3-create-experiment',
        component: ComponentCreator('/docs/getting-started/logging-first-model/step3-create-experiment', 'f3e'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/getting-started/logging-first-model/step4-experiment-search',
        component: ComponentCreator('/docs/getting-started/logging-first-model/step4-experiment-search', 'fb5'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/getting-started/logging-first-model/step5-synthetic-data',
        component: ComponentCreator('/docs/getting-started/logging-first-model/step5-synthetic-data', 'f4d'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/getting-started/logging-first-model/step6-logging-a-run',
        component: ComponentCreator('/docs/getting-started/logging-first-model/step6-logging-a-run', '0ee'),
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
        path: '/docs/getting-started/quickstart-2/',
        component: ComponentCreator('/docs/getting-started/quickstart-2/', 'c4d'),
        exact: true,
        sidebar: "docs"
      },
      {
        path: '/docs/getting-started/tracking-server-overview/',
        component: ComponentCreator('/docs/getting-started/tracking-server-overview/', '0cd'),
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

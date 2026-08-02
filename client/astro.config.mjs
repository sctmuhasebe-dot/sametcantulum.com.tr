- import node from '@astrojs/node';
+ import vercel from '@astrojs/vercel/serverless';

  export default defineConfig({
    output: 'server',
-   adapter: node({ mode: 'standalone' }),
+   adapter: vercel(),
    ...
  });
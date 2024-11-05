import { defineNuxtModule, addPlugin, createResolver, addComponentsDir, installModule } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'my-module',
    configKey: 'myModule',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)
    nuxt.options.modules.push('@nuxtjs/tailwindcss', '@nuxt/icon')

    nuxt.hook('nitro:config', async (nitroConfig) => {
      // if not already available, intialize as empty array
      nitroConfig.publicAssets ||= []
      nitroConfig.publicAssets.push({
        dir: resolver.resolve('./runtime/assets'), // path of assets
        maxAge: 60 * 60 * 24 * 365, // cache assets for 1 year
      })
    })

    await installModule('@nuxtjs/tailwindcss', {
      configPath: resolver.resolve('./runtime/tailwind.config.js'),
    })
    await installModule('@nuxt/icon')


    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))

    await addComponentsDir({
      path: resolver.resolve('./runtime/components'), // path of components
      pathPrefix: false, // Prefix component name by its path.
      prefix: '', // Prefix all matched components.
      global: true, // Registers components to be globally available.
    })
  },
})

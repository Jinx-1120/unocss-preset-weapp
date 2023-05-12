import presetWeapp from 'unocss-preset-weapp'
import { transformerAttributify, transformerClass } from 'unocss-preset-weapp/transformer'
import { defineConfig, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    // https://github.com/MellowCo/unocss-preset-weapp
    presetWeapp(
      {
        isH5: process.env.TARO_ENV === 'h5',
        platform: 'taro',
        taroWebpack: 'webpack5',
      },
    ),
    presetIcons(),
  ],
  shortcuts: [
    {
      'border-base': 'border border-gray-500/10',
      'center': 'flex justify-center items-center',
    },
  ],

  transformers: [

    // https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerAttributify
    transformerAttributify(),

    // https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerClass
    transformerClass(),
  ],
})

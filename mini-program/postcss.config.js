/* eslint-disable import/no-commonjs */
// module.exports = {
//   plugins: {
//     tailwindcss: {},
//     autoprefixer: {
//       'postcss-rem-to-responsive-pixel': {
//         // 32 意味着 1rem = 32rpx
//         rootValue: 32,
//         // 默认所有属性都转化
//         propList: ['*'],
//         // 转化的单位,可以变成 px / rpx
//         transformUnit: 'rpx',
//       }
//     },
//   }
// }

// postcss.config.js
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('postcss-rem-to-responsive-pixel')({
      rootValue: 32,
      propList: ['*'],
      transformUnit: 'rpx',
    }),
  ],
}

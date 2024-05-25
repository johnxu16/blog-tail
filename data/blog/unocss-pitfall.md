---
title: 记录一次痛苦的unocss使用经历
tags: ['postcss']
date: '2023-06-27'
draft: false
summary:
---

因为公司有用TinaCMS + NextJS搭建部分网页,
作为headless CRM, 使用起来还是相对简单高效的，
于是就想,干脆把博客也搭在上面,这样就可以用TinaCMS来管理博客了, 耶~~~

自从习惯了utility class以后呢, 我已经被完全惯坏了  

成为了一个没有utility class就只会在地上打滚的废人

#### 那么选哪家的utility class呢?

🤔作为一个叛逆的精神病(自豪), 不选择公司使用的tailwindcss, 用unocss也是非常合理的吧!

---

## 然后就发现, 用postcss方式集成unocss, NextJS在build的时候会卡在Create optimzed production build这一步

md, 什么东西! 给你机会你不中用啊!

### 出现问题的环境

最小复现环境如下, 

```yml
Operating System:
  Platform: win32
  Arch: x64
  Version: Windows 10 Pro
Binaries:
  Node: 18.16.0
  npm: N/A
  Yarn: N/A
  pnpm: N/A
Relevant packages:
  next: 13.4.7
  eslint-config-next: 13.4.7
  react: 18.2.0
  react-dom: 18.2.0
  typescript: 5.1.3
  unocss: 0.53.3
  @unocss/postcss: 0.53.3
```

```javascript
// postcss.config.js
module.exports={
  plugins: [
    require('@unocss/postcss')({
      theme: {
        extend: {
          colors: {
            primary: '#ff0000',
          },
        },
      },
    }),
  ],
}
```

虽然为了解决这个问题，我们可以在`next.config.js`通过webpack的方式来配置unocss, 但是这到底是为什么呢🤔

假设next.js没有问题, 那么真相只有一个

是@unocss/postcss偷偷给next.js下了毒

那到底是什么毒呢🤔

### 本地@unocss/postcss调试

```bash
git clone https://github.com/unocss/unocss.git

cd packages/postcss
```

要下班了, 下次再写

---

在使用unocss的过程中, 还发生了很奇怪的事情

在公司的电脑上，一切正常。

回到家里的电脑上, 安装同样unocss插件的vscode在其中一台电脑上报错了

妈耶, 难道电脑想让我多休息会嘛！他果然是爱我的❤️

虽然没有人问, 但是我还是要说一下, 他（电脑）叫小熊猫, 最喜欢的食物是竹子, 爱好睡觉, 他的梦想是成为一只大熊猫(虽然完全没可能🤫)

```bash
🛠 Resolving config for e:\Projects\Personal\blog
🛠 New configuration loaded from
  - e:\Projects\Personal\blog\uno.config.ts
ℹ️ 4 presets, 984 rules, 1 shortcuts, 45 variants, 0 transformers loaded
⚠️ Error on annotation
TypeError: Cannot read properties of undefined (reading 'join')
```

看了下github上有人提了类似的[issue](https://github.com/unocss/unocss/issues/2722)

然而并没有人解答

### 环境

vscode Version

antfu.unocss-0.45.21

#### 决定先碰碰运气 🙏K门

在vscode extension文件夹下找到antfu.unocss插件的文件夹

```bash
cd dist
code index.js
```

直接在编译后的插件代码index.js里搜索Error on annotation, 运气很好的找到了

谢谢你, 🙏K门

Big胆, 好大的catch, 我们打印下错误信息  
![](https://s2.loli.net/2023/06/28/tOH2XMBnQqGVPgK.png)

重新启动vscode打开之前使用unocss的项目, 在OUTPUT | UnoCSS中, 看到了如下报错
![](https://s2.loli.net/2023/06/28/Y6krU34B7vIdz8D.png)

点击Object.match的对应链接, 报错原因是ctx.generator.config.separators是undefined
![](https://s2.loli.net/2023/06/28/GcFB19MsfhVZRug.png)

看了下源码和文档

variantImportant是preset-mini定义important样式语法的函数, 

ctx.generator是unocss核心库(core)中的UnoGenerator对象, 负责生成css文件

UnoGenerator中的setConfig函数会合并defaults(默认配置)和用户定义在uno.config.ts中的配置

但是由于一些神秘力量, 它没有了

#### 验证推论

修改uno.config.ts

```typescript
export default defineConfig({
  // 加上separators配置
  separators: [":", "-"],
  presets: [
    presetUno(),
  ]
})
```

![](https://s2.loli.net/2023/06/28/GHeOVqaJLsSZopW.png)
**好了, 他终于可以工作了😭**

***困死了, 虽然解决了问题但还是不明白原因（合并配置的代码有空再看）, 先睡大觉, 有时间我一定提PR🕊️***

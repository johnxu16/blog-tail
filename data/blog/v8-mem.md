---
title: V8内存模型
tags: ['frontend', 'v8']
date: '2023-02-16'
draft: true
summary:
---
# V8内存模型

### Minor GC(Scavenger)

从前，有一个HEAP

里面有两块空间

young generation 和 old generation

创建新对象的时候，对象就被放进了young generation

Scavenger负责处理young generation的垃圾

young generation至少有一半的空间是空余的

大佬说，这叫semi-space design，听懂掌声

不就是标记下还在使用的对象，丢到另一边

删掉这边剩下的，一点都不高级

大佬说，你这就不懂了

丢到另一边的时候，顺便还能重新整理下

内存上连续，减少了内存碎片

最后再将原来对象的引用指向新的内存地址

就大功告成啦！

### 对象是怎么流转的？
对象创建时保存在young generation

在两次GC(这个标记包含major gc吗?)之后进入old generation

### Major GC(Mark-Compact)

那什么是Major GC呢？

Marjor GC从root set(execution stack, global object)进行dps，标记被使用的对象

未标记的对象会被放在free-list里，记录内存地址和区域

free-list还会根据内存大小拆分，为了后续使用能被更快的搜索到

最后，Major GC还会整理内存碎片，通过移动存活的对象到free-list里

### 遇到memory leak怎么办？

1. 使用PM2等检测内存的软件，进行自动重启，保证服务可用

2. 查看监控软件，定位时间，获取snapshot

3. 比对snapshot，定位故障

**常见问题**

为什么我们要有Minor GC和Major GC?

因为短期创建并立刻销毁的对象占多数, 用Minor GC可以减少资源的浪费

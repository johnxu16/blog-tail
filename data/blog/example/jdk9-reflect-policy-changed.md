---
title: jdk9-reflect-policy-changed
date: '2024-03-06'
tags: []
draft: false
summary:
---

jdk9以上使用了新的模块化系统

jdk9以上的JVM默认禁止使用对java内部类的reflect

如果要使用需要添加

```bash
JDK_JAVA_OPTIONS=— add-opens java.base/java.util=ALL-UNNAMED
```

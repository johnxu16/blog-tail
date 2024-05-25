---
title: 包管理软件的神asdf
date: '2023-06-27'
tags: ['tool']
draft: false
summary:
---

你知道如何使用一个支持多个软件的版本管理器吗？

管理软件版本可能是一个复杂且耗时的任务，尤其是当你处理多个跨平台应用程序时。

在当今快节奏的数字环境中，拥有一个支持多个软件包的统一解决方案非常宝贵。想象一下，一个单一的版本管理器可以简化流程，确保您的软件轻松保持最新。
让我们探讨使用能够处理多个软件应用程序的版本管理器的优点和可能性，简化您的工作流程并提高您的软件管理体验。

每种编程语言或框架都有其自己的版本管理器，例如Node.js的NVM，Ruby的RVM和Python的Pyenv。

然而，使用不同的版本管理器来管理不同的软件并不是一个好主意。最好使用一个支持多种软件的版本管理器。

选项A：asdf

asdf是一个命令行工具

`youtube: https://www.youtube.com/embed/RTaqWRj-6Lg`  
**Video: Use asdf to manage versions of Python, NodeJS, GoLang and more! (8 min)**

✅ 易于使用
✅ 轻量级 & 快速
✅ 非侵入性
✅ ~700个注册插件，涵盖大多数用例，包括node，dotnet，dotnet-core

❌ 仅限Linux/Mac/WSL

选项B：nix

nix-shell - 一种使用Nix包管理器和声明性配置文件创建和管理软件项目的孤立、可重复的开发环境的工具。

`youtube: https://www.youtube.com/embed/5Dd7rQPNDT8`  
**Video: How to use Nix on Ubuntu or any Linux Distro (18 min)**

✅ 可重复性 - 相同的软件安装过程产生相同的输出
✅ 声明性配置 - Nix使用声明性配置格式描述软件及其依赖关系
✅ 可扩展性 - 开发人员可以通过插件和自定义构建者扩展其功能

❌ 陡峭的学习曲线
❌ 侵入性
❌ 仅限Linux/Mac/WSL
---
title: vfox你也许值得拥有的开发环境管理器
tags: ['tool']
date: '2025-04-10'
draft: false
summary:
---

## 在windows上管理开发环境

在管理多个不同版本sdk的时候，asdf是一个不错的工具!

在macos和linux上管理nodejs, java, rust等不同语言的开发环境，省去了同时安装nvm，sdkman等多个sdk管理软件的工夫。

但是！作为开发环境同时散布在windows，linux，macos三个平台上的笨蛋开发者，asdf就不太够用了，毕竟它不支持**windows**

一番搜索，发现了vfox这只小狐狸！

### vfox初见

[![vfox][vfox-logo]](https://vfox.dev/zh-hans/)

文档非常完善, 安装使用都非常方便。

得益于插件基于lua开发，在windows上也可以运行。

#### 安装vfox

```sh
winget vfox
```

#### 安装插件

```sh
vfox add nodejs
```

### 安装sdk

```sh
# 直接安装
vfox install nodejs@22.14.0
```

或者...

搜索版本`vfox search nodejs`后再安装

![search][vfox-search]

#### 切换sdk

```sh
vfox use nodejs@22
```

---

### 开发插件

因为平时在使用的vagrant管理本地虚拟机环境，就想用vfox安装vagrant，发现还没有这个插件

🥲也是，lua脚本相比shell脚本还是太小众了，你看看隔壁asdf，插件数量直接起飞

还好开发一个插件也不复杂，手搓一个算了

#### 初始化

vfox提供插件模板[vfox-plugin-template](https://github.com/version-fox/vfox-plugin-template)

创建后，可以看到, 只要支持几个预设的hook就可以使用了

[![vfox-hooks][vfox-hooks]](https://vfox.dev/zh-hans/plugins/create/howto.html#%E9%92%A9%E5%AD%90%E6%A6%82%E8%A7%88)

为了本地开发方便, 我们使用软链接，把本地插件放到vfox的插件目录下

```sh
New-Item -ItemType SymbolicLink -Path "C:\Users\11633\.version-fox\vagrant" -Target "$(PluginDirectoryPath)"
```

查看插件有没有正常显示

```sh
vfox list
```

![vfox-list][vfox-list]

#### 踩坑

查看vagrant发布页面[vagrant-release](https://releases.hashicorp.com/vagrant/), 实现搜索功能还是很简单的

可惜，vagrant在windows和macos下只提供exe和dmg安装包，常规下载binary并添加环境变量的方式就不行了

但是煤油关系, 我们可以用`os.exec`直接执行cmd命令来运行软件包来安装呀🤔

```lua
-- /qn 静默安装
-- /L*V 设置日志
local install_cmd = "sudo msiexec.exe /i INSTALLER /qn /norestart /L*V INSTALL_PATH"

os.exec(install_cmd)
```

然后光速安装失败🥲

##### 定位问题

> TIP
>
> 1. 静默安装失败可以把/qn静默关掉，一边运行图形化安装程序，一边查看安装日志
> 2. 在安装的时候，如果想查看更多参数，也可以用[orca](https://learn.microsoft.com/en-us/windows/win32/msi/orca-exe)工具查看软件包提供的设置参数

查看安装日志发现，首先LicenseAccepted值没有设置为1， 在图形界面下，我们会在对话框里点击接受软件协议许可，那我们就把property加上,

```lua
local property = "LicenseAccepted=1 INSTALLDIR=..."
```

再次尝试安装，还是失败了，发现是权限问题，在图形界面下，安装器会请求管理员权限，跳出弹窗

这个时候有两种方法可以解决权限问题，使用[提权脚本](https://stackoverflow.com/questions/25229460/batch-script-to-install-msi)或者是sudo for windows

提权脚本实在是有点长，就暂时选择了sudo for windows的方案

缺点是比较旧版本的windows就使用不了了

#### 安装sudo for windows

安装指南见[https://learn.microsoft.com/en-us/windows/sudo/](https://learn.microsoft.com/en-us/windows/sudo/)

使用

```sh
sudo notepad.exe
```

![sudo-popup](https://image.assets.bringerxu.xyz/blog/20250417164330.png)  
**可以看到弹出的UAC确认窗口**

#### 在windows上安装脚本

```sh
vfox install vagrant@2.4.3
```

![vfox-installed][vfox-installed]  
**安装成功**

```sh
# 设置版本
vfox use vagrant@2.4.3

# 确认版本已切换
vfox list
# All installed sdk versions
# ├─┬dotnet
# │ └──v8.0.13
# ├─┬java
# │ └──v8.0.342+7
# ├─┬maven
# │ └──v3.9.9
# ├─┬nodejs
# │ ├──v22.14.0
# │ ├──v18.20.8
# │ ├──v16.20.2
# │ └──v14.21.3
# └─┬vagrant
#   └──v2.4.3

vagrant -v
# Vagrant 2.4.3
```

---

#### 最后

vfox作为一个跨平台的管理软件，还是非常优秀的，作为全栈开发使用起来非常方便，暂时还没有发现什么问题。

不过对于非binary的软件要开发插件，还是需要一番折腾😣

##### 可能的优化

- [ ] 开发者体验优化：提供命令本地link插件
- [ ] 用户体验：声明式的配置用于新机器的初始化安装

---

[vfox-logo]: https://vfox.dev/logo.png
[vfox-search]: https://image.assets.bringerxu.xyz/blog/vfox-search.png
[vfox-hooks]: https://image.assets.bringerxu.xyz/blog/20250417162111.png
[vfox-list]: https://image.assets.bringerxu.xyz/blog/20250417162327.png
[vfox-installed]: https://image.assets.bringerxu.xyz/blog/20250417164835.png

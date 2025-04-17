---
title: 在WSL2中使用dwm
date: '2023-05-17'
tags: []
draft: false
summary:
---

昨天本来是一个平静的晚上，直到看到左耳朵耗子老师突然离开的新闻。

我不知道该说些什么，只是觉得很难过，也很无奈。

想想自己的生活，也是一团糟，不知道该怎么办。

不行！做人最重要的是开心，我要开心起来！于是就去B站上试图找乐子...

[![dwm](http://web.image.bringerxu.xyz/blog/dwm.png)](https://www.bilibili.com/video/BV1Ef4y1Z7kA)

哎，这个桌面看起来有点好看啊

在Linux里面使用dwm这么爽吗！我也要用🤩

可是笔者平时用的是WSL2，会不会遇到问题呢？🤔

遇事不决莽一波，先试试看吧！

### 开工

如果想要修改dwm的配置，是需要修改编译文件的，所以为了扩展性，我们先把dwm的源码下载下来。

1. 下载源码

```zsh
git clone https://git.suckless.org/dwm
```

2. 安装编译所需依赖

```zsh
sudo apt install -y build-essential libdev xorg stterm suckless-tools libx11-dev libxinerama-dev libxft-dev
```

3. 编译安装

```zsh
sudo make clean install
```

如果不修改安装路径，dwm默认会安装在`/usr/local/bin`

### 使用

```zsh
dwm
```

输入dwm后，dwm会在terminal的前台运行

等待几秒后🤔，什么也没有发生（不要慌，一切都在我预料之中）

在WSL2里，运行图形化程序，是要用X server的（废物，还要用这个）

所以我们需要在windows也就是宿主机上安装一个X Server，wsl2作为客户端将图形化程序发送到server上，这里我用的是x410

1. 安装x410(windows store)

什么？你问这个程序怎么是付费的？那你可以用[VcXsrv](https://sourceforge.net/projects/vcxsrv/)，原理是一样的

参考[配置x410](https://x410.dev/cookbook/wsl/enable-systemd-in-wsl2-and-have-the-best-ubuntu-gui-desktop-experience)

配置DISPLAY环境变量

```zsh
# 使用zsh，发现.zshrc并不会在login的时候被加载
# 修改/etc/zshenv 可以解决这个问题
echo export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2; exit;}'):0.0 >> /etc/zshenv
```

2. 运行x410，并打开WSL2选项
3. 编写快速启动脚本
   参考[x410 cookbook | command line switches](https://x410.dev/cookbook/command-line-switches)

```cmd
@echo off

REM ### Start X410 in Windowed Apps Mode. If X410 is already running in Desktop Mode,
REM ### it'll be terminated first without any warning message box.

REM ### x410的windowed app模式不能使用，因为dwm本身就是窗口管理器
REM ### start /B x410.exe /wm
start /B x410.exe 0 /desktop

REM ### Start dwm

ubuntu.exe run "zsh --login -c 'nohup dwm > /dev/null 2>&1 & sleep 1'"
```

4. 双击脚本，哇是dwm窗口哎!

你可能会想，这个东西怎么会这么丑，空虚的界面，灰黑色的背景，就好像你的人生一样

左上角1到9的数字就好像兜兜里的钱钱，每当要攒起来的时候，就有一股神秘力量阻止他进位

我知道你很急，但你先别急！定制dwm就好像喝水一样简单🙂，且听下回分解！！！

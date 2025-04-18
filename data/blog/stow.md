---
title: 使用stow管理dotfiles
tags: ['tool']
date: '2025-04-11'
draft: false
summary: 使用GNU Stow简化dotfiles管理，轻松实现配置文件的版本控制和跨设备同步。
---

## 如何高效管理dotfiles

高效管理dotfiles一直是开发者会困扰的问题，git bare或者stow是比较老的解决方案，也有chezmoi之类比较重的工具可以选择

个人用下来git bare相比stow不够方便，chezmoi配置项有点反直觉

stow基于软连接，足够简单

## 什么是GNU Stow？

GNU Stow 是一个轻量级的符号链接管理工具，常用于管理和组织配置文件（dotfiles）。它通过创建符号链接，将配置文件从一个集中存储的目录链接到系统的实际位置，从而简化了配置文件的管理。

## 为什么选择Stow？

1. **简单易用**：只需一个命令即可完成符号链接的创建和管理。
2. **模块化管理**：可以将不同的配置文件分组管理，例如 `vim`、`zsh`、`git` 等。
3. **跨设备同步**：结合 Git 等版本控制工具，可以轻松在多台设备间同步配置文件。

## 安装Stow

在大多数 Linux 发行版和 macOS 上，可以通过包管理器安装 Stow：

### Ubuntu/Debian

```bash
sudo apt install stow
```

### Arch Linux

```bash
sudo pacman -S stow
```

### macOS

```bash
brew install stow
```

### Windows

```pwsh
wsl.exe

stow --adopt -t /mnt/c/Users/11633 $(folderIncludesDotfiles)
```

## 使用Stow管理dotfiles

以下是使用 Stow 管理 dotfiles 的基本步骤：

### 1. 组织你的dotfiles

将所有的配置文件存储在一个集中目录中，例如 `~/dotfiles`。为每个工具创建一个子目录，例如：

```sh
~/dotfiles/
├── windows/
│   └── .vimrc
├── linux/
│   └── .zshrc
├── macos/
│   └── .gitconfig
```

### 2. 创建符号链接

进入 `dotfiles` 目录，然后使用 Stow 创建符号链接。例如：

```bash
cd ~/dotfiles
stow vim
stow zsh
stow git
```

这将会在你的主目录中创建以下符号链接：

```sh
~/.vimrc -> ~/dotfiles/vim/.vimrc
~/.zshrc -> ~/dotfiles/zsh/.zshrc
~/.gitconfig -> ~/dotfiles/git/.gitconfig
```

### 3. 移除符号链接

如果需要移除某个工具的符号链接，可以使用 `stow -D` 命令。例如：

```bash
stow -D vim
```

这将会移除 `~/.vimrc` 的符号链接。

## 高级用法

### 忽略文件

如果某些文件不需要被 Stow 管理，可以在 `.stow-local-ignore` 文件中列出它们。例如：

```sh
# .stow-local-ignore
README.md
```

### 跨平台配置

可以为不同的操作系统创建特定的配置。例如：

```sh
~/dotfiles/
├── vim/
│   ├── .vimrc
│   └── .vimrc_linux
│   └── .vimrc_mac
```

然后在主配置文件中使用条件语句加载特定的配置。

## 总结

GNU Stow 是一个强大而简单的工具，可以极大地简化 dotfiles 的管理。通过模块化的方式组织配置文件，并结合版本控制工具，你可以轻松实现配置文件的备份和跨设备同步。

开始使用 Stow，让你的 dotfiles 管理更高效、更优雅吧！

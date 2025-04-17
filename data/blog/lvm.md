---
title: LVM —— 逻辑卷管理器
date: '2023-06-11'
tags: []
draft: false
summary:
---

# LVM [Introduction From RedHat](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/logical_volume_manager_administration/lvm_definition)

公司电脑用的windows系统，拜visual studio等软件所赐，

时不时就要清理C盘空间，还要担心分配给wsl的虚拟内存会不会不够用。

还不快用无敌的DiskGenius想想办法

然后就进入PE，给C盘加了50G的空间。

虽然解决了问题，可是这真的是一个好的解决方法吗？

在Linux系统中，可以使用LVM来处理动态磁盘分区的问题。

而在Windows中，也有类似的解决方案，那就是动态磁盘(Dynamic Disks)。

在win10和server版本中，叫做Storage Spaces

LVM是Logical Volume Manager的缩写，即逻辑卷管理器。

在了解Windows的解决方案之前，先来看看LVM是怎么工作的。

## 基本概念

使用LVM前，必须了解LVM是怎么抽象磁盘空间的

PE(Physical Extent)  
最小的存储单元，通常是4MB

PV(Physical Volume)
实际挂载的物理卷，和物理磁盘一一对应，可以是硬盘，也可以是SSD

VG(Volume Group)
物理卷的集合，可以理解为一个虚拟的磁盘，可以由多个PV组合而成

LV(Logical Volume)
逻辑卷

当我们创建PV时，存储空间会被自动划分成PE

xxxxxxxxxx netsh int ipv4 set dynamic tcp start=49152 num=16384netsh int ipv6 set dynamic tcp start=49152 num=16384bash

当然，一个VG也可以只有一个PV，一个LV也可以只有一个VG。

逻辑卷(LV)可以像普通磁盘分区一样使用，但是它的大小和位置都是可以动态调整的。

![lvm](http://web.image.bringerxu.xyz/blog/lvm.png)

## 那真的泰裤辣，试试看

正好在之前的PVE里，一台ubuntu18.04的虚拟机需要从20G扩容到40G

### 1. 首先在PVE管理界面扩大虚拟机的磁盘大小

![pve-resize-disk](http://web.image.bringerxu.xyz/blog/pve-resize-disk.png)

### 2. 修改虚拟机配置

```bash
df -h
# Filesystem                         Size  Used Avail Use% Mounted on
# udev                               1.9G     0  1.9G   0% /dev
# tmpfs                              395M  984K  394M   1% /run
# /dev/mapper/ubuntu--vg-ubuntu--lv   19G  8.9G  8.8G  51% /
```

```bash
fdisk -l
# GPT PMBR size mismatch (41943039 != 83886079) will be corrected by w(rite).
# Disk /dev/sda: 40 GiB, 42949672960 bytes, 83886080 sectors
# Units: sectors of 1 * 512 = 512 bytes
# Sector size (logical/physical): 512 bytes / 512 bytes
# I/O size (minimum/optimal): 512 bytes / 512 bytes
# Disklabel type: gpt
# Disk identifier: 1C599DDB-2617-4775-B6FA-1171B9271083

# Device       Start      End  Sectors Size Type
# /dev/sda1     2048     4095     2048   1M BIOS boot
# /dev/sda2     4096  2101247  2097152   1G Linux filesystem
# /dev/sda3  2101248 41940991 39839744  19G Linux filesystem
```

#### 使用fdisk和df查看后，发现磁盘大小已经变成了40G，但是分区大小还是19G

#### 使用parted修正GPT PMBR size

```bash
parted /dev/sda
# GNU Parted 3.2
# Using /dev/sda
# Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted) print
# Warning: Not all of the space available to /dev/sda appears to be used, you can fix the GPT
# to use all of the space (an extra 41943040 blocks) or continue with the current setting?
Fix/Ignore? Fix
# Model: QEMU QEMU HARDDISK (scsi)
# Disk /dev/sda: 42.9GB
# Sector size (logical/physical): 512B/512B
# Partition Table: gpt
# Disk Flags:

# Number  Start   End     Size    File system  Name  Flags
#  1      1049kB  2097kB  1049kB                     bios_grub
#  2      2097kB  1076MB  1074MB  ext4
#  3      1076MB  21.5GB  20.4GB

```

#### 修复了GPT PMBR size, 就可以使用fdisk扩大分区了

![fdisk](http://web.image.bringerxu.xyz/blog/fdisk.png)

---

> LVM 相关修改

#### **更新PV**

```bash
pvs
  # PV         VG        Fmt  Attr PSize   PFree
  # /dev/sda3  ubuntu-vg lvm2 a--  <19.00g    0

pvresize /dev/sda3
  # Physical volume "/dev/sda3" changed
  # 1 physical volume(s) resized / 0 physical volume(s) not resized

pvs
  # PV         VG        Fmt  Attr PSize   PFree
  # /dev/sda3  ubuntu-vg lvm2 a--  <39.00g 20.00g
```

#### **查看VG大小**

```bash
vgs
  # VG        #PV #LV #SN Attr   VSize   VFree
  # ubuntu-vg   1   1   0 wz--n- <39.00g 20.00g
```

#### **扩大LV**

```bash
lvs
  # LV        VG        Attr       LSize   Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  # ubuntu-lv ubuntu-vg -wi-ao---- <19.00g

lvresize -L+20g /dev/ubuntu-vg/ubuntu-lv
  # Size of logical volume ubuntu-vg/ubuntu-lv changed from <19.00 GiB (4863 extents) to <39.00 GiB (9983 extents).
  # Logical volume ubuntu-vg/ubuntu-lv successfully resized.

lvs
  # LV        VG        Attr       LSize   Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  # ubuntu-lv ubuntu-vg -wi-ao---- <39.00g
```

#### **_同步到文件系统_**

```bash
df -h
# Filesystem                         Size  Used Avail Use% Mounted on
# udev                               1.9G     0  1.9G   0% /dev
# tmpfs                              395M 1016K  394M   1% /run
# /dev/mapper/ubuntu--vg-ubuntu--lv   19G  8.8G  8.9G  50% /

# 文件系统挂载的lv大小不会自动同步
resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv
# resize2fs 1.44.1 (24-Mar-2018)
# Filesystem at /dev/mapper/ubuntu--vg-ubuntu--lv is mounted on /; on-line resizing required
# old_desc_blocks = 3, new_desc_blocks = 5
# The filesystem on /dev/mapper/ubuntu--vg-ubuntu--lv is now 10222592 (4k) blocks long.

df -h
# Filesystem                         Size  Used Avail Use% Mounted on
# udev                               1.9G     0  1.9G   0% /dev
# tmpfs                              395M 1016K  394M   1% /run
# /dev/mapper/ubuntu--vg-ubuntu--lv   39G  8.8G   28G  24% /
```

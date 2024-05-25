---
title: net-reset
date: '2024-03-06'
tags: []
draft: false
summary:
---

# 问题
docker desktop在windows下运行经常会遇到端口被占用的情况

### 原因
这里有三种可能
1. windows默认有一个动态TCP端口范围(TCP dynamic port range)， 保留给其他服务使用
一般来说是49152 ~ 65536

2. 其它应用占用的端口段, 例如hyper-v

3. windows自动更新有些时候会把范围重置为1024 ~ 65536
md, 真是坑。重启

### 如何解决

先查看TCP dynamic port range

```bash
netsh int ipv4 show dynamic tcp

# Protocol tcp Dynamic Port Range
# -------------------------------
# Start Port      : 1024
# Number of Ports : 13977
```
看到Start Port确实是1024, 我们重新设置一下动态TCP端口范围

再查看再动态范围中，看我们想使用的端口是不是已经被占用了
```bash
netsh int ipv4 show excludedportrange protocol=tcp

Start Port    End Port
----------    ----------
3306          3306
.             .
.             .
.             .
```

重设动态tcp范围
```bash
netsh int ipv4 set dynamic tcp start=49152 num=16384
netsh int ipv6 set dynamic tcp start=49152 num=16384
```

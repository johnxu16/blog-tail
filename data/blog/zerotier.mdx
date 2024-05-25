---
title: ZEROTIER DNS
date: '2022-12-08'
tags: ['network', 'maintenance']
draft: false
summary:
---

不会还有人没用过ZEROTIER吧！没用过的快去用，从此你的所有设备都在一个局域网内啦

而且不像openvpn组网，实现A -> B，B -> A互联需要部署两组server - client

ZEROTIER使用P2P，大家都是节点共享同一个网络，可以快速的搭建分布式网络

但是使用ZEROTIER后，由于使用的仍然是当前环境下的dns，就无法使用域名访问本地服务了

为了用的更爽，必须解决这个问题！！！

在github随便翻了翻, 看我发现了什么?!

### [zerotier-dns](https://github.com/mje-nz/zerotier-dns)

#### 准备
1. 获得zerotier [API Access Token](https://my.zerotier.com/account)
2. 路由器或者设备自身安装了docker
3. 配置文件 (填写api, interface)
4. 修改interface名称为zt0（optional）
vim /var/lib/zerotier-one/devicemap
网络ID=zt0

#### 部署
docker run --rm -d \
  --name zerodns \
  -p 533:533/udp \
  --volume $(pwd)/zerotier-dns.yml:/app/zerotier-dns.yml \
  mjenz/zerotier-dns

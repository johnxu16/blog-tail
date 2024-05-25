---
title: Docker network
tags: ['network', 'docker']
date: '2022-10-28'
draft: false
summary:
---

在docker中，自带用6中不同的网络，了解下他们的异同和使用场景。

```bash
sysctl net.ipv4.conf.all.forwarding=1

sudo iptables -P FORWARD ACCEPT
```
# daemon.json

```json
{
  "bip": "192.168.1.1/24",
  "fixed-cidr": "192.168.1.0/25",
  "fixed-cidr-v6": "2001:db8::/64",
  "mtu": 1500,
  "default-gateway": "192.168.1.254",
  "default-gateway-v6": "2001:db8:abcd::89",
  "dns": ["10.20.1.2","10.20.1.3"]
}
```


### 桥接网络 Bridge network

桥接网络在网络领域中，一般指负责链路层的网络, 功能类似我们日常使用的2层交换机

桥接网络也可以使用软件实现

docker启动时会自动创建一个默认的桥接网络，运行容器时不指定网络，会默认使用该桥接网络, 用户也可以自定义桥接网络

默认的桥接网络在功能上有缺失:

- 不能通过容器名访问在同一个桥接网络中的容器
- 隔离性差，默认都在同一个网络中
- 容器连接或离开默认网络时，需要中止容器
- 配置太全局 MTU iptables rules, 修改默认网络配置需要重启docker

#### 发生了什么？
```bash
# 创建网络
docker create network test

```

创建veth pair

```bash
# 创建容器
docker create --name test-nginx --network test --publish 8080:80 nginx:latest

# 链接容器到网络
docker network connect test test-nginx

# 断开链接到容器
docker network disconnect test test-nginx
```

ip link add p1-name type veth peer name p2-name

**network namespaces**



















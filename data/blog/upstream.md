---
title: nginx转发请求到ddns的服务器
tags: ['nginx', 'backend']
date: 2022-12-14 14:20:14
draft: false
summary:
---

我有一台云服务器，我有一个家用集群

哈，我有云服务器家用集群啦!

为了 443 和 80 端口，冲！！！

---

### 准备

1. 家用集群使用 ddns 脚本绑定了域名和动态公网 ip
  a. 域名：hello.example.com:8443
  b. 子域名的服务若干：a.example.com:8443, b.example.com:8443
2. 备案有固定 ip 的云服务器一台（服务甲）
  a. 域名：*.example.com

### 部署

兴高采烈并且年轻的我，写下了如下 nginx 配置部署到了服务甲上！

```nginx
stream {
  server {
    listen 443;
    proxy_pass hello.example.com:8443;
  }
}
```

在几周内工作的挺好的，不愧是我

然后它炸了，nginx stream 时遇到域名，只会解析一次！

这个域名缓存除非 nginx -s reload，是会被一直使用的！

P.S. 这是个上古问题，nginx enterprise 有模块动态刷新 dns，所以他并不是个 bug，而是 feature（牛哇）！

还好我们可以用变量来 hack nginx!

修改 nginx 配置如下

```nginx
stream {
  resolver 223.5.5.5 valid=1s;

  map "" $server_us {
    default hello.example.com:8443;
  }

  # server {
  #   listen 80;
  #   proxy_pass hello.example.com:8000;
  # }
  server {
    listen 443;
    proxy_pass $server_us;
  }
}
```

干完了这些就可以回家睡大觉了

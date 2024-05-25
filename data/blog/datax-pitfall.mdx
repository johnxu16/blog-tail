---
title: datax-pitfall
date: '2024-02-19'
tags: ['datax', 'maven']
draft: false
summary:
---

在datax二次开发中，发现使用3.9版本的maven会无法打包

执行打包命令

```shell
mvn clean package -DskipTests assembly:assembly
```

会报maven-assembly-plugin插件没有assembly:assembly命令，只有assembly:single

使用assembly:single后会报MojoNotFoundException

根目录/pom.xml插件配置如下
```xml
            <plugin>
                <artifactId>maven-assembly-plugin</artifactId>
                <configuration>
                    <finalName>datax</finalName>
                    <descriptors>
                        <descriptor>package.xml</descriptor>
                    </descriptors>
                </configuration>
                <executions>
                    <execution>
                        <id>make-assembly</id>
                        <phase>package</phase>
                    </execution>
                </executions>
            </plugin>
```

添加-e -X打印错误和debug日志
```shell
mvn clean package -DskipTests assembly:assembly -e -X
```

发现是读取的package.xml中的id是空的, executions里的id没有覆盖到package.xml中

**package.xml**
```xml
<assembly
        xmlns="http://maven.apache.org/plugins/maven-assembly-plugin/assembly/1.1.0"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://maven.apache.org/plugins/maven-assembly-plugin/assembly/1.1.0 http://maven.apache.org/xsd/assembly-1.1.0.xsd">
    <id></id>
    <formats>
        <format>tar.gz</format>
        <format>dir</format>
    </formats>
    <includeBaseDirectory>false</includeBaseDirectory>
```

切换为maven3.8.8, 成功编译

=== 探究原因 ===

1. maven-assembly-plugin:2.2-beta-5 有assembly:assembly 命令
2. maven插件版本依赖导致升级到maven3.9时，maven-assembly-plugin自动升级到3.6.0

Ref.
- https://maven.apache.org/guides/plugin/guide-java-plugin-development.html
- https://stackoverflow.com/questions/21128372/how-does-maven-resolve-plugin-versions
> Every version of Maven binaries has certain versions of plugin versions hardcoded

---
title: Vim Text object
tags: ['DevEx']
date: '2022-10-27'
draft: false
summary:
---

### Text objects!!!

在普通的编辑器中，我们通常以字符为单位编辑文本

在vim中预先定义了word，sentence, paragraph等text objects

可以帮助我们快速描述需要修改的区域，进行后续操作

#### 例子1
```javascript
const text = "Who are bMISTYPExd you?"

const text = "Who are you?"
```

光标在b一般会怎么删除呢？

dw

如果我们的光标不在b，在单词中间呢？

1. bdw
> 先使用b退回到单词开头，再删除单词
2. daw
> 使用aw选中单词，直接删除

这里的aw就是text object 代表around word

iw代表inner word, 选中的就是不包括空格的单词了

大部分情况下，使用daw的心智负担更小, 因为你不用再考虑光标在单词的哪个位置

---

可能现在你感觉text objects还没太大用, 再来看个例子!

#### 例子2
```javascript
const longText = "This is super long text ahhhhh!"

const longText = "short"
```
假如光标在第一个"上怎么快速的把longText替换成"short"呢?
1. dt"Ashort"
> 删除到", append在最后，输入short"

2. lct"short
> 右移，change到"的内容为short

3. ci"short
> change **双引号内的内容（text object）**为short

---

下面列出常用的text objects
- at it | 标签
- a} i}
- a] i]
- a) i)
- i,w | camelCase
- aa ia | argument
- ai ii | indentation

**通过vim script也可以定制自己想要的text objects, 有机会再介绍吧！**

---
title: VMware安装cent OS 7.4和Windows server 2012 R2
tags:
  - 虚拟机
  - linux
  - Windows Server
categories:
  - 虚拟机
type: technology
mathjax: false
hide: false
date: 2021-09-11 20:48:42
description: 利用VMware Workstation Pro 16 安装 Cent OS 7.4 和 Windows Server 2012 R2
password:
message:
---

# VMware安装

## 下载

进入官网的 [VMware Workstation Pro 页面](https://www.vmware.com/cn/products/workstation-pro.html)，浏览功能特性、应用场景、系统要求等。下滑页面点击 `试用 Workstation 16 Pro` 下方的下载链接，跳转至[下载页面](https://www.vmware.com/products/workstation-pro/workstation-pro-evaluation.html)。

![](https://img.seriouszyx.com/20210618083520.png)

在下载页面中下滑，根据操作系统选择合适的产品，在这里以 Win­dows10 系统为例，选择 `Workstation 16 Pro for Windows`，开始下载安装文件。

![](https://img.seriouszyx.com/20210618083552.png#vwid=1752&vhei=881)

## 安装

打开下载好的 `.exe` 文件， 即可开始安装。

![](https://img.seriouszyx.com/20210618083715.png)

安装位置默认在 C 盘下，在这里我选择安装在 D 盘，安装路径尽量不要有中文。可勾选 `增强型键盘驱动程序` ，此功能可更好地处理国际键盘和带有额外按键的键盘。

![](https://img.seriouszyx.com/20210618083715.png)

一直点击 `下一步` 等待软件安装完成。

![](https://img.seriouszyx.com/20210618083742.png)

安装成功后点击 `许可证` 输入密钥激活软件。

![](https://img.seriouszyx.com/20210618083825.png)

下面是一些网上搜集的可用密钥，复制到文本框中点击 `输入`。

-   VMware Work­sta­tion Pro 16
    -   ZF3R0-FHED2-M80TY-8QYGC-NPKYF
-   VMware Work­sta­tion Pro 15
    -   FG78K-0UZ15-085TQ-TZQXV-XV0CD
    -   ZA11U-DVY97-M81LP-4MNEZ-X3AW0
    -   YU102-44D86-48D2Z-Z4Q5C-MFAWD

![](https://img.seriouszyx.com/20210618083846.png)

安装后可能要求重启系统，重启后进入软件。依次点击导航栏中的 `帮助 -> 关于 VMware Workstation` ，查看许可证信息的状态，如下图所示即为激活成功。

![](https://img.seriouszyx.com/20210618083909.png)

未完待续……

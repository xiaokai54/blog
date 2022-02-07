---
title: WLAN基本概念
tags:
  - WLAN概述
  - WLAN基础
categories:
  - 数据通信
type: technology
hide: false
mathjax: true
date: 2021-09-21 11:44:08
description: wlan基本概念
password:
message:
---

# BSS和BSA

-   组成WLAN的基本单元是基本服务集（BSS），BSS包含一个固定的AP和多个终端。其中AP作为一种基础设施，为终端提供无线的通信服务

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/bss-bsa.png)

-   AP是BSS的中心，位置相对固定，AP在哪里，BSS就在哪里；而终端则分布在AP周围，位置相对于AP是不固定的，可以自由地移动，靠近或原理AP。AP的覆盖范围成为基本服务区（BSA），终端可以自由进出BSA，只有进入BSA的终端才可以和AP通信

# SSID和BSSID

-   终端要发现和找到AP，就需要AP有一个身份标识通告给终端，这个身份标识就是BSSID

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/ssid-bssid.png)

-   如果在一个空间内部署了多个BSS，终端就会发现多个BSSID，只要选择加入的BSSID就可以了。终端并不会自动选择，而是需要用户做出选择，如果用户在终端上看到的是一串的"MAC地址"，就不知道应该选哪一个。因此，需要一个可以由设置字符串作为AP的名字，让AP的身份个别更容易被白女士，这就是SSID

>   SSID是一个无线网络的名称
>
>   BSSID是一个AP的身份标识

# VAP

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/vap.png)

-   AP通常支持创建出多个虚拟AP（VAP），每个VAP对应1个BSS。这样只需要安放一个AP，就可以提供多个BSS，再为这些BSS设置不同的SSID，用户就可以看到多个WLAN共存，也成为多SSID

# DS

-   BSS解决了1个区域内多个终端无线通信的问题，但终端的通信对象往往不在本区域，而是在分散在各个地方，甚至在地球的另一端，这就需要AP可以连接到一个更大的网络，把不同区域的BSS连接起来，让终端可以通信。这个网络就是AP的上行网络，称为BSS的分布式系统(DS)

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/ds.png)

# ESS

-   BSS的有效覆盖半径一般是10m~15m, 为了覆盖更大面积，可以通过多个BSS实现扩展。
-   同时，为了消除用户对BSS变化的感知，可以让每个BSS都使用相同的SSID，这样不管用户移动到哪里，可以认为使用的都是同一个WLAN。
-   这种扩展BSS范围的方式称为扩展服务集(ESS)，它以BSS为单位自由组合，让WLAN部署变得极为灵活。
-   各BSS相同的SSID成了ESS的身份标识，叫作扩展服务集标识(ESSID) ，用于对终端通告一个连续的WLAN。

# WLAN基本概念

| 概念  | 全称                  | 描述                                                         |
| ----- | --------------------- | ------------------------------------------------------------ |
| BSS   | 基本服务及BSS         | 无线网络的基本服务单元，通常由一个AP和若干无线终端组成       |
| ESS   | 扩展服务及ES          | 由多个使用相同SSID的BSS组成，解决BSS覆盖范围有限的问题       |
| SSID  | 服务集标识符SSID      | 用来区分不同的无线网络                                       |
| ESSID | 扩展服务集标识符ESSID | 一个或一组无线网络的标识，和SSID是相同的                     |
| BSSID | 基本服务集标识符BSSID | 在链路层上用来区分同一个AP上的不同VAP，也可以用来区分同一个ESS中的BSS |
| VAP   | 虚拟接入点VAP         | AP设备上虚拟出来的业务功能实体。用户可以在一个AP上创建不同的VAP来为不同的用户群体提供无线接入服务 |


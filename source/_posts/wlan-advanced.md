---
title: WLAN关键技术
tags:
  - WLAN概述
  - WLAN基础
categories:
  - 数据通信
mathjax: true
type: technology
hide: false
date: 2021-09-21 10:56:56
description: WLAN关键技术
password:
message:
---

# IEEE 802与TCP/IP对等模型

-   WLAN是一种基于IEEE802.11标准的无线局域网技术'
-   802.11标准聚焦在TCP/IP对等模型的上下两层：
    -   数据链路层
        -   主要负责信道接入、寻址、数据帧校验、错误检测、安全机制等内容
    -   物理层
        -   主要负责在空口（空中接口）中传输比特流，例如规定所使用的频段等

<table style="text-align: center;">
    <tr>
        <td rowspan="2">数据链路层</td>
        <td>LLC子层</td>
        <td rowspan="3">802<br>Overview<br>and<br>Architecture</td>
        <td rowspan="3">802.1<br>Management</td>
        <td colspan="7">802.2 Logicl Link control(LLC)</td>
    </tr>
    <tr>
        <td>MAC子层</td>
        <td>802.3<br>MAC</td>
        <td>802.5<br>MAC</td>
        <td colspan="5">802.11 MAC</td>
    </tr>
    <tr>
        <td colspan="2">物理层</td>
        <td>802.3<br>PHY</td>
        <td>802.5<br>PHY</td>
        <td>802.11<br>FHSS<br>PHY</td>
        <td>802.11<br>DSSS<br>PHY</td>
        <td>802.11a<br>OFDM<br>PHY</td>
        <td>802.11b<br>HR/DSSS<br>PHY</td>
        <td>802.11g<br>ERP<br>PHY</td>
    </tr>
</table>



# WLAN关键技术概览

**物理层**

-   OFDM正交频分复用
-   OFDMA正交频分多址
-   MIMO

**MAC层**

-   CSMA/CA
-   RTS/CTS
-   帧间间隔
-   信道绑定
-   帧聚合技术
-   确认块技术

# 802.11物理层技术

-   802.11所采用的无线电物理层使用了三种不同的技术：
    -   ~~跳频（FH或FHSS）~~
    -   ~~直接序列（DS或DSSS）~~
    -   正交频分复用（OFDM）

## OFDM

-   OFDM是一种特殊的多载波调制技术
-   <font color=orange>当一个子载波到达波峰波谷的时候，另一子载波幅度为0，即两个子载波正交无干扰</font>

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/OFDM.png)

-   OFDM之所以能够使用相互重叠的子载波，是因为定义了副载波，因此可以轻易区分彼此。

**OFDM调制方式**

-   BPSK：二进制相移键控
-   QPSK：正交相移键控
-   **<font color=orange>QAM：正交幅度调制</font>**

**QAM同时利用了载波的振幅和相位来传递信息**

| ![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/256-qam.png) | ![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/1024-qam.png) |
| ------------------------------------------------------------ | ------------------------------------------------------------ |

>   1024QAM：相比于256QAM，每条空间流速率提升25%

## OFDMA

-   在Wi-Fi6中的新技术
-   OFDMA正交频分多址技术

**RU**

-   资源单位
-   802.11ax将现有的20 MHz、 40 MHz、80 MHz以及160 MHz带宽划分成若干个不同的资源单元（RU）
-   一共定义了7种RU类型，分别是26-tone RU、52- tone RU、106-tone RU、242-tone RU、484-tone RU、996-tone RU和2x 996-tone RU，一个用户可以同时使用多个RU来传输数据，比如以80MHz的频宽为例，最多可以分成37个资源单元，同时供37个用户并发



>   wifi5在传输的时候，用户是根据不同时间区分出来的，每个时间段用户完整占据子载波，发送完整的数据包
>
>   wifi6一个用户可以使用多个RU来传输数据

-   OFDMA不必排队等待、相互竞争，提升了效率，降低了排队等待时延
-   OFDMA是通过将整个信道资源划分成多个子载波(也可称为子信道)，子载波又按不同RU（Resource Unit）类型被分成若干组，每个用户可以占用一-组或多组RU以满足不同带宽需求的业务。

不同信道带宽下最大的RU数

|       RU Type       |    CBW20     |    CBW40     |    CBW80     | CBW160 and CBW80+80 |
| :-----------------: | :----------: | :----------: | :----------: | :-----------------: |
|  26-subcarrier RU   |      9       |      18      |      37      |         74          |
|  52-subcarrier RU   |      4       |      8       |      16      |         32          |
|  106-subcarrier RU  |      2       |      4       |      8       |         16          |
|  242-subcarrier RU  | 1-SU/MU-MINO |      2       |      4       |          8          |
|  484-subcarrier RU  |     N/A      | 1-SU/MU-MINO |      2       |          4          |
|  996-subcarrier RU  |     N/A      |     N/A      | 1-SU/MU-MINO |          2          |
| 2*996-subcarrier RU |     N/A      |     N/A      |     N/A      |    1-SU/MU-MINO     |

# 802.11MAC层

-   WLAN的信道同时只能有一个站点发送数据， 所以需要一个信道的分配机制， 协调WLAN的各站点在什么时间发送和接收数据。
    802.11在由各个站点共用，MAC 层提出了两种协调方式:
    -   分布式协调功能（Distributed Coordination Function, DCF）：使用载波侦听多址访问/冲突避免（Carrier Sense Multiple
        Access with Collision Avoidance, CSMA/CA）机制，每个站点通过竞争信道来获取数据的发送权；
        -   用之前先检测信道是否为空，如果为空申请使用，如果不为空不能使用
    -   点协调功能（Point Coordination Function，PCF）：使用集中控制的接入算法，用类似轮询的方法把数据的发送权轮流交给各
        站点，从而避免碰撞冲突。

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/csma-ca.png)

## CSMA/CA

-   CS：载波监听，在发送数据之前进行侦听，以确保线路空闲，减少冲突的机会
-   MA：多址访问，每个站点发送的数据，可以同时被多个站点接收
-   CA：冲突避免，是碰撞的意思，或者说，协议的设计是要尽量减少碰撞发生的概率

## RTC/CTS

-   请求发送/允许发送
-   RTS/CTS是被802.11无线网络协议采用的一种用来减少节点问题所造成的冲突的机制
    -   RTS帧的作用：预约链路使用权；其他收到该RTS的STA保持沉默
    -   CTS帧的作用：用于AP答复RTS帧；其他收到该CTS的STA保持沉默（broadcast）
-   RTS/CTS的核心思想就是：允许发送端预留通道，通过小的预留包（RTS/CTS）来避免后续较大数据帧的碰撞

## 帧间间隔

**帧间间隔（IFS）**

-   为了避免碰撞，802.11规定所有的站在完成发送后，必须在等待很短的时间（继续侦听）才能发送下一帧。这段时间通称为IFS
-   帧间间隔长度决定欲发送的帧的类型。高优先级帧需要等待的时间较短，因此可优先获得发送权，而低优先级帧必须等待较长的时间
-   若低优先级帧还没来得及发送而其他站的高优先级帧已经发送到媒体，则媒体为忙态，因而低优先级帧就只能再推迟发送了，这样就减少了发生碰撞的机会

**SIFS**（短帧间间隔）：等待时间段，16us（802.11ax），优先级高

-   隔开始于一次对话的各种帧。在这段时间内，一个站应当能够从发送方式切换到接收方式。使用SIFS的帧优先级最高，用于需要立即响应的服务，例如：ACK帧，CTS帧和控制帧

**DIFS**（分布协调功能帧间间隔）：等待时间长，优先级低

-   在DCF方式中用来发送数据帧和管理帧
-   DIFS是竞争式服务中最短的媒体闲置时间。如果媒介闲置时间长于DIFS，则工作站可以立即对媒体进行访问

# CSMA/CA协议的关键技术

-   在802.11标准中，规定了物理层的空中接口进行物理层的载波监听。当STA发送它的第一个MAC帧时，若检测到信道空闲，则在等待一段时间DIFS后就开始发送第一个帧

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/csma-ca%E5%85%B3%E9%94%AE%E6%8A%80%E6%9C%AF.png)

-   当一个STA检测到正在信道中传送的MAC帧首部的“持续时间”字段时，就调整自己的网络分配向量NAV。
-   NAV指出了必须经过多长时间才能完成数据帧的这次传输，才能使信道转入空闲状态

## 802.11的随机退避机制

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/802.11%E9%9A%8F%E6%9C%BA%E9%80%80%E9%81%BF%E6%9C%BA%E5%88%B6.png)

-   802.11标准规定，退避时间必须是整数倍的时隙时间，第i次退避就在2<sup>2+i</sup>个时隙中随机的选择一个，i < 6，最短退避时间为退避窗口

## RTS/CTS-隐藏节点

-   隐藏节点是指在AP的覆盖范围内，但是在某个STA的覆盖范围内的其他STA

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/rts-cts-%E9%9A%90%E8%97%8F%E8%8A%82%E7%82%B9.png)

>   由于距离太远而导致一个站点无法检测到介质竞争对手的存在，上图中STA1和STA2由于距离过远无法检测到彼此的存在

**<font coloR=red>STA1和STA2互为隐藏节点</font>**

1.   STA1发送RTS来预约对信道的访问；

2.   AP收到RTS后，广播一个CTS帧作为回应；

3.   STA1收到AP发送的CTS，准备开始传输数据

     STA2收到AP发送的CTS，被告知当前信道繁忙，STA2保持静默，不能发送数据

## RTS/CTS-暴露节点

-   暴露节点是指在STA的覆盖范围内而在AP覆盖范围之外的其它STA

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/rts-cts-%E6%9A%B4%E9%9C%B2%E8%8A%82%E7%82%B9.png)

**<font coloR=red>STA1和STA2互为暴露节点</font>**

1.   广播发送RTS来预约对信道的访问；
2.   AP收到RTS后，广播一个CTS帧作为回应；
3.   STA2收到STA1发送的RTS，但没有收到AP1发送的CTS；
4.   STA2广播发送RTS来预约对信道的访问

## 2.4GHz信道绑定

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/2.4%E4%BF%A1%E9%81%93%E7%BB%91%E5%AE%9A.png)

-   信道捆绑是指将相邻的两个不重叠20MHz信道绑定成40MHz，使传输速率成倍提高，例如信道1和信道5绑定，信道9和信道13绑定
-   在实际工作中，一个为主带宽，一个为次带宽，主信道发送<font color=red>beacon报文和部分数据报文</font>，辅信道发送其他报文

>   2.4GHz频段最大只能实现40MHz的信道捆绑频宽

## 5GHz信道绑定

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/5%E4%BF%A1%E9%81%93%E7%BB%91%E5%AE%9A.png)

-   40MHz信道是将两个相邻的20MHz信道捆绑在一起形成的。其中一个是主信道，另一个是辅信道
    -   例如当前信道是149，配成40 M频宽需要叠加另外一个信道,就是149+ 153两个信道组成的40MHz频宽，149plus表示40MHz信道是由中心频率149所在的20 MHz信道，加上中心频率153所在的20 MHz信道捆绑结合
-   80 MHz信道是将两个相邻的40 MHz信道捆绑在一起形成的， 160 MHz信道是将两个相邻的80 MHz信道捆绑在一起形成的。
-   管理报文和控制报文只能在主信道发送，只有当主信道空闲时，整个信道才是空闲状态。

>若捆绑两个相邻的20MHz信道时，辅助20MHz带 宽的中心频率低于主信道的中心频率，则为plus， 反之则为minus

# MIMO技术

## SISO

-   单入单出

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/siso.png)

-   发射天线和接收天线之间的路径是唯一的，传输的是一份信号，我们把一份信号定义为1条空间流

## MISO

-   多入单出

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/miso.png)

-   发射天线和接收天线之间又两天路径，但接受天线只有一个，这就导致发射天线只能发送相同的数据，传输的还是只有一份信号，和SIMO效果相似

## SIMO

-   单入多出

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/simo.png)

-   发射天线和接收天线之间有两条路径，但发送数据还是从同一个发射天线发出的，传输的还是一份信号，可靠性提升了一倍

## MIMO

-   多入多出

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/mimo.png)

-   发射天线和接收天线之间有四条路经，可以同时传输两份信号，效率翻倍

## MU-MIMO

>WLAN采用的CSMA-CA机制只能使1个空口信道同时被1个STA占用，其他STA无法和AP通信。而开启了MU-MIMO功能之后，支持MU-MIMO的多个STA可以组成-一个MU Group，同一个MUGroup内的多个STA可以同时接收同一空口信道的下行数据，从而提高了空口信道的利用效率，提升系统整体下行吞吐量。

-   多用户—多入多出
-   一个AP同时服务于多个STA，AP充利用天线新的空域资源与多个STA同时进行通信

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/mu-mimo-off.png)

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/mu-mimo-on.png)

-   在802.11ac中只能做到下行，在802.11ax中可以上下行并行使用

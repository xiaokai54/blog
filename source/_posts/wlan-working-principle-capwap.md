---
title: WLAN工作原理之CAPWAP隧道
tags:
  - WLAN概述
  - WLAN基础
categories:
  - 数据通信
type: technology
hide: false
mathjax: false
date: 2021-09-22 08:53:52
description: WLAN工作原理之CAPWAP隧道及CAPWAP隧道建立过程
password:
message:
---

# CAPWAP隧道

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/b-capwap.png)

>   传统FAT AP组网难以满足需求

-   企业级用户部署AP的数量庞大，对集中运维管控、安全性提出了更高的要求。
-   传统FAT AP组网已经难于满足需求:
    -   自治管理，安全无法保证；
    -   实现不了精细化的用户管控；
    -   大批量部署难度高，只适合SOHO级小规模组网。

>   解决方案

-   FIT AP+AC组网架构，适合中大规模组网场景，且可以实现：
    -   集中可视化管控，降低运维成本
    -   对用户实现精细化策略管理
    -   支持认证计费场景，不同层面保证企业数据安全
    -   增值业务能力：可扩展更多丰富业务
-   在此应用背景下，<font color=red>CAPWAP协议</font>—<font color=red>C</font>ontrol <font color=red>a</font>nd <font color=red>P</font>rovisioning of <font color=red>W</font>ireless <font color=red>A</font>ccess <font color=red>P</font>oints,用于AC与AP通信的协议规范也应运而生。

## CAPWAP起源

| 协议名称 | LWAPP                                                        | SLAPP                                                        | CTP                                                          | WiCoP                                                        |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 标准     | RFC5412                                                      | RFC5413                                                      | draft-singh-capwap-ctp                                       | RFC5414                                                      |
| 协议全程 | Light Weight Access Point Protocol                           | Secure Light Access Point Protocol                           | CAPWAP Tunneling Protocol                                    | Wireless LAN Control Protocol                                |
| 提出厂家 | Cisco - AirSpace                                             | Aruba                                                        | Siemens - Chantry                                            | Panasonic                                                    |
| 协议特点 | 全面的描述了AC发现、安全和系统管理方法，支持本地MAC和分离MAC机制。两者连接采用2层或3层连接，2层连接使用以太网帧传输，3层连接使用UDP传输LWAPP报文。 | 支持桥接和隧道两种本地MAC机制。支持直连、2层和3层三种连接方式。使用成熟的技术标准来建立通信隧道，数据信道使用GRE技术。 | 利用扩展的SNMP对WTP进行配置和管理。CTP的控制消息着重于STA连接状态、WTP配置和状态几方面。 | 定义了包括无线终端-AC性能协商功能在内的AC发现机制，定义了QoS参数。 |
| 加密情况 | 信令- AES-CCM<br/>数据-没有加密                              | 信令- DTLS<br/>数据- DTLS                                    | 建立了AP与无线终端互相认证及一套基于AES-CCM的加密规则，但是并不完善。 | 协议建议使用IPsec和EAP安全标准，却并未详细说明实现方法。     |

## CAPWAP背景

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/bc-capwap.png)

## CAPWAP协议

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/capwap.png)

>   什么是CAPWAP隧道（控制隧道、数据隧道）

-   **CAPWAP（无线接入点控制和配置协议）**：该协议定义了如何对AP进行管理、业务配置，即AC通过CAPWAP隧道来时先对AP的集中管理和控制

>   CAPWAP隧道的功能

-   AP对AC的自动发现
-   AP与AC间的状态维护
-   AC通过CAPWAP隧道对AP进行管理、业务配置下发
-   当采用隧道转发模式时，AP将STA发出的数据通过CAPWAP隧道实现与AC之间的交互

## CAPWAP报文

| 报文类型 | 功能             | UDP端口 | 加密         |
| -------- | ---------------- | ------- | ------------ |
| 控制报文 | 管理AP           | 5246    | 大部分是密文 |
| 数据报文 | 转发用户业务数据 | 5247    | 大部分时明文 |

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/capwap%E6%8A%A5%E6%96%87.png)

# CAPWAP隧道建立

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/capwap%E9%9A%A7%E9%81%93%E5%BB%BA%E7%AB%8B.png)

-   AP获取IP地址

    -   静态方式：登录到AP设备上手工配置IP地址
    -   DHCP方式：通过配置DHCP服务器，使AP作为DHCP客户端向DHCP服务器请求IP地址

    >   典型方案
    >
    >   -   部署专门的DHCP server为AP分配IP地址
    >   -   使用AC的DHCP服务器为AP分配IP地址
    >   -   使用网络中的设备，例如核心交换机为AP分配IP地址

    ![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/ap-dhcp.png)

-   AP动态发现AC

    -   DHCP方式
    -   广播方式
        -   当AP启动后，如果DHCP方式和DNS方式均未获得AC的IP或AP发出发现请求报文后未收到响应，则AP启动广播发现流程，<font color=red>以播包方式发出发现请求报文</font>。
        -   广播发现方式只适用于AC/AP间为二层可达的网络场景。

-   AP接入控制流程

    ![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/ap-join.png)

1.   **DHCP的四步交互**
     -   首先AP发送discover广播报文，请求DHCP服务器响应；
     -   在DHCP服务器监听到discover报文后，响应AP一个DHCP offer报文，该报文中会包含一个租约期限的信息。
     -   当AP端收到多台DHCP Server的响应时，只会挑选其中一个offer（通常是最先抵达的那个），然后向网络中发送一个DHCP request广播报文，告诉所有的offer服务器结果，并重新单播发送DHCP请求；
     -   当DHCP服务器接收到AP的request报文之后，会向AP发送一个DHCP Ack响应，该报文中携带的信息包括了AP的IP地址，租约期限，网关信息，以及DNS server IP等，以此确定租约的正式生效，就此完成DHCP的四步交互工作。
2.   **Discovery阶段（AP发现AC阶段）**
     -   AP以单播（三层组网DHCP Option 43获取AC的IP）或广播（二层组网）的形式发送发现请求报文试图关联AC。
     -   AC收到AP的Discovery Request以后， 会发送一个单播Discover Response给AP，AP可以通过Discover Response中 所带的AC优先级或者AC上当前AP的个数等，确定与哪个AC建立会话。
3.   **DTLS连接（可选）**
     -   AP与AC之间DTLS connect消息交互，该过程是可选过程，根据报文是否需要加密来决定。是否需要加密的开关在discover response报文中。
4.   **Join阶段**
     -   在完成DTLS握手后，AC与AP开始建立控制通道，AP发送Join
         Request报文请求在AC上线。
     -   AC回应的Join Response报文中会携带用户配置的升级版本号，
         握手报文间隔/超时时间，控制报文优先级等信息。
5.   **Image Data阶段**（版本升级，版本一致跳过）
     -   AP根据协商参数判断当前版本是否是最新版本，如果不是最新版本，则AP将在CAPWAP隧道上开始更新软件版本，AP向
         AC发送Image Data Request请求下载最新软件版本；
     -   AC收到请求后下发软件版本，AP在软件版本更新完成后重新启动，重复进行AC发现、建立CAPWAP隧道、加入过程。
6.   **Configuration Status**
     -   AP发送Configuration Status Request报文（携带AC Name, Radio等信息），启动等待Configuration Status Response报文超时定时器。
     -   AC收到报文后，迁移状态并回应Response报文（<font color=red>目前此阶段没有下发配置，都是在run状态之后统一 下发</font>）；AP收到报文后，停止等待Response报文超时定时器，并迁移到Data Check状态。
7.   **Data Check**
     -   AP发送Change State Event Request报文(携带Radio, Result Code等信息)，并启动等待Response超时定时器;
     -   AC收到Change State Event Request后，迁移状态到Data Check并回Response报文（<font color=red>目前没有携带错误码信息</font>）；AP收到Response报文后，停止等待Response超时定时器并迁移到run状态。
8.   **Run**（数据隧道）
     -   AP发送keepalive到AC，AC收到keepalive后表示数据隧道建立。
     -   AC回应keepalive，AP进入“normal"状态，开始正常工作。
9.   **Run**（控制隧道）
     -   AP进入Run状态后，同时发送echo request报文给AC， 宣布建立好CAPWAP管理隧道并启动echo发送定时器和隧道检测超时定时器以检测管理隧道时候异常。
     -   当AC收到EchoRequest报文后，同样进入Run状态，并回应EchoResponse报文给AP，启动隧道超时定时器。AP收到Echo Response报文后，会重设检验隧道超时的定时器。此时， AP已经正常上线。
10.   **Configuration Update**
      -   AC对AP的配置进行更新，当AP的配置需要进行更新时，AC会向AP发送configuration update request报文。
      -   AP接收到AC的请求后会向AC回一个Configuration Update Response报文，AC收到AP的Configuration Update Response报文后，进行配置更新。

>   CAPWAP隧道建立完成也意味着AP已成功上线，业务配置正常的话能够释放出SSID，让终端接入了


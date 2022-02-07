---
title: WLAN组网架构
tags:
  - WLAN概述
  - WLAN基础
categories:
  - 数据通信
type: technology
hide: false
mathjax: false
date: 2021-09-21 21:28:24
description: WLAN组网架构
password:
message:
---

# FAT AP架构 

-   FAT AP（胖AP）架构又称为自治式网络架构
-   当部署单个AP时，由于FAT AP具备良好的独立性，不需要另外部署集中控制设备，不是起来很方便，成本较低廉
-   但是，在企业网中，随着WLAN覆盖面积增大，接入用户增多，需要部署的FAT AP数量也会增多。而每个FAT AP又是独立工作的，缺少统一的控制设备，因此管理、维护这些FAT AP就变得十分麻烦
-   所以对于企业而言，部队见FAT AP架构，更何时的选择时下面要介绍的AC+FIT AP架构、云管理架构、Leader AP架构

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/fat-ap.png)

# AC+FIT AP

-   AC负责WLAN的接入控制、转发和统计、AP的配置监控、漫游管理、AP的网管代理、安全控制
-   FIT AP（瘦AP）负责802.11报文的加解密、802.11物理层功能、接收AC的管理、空口的统计等简单的功能
-   AC和AP之间使用的通信协议时CAPWAP
-   相对于FAT AP架构，AC+FIT AP架构的优点如下
    -   配置与部署更容易
    -   安全性高
    -   更新与扩展容易

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/ac-fit-ap.png)

# AC+FIT AP组网

## 二层组网

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/%E4%BA%8C%E5%B1%82%E7%BB%84%E7%BD%91.png)

-   **说明**：AC和FIT AP在同一个广播域，AP通过本地广播可以直接找到AC，组网简单，配置简单，管理简单
-   **应用**：使用与小范围组网，例如：小型企业网络等；不适合大型企业复杂、精细化的WLAN组网

## 三层组网

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/%E4%B8%89%E5%B1%82%E7%BB%84%E7%BD%91.png)

-   **说明**：AC和FIT AP不在同一网段，中间网络必须保证AP和AC之间路由可达，需要进行额外配置才能使得AP发现AC，组网灵活、易扩展
-   **应用**：适用于中型和大型网络。以大型园区为例，每一栋楼里都会部署AP进行无线覆盖，AC放在核心机房进行统一控管。这样AC和FIT AP直接按必须采用较为复杂的三层网络

## 直连组网

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/%E7%9B%B4%E8%BF%9E%E7%BB%84%E7%BD%91.png)

-   **说明**：AC同时攀岩无线接入控制器和汇聚交换机功能，AP的数据业务和管理业务由AC集中转发处理
-   **应用**：适用于新建的中小规模集中部署的WLAN

## 旁挂组网

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/%E6%97%81%E6%8C%82%E7%BB%84%E7%BD%91.png)

-   **说明**：旁挂式组网是指AC旁挂在现有网络中，仅处理AP的管理业务，AP的数据业务经过设置可以不经AC直接到达上行网络
-   **应用**：主要用于网络改造、或新建大、中型园区网络场景

# 数据转发方式

## CAPWAP协议

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/capwap.png)

>   什么是CAPWAP隧道（控制隧道、数据隧道）

-   **CAPWAP（无线接入点控制和配置协议）**：该协议定义了如何对AP进行管理、业务配置，即AC通过CAPWAP隧道来时先对AP的集中管理和控制

>   CAPWAP隧道的功能

-   AP对AC的自动发现
-   AP与AC间的状态维护
-   AC通过CAPWAP隧道对AP进行管理、业务配置下发
-   当采用隧道转发模式时，AP将STA发出的数据通过CAPWAP隧道实现与AC之间的交互

## 直接转发（本地转发）

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/%E7%9B%B4%E6%8E%A5%E8%BD%AC%E5%8F%91.png)

-   **直接转发**：用户的数据报文到达AP后，不经过CAPWAP的隧道封装而直接转发到上层网络。AC只对AP进行管理，业务数据都是由本地直接转发
-   **优势**：数据流量不经过AC，AC负担小，万兆园区推荐方案

## 隧道转发

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/%E9%9A%A7%E9%81%93%E8%BD%AC%E5%8F%91.png)

-   **隧道转发**：业务数据报文由AP同意封装后到达AC实现转发，AC不但进行对AP管理，还作为AP流量的转发中枢
-   用户的数据报文经过CAPWAP隧道封装后再由AC转发到上层网络
-   **优势**：数据流和管理流全部经过AC，可以更容易对无线用户实施安全控制策略

# AC+FIT AP组网特点对比

| 组网描述                   | 特点                                                         |
| -------------------------- | ------------------------------------------------------------ |
| 直连模式+二层组网+直接转发 | 数据流量无迂回，转发效率高。                                 |
| 旁挂模式+二层组网+直接转发 | 数据流量无迂回，转发效率高，便于在现有网络上叠加建设WLAN，也便于热备方案部署。 |
| 旁挂模式+二层组网+隧道转发 | 数据VLAN配置简单，隧道转发提供了二层隧道，可支持802.1X认证，便于在现有网络上叠加建设WLAN，也便于热备方案部署。 |
| 旁挂模式+三层组网+隧道转发 | 数据VLAN配置简单，隧道转发提供了二层隧道，可支持802.1X认证，便于在现有网络上叠加建设WLAN,也便于热备方案部署。 |
| 旁挂模式+三层组网+直接转发 | 数据流量无迂回，转发效率高，便于在现有网络.上叠加建设WLAN，也便于热备方案部署。 |

# AC+FIT AP规划

## VLAN规划

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/vlan%E8%A7%84%E5%88%92.png)

-   WLAN中的VLAN主要分两类：管理VLAN和业务VLAN
    -   管理VLAN：负责传输CAPWAP对扫转发的报文，包括管理报文和CAPWAP隧道转发的业务数据报文
    -   业务VLAN：负责传输业务的数据报文
-   在进行VLAN规划需要注意以下原则
    -   管理VLAN和业务VLAN分离
    -   业务VLAN应根据实际业务需求与SSID匹配映射关系

### 业务VLAN与SSID的映射关系

## IP地址规划

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/ip%E5%9C%B0%E5%9D%80%E8%A7%84%E5%88%92.png)

-   **AC的源IP地址**
    -   用于管理AP，一般通过静态手动配置
-   **AP的IP地址**
    -   用于和AC进行CAPWAP通信，由于AP数量较多，一般使用DHCP服务器动态分配IP地址
-   **终端的IP地址**
    -   建议通过DHCP服务器分配IP地址，对于固定无线终端（如无线打印机）可以静态配置。可以只用AC作为DHCP服务器，也可以采用独立的DHCP服务器

# AC+FIT AP可靠性

## AC单点故障

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/ac%E5%8D%95%E7%82%B9%E6%95%85%E9%9A%9C.png)

-   在AC和FIT AP架构的WLAN网络中，所有AP由AC通过CAPWAP隧道统一管理和下发配置
-   一旦AC出现故障，AC和所有AP之间的CAPWAP隧道断开，AP掉线，用户搜索不到WLAN信号。该网络下所有WLAN用户无法上网

## AC可靠性

### VRRP双机热备

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/vrrp%E5%8F%8C%E6%9C%BA%E7%83%AD%E5%A4%87.png)

-   两台AC组成VRRP，主、备AC对AP始终显示为同一个虚拟IP地址，主AC通过Hot Standby（HSB）主备通道同步业务信息到AC上
-   两台AC通过VRRP协议产生一台“虚拟AC”，缺省情况下，主AC担任虚拟AC的具体工作，当主AC故障时，备AC接替其工作。所有AP与“虚拟AC”建立CAPWAP隧道
-   AP只看到一个AC的存在，AC间的切换由VRRP决定
-   这种方式一般将主备AC部署在同一地理位置，和其他备份方式比较，其业务切换速度非常快

### 双链路双机热备

![](D:\codes\Markdown\WLAN\img\双链路双机热备.png)

-   AP同时与主备AC之间分别建立CAPWAP隧道，AC间的业务信息通过HSB主备通道同步
-   当AP和主AC间链路断开，AP会通知备AC切换为主AC
-   通过AC优先级确立主备关系AC。AC优先级相同的情况下，根据AC负载（AP和STA个数）确立主备AC

>   HSB

-   HSB（热备份）时华为主备公共机制
-   主备服务（HSB service）：建立和维护主备通道，为各个主备业务模块提供通道同短时间和报文发送/接收窗口
-   主备备份组（HSB group）：HSB备份组内部绑定HSB service, 为各个主备业务模块提供数据备份通道。HSB备份组与一个VRRP实例绑定，借用VRRP机制协商出主备实例。同时，HSB备份组还负责通知各个业务模块处理批量备份、实时备份、主备切换等事件。

### N+1

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/np1.png)

-   使用一台AC作为备AC，为多台主AC提供备份服务
-   网络正常情况下，AP只与各自所属的主AC建立CAPWAP隧道
-   当主AC故障或主AC与AP间CAPWAP链路故障时，备AC替代主AC来管理AP，备AC与AP间建立CAPWAP链路，为AP提供业务服务
-   支持主备倒换，支持主备回切

### 小结

| 对比项         | VRRP双机热备                                                 | 双链路双机热备                                               | N+1备份                                                      |
| -------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 切换速度       | 主备切换速度快，对业务影响小。通过配置VRRP抢占时间，相比于其他备份方式实现更快的切换 | AP状态切换慢，需等待检测到<CAPWAP断链超时后才会切换，主备切换后终端不需要重新上线 | AP状态切换慢，需等待检测到CAPWAP断链超时后才会切换,AP、终端均需要重新上线，业务会出现短暂中断 |
| 主备AC异地部署 | VRRP协议是二层协议，不支持主备AC异地部署                     | 支持·                                                        | 支持                                                         |
| 适用范围       | 对可靠性要求高，且无须异地部署主备AC的场景                   | 对可靠性要求高，且要求异地部署主备AC的场景                   | 对可靠性要求较低，对成本控制要求较高的场景                   |

## 业务可靠性

### 本地转发CAPWAP断链业务保持

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/%E6%9C%AC%E5%9C%B0%E8%BD%AC%E5%8F%91CAPWAP%E6%96%AD%E9%93%BE%E4%B8%9A%E5%8A%A1%E4%BF%9D%E6%8C%81.png)

>   功能说明

-   AP与AC之间的CAPWAP链路中断后，已在线用户的业务不会中断，用户数据可正常转发
-   用户数据通过本地转发模式转发
-   AP无线侧安全策略为开放系统认证、共享密钥认证（WEP）和WPA/WPA2-PSK时，新上线用户可接入上线

>   应用场景

-   对于没有部署备份AC的小型无线网络，该特性可保证当AP与AC断开连接时，用户数据转发不中断，提升业务可靠性

### 广域逃生

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/%E5%B9%BF%E5%9F%9F%E9%80%83%E7%94%9F.png)

>   功能说明

-   传统方式下用户认证都是在AC.上处理，当AC与AP的通信中断时，新接入用户因无法认证，便无法接入到网络中
-   广域逃生:当AC与AP断链时，AP具有本地认证功能，对新接入的用户进行认证，保障业务可靠性

>   应用场景

-   总部与分支之间跨越广域网，AC部署在园区总部，AP部署在园区分支
-   当分支AP与总部AC断开时，已在线用户，通过配置业务保持功能，能够保证业务正常运行;但新用户将无法接入到网络中,影响用户体验。可以部署园区广域认证逃生方案，使园区AP与总部AC断开后，新用户仍然能接入到网络中

# 云管理架构

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/%E4%BA%91%E7%AE%A1%E7%90%86%E6%9E%B6%E6%9E%84.png)

-   由云管理平台统一管理和配置云A，统一管理用户终端接入
-   云管理架构相比传统的AC+FIT AP架构，有如下优势：
    -   即插即用，自动开局，减少网络部署成本
    -   同一运维。所有云管理网元同意在云管理平台上进行键控和管理
-   适用于中小型的无线网络，部署灵活，运维成本低

# Leader AP架构

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/leader-ap.png)

-   Leader AP架构中只包含AP。用户将其中1台AP设置为Leader AP模式，将其他AP以FIT AP模式接入网络，和Leader AP二层互通
-   Leader AP会在二层网络中广播自己的角色，其它AP自动发现并接入Leader AP
-   Leader AP的功能和AC非常类似，提供基于CAPWAP隧道的统一接入管理和配置运维，提供集中的无线资源管理和漫游管理
-   用户只需登录Leader AP，配置无线业务，所有AP都会提供相同的无线业务，终端可以在不同AP间漫游

# WLAN组网架构对比

| 组网描述      | 特点                                         | 应用场景               |
| ------------- | -------------------------------------------- | ---------------------- |
| FAT AP架构    | 独立部署和配置，管理和维护就较麻烦           | 适用于SOHO             |
| AC+FIT AP架构 | AC统一管理和配置AP，配置和部署较简单         | 适用于中大型的无线网络 |
| 云管理架构    | 云管理平台统一管理和配置AP，部署和运维较简单 | 适用于中小型的无线网络 |
| Leader AP架构 | Leader AP统一管理和配置AP配置和部署较简单    | 适用于小型无线网络     |


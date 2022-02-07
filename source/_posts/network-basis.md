---
title: 网络基础
comments: true
tags:
  - 华为
  - ensp
  - 计算机网络
  - 计算机网络基础
categories:
  - 网络
type: technology
date: 2021-08-31 12:52:42
description: 计算机网络基础，未完……
---

# 网络

## 作用

>   传递数据，数据共享

## 组成

|   名称   |            内容            |
| :------: | :------------------------: |
|   终端   |      数据的起点和终点      |
| 转发设备 | 路由器、交换机、防火墙、AP |
|   线缆   |        双绞线、光纤        |

## 分类

-   园区网
    -   企业网
    -   校园网
-   运营商网络

## 传输介质

## 双绞线

>   1000BASE-T     超5E类双绞线

|    1000     |   BASE   |   T    |
| :---------: | :------: | :----: |
| 1G（1000M） | 基带传输 | 双绞线 |

### 单位

-   **Mbps**

100Mbsp=0.125MB/s=128KB/s

| 单位（简称） | 单位（全称） |    解释    |
| :----------: | :----------: | :--------: |
|      b       |     bit      | 比特（位） |
|      B       |     Byte     |    字节    |

-   **<font color=red size=6>1B=8bit</font>**

## 光纤

|  优点  | 缺点 |
| :----: | :--: |
|  可靠  |  贵  |
| 光信号 |  贵  |

## 同轴电缆

-   总线型
-   共享网络

## 冲突域

-   共享式网络中，不同的主机同时发送数据时，就会产生信号冲突的问题

## CSMA/CD

-   载波监听多路访问/冲突检测技术
-   先听先发，变发边听，冲突停发，随即延迟后重发

## 双工模式

-   半双工：**可收可发，不能同时进行**
-   全双工：**可收可发，可以同时进行**

## 名词

## 标准

-   定义数据在网络中传输的格式   -----   帧

## 协议

-   定义数据的传输方式

# TCP/IP

-   应用层
-   传输层
-   网络层
-   网络接口层

# OSI模型

>   将应用层、表示层和会话层合并为应用层来描述

-   应用层
-   表示层
-   会话层
-   传输层
-   网络层
-   数据链路层
-   物理层

---

## 应用层

>   产生数据

-   根据协议产生数据
-   **PDU**：协议数据单元
-   常见服务以及端口号

| 协议   | 名称             | 端口号           |
| ------ | ---------------- | ---------------- |
| HTTP   | 超文本传输协议   | 80、443（HTTPS） |
| DNS    | 域名解析协议     | 53               |
| FTP    | 文件传输协议     | 20、21           |
| TFTP   | 简单文件传输协议 | 69               |
| SMTP   | 邮件传输协议     | 25               |
| POP3   | 邮局协议         | 110              |
| Telnet | telnet           | 23               |
| SSH    | ssh              | 22               |
| RIP    | 路由信息协议     | 520              |

## 传输层

>   数据段

-   定义数据的传输方式

|            TCP             |             UDP              |
| :------------------------: | :--------------------------: |
| 可靠的、面向连接的传输方式 | 不可靠、面向无连接的传输方式 |

## 动作

1.   分段
2.   分类封装

## TCP

-   TCP头部

<table style="text-align: center;">
    <tr>
        <td colspan="8">源端口号</td>
        <td colspan="2">目的端口号</td>
    </tr>
    <tr>
        <td colspan="10">序列号</td>
    </tr>
    <tr>
        <td colspan="10">确认号</td>
    </tr>
    <tr>
        <td>头部长度</td>
        <td>RESV.</td>
        <td>URG</td>
        <td>ACK</td>
        <td>PSH</td>
        <td>RST</td>
        <td>SYN</td>
        <td>FIN</td>
        <td colspan="2">窗口大小</td>
    </tr>
    <tr>
        <td colspan="8">校验和</td>
        <td colspan="2">Urgent Pointer</td>
    </tr>
    <tr>
        <td colspan="9">选项字段</td>
        <td>填充字段</td>
    </tr>
</table>


-   20-60字节

### 三次握手

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/%E4%B8%89%E6%AC%A1%E6%8F%A1%E6%89%8B.png)

### SYN消息

- 同步消息
- seq（序列号）
    - seq=0时表示此消息位SYN消息

### ACK消息

- 确认消息
- ack（确认号）
    - 序列号 + 1

### 特殊情况

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/TCP-1.png)

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/TCP-2.png)

-   超时重传
    -   当数据在传输过程中丢失后，过一段时间会进行重传
    -   当数据传递不完整时，校验不通过，会进行重传
-   滑动窗口

### 四次分手

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/%E5%9B%9B%E6%AC%A1%E5%88%86%E6%89%8B.png)*

### FIN消息

-   当对端收到FIN消息后，开始断开连接

## UDP

-   UDP头部

<table  style="text-align: center;">
    <tr>
        <td>源端口</td>
        <td>目的端口</td>
    </tr>
    <tr>
        <td>长度</td>
        <td>校验和</td>
    </tr>
</table>


-   8字节

## 网络层

>   数据包

-   IP寻址

## IP

-   IP头部

<table style="text-align: center;">
    <tr>
        <td>版本</td>
        <td>头部长度</td>
        <td>差分服务字段</td>
        <td colspan="2">总长度</td>
    </tr>
    <tr>
        <td colspan="3">标识</td>
        <td>标志</td>
        <td>片偏移</td>
    </tr>
    <tr>
        <td colspan="2">生存时间</td>
        <td>协议字段</td>
        <td colspan="2">头部校验和</td>
    </tr>
    <tr>
        <td colspan="5">源IP地址</td>
    </tr>
    <tr>
        <td colspan="5">目的IP地址</td>
    </tr>
    <tr>
        <td colspan="5">选项字段</td>
    </tr>
</table>


-   差分服务字段
    -   服务于QoS
-   协议字段（用来识别上层协议）
    -   TCP（6）
    -   UDP（17）
    -   ICMP（1） 
    -   IGMP（2）
-   生存时间
    -   TTL

## MTU

-   最大传输单元
-   默认为1500字节
-   超过1500字节执行IP包分片动作

## 包分片

- Identification（标识）：标识哪些数据片属于一个数据包
- Flags（标志）：代表收到的数据片是否为最后一个   -----   最后一个标识0，其余标识为1
- Fragment Offset（片偏移）：标识数据片再数据包中的位置

## 网关

-   网关用来转发不同网段内的数据包
-   网关地址
    -   一般使用可用IP地址的第一个或最后一个

## 数据链路层

>   数据帧

-   以太网Ⅱ数据帧格式

<table>
    <tr>
        <td>D.MAC</td>
        <td>S.MAC</td>
        <td>TYPE</td>
        <td>DATA</td>
        <td>FCS</td>
    </tr>
    <tr>
        <td>目的MAC</td>
        <td>源MAC</td>
        <td>IP:0x0800<br />ARP:0x0806</td>
        <td>PDU</td>
        <td>校验</td>
    </tr>
</table>


## MAC地址

>   数据链路层基于（目的）MAC地址进行转发

-   MAC地址具有全球唯一性
-   MAC地址由两部分组成，分别是供应商代码和序列号。其中前24位代表该供应商代码，由IEEE管理和分配。剩下的24位序列号由厂商自己分配。

## 单播

-   一对一
-   其MAC地址第8bit为0表示单播

## 组播

-   一对多
-   其MAC地址第8bit为1表示组播

## 广播

-   一堆全部
-   其MAC地址为全F表示广播

## ARP协议

-   IP地址与MAC地址的对应

### 普通ARP

-   ARP数据包

<table>
    <tr>
        <td>以太网Ⅱ数据帧</td>
        <td>ARP</td>
        <td>FCS</td>
    </tr>
</table>


-   ARP报文

<table style="text-align: center;">
    <tr>
        <td colspan="2">硬件地址类型</td>
        <td>三层协议地址类型</td>
    </tr>
    <tr>
        <td>MAC地址和IP地址的长度</td>
        <td>三层协议长度</td>
        <td>ARP报文类型</td>
    </tr>
    <tr>
        <td colspan="3">源物理地址</td>
    </tr>
    <tr>
        <td colspan="3">源IP地址</td>
    </tr>
    <tr>
        <td colspan="3">目的物理地址</td>
    </tr>
    <tr>
        <td colspan="3">目的IP地址</td>
    </tr>
</table>


### ARP工作过程

-   ARP请求
-   ARP响应
-   交换机动作

1.   解封装

     获取DMAC和SMAC

2.   学习

     如果SMAC和接收端绑定，构建MAC地址表项

3.   转发

     如果DMAC地址为全F，无需查找MAC地址表项，直接执行泛洪动作

     如果DMAC不为全F，查询MAC地址表项转发

     1.   能查到MAC地址

          发送端口是不是接收端口，是则丢弃，不是则转发

     2.   查不到MAC地址

          执行泛洪动作

-   泛洪：将从某个接口收到的数据向除该接口之外的所有接口发送出去
-   广播域：广播帧传递的范围

>   交换机MAC地址表项老化时间默认为300秒
>
>   路由器不会转发广播报文，因为路由器隔离广播域
>
>   相同网段请求对端MAC地址，不同网段请求网关MAC地址

### ARP代理

-   路由器代替对端回复ARP报文

```shell
[AR1-GigabitEthernet0/0/0]arp-proxy enable  # 开启ARP代理功能
```

>   ARP代理有风险：<font color=red>ARP欺骗攻击</font>

### 免费ARP

-   免费ARP用来探测IPv4地址是否冲突

# 交换网络基础

-   交换机工作在数据链路层，转发数据<font color=red>帧</font>

## 交换机动作

0.   初始状态

     MAC地址表为空

1.   学习

     交换机将收到的数据帧的源MAC地址和对应接口记录到MAC地址表中

2.   转发

     当数据帧的目的MAC地址在MAC表中，按照MAC地址表转发

     当数据帧的目的MAC地址不在MAC表中，或者目的MAC地址为广播地址时，交换机会泛洪该帧

3.   回复

     交换机根据MAC地址表将目标主机的回复信息单播转发给源主机


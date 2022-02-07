---
title: BGP
tags:
  - BGP
categories:
  - HCIP
type: technology
date: 2021-08-12 18:52:30
description: BGP路由协议
---

# BGP协议

-   链路状态路由协议：
    -   OSPF
    -   IS-IS
-   距离矢量路由协议：
    -   RIP
    -   **<font color=red size=8>BGP</font>**
-   IGP：内部网关路由协议

-   EGP：外部网关路由协议
    -   ~~EGP：已经被BGP所取代~~
    -   BGP

---

-   **<font color=red>B</font>order <font color=red>G</font>ateway <font color=red>P</font>rotocol**
-   边界网关协议
-   外部网关协议

## AS

-   自治系统

## BGP的基本内容

-   BGP是以AS为单位的，传递AS之间和AS之间的路由
-   AS_number：AS号
    -   标识一个AS
    -   16bit
    -   32bit
    -   0-65535
        -   64512-65535（私有AS号）
-   BGP目前版本为 V4
-   BGP：TCP（179）

### BGP邻居

-   EBGP：AS和AS之间的邻居
    -   可以跨路由器建立邻居
-   IBGP：AS的邻居
-   IBGP一般使用Loopback接口建立邻居
-   RST：重置
-   EBGP优先级：255

#### 邻居建立的问题

1.   IBGP使用Loopback接口建立邻居

```shell
[R2]peer 4.4.4.4 connect-interface Loopback 0
```

2.   EBGP使用Loopback接口建立邻居

```shell
[R1]peer 2.2.2.2 ebgp-max-hop 2
```

### BGP的配置

-   有选择性的宣告路由
-   手动指定邻居

```shell
[R1]bgp 100
# 邻居IP：12.1.1.2 邻居AS号：200
[R1-bgp]peer 12.1.1.2 as-number 200 
# 查看BGP邻居
[R1]display bgp peer
[R2]peer 4.4.4.4 as-number 200
# 使用Loopback接口建立邻居
[R2]peer 4.4.4.4 connect-interface Loopback 0
# 修改最大跳数
[R1]peer 2.2.2.2 ebgp-max-hop 2
# 宣告192.168.1.0/24
[R1-bgp]network 192.168.1.0 24
# 刷新import方向的BGP路由
<R1>refresh bgp all import
# 修改keepalive和holdtime的时间
[R1-bgp]timer keepalive 55 hold 55
```

### BGP路由表

-   查看BGP路由表

```shell
display bgp routing-table 
```

-   `*`：可用的路由
-   `>`：最优的路由
-   **BGP只会把最优的路由放入IP路由表中，以及传递给BGP邻居**

### BGP数据包

-   BGP Open消息：协商参数，建立邻居
    -   Type：类型
        -   用来标识数据包类型
    -   version：版本
    -   MY AS：我的AS号
        -   收到对端按发送的OPEN消息中的MY AS要与本地指定的AS号相同
    -   Hold time：超时时间
        -   Keepalive消息的超时时间
        -   按照最小协商
    -   BGP identifier：BGP标识（BGP Router ID 接口IP地址）
        -   必须唯一
-   BGP Keepalive消息：维护邻居
    -   周期性发送，啥也没有。
    -   每60秒发送一次
    -   超时时间三倍
-   BGP Notification消息：错误消息
    -   通告错误
-   **BGP Update消息：存放路由信息**
    -   **Path attributes：路径属性**
        -   **路径属性**
    -   **Network Layer Reachability Information（NLRI）：网络层可达性信息**
        -   **存放路由**
-   BGP Route-refresh消息
    -   让其它路由器重新发送一条Update

### BGP状态机

-   IDLE：准备TCP连接
-   CONNECT：进行TCP连接，连接成功，发送open报文，进入OPENSENT状态；连接失败，进入ACTIVE状态
-   ACTIVE：重置TCP连接，连接成功，发送open报文，进入OPENSENT状态；连接失败，进入ACTIVE状态
-   OPENSENT：参数协商，协商成功，发送keepalive消息，进入OPENCONFIRM状态；协商失败，发送notification消息，返回IDLE
-   OPENCONFIRM：收到keepalive消息，进入ESTAVLISHED
-   ESTABLISHED：发送update，没有路由不发送update

### BGP下一跳不改变原则

-   从EBGP邻居收到的路由传递给IBGP邻居时下一跳不改变
    -   BGP以AS为单位，每一个AS在BGP看来是一个大路由器

### BGP路由黑洞

-   由于BGP跨设备建立邻居，中间路由器不存在路由

#### 解决办法

1.   IBGP互联
2.   引入
3.   MPLS VPN
4.   路由反射

### BGP水平分割原则

-   从IBGP邻居收到的路由，不再传递给IBGP邻居

## BGP属性

-   BGP路径矢量
-   BGP属性是用来描述路由的

### 公认必遵

>   所有路由器都识别，并且(UPDATE)携带在数据包

#### Origin

起源属性

-   i：从IGP学到的路由：network
-   e：从EGP学到的路由：
-   ?：引入的路由

i > e > ?

##### 修改起源属性修改路由选路

```shell
[AR3]ip ip-prefix 1 premit 192.168.1.0 24
[AR3]route-policy hcip permit node 10
[AR3-route-policy]if-match ip-prefix 1
[AR3-route-policy]apply origin egp 110
[AR3]route-policy hcip permit node 20
[AR3-bgp]peer 4.4.4.4 route-policy hcip export
```

#### AS_Path

AS路径

-   解决环路
    -   路由每经过一个AS，携带AS号；当设备收到的路由其中AS_Path中有自己的AS号，就不接受
-   AS_Path路径数量越少越优先

#### Next_hop

下一跳 

### 公认任意

>   所有路由器都识别，不一定会放在数据包中

#### Loacl_Preference

-   本地优先级
-   默认为100
-   **影响<font color=red>出</font>站<font color=red>流量</font>，<font color=red>入</font>站<font color=red>路由</font>**
    -   站：AS
-   本地优先级越**<font color=red>大</font>**越**<font color=red>优先</font>**
-   本地优先级不能跨AS传递

#### Atomic_aggregate  

-   原子聚合（自动聚合）
-   聚合路由，只有在抑制明细后才会有这个属性

### 可选过度

>   由器不一定识别该属性，但是可以传递

#### community

-   团体属性
-   相当于tag
-   no-export
    -   不通告给EBGP邻居
-   no-advertise
    -   不通告给任何BGP邻居

#### Aggregator

-   聚合者
    -   AS：由哪个AS发出
    -   origin：由哪台路由器发出

### 可选非过度

>   路由器不一定识别该属性，可以不传递

#### MED

-   多出口鉴别器
-   cost
-   **影响<font color=red>出</font>站<font color=red>路由</font>，<font color=red>入</font>站<font color=red>流量</font>**

### PrefValue

-   首选值
-   Huawei私有属性
-   首选值越大越优先
-   首选值只在本地有效

### BGP路由聚合

#### 自动聚合

-   自动聚合必须是引入路由
-   自动聚合成为主类路由
    -   10.0.0.0/**<font color=red>8</font>**
    -   172.1.0.0/**<font color=red>16</font>**
    -   192.168.1.0/**<font color=red>24</font>**

```shell
summary automatic
```

#### 手动聚合

```shell
[AR2-bgp]aggregate 10.1.0.0 22 detail-suppressed  as-set
```

-   detail-suppressed 
    -   抑制明细
-   as-set
    -   携带明细路由的AS号

## BGP路由优选

-   首选值越高越优先
-   本地优先级越高越优先
-   手动聚合>自动聚合>network>import>从对等体学到的（从EGP学到的）
-   AS_Path短的
-   origin：IGP>EGP>?
-   MED越小越优先
-   EBGP（EBGP>IBGP）
-   IGP开销
-   Router ID小的
-   较小IP地址的邻居学来的

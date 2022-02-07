---
title: BGP-old
tags:
  - BGP
categories:
  - 华为IP数通基础
date: 2021-05-06 13:43:08
type: technology
description: BGP路由协议
---

## BGP基础原理

### AS的概念

- 自治系统（Autonomouns System，AS）— A collection of IP networks and routers under the contrl of one entity。在一个实体管辖下的拥有相同选路策略的IP网络
- BGP网络中的，每个AS都被分配一个唯一的AS号，用于区分不同的AS。AS号分为2字节AS号和4字节AS号，其中2字节AS号的范围为1-65535，4字节AS号的范围为1-4294967295。支持4字节AS号的设备能够与支持2字节的AS号的设备兼容。
- 64512-65535是私有的AS号

### 路由协议的分类

- An IGP（Interior Gateway Protocol）is a typr of protocol used for exchanging routing information between routers **within** an autonomous system.
  - RIP、OSPF、IS-IS
- An EGP（Exterior Gateway Protocol）is a routing protocol used to exchange routing information **between** autonomous system
  - BGP

### BGP概述

- BGP（Border Gateway Protocol，边界网关路由协议），用于在AS之间实现路由信息的交互
- 使用BGP的理由
  - BGP更够承载大批量的路由前缀。
  - 支撑MPLS / VPN的应用，传递客户VPN
  - 具备强大的路由策略能力，定义了丰富的路径属性
  - 支持多协议的扩展

### BGP协议特征

- BGP使用TCP为传输层协议，使用TCP端口号179。BGP路由器之间基于TCP建立BGP会话。BGP对等体无需直连
- 运行BGP的路由器被称为BGP Spearker。两台BGP路由需建立对等体关系（邻居关系）才能交互BGP路由。存在两种类型的BGP对等体关系 — EBGP和IBGP
- 在BGP对等体关系建立完成后，BGP路由器只发送增量更新或触发更新（不会周期性更新）
- BGP具有丰富的路径属性和强大的策略工具
- BGP能够承载大批量的路由前缀，用于大规模网络中
- 目前主要BGP版本为V4以及MP-BGP

### BGP报文类型

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/Network/BGP报文类型.png)

|    报文名称    | 作用                                                         | 时间                                                         |
| :------------: | ------------------------------------------------------------ | ------------------------------------------------------------ |
|      OPEN      | 协商BGP邻居的各项参数                                        | Open是TCP链接建立后发送的第一个报文                          |
|     UPDATE     | 用于在对等体之间交换路由信息                                 | 连接建立后，有路由需要发送或路由变化时，发送UPDATE通告对端路由信息。它既可以发布可达路由信息，也可以撤销不可达路由信息 |
|  NOTIFICATION  | 当BGP检测到错误状态时，就像对等体发出Notification消息，之后BGP链接回立即中断 | 当BGP在运行中发现错误时，要发送NOTIFICATION报文通告BGP对端   |
|   KEEPALIVE    | 维持邻居关系                                                 | 定时发送KEEPALIVE报文以保持BGP邻居关系的有效性               |
| Router-refresh | Router-refresh消息用来要求对等体重新发送指定地址族的路由信息 | 当路由策略发生变化时，触发请求邻居重新通告路由               |

### BGP的邻居状态机

| Peer状态    | 发什么包        | 在做什么                                                     |
| ----------- | --------------- | ------------------------------------------------------------ |
| Idle        | 尝试建立TCP连接 | 开始准备TCP的连接并监视远程peer启动TCP连接，启用BGP时，要准备足够的资源 |
| Connect     | 发TCP包         | 正在进行TCP连接，等待完成中，认证都是在TCP建立期间完成的。如果TCP连接不上则进入Active状态，反复尝试连接 |
| Active      | 发TCP包         | TCP连接没有建立成功，反复尝试TCP连接                         |
| OpenSent    | 发Open包        | TCP连接已经建立成功，开始发送Open包，Open包携带参数协商对等体的建立 |
| OpenConfirm | 发Keepalive包   | 参数、能力特性协商成功，子开始发送Keepalive包，等待对方的Keepalive包 |
| Established | 发Update包      | 已经收到对方的Keepalive包，双方能力特性一致，开始使用Update通告路由信息 |

### BGP对等体（BGP peer）

- BGP对等体关系也被称为BGP邻居关系。两台BGP路由器需建立BGP对等体关系才能够交换BGP路由

- BGP会话基于TCP建立。建立对等体关系的BGP路由器无需直连

- EBGP Peer（External BGP Peer）

  位于不同AS的BGP路由器之间的对等体关系

- IBGP Peer（Internal BGP Peer）

  位于相同AS的BGP路由器之间的对等体关系

### BGP同步规则

- BGP同步规则（Synchronization）规则指出，BGP路由器不应该使用通过IBGP对等体获悉的路由或将其通告给EBGP对等体，除非该路由时本地的或者**又通过IGP获取**

### 中转AS中的路由黑洞的问题

- 解决办法1
  - IGP-BGP路由重发布
- 解决办法2
  - 中转AS内的路由器均运行BGP，且IBGP邻居全互联
- 解决办法3
  - 通过部署MPLS解决BGP路由黑洞的问题

 ### IBGP水平分割规则

- BGP的路由防环是依赖AS_PATH属性的，而AS_PATH属性仅仅在路由离开AS才会被更该，因此在AS内，IBGP路由就没有EBGP路由那样基于AS_PATH的防环能力，为了防止环路的出现，BGP路由器不会将从IBGP邻居学习过来的路由再通告给其他IBGP邻居 — 这就是BGP水平分割原则
- 由于水平分割规则的存在，BGP要求AS内保证IBGP邻居关系全互联（FULL Mesh）
- 由于IBGP水平分割原则的限制，为了使得AS内的BGP路由器都能够正常学习到BGP路由，我们不得不建立一个FULL MESH的全互联IBGP连接
- 然而在AS内的所有BGP路由器之间维护全互联的IBGP连接时需要耗费大量资源，也是低效、低扩展性的，那么如何规避这个问题呢？
  - 路由反射器（Router Reflector）
  - 联邦（Confederation）

### BGP路由通告规则

- 当到达同一个目的地存在多条路径时，BGP路由器只选取最优的（Best）路由来使用（在没有开启负载均衡的状态下）
- BGP只把自己使用的路由，也就是自己认为Best的路由传递给BGP对等体
- BGP路由器从EBGP对等体获得的路由回向它所有的BGP对等体通告（包括EBGP和IBGP对等体）
- BGP路由器从IBGP对等体获知的路由不向它的IBGP对等体通告（水平分割规则，存在路由反射器的情况除外）
- BGP路由器从IBGP对等体获知的路由是否通告给它的EBGP对等体则要视IGP和BGP同步的情况来决定
- 路由更新时，BGP设备只会发送更新的BGP路由

### BGP基础配置

- **创建BGP进程，指定BGP Router-ID：**

  - [Router]**bgp** *as-num*

  - [Router]**router-id** x.x.x.x

    为了增加网络的安全性，建议将BGP Router-ID手工配置为Lookback接口的地址。如果设备没有配置，则BGP自动选取设备的全局Router-ID作为BGP Router-ID。全局Router-ID在系统视图下使用router-id命令指定

- **配置BGP对等体：**

  - [Router-bgp]**peer** *x.x.x.x* **as-number** *as-num*
    - BGP的对等体需通过peer命令指定，而无法像IGP那样通过协议自动发现
    - Peer命令所指定的对等体的地址必须路由可达
    - 两者的AS号决定了对等体关系的类型

- **（可选）指定本路由器与特定对等体建立BGP会话所使用的更新源IP地址：**

  - [Router-bgp]**peer** *x.x.x.x* **connect-interface** *intf* [*ipv4-src-address*]
    - 缺省情况下，报文的出接口的IP地址为BGP更新源IP地址

- **使用network方式向BGP通告路由：**

  - [Router-bgp]**network** *ipv4-address* [*mask*|*mask-length*]
    - BGP协议本身不发现路由，因此需要将其他路由（如IGP路由等）引入到BGP路由表中，从而将这些路由在AS之内和AS之间传播。要引入的本地路由必须存在于本地的IP路由表中
    - 与IGP的network命令不同，BGP的network命令是通告特定的IGP路由、直连路由或静态路由进BGP进程，而不是在接口上是用BGP
    - 该命令如果没有指定掩码或掩码长度，则按有类地址处理，若指定了，则当路由表中有与该网络完全匹配的条目时才会被通告出去
    - 使用路由策略可以更为灵活的控制所引入的路由

## BGP路径属性

- 属性分类
  - 公认属性 Well-Known
    - 公认必循属性 Well-Known mandatory
    - 公认自由决定属性 Well-Known doscretionary
  - 可选属性 Optional
    - 可选传递的 Optional non-transitive
    - 可选非传递的 Optional non-transitive

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/Network/BGP路径属性.png)

### Perferred_Value

- 华为BGP私有路径属性，取值范围：0-65535；越大越优先
- 在路由器本地配置，只对本路由器有效，不会传播给任何BGP对等体
- 本地始发的路由默认Perferred_Value为0，对其他对等体学到的路由缺省也为0

### Local_Preference

- 本地优先级，公认自觉属性，用于告诉AS中的路由器，哪条路径是离开AS的首选路径
- Local_Preference越大则路径越优。缺省Local_Preference值为100
- 只能发送给IBGP对等体，而不能传递给EBGP对等体

- Local_Preference属性只能在IBGP对等体之间传递（除非部署了路由策略否则该属性值在IBGP对等体传递过程中不会丢失），不能在EBGP对等体之间传递
- 如果从EBGP对等体收到的路由携带Local_Preference，则会触发Nottifaction报文；但是可以在AS边界路由器上使用import方向的策略来修改Local_Preference属性
- 路由器network及重发布到BGP的路由，Local_Preference缺省100。使用bgp default local-preference命令可以修改缺省Local_Preference值
- BGP路由器在向其EBGP对等体发送BGP路由时，不能携带Local_Preference属性，但是对方会在本地为这条路由赋一个缺省Local_Preference也就是100，然后再将路由传递给自己的IBGP对等体

### AS_PATH

- **AS_PATH是公认必遵属性**，是BGP路由传递过程中所经历过的AS号列表

- AS_PATH可用于确保路由在EBGP对等体之间传递时的无环；另外也作为路由优选的依据之一

- BGP路由被通告给EBGP对等体时会在AS_PATH中追加上本地的AS号；通告给IBGP邻居时不修改AS-PATH

  四种类型

  - AS_SET：一个去往特定目的地所经路径上的无序AS号列表
  - AS_SEQENCE：一个有序AS号列表
  - AS_CONFED_SEQENCE：一个去往特定目的地所经路径上的有序AS号列表，其用法与AS_SEQENCE完全一样，区别在于该列表中的AS号属于本地联邦中的AS
  - AS_CONFED_SET：一个去往特定目的地所在路径上的无序AS列表，其用法与AS_SET一样，区别在于列表中的AS属于本地联邦中的AS

### ORIGIN

- 公认必遵属性
  - 路由优选顺序：lowest  origin  code(IGP>EGP>Incomplete)

|    名称    | 标记 |                             描述                             |
| :--------: | :--: | :----------------------------------------------------------: |
|    IGP     |  i   | 通过BGP network的路由，也就是起源于IGP的路由。因为BGP network必须保证该网络在路由表中 |
|    EGP     |  E   |               是由EGP这种早期的协议重发布而来                |
| Incomplete |  ?   | 从其他渠道学习到的，路由来源不完全（确认该路由来源的信息不完全）。（重发布的路由） |

### MED

- MED（Multi Exit Discriminator）是可选非传递属性，是一种度量值，用于向外部对等体指出进入AS的首选路径，即当入口有多个时，AS可以使用MED动态的影响其他AS如何选择进入的路径
- MED属性值越小则BGP路由越优
- MED主要用于在AS之间影响BGP的选路。MED被传递给EBGP对等体后，对等体在其AS内传递路由时，携带该MED值，但不会将该MED传递给下一个AS

#### MED注意事项

- 缺省情况下，只比较来自同一对等体AS的BGP路由的MED值，也就是说如果去往同一个目的地的两条路由来自不同的AS，则不进行MED值的比较
- MED旨在直接相邻的AS间影响业务两，而不会跨AS传递
- 一台BGP路由器将路由通告给EBGP对等体时，是否携带MED属性，需要根据以下条件进行判断（不对EBGP对等体使用策略的情况下）：
  - 如果该BGP路由是本地始发（本地通过network或import-route命令引入）的，则缺省携带MED属性发送给EBGP对等体
  - 如果该BGP路由是从其他BGP对等体学习来的，那么将路由通告给EBGP对等体时不携带MED
- 在IBGP对等体之间传递路由时，MED值会被保留并传递，除非部署了策略，否则MED值在传递过程中不发生改变也不会丢失

#### MED的默认操作

- 如果路由器通过IGP学习到一条路由，并通过network或import-route的方式将路由引入BGP，产生的BGP路由的MED值继承路由在IGP中的metric或cost
- 如果路由器将本地直连路由通过network或import-route的方式引入BGP，那么这条BGP路由的MED为0，因为直连路由cost为0
- 如果路由器将本地静态路由通过network或import-route的方式引入BGP，那么这条BGP路由的MED为0，因为静态路由cost为0
- 如果路由器通过BGP学习到其他对等体传递过来的一条路由，那么将路由更新给自己的EBGP对等体时，默认是不携带MED的。这就是所谓的“MED不会跨AS传递”
- 可以使用default med命令修改缺省的MED值，default med命令只对本设备上用import-route命令引入的路由和BGP的聚合路由生效

### Next_Hop

- 该属性是一个公认必循属性，用于指定到达目标网络的下一跳地址
- 当路由器学习到BGP路由后，需对BGP路由器的Next_Hop属性值进行检查，该属性值（IP地址）必须在本地路由可达，如果不可以，这条BGP路由不可用
- 在EBGP及IBGP对等体的场景中，Next_Hop的缺省操作时存在差异的

#### Next_Hop的缺省操作

- 路由器将BGP路由通告给自己的EBGP对等体时，将该路由的Next_Hop设置为自己的更新源IP地址
- 路由器在收到EBGP对等体所有通告的BGP路由后，再将路由传递给自己的IBGP对等体时，会保持路由的Next_Hop属性值不变
- 如果路由器收到某条BGP路由，该路由的Next_Hop地址值与EBGP对等体（更新对象）同属于一个网段，那么该条路由的Next_Hop地址将保持不变并传递给它的BGP对等体

### Community

- 该属性为可选传递属性，是一种路由标记，用于简化路由策略的执行
- 可以将某些路由分配给一个特定的Community属性值，之后就可以基于Community值而不是网络号/掩码信息来抓取路由并执行相应的策略了
- Community属性值长度为32比特，也就是4字节，通常使用两种形式呈现，一是十进制整数格式，二是十六进制的AA:NN格式，其中AA代表AS号，NN是自定义编号

#### 众所周知（Well-Known）的Community值

```bash
[R1]route-policy XXX  permit node 10
[R1-route-policy]apply community ?
```

​	NTEGER<0-4294967295>  Specify community number
​	STRING<3-11>           Specify aa<0-65535>:nn<0-65535>
​	internet               Internet(well-known community attributes)
​	no-advertise           Do not advertise to any peer (well-known community attributes)
​	no-export              Do not export to external peers(well-known community attributes)
​	no-export-subconfed    Do not send outside a sub-confederation(well-known community attributes)
​	none                   No community attribute

##### 众所周知（Well-Known）的Community值：no-advertise

- 如果路由器收到一条携带了community属性的BGP路由，其中包含了no-advertise属性值，那么这条路由将不能再传递给任何其它BGP对等体

##### 众所周知（Well-Known）的Community值：no-export

- 如果路由器收到了一条携带community属性的BGP路由，且其中包括no-export属性，那么该条路由将不能再传递给任何其它EBGP对等体（联邦EBGP对等体除外）

##### 众所周知（Well-Known）的Community值：no-export-subconfed

- 如果路由器收到了一条携带community属性的BGP路由，且其中包括no-export-subconfed属性，那么该条路由将不能再传递给任何其它EBGP对等体（包括联邦EBGP对等体）

### Atomic_Aggregate及aggregator

## BGP路由策略技术

### BGP路由自动汇总

- BGP支持路由自动汇总，该功能缺省关闭，可以在BGP配置视图中使用如下命令开启
  - summary automatic
- BGP路由自动汇总功能之对于本地采用import-route命令注入的BGP路由有效
- 开启该功能后，import-route注入的BGP路由会按主类网路进行汇总（按照IP地址所属类别的缺省网络掩码进行计算），所产生的汇总路由会发布到BGP中，而明细路由则会被抑制
- BGP路由自动汇总功能对汇总路由的把控较差，只能够将路由汇总成主类网路路由，无法做到精细化的掩码控制z

### BGP路由手工汇总

#### aggregate

[R1-bgp]aggregate 172.16.0.0 16 ?
  as-set             Generate the route with AS-SET path-attribute
  attribute-policy   Set aggregation attributes
  detail-suppressed  Filter more detail route from updates
  origin-policy      Filter the originate routes of the aggregate
  suppress-policy    Filter more detail route from updates through a Routing policy
  `<cr>`               Please press ENTER to execute command 

- 汇总路由丢失明细路由的路径属性，有可能导致路由环路

#### aggregate detail-suppressed

- 由于配置了detail-suppressed关键字，因此在路由通告的时候将抑制明细路由的通告
- 汇总路由丢失明细路由的路径属性，有可能导致路由环路

#### aggregate detail-suppressed as-set

- 增加as-set关键字后，该汇总路由将继承明细路由的Origin、AS-Path、Community等属性，其中对明细路由的AS-Path属性的继承最为重要，可以起到路由防环的作用

#### aggregate suppress-policy

- Aggregate命令的supperess-policy关键字用于通告汇总路由以及选定的明细路由（或者说只抑制特定的明细路由）
- 如果在aggregate命令后关联detail-supperess关键字，则所有的明细都将被抑制，如果需要产生汇总路由的同时通告特定的明细路由，可关联supperess-policy关键字，在其后调定义好的route-policy，被route-ploicy permit的路由将被过滤，其他路由被放行
- 抑制列表虽然调用route-policy，但route-policy只能用于匹配（if-match），不能用于设置属性（不能用apply命令）

#### aggregate attribute-policy

- 在aggregate命令中使用attribute-policy关键字，关联已经定义好的route-policy，在route-policy中使用apply语句修改路由属性，则可设置汇总路由的路由属性

#### aggregate origin-policy

- origin-policy关键字可调用一个已经定义好的route-policy，在该route-policy中使用if-match语句匹配明细路由。如此一来，aggregate命令产生的汇总路由是为了上述明细路由而产生只要这些明细路由中，至少有一条路由处于活跃状态，那么汇总路由就会被通告，如果route-policy所匹配的所有明细路由都是小，那么汇总路由也就随之

### 正则表达式

- 正则表达式（Regular expression）是按照一定的模板来匹配字符的公式

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/Network/正则表达式.png)

#### 原子字符

| 字符 | 含义                                                       |
| :--: | ---------------------------------------------------------- |
|  .   | 匹配任何单个字符，包括空格                                 |
|  ^   | 一个字符串的开始                                           |
|  $   | 一个字符串的结束                                           |
|  _   | 下划线，匹配任意的一个分隔符如 ^、$、空格、tab、逗号、{、} |
|  \|  | 管道符，逻辑或                                             |
|  \   | 转义符，用来将紧跟其后的控制字符转变为普通字符             |

#### 乘法字符

| 字符 | 含义                       |
| :--: | -------------------------- |
|  *   | 匹配前面字符0次或多次出现  |
|  +   | 匹配前面字符1次或多次出现  |
|  ?   | 匹配前面字符的0次或1次出现 |

- 一个乘法字符可以应用于一个单字符或多个字符，如果应用于多字符，需将字符串放入 ( ) 中

#### 范围字符

| 字符 | 含义                                                         |
| :--: | ------------------------------------------------------------ |
|  []  | 表示一个范围。只匹配包含在范围内的字符之一<br>可以在一个[]的开始使用^来排除范围内的所有字符，也可以使用短横线-来指定一个区间 |

### as-path-filter

- 使用正则表达式匹配AS_Path示例

| 示例           | 含义                                            |
| -------------- | ----------------------------------------------- |
| ^$             | 匹配不包含任何AS号的AS_Path，也就是本AS内的路由 |
| .*             | 一个点和一个星号，匹配所有，任何路由            |
| ^100$          | 就匹配100的这个AS_Path                          |
| _100$          | 以100结束的AS_Path，也就是路由起源于100AS的路由 |
| ^10[012349]$   | 匹配100、101、102、103、104、109这些AS_Path     |
| ^10[&and;0-6]$ | 匹配除了100-106外的AS_Path                      |
| ^10.           | 匹配100-109，以及10                             |
| ^(100\|200)$   | 匹配包含100及200的AS_Path                       |
| 12(_34)?_56    | 匹配12 56 以及12 34 56                          |

#### 配置命令

- 配置as-path-filter

```bash
[Router]ip as-path-filter 1 {permit | deny} regexp
```

- 关联as-path-filter到BGP peer，起到路由过滤作用

```bash
[Router]peer x.x.x.x as-path-filter as-path-filter {import | export}
```

#### as-path-filter验证及查看

- 查看配置的as-path access-list

```bash
[Router]display ip as-path-filter
```

- 显示BGP表中所有AS_Path被该正则表达式匹配的路由，这是一个非常不错的工具

```bash
[Router]display bgp routing-table regular expression
```

- 显示BGP表中所有被该as-path-filter匹配的路由

```bash
[Router]display bgp routing-table as-path-filter
```

## 示例

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/Network/为BGP设置Community拓扑.png)

### 为BGP路由设置Community

- 定义前缀列表匹配路由

```bash
[R1]ip ip-prefix 1 permit 1.1.1.0 24
```

- 给R1做路由策略

```bash
[R1]route-policy RP permit node 10
[R1-route-policy]if-match ip-prefix 1 
```

- 设置community值

```bash
[R1-route-policy]apply community 100:1
```

- 放通其它

```bash
[R1]route-policy RP permit node 20
```

- 回到BGP配置视图下执行策略

```bash
[R1-bgp]peer 10.1.12.2 route-policy RP export 
[R1-bgp]peer 10.1.12.2 advertise-community
```

**R2向R3发送路由更新将不携带community值，须在R2上配置**`advertise-community`

### 为BGP路由追加Community

- 定义前缀列表匹配路由

```bash
[R2]ip ip-prefix 1 permit 1.1.1.0 24
```

- 给R2做路由策略

```bash
[R2]route-policy RP permit node 10
[R2-route-policy]if-match ip-prefix 1 
```

- 设置community值

```bash
[R2-route-policy]apply community no-export additive 
```

- additive表示追加，如果没有则为覆盖

- 回到BGP配置视图下执行策略

```bash
[R2-bgp]peer 10.1.23.3 route-policy RP export 
[R2-bgp]peer 10.1.23.3 advertise-community
```

这时R3查看1.1.1.0的BGP信息时community属性为100:1, no-export

### 使用ip community-filter匹配community属性

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/Network/使用ip_community-filter匹配community属性.png)

- 创建一个ip community-filter

```bash
[R2]ip community-filter 1 permit 100:1
```

- 配置路由策略

```bash
[R2]route-policy RP permit node 10
[R2-route-policy]if-match community-filter 1
```

**注意事项：**

```bash
ip community-filter 1 permit 100:999
```

- 匹配community中包含100:999的路由，因此匹配住路由1.1.1.0/24及1.2.2.0/24

```bash
ip community-filter 2 permit 100:1 100:999
```

- 匹配community中包含100:1，**并且**包含100:999的路由，因此只匹配住1.1.1.0/24

```bash
ip community-filter 3 permit 100:1 100:1
ip community-filter 3 permit 100:1 100:2
```

- 匹配community中包含100:1，或者100:2的路由，因此匹配住路由1.1.1.0/24及1.2.2.0/24

```bash
ip community-filter 12 permit internet
```

- 默认所有路由都能被Internet这个community所匹配，因此这条community-filter同时匹配了路由1.1.1.0/24及1.2.2.0/24

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/Network/严格匹配.png)

```bash
ip community-filter 9 permit 100:999

route-policy RP permit node 10
if-match community-filter 9 whole-match
```

- whole-match关键字表示严格匹配，因此上面呢例子要求严格匹配community属性为100:999的路由，多一点，少一点都不行，这条route-policy只会匹配住路由1.2.2.0/24

### 删除一个community属性值

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/Network/删除一个community值.png)

- 匹配路由

```bash
[R2]ip community-filter 1 permit 100:2
```

- 匹配要删除的community值

```BASH
[R2]ip community-filter basic del permit 100:999
```

- 定义路由策略

```bash
[R2]route-policy PR permit node 10
[R2-route-policy]if-match community-filter 1
[R2-route-policy]apply comm-filter del delete 
```

- apply comm-filter del delete 删除100:999

#### 删除多个community属性值

匹配要删除的属性值的时候分行写

```bash
[R2]ip community-filter basic del permit 100:2
[R2]ip community-filter basic del permit 100:999
```

## RR和联邦

#####  中转AS中的IBGP问题

- 由于IBGP水平分割的存在，为了保证所有的BGP路由器都能学习到完整的BGP路由，就必须在AS内实现IBGP全互联。然而实现IBGP全互联存在诸多短板：
  - 路由器需维护大量的TCP及BGP链接，尤其在路由数量较多时；
  - AS内BGP网络的可扩展性较差
- 解决方案
  - 路由反射器
  - BGP联邦

### 路由反射器

- 路由反射器（Router Reflector RR）
- 客户端（Client）

#### 路由反射规则

- RR在收到BGP路由时：
  - 如果该路由学习自非Clinet IBGP对等体，则**反射**给自己所有的Client
  - 如果路由学习自Client，则**反射**给所有非Client IBGP对等体和除了该Client之外的所有Client（华为设备可以通过命令关闭RR在client之间的路由反射行为
  - 如果路由学习自EBGP对等体，则**发送**给所有Client和非Client IBGP对等体

#### RR场景下的BGP路由防环

由于AS_Path属性在AS内部不会发生变化（谨当路由离开本AS时AS_PATH才会改变），因此AS内才需要IBGP水平分割用于防止IBGP路由环路，而RR的存在实际上是放宽了水平分割原则，这就会给路由环路带来一定的潜在隐患，BGP通过两个特殊的路径属性来实现RR场景下的BGP路由防环

**Originator_ID**和**Cluster_List**是可选非传递属性，用来防止路由环路

##### Originator_ID

- Originator_ID是一个可选非传递属性，属性类型为9。是一个32bit的数值。RR将一条BGP路由进行反射时会在反射出去的路由中增加该路径属性，其值被设置为以下这些路由器的BGP Router-ID
  - 如果路由为本AS始发：则Originator_ID被设置为BGP路由器宣告者的Router-ID
  - 如果路由为非本AS始发：则Originator_ID被设置为本地AS的边界路由器Router-ID
- 当AS内存在多个RR，则Originator_ID属性由第一个RR船舰，并不被后续的RR（若有）所更改
- 当BGP路由器收到一条携带Originator_ID属性的IBGP路由，并且Originator_ID属性与其自身的Router-ID相同，则它会忽略关于该条路由的更新
- Originator_ID及Cluster_list会影响BGP路径优选决策

#### 路由反射簇（Cluster）

- 路由反射簇包括反射器及其Client。一个AS内允许存在多个路由反射簇
- 每一个簇都有唯一的簇ID（Cluster-ID，缺省时为RR的BGP Router-ID）
- 每一条路由被反射器反射后，该RR（该簇）的Cluster_ID就会被添加至路由的Cluster_List属性中
- 当RR收到一条携带Cluster_list属性的BGP路由，且该属性值中包含该簇的Cluster_ID时，RR认为该条路由存在环路，因此它将忽略关于该条路由的更新

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/Network/路由反射簇.png)

#### 示例

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/Network/BGP路由反射簇拓扑.png)

- 说明：

  AS345内使用loopback接口作为IGBP邻居接口

  其余使用直连接口作为EBGP邻居接口

为R1配置到NULL0的静态路由    10.1.1.0/24

- 通过R1将路由引入BGP 

```bash
[R1-bgp]network 10.1.1.0 24
```

这时R3可以收到该路由并且为bast

R4也可接收到该路由但为unvalid

这时将发送给R4的BGP路由的next-hop值设为R3的IP

```bash
[R3-bgp]peer 4.4.4.4 next-hop-local
```

这时R4上10.1.1.0路由为bast

- 将R4设置为RR

```bash
[R4-bgp]peer 3.3.3.3 reflect-client 
```

- 将R3设置为R4的client，这时R3,R4自动称为路由反射簇，这时R5就能收到

- 修改Cluster list

```bash
[R4-bgp]reflector cluster-id x.x.x.x
```

### BGP联邦

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/Network/BGP联邦.png)



#### 联邦内的BGP路由的路径属性

- 通告给联邦的BGP路由，Next_Hop属性在整个联邦范围内缺省不发生改变
- 通告给联邦的BGP路由，MED属性在整个联邦范围内缺省不发生改变
- 通告给联邦的BGP路由，Local_Preference属性在整个联邦范围内缺省不发生改变

- BGP路由在联邦内的EBGP对等体间传递时，路由器将成员AS号插入AS_Path，并且使用TYPE3、4的特殊AS_Path存储。成员AS号不会被公布到联邦AS之外，也即对于联邦AS外部而言，联帮成员AS是不可见的。
- AS_Path中的联邦成员AS号用于在联邦内部避免环路；联帮成员AS号不参与AS_Path长度计算

## BGP选路规则

### BGP路由优选规则概览

1. 优选具有最大[Perferred-Value](#Perferred_Value)的路由
2. 优选具有最大[Local_Preference](#Local_Preference)的路由
3. 有段起源于本地的路由
4. 优选[AS_Path](#AS_Path)最短的路由
5. [Origin](#ORIGIN)（IGP>EGP>Incomplete）
6. 优选[MED](#MED)最小的路由
7. 优选EBGP对等体所通告的路由
8. 优选[Next_Hop](#Next_Hop)的IGP度量值最小的路由
9. BGP路由负载分担
10. 优选[Cluster_List](#路由反射簇（Cluster）)最短的路由
11. 优选Router-ID最小的BGPO对等体发来的路由
12. 优选Peer-IP地址最小的对等体发来的路由

BGP路由优选规则也被称为BGP选路规则，不同厂商的设备在BGP选路上存在细微差异

#### 优选起源于本地的路由

- 在其他条件的情况下，优选本地生成的路由（本地生成的路由优先级高于从邻居学来的路由）
- 本地生成的路由包括通过network或import-route命令引入的路由、手工汇总路由和自动汇总路由。这些本地生成的路由之间的优选规则如下：
  1. 优选汇总路由（汇总路由的优先级高于非汇总路由的优先级）
  2. 通过aggregate命令生成的手动汇总路由的优先级高于通过summary automatic命令生成的自动汇总路由
  3. 通过network命令引入的路由优先级高于import-route

#### 优选AS_Path最短的路由

- AS_Set的长度为1，无论AS_Set中有多少AS号，长度仅当作1来计算
- AS_confed_sed和AS_confed_set类型不参与AS_Path长度计算

#### 关于MED对BGP路由优选的影响

- 一般情况下，BGP设备只比较来自同意AS（不同对等体）的路由的MED属性值。可以通过配置命令来允许BGP比较来自不同AS的路由的MED属性值。执行compaer-different-as-med命令后，系统将比较来自不同AS中的对等日的路由的MED值
- 如果路由没有MED值，BGP选路时将该路由的MED值按缺省值0来处理；执行bestroute med-none-as-maximum命令后，BGP选路时将该路由的MED属性值按最大值4294967265来处理bastroute-med-confederation
- BGP路由属性AS_Path按一定次序记录了某条路由从本地到目的地址所要经过的所有自治系统号。配置bastroute-med-confederation命令后，只有当AS_Path中不包含外部自治系统（不在联邦范围内的自治系统）号时才比较MED值的大小。如果AS_Path中包含外部自治系统号，则不进行比较。
- 使能deterministic-med功能，在对从多个不同AS收到的相同前缀的路由进行选路时，首先会按路由的AS_Path最左边的AS号进行分组。在组内进行比较后，再用组中的优选路由和其它组中的优选路由进行比较，消除了选路的结果和路由接受顺序的相关性。

#### BGP路由负载分担

- 在大型网络中，到达同一目的地的地址通常会存在多条有效BGP路由，<font color="red">设备只会优选一条最优的BGP路由，将该路由加载到路由表中使用</font>，并且只将最优路由发布给对等体，这一特点往往会造成很多流量负载不均衡的情况。<font color="red">通过配置BGP负载分担，可以使得设备同时将多条等代价的BGP路由加载到路由表</font>，实现流量负载均衡，减少网络拥塞。
- 值得注意的是，尽管配置了BGP负载分担，设备依然只会在多条到达同一目的地的BGP路由中优选一条路由，并只将这条路由通告给其他对等体
- 形成BGP等价负载均衡分担的条件是“BGP路由优选规则”的1至8条规则中需要比较的属性万千相同，例如相同的Perferred_Value、Local_Preference、AS_Path（包括长度及值）、MED、到达Next-hop的IGP度量值、路由类型（IBGP或EBGP）等。
- 如果实现了BGP负载分担，则不论是否配置了peer next-hop-local命令，本设备想IBGP对等体组发出路由时都先将下一跳地址改变为自身地址
- 在公网中到达同一目的地的路由形成负载分担时，系统会首先判断最优路由的类型。若最优路由为IBGP路由则只是IBGP路由参与负载分担，若最有路由为EBGP路由则只是EBGP路由参与负载分担，即公网中到达同意目的地的IBGP和EBGP路由不能形成负载分担
- 如果到达目的地址存在多条路由，但是这些路由分别经过了不同的AS，缺省情况下，这些路由不能形成负载分担。如果用户需要这些路由参与负载分担，就可以执行load-balancing as-path-ignore命令。配置load-balancing as-path-ignore命令后会改变路由参与负载分担的条件，路由形成负载分担时不再比较AS-Path属性，配置时需慎重考虑。
- load-balancing as-path-ignore命令和bastroute as-path-ignore命令互斥，不能同时使能。


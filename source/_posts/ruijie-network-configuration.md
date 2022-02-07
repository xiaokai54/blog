---
title: 省赛的一些配置（使用Ruijie设备）
tags:
  - 技能大赛
  - 网络技术
categories:
  - 网络
type: technology
mathjax: false
hide: false
date: 2021-10-06 17:30:21
description: 锐捷SSH RLDP SNMP等功能的配置
password:
message:
---

# ssh

-   为路由器和无线控制器开启 SSH 服务端功能，用户名和密码为 admin，密码为明文类型，特权密码为 admin

```shell
Ruijie(config) enable service ssh-server  # 全局使能SSH-SERVER
Ruijie(config) crypto key generate dsa   # 加密方式有两种：DSA和RSA,可以随意选择     
% You already have DSA keys.
% Do you really want to replace them? [yes/no]:yes
Choose the size of the rsa key modulus in the range of 512 to 2048
and the size of the dsa key modulus in the range of 360 to 2048 for your
Signature Keys. Choosing a key modulus greater than 512 may take
a few minutes.

How many bits in the modulus [512]:
% Generating 512 bit DSA keys ...[ok]
Ruijie(config) line vty 0 4  # 进入SSH密码配置模式，0 4表示允许共5个用户同时SSH登入到设备
Ruijie(config-line) login local  # 启用SSH时使用本地用户和密码功能
Ruijie(config) username admin password admin
Ruijie(config) enable password admin
```

# SNMP

-   配置所有设备 SNMP 消息，向主机 172.16.0.254 发送 Trap 消息版本采用V2C，读写的 Community 为“ruijie”，只读的 Community 为“public“，开启 Trap 消息

```shell
Ruijie(config) snmp-server community ruijie rw  # 配置读写消息
Ruijie(config) snmp-server community public ro  # 配置只读消息
Ruijie(config) snmp-server host 172.16.0.254 version 2c ruijie  # 向172.16.0.254发从版本为V2C的trap报文
Ruijie(config) snmp-server enable traps  # 使能交换机主动发送Trap消息 
```

# PrivateVlan

-   为节省 IP 资源，隔离广播风暴、病毒攻击，控制端口二层互访，在 S7 交换机使用 Private Vlan

```shell
Ruijie(config) vlan 10
Ruijie(config-vlan) name Primary
Ruijie(config-vlan) private-vlan primary  # 创建主VLAN
Ruijie(config) vlan 11
Ruijie(config-vlan) name Community
Ruijie(config-vlan) private-vlan community  # 创建团体VLAN
Ruijie(config) vlan 12
Ruijie(config-vlan) name Isolated
Ruijie(config-vlan) private-vlan isolated  # 创建隔离VLAN
Ruijie(config) vlan 10
Ruijie(config-vlan) private-vlan association add 11,12  # 进入主VLAN绑定团体VLAN和隔离VLAN

Ruijie(config) interface range gi 0/1 - 8
Ruijie(config-if-range) switchport mode private-vlan host  
Ruijie(config-if-range) switchport private-vlan host-association 10 11  # 将1-8端口加入团体vlan11  
Ruijie(config) interface range gi0/9 - 16
Ruijie(config-if-range) switchport mode private-vlan host
Ruijie(config-if-range) switchport private-vlan host-association 10 12  # 将9-16端口加入隔离vlan12     

Ruijie(config) intterface vlan 10
Ruijie(config-if-vlan) ip address 194.1.10.254 255.255.255.0 # 配置主VLAN的IP地址
Ruijie(config-if-vlan) private-vlan mapping add 11-12 # 映射两个辅vlan到主vlan10
```

# 端口保护

-   为隔离部分终端用户间的二层互访，在交换机S1、S2的Gi0/1-Gi0/16端口启用端口保护。

```shell
Ruijie(config) interface rang gi 1/0/1 - 16
Ruijie(config-if-range) sw protected  # 使能端口安全
Ruijie(config) interface rang gi 2/0/1 - 16
Ruijie(config-if-range) sw protected  # 使能端口安全
```

# Portfast & BPDUguard

-   连接 PC 端口开启 Portfast 和BPDUguard 防护功能；

```shell
Ruijie(config) int gi 0/1
Ruijie(config-if-GigabitEthernet 0/1) spanning-tree portfast  # 设置为边缘端口
Ruijie(config-if-GigabitEthernet 0/1) spanning-tree bpduguard enable  # 使能BPDU保护
```

# RLDP

-   为防止接入交换机下联端口私接HUB 设备引起环路，需要启用RLDP 协议；
-   终端接口检测到环路后处理方式为 Shutdown-Port； 
-   端口检测进入 Err-Disabled 状态，设置 300 秒自动恢复机制（基于接口部署策略）

```shell
Ruijie(config) rldp enable  # 使能RLDP协议
Ruijie(config) errdisable recovery interval 300
# 如果端口被RLDP检测并shutdown，再过300秒后会自动恢复，重新检测是否有环路     
Ruijie(config) int gi 0/1
Ruijie(config-if-GigabitEthernet 0/1) rldp port loop-detect shutdown-port
# 接口开启RLDP功能，如果检测出环路后shutdow该端口
```

# 端口安全

-   为了防止伪 IP 源地址攻击，导致出口路由器会话占满，要求 S7 交换机部署端口安全，接口 Gi0/1 只允许 PC2 通过

```shell
Ruijie(config) int gi 0/1
Ruijie(config-if-GigabitEthernet 0/1) switchport port-security  # 使能端口安全
Ruijie(config-if-GigabitEthernet 0/1) switchport port-security mac-address sticky  # 设置端口安全模式为sticky_MAC
Ruijie(config-if-GigabitEthernet 0/1) switchport port-security maximum 1  # 最大绑定一个MAC地址
```

# 端口镜像

-   在 S3 上只针对A 公司涉密部门VLAN10 网段与总部VLAN40 网段流量（ACL 编号 100）做端口镜像，目的端口为 Gi0/24，并且监控服务器也能正常访问互联网。

```shell
Ruijie(config) ip access-list extended 100  # 定义扩展ACL100
Ruijie(config-ext-nacl) permit ip 194.1.10.0 0.0.0.255 192.1.40.0 0.0.0.255  # 源194.1.10.0/24 目的 192.1.40.0/24
Ruijie(config) monitor session 1 source interface GigabitEthernet 0/5 rx acl 100
# 指定镜像会话1的源数据是Gi0/5收到的数据
Ruijie(config) monitor session 1 destination interface GigabitEthernet 0/24 switch
# 指定镜像会话1的目的端口是Gi0/24，并保证这个端口可以和其他端口正常通信
```

# DHCP&DHCPRealy

-   DHCP 服务器搭建于 EG2 上，地址池命名为 Pool_VLAN10，DHCP 对外服务使用 loopback 0 地址；
-   在交换机 S3、S4 上配置 DHCP 中继，对 VLAN10 内的用户进行中继

```shell
EG2(config) service dhcp  # 开启DHCP服务
EG2(config) ip dhcp pool Poor_VLAN10  # 定义名为Poor_VLAN10的DHCP地址池
EG2(dhcp-config) network 192.1.10.0 255.255.255.0  # 网段为192.1.10.0；掩码为255.255.255.0
EG2(dhcp-config) default-router 192.1.10.254  # 网关地址为192.1.10.254
EG2(config)ip dhcp excluded-address 192.1.10.252 192.1.10.253 # 保留192.1.10.252到192.1.10.253
S3(config) service dhcp  # 在S3交换机上开启DHCP服务
S3(config) ip helper-addres 10.1.0.14  # DHCP服务器IP地址为10.1.0.14
S4(config) service dhcp  # 在S4交换机上开启DHCP服务
S4(config) ip helper-addres 10.1.0.14
```

# DHCP Snooping+IP Source Guard+ARP-check

-   为了防御动态环境局域网 ARP 欺骗及伪 DHCP 服务欺骗，在（S1/S2）上部署 DHCP Snooping+IP Source Guard+ARP-check 解决方案

```shell
Ruijie(config) ip dhcp snooping  # 开启DHCP Snooping
Ruijie(config) interface gigabitEthernet 1/0/24
Ruijie(config-if-GigabitEthernet 1/0/24) ip dhcp snooping trust  # 设置DHCP信任端口
Ruijie(config) interface gigabitEthernet 1/0/1
Ruijie(config-if-GigabitEthernet 1/0/1) ip verify source port-security  # 开启源IP+MAC的报文检测
Ruijie(config-if-GigabitEthernet 1/0/1) arp-check  # 开启接口ARP-check功能
```

>   --  开启DHCP snooping的交换机所有接口缺省为untrust口，交换机只转发从trust口收到的DHCP响应报文（offer、ACK）
>
>   --  开启arp-check功能后，对于接口收到的ARP报文会检测ARP报文字段里面的Sender IP及Sender  MAC，与地址绑定库中的IP及MAC进行匹配，如果匹配将放行，否则丢弃该ARP报文
>
>   --  对于绑定后的用户，对应的IPv6  报文无法通过，如果要让绑定正确用户同时能使用IPv6的地址进行访问，那么需要在交换机上开启IPv6模式为兼容模式 ( address-bind ipv6-mode compatible )

# MSTP&VRRP

-   在交换机 S3、S4 上配置 MSTP 防止二层环路。要求 VLAN10、VLAN20、VLAN30、VLAN40、VLAN100 数据流经过 S3 转发，VLAN50、VLAN60 数据流经过 S4 转发，S3、S4 其中一台宕机时均可无缝切换至另一台进行转发。所配置的参数要求如下：
    -   region-name 为ruijie；
    -   revision 版本为 1；
    -   实例 1，包含 VLAN10、VLAN20、VLAN30、VLAN40、VLAN100；
    -   实例 2，包含 VLAN50,VLAN60； 
    -   S3 作为实例 0、1 中的主根，S4 作为实例 0、1 的从根；
    -   S4 作为实例 2 中的主根，S3 作为实例 2 的从根；
    -   主根优先级为 4096，从根优先级为 8192；
    -   在 S3 和 S4 上配置 VRRP，实现主机的网关冗余。
    -   S3、S4 各VRRP 组中高优先级设置为 200，低优先级设置为 110
    -   S3、S4 启用 IPV6 网络，实现 IPV6 终端可自动从网关处获取地址。
    -   在 S3 和S4 上配置 VRRP for IPv6，实现主机的 IPv6 网关冗余
    -   VRRP 主备状态与 IPV4 网络一致

|  VLAN   | VRRP备份组号（VRID） |  VRRP虚拟IP   |      VRRP6虚拟IP       |
| :-----: | :------------------: | :-----------: | :--------------------: |
| VLAN10  |          10          | 192.1.10.254  |  2001:192:10::254/64   |
| VLAN20  |          20          | 192.1.20.254  |  2001:192:20::254/64   |
| VLAN30  |          30          | 192.1.30.254  |  2001:192:30::254/64   |
| VLAN40  |          40          | 192.1.40.254  |  2001:192:40::254/64   |
| VLAN50  |          50          | 192.1.50.254  |           -            |
| VLAN60  |          60          | 192.1.60.254  |  2001:192:60::254/64   |
| VLAN100 |         100          | 192.1.100.254 | `2001:192:100::254/64` |

-   MSTP配置

```shell
VSU(config) spanning-tree  # 开启生成树
VSU(config) spanning-tree mst configuration  # 配置MSTP
VSU(config-mst) name ruijie  # 名称为ruijie
VSU(config-mst) revision 1  # 版本为1
VSU(config-mst) instance 1 vlan 10, 20, 30, 40, 100  # 实例1允许通过VLAN10、VLAN20、VLAN30、VLAN40、VLAN100
VSU(config-mst) instance 2 vlan 50, 60  # 实例2允许通过VLAN50、VLAN60

S3(config) spanning-tree
S3(config) spanning-tree mst configuration
S3(config-mst) name ruijie 
S3(config-mst) revision 1
S3(config-mst) instance 1 vlan 10, 20, 30, 40, 100
S3(config-mst) instance 2 vlan 50, 60

S4(config) spanning-tree
S4(config) spanning-tree mst configuration
S4(config-mst) name ruijie 
S4(config-mst) revision 1
S4(config-mst) instance 1 vlan 10, 20, 30, 40, 100
S4(config-mst) instance 2 vlan 50, 60

S3(config) spanning-tree mst 2 priority 8192  # S3为实例2的次根
S3(config) spanning-tree mst 1 priority 4096  # S3为实例1的主根
S3(config) spanning-tree mst 0 priority 4096  # S3为实例0的主根

S4(config) spanning-tree mst 2 priority 4096  # S4为实例2的主根
S4(config) spanning-tree mst 1 priority 8192  # S4为实例1的次根
S4(config) spanning-tree mst 0 priority 8192  # S4为实例0的次根
```

-   VRRP for IPv4配置

```shell
S3(config) interface vlan 10
S3(config-if-VLAN 10) ip address 192.1.10.252 255.255.255.0  # 配置VLAN10的IP地址
S3(config-if-VLAN 10) vrrp 10 ip 192.1.10.254  # 配置VRRP10的IP地址
S3(config-if-VLAN 10) vrrp 10 priority 200  # 设置VRRP10的优先级
S3(config) interface vlan 20
S3(config-if-VLAN 20) ip address 192.1.20.252 255.255.255.0
S3(config-if-VLAN 20) vrrp 20 ip 192.1.20.254
S3(config-if-VLAN 20) vrrp 20 priority 200
S3(config) interface vlan 30
S3(config-if-VLAN 30) ip address 192.1.30.252 255.255.255.0
S3(config-if-VLAN 30) vrrp 30 ip 192.1.30.254
S3(config-if-VLAN 30) vrrp 30 priority 200
S3(config) interface vlan 40
S3(config-if-VLAN 40) ip address 192.1.40.252 255.255.255.0
S3(config-if-VLAN 40) vrrp 40 ip 192.1.40.254
S3(config-if-VLAN 40) vrrp 40 priority 200
S3(config) interface vlan 50
S3(config-if-VLAN 50) ip address 192.1.50.252 255.255.255.0
S3(config-if-VLAN 50) vrrp 50 ip 192.1.50.254
S3(config-if-VLAN 50) vrrp 50 priority 110
S3(config) interface vlan 60
S3(config-if-VLAN 60) ip address 192.1.60.252 255.255.255.0
S3(config-if-VLAN 60) vrrp 60 ip 192.1.60.254
S3(config-if-VLAN 60) vrrp 60 priority 110
S3(config) interface vlan 100
S3(config-if-VLAN 100) ip address 192.1.100.252 255.255.255.0
S3(config-if-VLAN 100) vrrp 100 ip 192.1.100.254
S3(config-if-VLAN 100) vrrp 100 priority 200

S4(config) interface vlan 10
S4(config-if-VLAN 10) ip address 192.1.10.253 255.255.255.0
S4(config-if-VLAN 10) vrrp 10 ip 192.1.10.254
S4(config-if-VLAN 10) vrrp 10 priority 200
S4(config) interface vlan 20
S4(config-if-VLAN 20) ip address 192.1.20.253 255.255.255.0
S4(config-if-VLAN 20) vrrp 20 ip 192.1.20.254
S4(config-if-VLAN 20) vrrp 20 priority 200
S4(config) interface vlan 30
S4(config-if-VLAN 30) ip address 192.1.30.253 255.255.255.0
S4(config-if-VLAN 30) vrrp 30 ip 192.1.30.254
S4(config-if-VLAN 30) vrrp 30 priority 200
S4(config) interface vlan 40
S4(config-if-VLAN 40) ip address 192.1.40.253 255.255.255.0
S4(config-if-VLAN 40) vrrp 40 ip 192.1.40.254
S4(config-if-VLAN 40) vrrp 40 priority 200
S4(config) interface vlan 50
S4(config-if-VLAN 50) ip address 192.1.50.253 255.255.255.0
S4(config-if-VLAN 50) vrrp 50 ip 192.1.50.254
S4(config-if-VLAN 50) vrrp 50 priority 110
S4(config) interface vlan 60
S4(config-if-VLAN 60) ip address 192.1.60.253 255.255.255.0
S4(config-if-VLAN 60) vrrp 60 ip 192.1.60.254
S4(config-if-VLAN 60) vrrp 60 priority 110
S4(config) interface vlan 100
S4(config-if-VLAN 100) ip address 192.1.100.253 255.255.255.0
S4(config-if-VLAN 100) vrrp 100 ip 192.1.100.254
S4(config-if-VLAN 100) vrrp 100 priority 200
```

-   VRRP for IPv6配置

```shell
S3(config) ipv6 unicast-routing  # 开启IPv6单播路由
S3(config) interface vlan 10
S3(config-if-VLAN 10) ipv6 enable  # 开启IPv6
S3(config-if-VLAN 10) ipv6 address 2001:192:10::252/64  # 配置VLAN10的IPv6地址
S3(config-if-VLAN 10) ipv6 address autoconfig  # 无状态自动配置
S3(config-if-VLAN 10) no ipv6 nd suppress-ra  # 开启路由通告功能
S3(config-if-VLAN 10) vrrp 10 ipv6 FE80::  # 配置VRRP6 10的本地链路地址为FE80::
S3(config-if-VLAN 10) vrrp 10 ipv6 2001:192:10::254  # 配置VRRP6 10的IPv6地址为2001:192:10::254
S3(config-if-VLAN 10) vrrp ipv6 10 priority 200  # 配置VRRP6 10的优先级
S3(config) interface vlan 20
S3(config-if-VLAN 20) ipv6 enable 
S3(config-if-VLAN 20) ipv6 address 2001:192:20::252/64
S3(config-if-VLAN 20) ipv6 address autoconfig
S3(config-if-VLAN 20) no ipv6 nd suppress-ra
S3(config-if-VLAN 20) vrrp 20 ipv6 FE80::
S3(config-if-VLAN 20) vrrp 20 ipv6 2001:192:20::254
S3(config-if-VLAN 20) vrrp ipv6 20 priority 200
S3(config) interface vlan 30
S3(config-if-VLAN 30) ipv6 enable 
S3(config-if-VLAN 30) ipv6 address 2001:192:30::252/64
S3(config-if-VLAN 30) ipv6 address autoconfig
S3(config-if-VLAN 30) no ipv6 nd suppress-ra
S3(config-if-VLAN 30) vrrp 30 ipv6 FE80::
S3(config-if-VLAN 30) vrrp 30 ipv6 2001:192:30::254
S3(config-if-VLAN 30) vrrp ipv6 30 priority 200
S3(config) interface vlan 40
S3(config-if-VLAN 40) ipv6 enable 
S3(config-if-VLAN 40) ipv6 address 2001:192:40::252/64
S3(config-if-VLAN 40) ipv6 address autoconfig
S3(config-if-VLAN 40) no ipv6 nd suppress-ra
S3(config-if-VLAN 40) vrrp 40 ipv6 FE80::
S3(config-if-VLAN 40) vrrp 40 ipv6 2001:192:40::254
S3(config-if-VLAN 40) vrrp ipv6 40 priority 200
S3(config) interface vlan 60
S3(config-if-VLAN 60) ipv6 enable 
S3(config-if-VLAN 60) ipv6 address 2001:192:60::252/64
S3(config-if-VLAN 60) ipv6 address autoconfig
S3(config-if-VLAN 60) no ipv6 nd suppress-ra
S3(config-if-VLAN 60) vrrp 60 ipv6 FE80::
S3(config-if-VLAN 60) vrrp 60 ipv6 2001:192:60::254
S3(config-if-VLAN 60) vrrp ipv6 60 priority 110
S3(config) interface vlan 100
S3(config-if-VLAN 100) ipv6 enable 
S3(config-if-VLAN 100) ipv6 address 2001:192:100::252/64
S3(config-if-VLAN 100) ipv6 address autoconfig
S3(config-if-VLAN 100) no ipv6 nd suppress-ra
S3(config-if-VLAN 100) vrrp 100 ipv6 FE80::
S3(config-if-VLAN 100) vrrp 100 ipv6 2001:192:100::254 
S3(config-if-VLAN 100) vrrp ipv6 100 priority 200

S4(config) ipv6 unicast-routing
S4(config) interface vlan 10
S4(config-if-VLAN 10) ipv6 enable
S4(config-if-VLAN 10) ipv6 address 2001:192:10::253/64
S4(config-if-VLAN 10) ipv6 address autoconfig
S4(config-if-VLAN 10) no ipv6 nd suppress-ra
S4(config-if-VLAN 10) vrrp 10 ipv6 FE80::
S4(config-if-VLAN 10) vrrp 10 ipv6 2001:192:10::254
S4(config-if-VLAN 10) vrrp ipv6 10 priority 200
S4(config) interface vlan 20
S4(config-if-VLAN 20) ipv6 enable 
S4(config-if-VLAN 20) ipv6 address 2001:192:20::253/64
S4(config-if-VLAN 20) ipv6 address autoconfig
S4(config-if-VLAN 20) no ipv6 nd suppress-ra
S4(config-if-VLAN 20) vrrp 20 ipv6 FE80::
S4(config-if-VLAN 20) vrrp 20 ipv6 2001:192:20::254
S4(config-if-VLAN 20) vrrp ipv6 20 priority 200
S4(config) interface vlan 30
S4(config-if-VLAN 30) ipv6 enable 
S4(config-if-VLAN 30) ipv6 address 2001:192:30::253/64
S4(config-if-VLAN 30) ipv6 address autoconfig
S4(config-if-VLAN 30) no ipv6 nd suppress-ra
S4(config-if-VLAN 30) vrrp 30 ipv6 FE80::
S4(config-if-VLAN 30) vrrp 30 ipv6 2001:192:30::254
S4(config-if-VLAN 30) vrrp ipv6 30 priority 200
S4(config) interface vlan 40
S4(config-if-VLAN 40) ipv6 enable 
S4(config-if-VLAN 40) ipv6 address 2001:192:40::253/64
S4(config-if-VLAN 40) ipv6 address autoconfig
S4(config-if-VLAN 40) no ipv6 nd suppress-ra
S4(config-if-VLAN 40) vrrp 40 ipv6 FE80::
S4(config-if-VLAN 40) vrrp 40 ipv6 2001:192:40::254
S4(config-if-VLAN 40) vrrp ipv6 40 priority 200
S4(config) interface vlan 60
S4(config-if-VLAN 60) ipv6 enable 
S4(config-if-VLAN 60) ipv6 address 2001:192:60::253/64
S4(config-if-VLAN 60) ipv6 address autoconfig
S4(config-if-VLAN 60) no ipv6 nd suppress-ra
S4(config-if-VLAN 60) vrrp 60 ipv6 FE80::
S4(config-if-VLAN 60) vrrp 60 ipv6 2001:192:60::254
S4(config-if-VLAN 60) vrrp ipv6 60 priority 110
S4(config) interface vlan 100
S4(config-if-VLAN 100) ipv6 enable 
S4(config-if-VLAN 100) ipv6 address 2001:192:100::253/64
S4(config-if-VLAN 100) ipv6 address autoconfig
S4(config-if-VLAN 100) no ipv6 nd suppress-ra
S4(config-if-VLAN 100) vrrp 100 ipv6 FE80::
S4(config-if-VLAN 100) vrrp 100 ipv6 2001:192:100::254 
S4(config-if-VLAN 100) vrrp ipv6 100 priority 200
```

# 网络设备虚拟化

-   两台接入交换机通过 VSU 虚拟化为一台设备进行管理，从而实现高可靠性。当任意交换机故障时，都能实现设备、链路切换，保护客户业务稳定运行
-   规划 S1 和S2 间的 Te0/25-26 端口作为 VSL 链路，使用 VSU 技术实现网络设备虚拟化。其中 S1 为主，S2 为备；
-   规划 S1 和 S2 间的 Gi0/17 端口作为双主机检测链路，配置基于 BFD 的双主机检测，当 VSL 的所有物理链路都异常断开时，备机会切换成主机，从而保障网络正常；
-   主设备：Domain id ：1，switch id：1，priority 200，description：S2910-24GT4XS-E-1
-   备设备：Domain id ：1，switch id：2，priority 150，description：S2910-24GT4XS-E-2

```shell
S1(config) switch virtual domain 1  
S1(config) switch 1  # 设置switch ID
S1(config-vs-domain) switch 1 priority 200  # 将switch1的优先级设置为200
S1(config-vs-domain) switch 1 description S2910-24GT4XS-E-1  # switch1的描述为S2910-24GT4XS-E-1
S1(config) vsl-port  # 进入VSL配置视图
S1(config-vsl-ap-1) port-member interface TengigabitEthernet 0/25  # 配置Te0/25为VSL链路
S1(config-vsl-ap-1) port-member interface TengigabitEthernet 0/26  # 配置Te0/26为VSL链路
S1(config-vsl-ap-1) end
S1# write memory
S1# switch convert mode virtual  --  更改为VSU模式
Are you sure to convert switch to virtual mode[yes/no]：yes     
Do you want to recover config file from backup file in virtual mode (press 'ctrl + c' to cancel) [yes/no]：no
# no 标识重新配置

S2(config) switch virtual domain 1  
S2(config) switch 2
S2(config-vs-domain) switch 1 priority 150
S2(config-vs-domain) switch 1 description S2910-24GT4XS-E-2
S2(config) vsl-port
S2(config-vsl-ap-1) port-member interface TengigabitEthernet 0/25
S2(config-vsl-ap-1) port-member interface TengigabitEthernet 0/26
S2(config-vsl-ap-1) end
S2# write memory
S2# switch convert mode virtual
Are you sure to convert switch to virtual mode[yes/no]：yes     
Do you want to recover config file from backup file in virtual mode (press 'ctrl + c' to cancel) [yes/no]：no
```

-   选择转换模式后，设备会重启启动，并组建VSU。 

```shell
VSU(config) interface gi1/0/17
VSU(config-if-GigabitEthernet 1/0/17) no switchport  # 转换为三层口
VSU(config) interface gi2/0/17
VSU(config-if-GigabitEthernet 2/0/17) no switchport
VSU(config) switch virtual domain 1
VSU(config-vs-domain) dual-active detection bfd  #  BFD 开关,缺省关闭
VSU(config-vs-domain) dual-active bfd interface gi1/0/17  # 配置一对BFD 检测接口 
VSU(config-vs-domain) dual-active bfd interface gi2/0/17  
```

# 被动接口

-   要求只允许在设备互联网段出现协议报文

```shell
Ruijie(config) router ospf 10
Ruijie(config-router) passive-interface vlan10  # 配置VLAN10为被动接口
Ruijie(config) router rip
Ruijie(config-router) passive-interface interface gi 0/1  # 设置Gi0/1为被动接口
```

-   被动接口：
    -   在OSPF中，被动接口不发送和接收OSPF报文
    -   在RIP中，被动接口只接收不发送RIP报文

# 修改OSPF网络类型

-   优化 OSPF 相关配置，以尽量加快 OSPF 收敛

```shell
Ruijie(config) interface gi0/1
Ruijie(config-if-GigabitEthernet 0/1) ip ospf network point-to-point  # 修改接口OSPF网络类型为p2p
```

# MPLS VPN

-   北京总部、广州分部、吉林分部三个企业内部的局域网之间，通过 MPLS VPN 技术实现安全访问。其中，R1、R2、R3 开启 MPLS 报文转发及 LDP 标签转发协议。VRF 名称为 VPNA,RD 值分别 100:1、100:2、100:3，RT 值均为 1:1。
-   在 R1、R2、R3 间部署 IBGP,AS 号为 100。IGP 协议使用 OSPF，归属区域 0，进程号 20。定义 R1 为路由反射器 RR，使用 Loopback 接口建立 BGP 邻居关系。

>   配置思路：
>
>   1.   部署AS核心的IGP路由协议
>   2.   部署AS核心的MPLS
>        1.   全局开启MPLS转发功能
>        2.   全局开启LDP标签分发协议
>        3.   开启接口的标签交换能力
>        4.   接口下开启LDP协议
>   3.   部署PE-PE的MP-BGP协议
>        1.   启用BGP进程
>        2.   进入VPNV4地址簇下激活VPNV4邻居关系
>        3.   配置路由反射器RR
>   4.   部署PE-CE的路由协议
>        1.   创建VRF实例
>        2.   将相关接口划入对应的VRF实例中
>        3.   配置PE-CE的路由协议
>   5.   将CE的路由重发布进MP-BGP
>   6.   将MP-BGP的路由重发布进CE

-   MPLS

```shell
R1(config) mpls ip  # 全局开启MPLS转发功能
R1(config) mpls router ldp  # 全局开启LDP标签分发协议
R1(config-mpls-router) ldp router-id interface loopback 0 force  # 指定LSR-ID
R1(config) interface gi0/1
R1(config-if-GigabitEthernet 0/1) label-switching  # 开启接口的标签交换能力
# 缺省情况下，三层接口只能识别IP数据包，如果不开启标签交换能力的话，是不能识别0x8847的标签包。
R1(config-if-GigabitEthernet 0/1) mpls ip  # 接口下开启LDP协议
```

-   PE-PE的MP-BGP协议

```shell
R1(config) router bgp 100
R1(config-router) neighbor 3.3.3.3 remote-as 100
R1(config-router) neighbor 3.3.3.3 update-source Loopback 0
R1(config-router) no bgp default ipv4-unicast  # 关闭缺省的IPV4单播的邻居建立过程
R1(config-router) address-family vpnv4 unicast  # 进入进入VPNV4地址簇
R1(config-router-af) neighbor 3.3.3.3 activate  # 激活VPNV4邻居关系

R2(config) router bgp 100
R2(config-router) neighbor 2.2.2.2 remote-as 100
R2(config-router) neighbor 2.2.2.2 update-source Loopback 0
R2(config-router) neighbor 2.2.2.2 route-reflector-client  # 设置路由反射客户为R1
R2(config-router) neighbor 4.4.4.4 remote-as 100
R2(config-router) neighbor 4.4.4.4 update-source Loopback 0
R2(config-router) neighbor 4.4.4.4 route-reflector-client  # 设置路由反射客户为R3
R2(config-router) no bgp default ipv4-unicast
R2(config-router) address-family vpnv4 unicast
R2(config-router-af) neighbor 2.2.2.2 activate
R2(config-router-af) neighbor 2.2.2.2 route-reflector-client
R2(config-router-af) neighbor 4.4.4.4 activate
R2(config-router-af) neighbor 4.4.4.4 route-reflector-client

R3(config) router bgp 100
R3(config-router) neighbor 3.3.3.3 remote-as 100
R3(config-router) neighbor 3.3.3.3 update-source Loopback 0
R3(config-router) no bgp default ipv4-unicast
R3(config-router) address-family vpnv4 unicast
R3(config-router-af) neighbor 3.3.3.3 activate
```

-   PE-CE的路由协议

```shell
R1(config) ip vrf VPNA  # 创建名为VPNA的VRF实例
R1(config-vrf) rd 100:1  # 设置RD为100:1
R1(config-vrf) route-target both 1:1  # 设置进和出RT均为1:1
R1(config) router ospf 10 vrf VPNA  # 启用VPNA虚拟转发的OSPF进程    
R1(config-router) network 12.1.1.0 0.0.0.255 area 0
```


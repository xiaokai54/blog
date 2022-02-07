---
title: 山东省第四届大学生网络技术大赛企业网赛道决赛操作题
tags:
  - 竞赛
  - 企业网赛道
categories:
  - 文档
type: docs
mathjax: false
hide: false
date: 2021-11-11 17:35:32
description: VLAN、STP、聚合技术、静态路由、RIP、OSPF、BGP、ISIS、MPLS、VRRP、防火墙、VPN、DHCP、ACL、NAT、WLAN、网络自动化运维
password:
message:
---

# 项目背景

- 某公司的总部位于济南，随着业务发展壮大，在内蒙古成立分公司开拓新业务，由于总部人员较多，重要业务集中于此，网络建设要求较高，因此采用MSTP+VRRP 方式保证网络可靠。总部和分公司业务往来密切，为保证数据能在公网安全可靠传输，采用跨域 VPN-OptionB 部署方案。

---

# 拓扑描述

- 总部设备：交换机 LSW1、LSW2、LSW3、LSW4、LSW5、LSW6，路由器 CE1，无线控制器AC1，无线接入点 AP1，终端PC1、PC2、PC3、PC4、PC5，无线终端 STA1。
- 分公司设备：交换机 LSW7、LSW8，路由器 CE2、AR7、AR8，防火墙 FW1，路由器R2，终端 PC6、PC7，服务器 Server1、Server2、Server3。
- 运营商设备：路由器 PE1、ASBR-PE1、ASBR-PE2、PE2。
- 公司总部的网络通过路由器 CE1 经过运营商网络连接分公司的路由器 CE2，实现总部网络和分公司网络互访。公司总部的路由器设备 CE1 和公司分部的路由器设备 CE2 通过配置相关的 VPN 技术，实现总部网络和分部网络的业务数据安全可靠传输。

---

# 拓扑结构

![enterprise-network-topological-graph](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/enterprise-network-topological-graph.png)

---

# 网络环境介绍

### 设备基本互联信息

> 表 1	接口互联信息

<table style="text-align: center;">
    <!-- header -->
    <tr>
        <th>设备名称</th>
        <th>设备编号</th>
        <th>本地设备端口</th>
        <th>对端设备端口</th>
        <th>端口类型</th>
        <th>允许通过的vlan</th>
    </tr>
    <!-- LSW1 -->
    <tr>
        <td rowspan="11">LSW1</td>
        <td rowspan="11">1</td>
        <td>SW1-G0/0/1</td>
        <td>SW3-G0/0/1</td>
        <td>trunk</td>
        <td>10 50 60</td>
    </tr>
    <tr>
        <td>SW1-G0/0/2</td>
        <td>SW2-G0/0/1</td>
        <td>hybrid</td>
        <td>1</td>
    </tr>
    <tr>
        <td>SW1-G0/0/3</td>
        <td>SW2-G0/0/3</td>
        <td>hybrid</td>
        <td>1</td>
    </tr>
    <tr>
        <td>SW1-G0/0/4</td>
        <td>SW2-G0/0/4</td>
        <td>hybrid</td>
        <td>1</td>
    </tr>
    <tr>
        <td>SW1-G0/0/5</td>
        <td>SW4-G0/0/2</td>
        <td>trunk</td>
        <td>20</td>
    </tr>
    <tr>
        <td>SW1-G0/0/6</td>
        <td>SW5-G0/0/1</td>
        <td>trunk</td>
        <td>30 40</td>
    </tr>
    <tr>
        <td>SW1-G0/0/7</td>
        <td>SW6-G0/0/1</td>
        <td>hybrid</td>
        <td>1</td>
    </tr>
    <tr>
        <td>SW1-G0/0/8</td>
        <td>SW6-G0/0/4</td>
        <td>hybrid</td>
        <td>1</td>
    </tr>
    <tr>
        <td>SW1-G0/0/9</td>
        <td>AC1-G0/0/1</td>
        <td>trunk</td>
        <td>50 60</td>
    </tr>
    <tr>
        <td>SW1-Eth-Trunk1</td>
        <td>SW2-Eth-Trunk1</td>
        <td>trunk</td>
        <td>10 20 30 40</td>
    </tr>
    <tr>
        <td>SW1-Eth-Trunk2</td>
        <td>SW6-Eth-Trunk2</td>
        <td>trunk</td>
        <td>16 60</td>
    </tr>
    <!-- LSW2 -->
    <tr>
        <td rowspan="10">LSW2</td>
        <td rowspan="10">2</td>
        <td>SW2-G0/0/1</td>
        <td>SW1-G0/0/2</td>
        <td>hybrid</td>
        <td>1</td>
    </tr>
    <tr>
        <td>SW2-G0/0/2</td>
        <td>SW3-G0/0/2</td>
        <td>Trunk</td>
        <td>10</td>
    </tr>
    <tr>
        <td>SW2-G0/0/3</td>
        <td>SW1-G0/0/3</td>
        <td>hybrid</td>
        <td>1</td>
    </tr>
    <tr>
        <td>SW2-G0/0/4</td>
        <td>SW1-G0/0/4</td>
        <td>hybrid</td>
        <td>1</td>
    </tr>
    <tr>
        <td>SW2-G0/0/5</td>
        <td>SW4-G0/0/1</td>
        <td>Trunk</td>
        <td>20</td>
    </tr>
    <tr>
        <td>SW2-G0/0/6</td>
        <td>SW5-G0/0/2</td>
        <td>Trunk</td>
        <td>30 40</td>
    </tr>
    <tr>
        <td>SW2-G0/0/7</td>
        <td>SW6-G0/0/2</td>
        <td>hybrid</td>
        <td>1</td>
    </tr>
    <tr>
        <td>SW2-G0/0/8</td>
        <td>SW6-G0/0/5</td>
        <td>hybrid</td>
        <td>1</td>
    </tr>
    <tr>
        <td>SW2-Eth-Trunk1</td>
        <td>SW1-Eth-Trunk1</td>
        <td>Trunk</td>
        <td>10 20 30 40</td>
    </tr>
    <tr>
        <td>SW2-Eth-Trunk3</td>
        <td>SW6-Eth-Trunk3</td>
        <td>Trunk</td>
        <td>26</td>
    </tr>
    <!-- LSW3 -->
    <tr>
        <td rowspan="5">LSW3</td>
        <td rowspan="5">3</td>
        <td>SW3-G0/0/1</td>
        <td>SW1-G0/0/1</td>
        <td>Trunk</td>
        <td>10 50 60</td>
    </tr>
    <tr>
        <td>SW3-G0/0/2</td>
        <td>SW2-G0/0/2</td>
        <td>Trunk</td>
        <td>10</td>
    </tr>
    <tr>
        <td>SW3-G0/0/3</td>
        <td>PC1-E0/0/1</td>
        <td>hybrid</td>
        <td>10</td>
    </tr>
    <tr>
        <td>SW3-G0/0/4</td>
        <td>PC2-E0/0/1</td>
        <td>hybrid</td>
        <td>10</td>
    </tr>
    <tr>
        <td>SW3-G0/0/5</td>
        <td>AP1-G0/0/0</td>
        <td>Trunk</td>
        <td>50</td>
    </tr>
    <!-- LSW4 -->
    <tr>
        <td rowspan="3">LSW4</td>
        <td rowspan="3">4</td>
        <td>SW4-G0/0/1</td>
        <td>SW2-G0/0/5</td>
        <td>Trunk</td>
        <td>20</td>
    </tr>
    <tr>
        <td>SW4-G0/0/2</td>
        <td>SW1-G0/0/5</td>
        <td>Trunk</td>
        <td>20</td>
    </tr>
    <tr>
        <td>SW4-G0/0/3</td>
        <td>PC3-E0/0/1</td>
        <td>hybrid</td>
        <td>20</td>
    </tr>
    <!-- LSW5 -->
    <tr>
        <td rowspan="4">LSW5</td>
        <td rowspan="4">5</td>
        <td>SW5-G0/0/1</td>
        <td>SW1-G0/0/6</td>
        <td>Trunk</td>
        <td>30 40</td>
    </tr>
    <tr>
        <td>SW5-G0/0/2</td>
        <td>SW2-G0/0/6</td>
        <td>Trunk</td>
        <td>30 40</td>
    </tr>
    <tr>
        <td>SW5-G0/0/3</td>
        <td>PC4-E0/0/1</td>
        <td>hybrid</td>
        <td>30</td>
    </tr>
    <tr>
        <td>SW5-G0/0/4</td>
        <td>PC5-E0/0/1</td>
        <td>hybrid</td>
        <td>40</td>
    </tr>
    <!-- LSW6 -->
    <tr>
        <td rowspan="8">LSW6</td>
        <td rowspan="8">6</td>
        <td>SW5-G0/0/1</td>
        <td>SW1-G0/0/7</td>
        <td>hybrid</td>
        <td>1</td>
    </tr>
    <tr>
        <td>SW5-G0/0/2</td>
        <td>SW2-G0/0/7</td>
        <td>hybrid</td>
        <td>1</td>
    </tr>
    <tr>
        <td>SW5-G0/0/3</td>
        <td>CE1-G0/0/0</td>
        <td>hybrid</td>
        <td>61</td>
    </tr>
    <tr>
        <td>SW5-G0/0/4</td>
        <td>SW1-G0/0/8</td>
        <td>hybrid</td>
        <td>1</td>
    </tr>
    <tr>
        <td>SW5-G0/0/5</td>
        <td>SW2-G0/0/8</td>
        <td>hybrid</td>
        <td>1</td>
    </tr>
    <tr>
        <td>SW6-Eth-Trunk2</td>
        <td>SW1-Eth-Trunk2</td>
        <td>Trunk</td>
        <td>16 60</td>
    </tr>
    <tr>
        <td>SW6-Eth-Trunk3</td>
        <td>SW2-Eth-Trunk3</td>
        <td>Trunk</td>
        <td>26</td>
    </tr>
    <tr>
        <td>SW5-G0/0/6</td>
        <td>Cloud1-E0/0/1</td>
        <td>hybrid</td>
        <td>100</td>
    </tr>
    <!-- AC1 -->
    <tr>
        <td>AC1</td>
        <td>7</td>
        <td>AC1-G0/0/1</td>
        <td>SW1-G0/0/9</td>
        <td>Trunk</td>
        <td>50 60</td>
    </tr>
    <!-- AP1 -->
    <tr>
        <td>AP1</td>
        <td>8</td>
        <td>AP1-G0/0/0</td>
        <td>SW3-G0/0/5</td>
        <td></td>
        <td></td>
    </tr>
    <!-- CE1 -->
    <tr>
        <td rowspan="2">CE1</td>
        <td rowspan="2">9</td>
        <td>CE1-G0/0/0</td>
        <td>SW6-G0/0/3</td>
        <td rowspan="20">三层接口</td>
        <td rowspan="20"></td>
    </tr>
    <tr>
        <td>CE1-G0/0/1</td>
        <td>PE1-G0/0/0</td>
    </tr>
    <!-- PE1 -->
    <tr>
        <td rowspan="2">PR1</td>
        <td rowspan="2">10</td>
        <td>PE1-G0/0/0</td>
        <td>CE1-G0/0/1</td>
    </tr>
    <tr>
        <td>PE1-G0/0/1</td>
        <td>ASBR-PE1-G0/0/0</td>
    </tr>
    <!-- ASBR-PE1 -->
    <tr>
        <td rowspan="2">ASBR-PE1</td>
        <td rowspan="2">11</td>
        <td>ASBR-PE1-G0/0/0</td>
        <td>PE1-G0/0/1</td>
    </tr>
    <tr>
        <td>ASBR-PE1-G0/0/1</td>
        <td>ASBR-PE2-G0/0/0</td>
    </tr>
    <!-- ASBR-PE2 -->
    <tr>
        <td rowspan="2">ASBR-PE2</td>
        <td rowspan="2">12</td>
        <td>ASBR-PE2-G0/0/0</td>
        <td>ASBR-PE1-G0/0/1</td>
    </tr>
    <tr>
        <td>ASBR-PE2-G0/0/1</td>
        <td>PE2-G0/0/0</td>
    </tr>
    <!-- PE2 -->
    <tr>
        <td rowspan="2">PE2</td>
        <td rowspan="2">13</td>
        <td>PE2-G0/0/0</td>
        <td>ASBR-PE2-G0/0/1</td>
    </tr>
    <tr>
        <td>PE2-G0/0/1</td>
        <td>CE2-G0/0/0</td>
    </tr>
    <!-- CE2 -->
    <tr>
        <td rowspan="4">CE2</td>
        <td rowspan="4">14</td>
        <td>CE2-G0/0/0</td>
        <td>PE2-G0/0/1</td>
    </tr>
    <tr>
        <td>CE2-G0/0/1</td>
        <td>AR7-G0/0/0</td>
    </tr>
    <tr>
        <td>CE2-G0/0/2</td>
        <td>AR8-G0/0/0</td>
    </tr>
    <tr>
        <td>CE2-G0/0/3</td>
        <td>FW1-G1/0/0</td>
    </tr>
    <!-- FW1 -->
    <tr>
        <td rowspan="2">FW1</td>
        <td rowspan="2">15</td>
        <td>FW1-G1/0/0</td>
        <td>CE2-G4/0/0</td>
    </tr>
    <tr>
        <td>FW1-G1/0/1</td>
        <td>SW8-G0/0/1</td>
    </tr>
    <!-- AR7 -->
    <tr>
        <td rowspan="2">AR7</td>
        <td rowspan="2">16</td>
        <td>AR7-G0/0/0</td>
        <td>CE2-G0/0/1</td>
    </tr>
    <tr>
        <td>AR7-G0/0/1</td>
        <td>SW7-G0/0/1</td>
    </tr>
    <!-- AR8 -->
    <tr>
        <td rowspan="2">AR8</td>
        <td rowspan="2">17</td>
        <td>AR8-G0/0/0</td>
        <td>CE2-G0/0/2</td>
    </tr>
    <tr>
        <td>AR8-G0/0/1</td>
        <td>SW7-G0/0/2</td>
    </tr>
    <!-- LSW7 -->
    <tr>
        <td rowspan="4">LSW7</td>
        <td rowspan="4">18</td>
        <td>SW7-G0/0/1</td>
        <td>AR7-G0/0/1</td>
        <td>Trunk</td>
        <td>51 52</td>
    </tr>
    <tr>
        <td>SW7-G0/0/2</td>
        <td>AR8-G0/0/1</td>
        <td>Trunk</td>
        <td>51 52</td>
    </tr>
    <tr>
        <td>SW7-G0/0/3</td>
        <td>PC6-E0/0/1</td>
        <td>Access</td>
        <td>51</td>
    </tr>
    <tr>
        <td>SW7-G0/0/4</td>
        <td>PC7-E0/0/1</td>
        <td>Access</td>
        <td>52</td>
    </tr>
    <!-- LSW8 -->
    <tr>
        <td rowspan="4">LSW8</td>
        <td rowspan="4">19</td>
        <td>SW8-G0/0/1</td>
        <td>FW1-G1/0/1</td>
        <td>hybrid</td>
        <td>1</td>
    </tr>
    <tr>
        <td>SW8-G0/0/2</td>
        <td>Server1-E0/0/0</td>
        <td>hybrid</td>
        <td>1</td>
    </tr>
    <tr>
        <td>SW8-G0/0/3</td>
        <td>Server2-E0/0/0</td>
        <td>hybrid</td>
        <td>1</td>
    </tr>
    <tr>
        <td>SW8-G0/0/4</td>
        <td>Server3-E0/0/0</td>
        <td>hybrid</td>
        <td>1</td>
    </tr>
    <!-- PC -->
    <tr>
        <td>PC1</td>
        <td>20</td>
        <td>PC1-E0/0/1</td>
        <td>SW3-G0/0/3</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>PC2</td>
        <td>21</td>
        <td>PC2-E0/0/1</td>
        <td>SW3-G0/0/4</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>PC3</td>
        <td>22</td>
        <td>PC3-E0/0/1</td>
        <td>SW4-G0/0/3</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>PC4</td>
        <td>23</td>
        <td>PC4-E0/0/1</td>
        <td>SW5-G0/0/3</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>PC5</td>
        <td>24</td>
        <td>PC5-E0/0/1</td>
        <td>SW5-G0/0/4</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>PC6</td>
        <td>25</td>
        <td>PC6-E0/0/1</td>
        <td>SW7-G0/0/3</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>PC7</td>
        <td>26</td>
        <td>PC7-E0/0/1</td>
        <td>SW7-G0/0/4</td>
        <td></td>
        <td></td>
    </tr>
    <!-- Server -->
    <tr>
        <td>Server1</td>
        <td>27</td>
        <td>Server1-E0/0/0</td>
        <td>SW8-G0/0/2</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>Server2</td>
        <td>28</td>
        <td>Server2-E0/0/0</td>
        <td>SW8-G0/0/3</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>Server3</td>
        <td>29</td>
        <td>Server3-E0/0/0</td>
        <td>SW8-G0/0/4</td>
        <td></td>
        <td></td>
    </tr>
</table>

---

### IP 地址规划

> 表-3 接口的详细的 IP 地址规划

<table style="text-align: center;">
    <!-- header -->
    <tr>
        <th>设备名称</th>
        <th>设备编号</th>
        <th>设备端口</th>
        <th>IPv4地址</th>
    </tr>
    <!-- LSW1 -->
    <tr>
        <td rowspan="5">LSW1</td>
        <td rowspan="5">1</td>
        <td>VLAN IF 10</td>
        <td>192.168.10.253/24</td>
    </tr>
    <tr>
        <td>VLAN IF 20</td>
        <td>192.168.20.253/24</td>
    </tr>
    <tr>
        <td>VLAN IF 30</td>
        <td>192.168.30.253/24</td>
    </tr>
    <tr>
        <td>VLAN IF 40</td>
        <td>192.168.40.253/24</td>
    </tr>
    <tr>
        <td>VLAN IF 16</td>
        <td>10.1.16.1/24</td>
    </tr>
    <!-- LSW2 -->
    <tr>
        <td rowspan="5">LSW2</td>
        <td rowspan="5">2</td>
        <td>VLAN IF 10</td>
        <td>192.168.10.252/24</td>
    </tr>
    <tr>
        <td>VLAN IF 20</td>
        <td>192.168.20.252/24</td>
    </tr>
    <tr>
        <td>VLAN IF 30</td>
        <td>192.168.30.252/24</td>
    </tr>
    <tr>
        <td>VLAN IF 40</td>
        <td>192.168.40.252/24</td>
    </tr>
    <tr>
        <td>VLAN IF 26</td>
        <td>10.1.26.2/24</td>
    </tr>
    <!-- LSW6 -->
    <tr>
        <td rowspan="5">LSW6</td>
        <td rowspan="5">6</td>
        <td>VLAN IF 16</td>
        <td>10.1.16.6/24</td>
    </tr>
    <tr>
        <td>VLAN IF 26</td>
        <td>10.1.26.6/24</td>
    </tr>
    <tr>
        <td>VLAN IF 61</td>
        <td>10.1.61.6/24</td>
    </tr>
    <tr>
        <td>VLAN IF 60</td>
        <td>192.168.60.1/24</td>
    </tr>
    <tr>
        <td>VLAN IF 100</td>
        <td>10.1.100.6/24</td>
    </tr>
    <!-- AC1 -->
    <tr>
        <td rowspan="2">AC1</td>
        <td rowspan="2">7</td>
        <td>VLAN IF 50</td>
        <td>10.1.50.254/24</td>
    </tr>
    <tr>
        <td>VLAN IF 60</td>
        <td>192.168.60.254/24</td>
    </tr>
    <!-- CE1 -->
    <tr>
        <td rowspan="2">CE1</td>
        <td rowspan="2">9</td>
        <td>GigabitEthernet0/0/0</td>
        <td>10.1.61.1/24</td>
    </tr>
    <tr>
        <td>GigabitEthernet0/0/1</td>
        <td>12.1.1.1/24</td>
    </tr>
    <!-- PE1 -->
    <tr>
        <td rowspan="3">PE1</td>
        <td rowspan="3">10</td>
        <td>GigabitEthernet0/0/0</td>
        <td>12.1.1.2/24</td>
    </tr>
    <tr>
        <td>GigabitEthernet0/0/1</td>
        <td>23.1.1.1/24</td>
    </tr>
    <tr>
        <td>Loopback0</td>
        <td>2.2.2.2/32</td>
    </tr>
    <!-- ASBR-PE1 -->
    <tr>
        <td rowspan="3">ASBR-PE1</td>
        <td rowspan="3">11</td>
        <td>GigabitEthernet0/0/0</td>
        <td>23.1.1.2/24</td>
    </tr>
    <tr>
        <td>GigabitEthernet0/0/1</td>
        <td>34.1.1.1/24</td>
    </tr>
    <tr>
        <td>Loopback0</td>
        <td>3.3.3.3/32</td>
    </tr>
    <!-- ASBR-PE2 -->
    <tr>
        <td rowspan="3">ASBR-PE2</td>
        <td rowspan="3">12</td>
        <td>GigabitEthernet0/0/0</td>
        <td>34.1.1.2/24</td>
    </tr>
    <tr>
        <td>GigabitEthernet0/0/1</td>
        <td>45.1.1.1/24</td>
    </tr>
    <tr>
        <td>Loopback0</td>
        <td>4.4.4.4/32</td>
    </tr>
    <!-- PE2 -->
    <tr>
        <td rowspan="3">PE2</td>
        <td rowspan="3">13</td>
        <td>GigabitEthernet0/0/0</td>
        <td>45.1.1.2/24</td>
    </tr>
    <tr>
        <td>GigabitEthernet0/0/1</td>
        <td>56.1.1.1/24</td>
    </tr>
    <tr>
        <td>Loopback0</td>
        <td>5.5.5.5/32</td>
    </tr>
    <!-- CE2 -->
    <tr>
        <td rowspan="4">CE2</td>
        <td rowspan="4">14</td>
        <td>GigabitEthernet0/0/0</td>
        <td>56.1.1.2/24</td>
    </tr>
    <tr>
        <td>GigabitEthernet0/0/1</td>
        <td>10.1.27.2/24</td>
    </tr>
    <tr>
        <td>GigabitEthernet0/0/2</td>
        <td>10.1.28.2/24</td>
    </tr>
    <tr>
        <td>GigabitEthernet4/0/0</td>
        <td>10.1.29.2/24</td>
    </tr>
    <!-- FW1 -->
    <tr>
        <td rowspan="2">FW1</td>
        <td rowspan="2">15</td>
        <td>GigabitEthernet1/0/0</td>
        <td>10.1.29.1/24</td>
    </tr>
    <tr>
        <td>GigabitEthernet1/0/1</td>
        <td>192.168.53.254/24</td>
    </tr>
    <!-- AR7 -->
    <tr>
        <td rowspan="3">AR7</td>
        <td rowspan="3">17</td>
        <td>GigabitEthernet0/0/0</td>
        <td>10.1.27.7/24</td>
    </tr>
    <tr>
        <td>GigabitEthernet0/0/1.51</td>
        <td>192.168.51.253/24</td>
    </tr>
    <tr>
        <td>GigabitEthernet0/0/1.52</td>
        <td>192.168.52.253/32</td>
    </tr>
    <!-- AR8 -->
    <tr>
        <td rowspan="3">AR8</td>
        <td rowspan="3">18</td>
        <td>GigabitEthernet0/0/0</td>
        <td>10.1.28.8/24</td>
    </tr>
    <tr>
        <td>GigabitEthernet0/0/1.51</td>
        <td>192.168.51.252/24</td>
    </tr>
    <tr>
        <td>GigabitEthernet0/0/1.52</td>
        <td>192.168.52.252/32</td>
    </tr>
    <!-- PC -->
    <tr>
        <td>PC1</td>
        <td>20</td>
        <td>E0/0/1</td>
        <td>192.168.10.1/24</td>
    </tr>
    <tr>
        <td>PC2</td>
        <td>21</td>
        <td>E0/0/1</td>
        <td>192.168.10.2/24</td>
    </tr>
    <tr>
        <td>PC3</td>
        <td>22</td>
        <td>E0/0/1</td>
        <td>192.168.20.1/24</td>
    </tr>
    <tr>
        <td>PC4</td>
        <td>23</td>
        <td>E0/0/1</td>
        <td>192.168.30.1/24</td>
    </tr>
    <tr>
        <td>PC5</td>
        <td>24</td>
        <td>E0/0/1</td>
        <td>192.168.40.1/24</td>
    </tr>
    <tr>
        <td>PC6</td>
        <td>25</td>
        <td>E0/0/1</td>
        <td>自动获取</td>
    </tr>
    <tr>
        <td>PC7</td>
        <td>26</td>
        <td>E0/0/1</td>
        <td>自动获取</td>
    </tr>
    <!-- Server -->
    <tr>
        <td>Server1</td>
        <td>27</td>
        <td>E0/0/0</td>
        <td>192.168.53.1/24</td>
    </tr>
    <tr>
        <td>Server2</td>
        <td>28</td>
        <td>E0/0/0</td>
        <td>192.168.53.2/24</td>
    </tr>
    <tr>
        <td>Server3</td>
        <td>29</td>
        <td>E0/0/0</td>
        <td>192.168.53.3/24</td>
    </tr>
</table>

---

# 总部要求

#### 链路聚合

- LSW1 和 LSW2 之间做 LACP，编号为 1，LSW1 为主动方，优先级设置为 5000，活跃两条链路，负载均衡方式为 sip，抢占延迟时间设置为 10s
- LSW1 和 LSW6 以及 LSW2 和 LSW6 之间的链路聚合做手工负载分担模式，编号分别为 2 和 3

#### MSTP

- AS 65003 的交换机设备运行 MSTP 协议
- 交换机和交换机之间用 trunk，交换机和终端用 hybrid，不要有冗余配置，例如 trunk 接口只需要允许 vlan 101 和 102 通过即可，就不要设置允许其他 vlan 通过，交换机创建vlan 不允许其他不相关 vlan 创建
- region-name 为 bosai
- instance 1 vlan10 20 优先从 LSW1 转发，instance 2 vlan30 40 优先从 LSW2 转发

#### VRRP

- 公司总部的网关配置在汇聚设备 LSW1 和 LSW2 上，为了保证网络的备份，需要在 LSW1和 LSW2 上部署 VRRP 协议
- 虚拟IP地址为 x.254
- LSW1 为 vlan10 和 20 的 vrrp 的 master（vrid 为 10 和 20，优先级为 150），也是 vlan 30 和 40 的 backup，物理地址为 x.253；LSW2 为 vlan30 和 40 的 maste（vrid 为 30 和40，优先级为 150）r，也是 vlan 10 和 20 的backup，物理地址为x.252

#### BFD

- LSW1 和 LSW6 的链路以及 LSW2 和 LSW6 的链路，进行 BFD 单跳检测，自动模式， 分别绑定 vrid 10 和vrid 30 的接口，bfd 分别为 bfd 1 和 bfd2，如果聚合链路整个宕掉，优先级减 100

#### WLAN 配置

- AC、AP 采用二层组网、转发模式为隧道转发，AP 管理 VLAN 为 50，STA 业务 VLAN 为 60
- 创建 AP 组，AP 组的名称为 wlds-group，域管理模板的名称为 wlds
- AP 的地址由DHCP 自动获取，AC 为DHCP 服务器，在 AC 上创建名为 VLAN 50 地址池, 地址池可分配的网络为 10.1.50.0/24，网关为 10.1.50.254，DNS为 8.8.8.8，租期 8 天。STA1 的地址由DHCP 自动获取，AC 为DHCP 服务器，在 AC 上创建名为 VLAN 60 的地址池，地址池可分配网络为192.168.60.0/24，网关为 192.168.60.254，其余配置和 VLAN50 地址池一致
- AP 与 AC 之间通过源接口方式建立 capwap 隧道
- AP 的 SSID 设置为WLDS，认证方式采用WPA-WPA2 PSK 安全策略，加密算法为 AES， 密码类型为 PASS-PHRASE，密码配置为 WLDS@123，WLAN ID 为 1，射频为 0
- 配置 AP 组的射频 0 工作在 normal 模式，并开启非法设备检测和反制功能
- 采用全局方式配置 STA 黑名单，使 MAC 地址为 00E0-2233-4488 的无线终端禁止接入 WLAN 中

> 除了 AP 组的名称是指定的，其余模板名称均采用“wlds”命名

#### OSPF

- AS 65003 中的三层设备配置 ospf，进程 1，按照图中区域进行划分，使用默认 router - id

> OSPF 宣告的是网段，而非是具体的接口地址

---

# 分公司需求

#### 防火墙部署

由于分公司安装三台重要业务服务器，因此部署防火墙保障服务器业务安全，配置要求如下：

- FW2 的接口G1/0/1 属于 DMZ 区域，G1/0/0 属于 untrust 区域，需要配置安全策略实现各安全区域之间的访问
- 开启 IP 地址扫描和端口扫描防范功能
- 运行OSPF，实现服务器与分公司网络互通
- 分公司有三台 FTP 服务器 Server1、Server2 和 Server3，且这三台服务器的硬件性能顺次降低，Server1 性能是 Server2 的两倍、Server2 性能是Server3 的两倍。通过配置负载均衡，让这三台服务器联合对外提供 FTP 服务，且三台服务器承载业务的多少与服务器硬件性能的高低匹配。通过配置健康检测实时监控这三台服务器是否可达

> 在上述要求中配置安全策略的时候所用到的 rule name 采用统一的命名规则 例：source-zone 为 trust ，destination-zone 为untrust，rule name 即为 trust-untrust，source-zone 在前，destination-zone 在后，切记注意命名规则

#### OSPF

AR7 和 AR8 与CE2 通过 ospf 进程 100 进行通信，宣告在 Area 0 中

> OSPF 宣告的是网段，而非是具体的接口地址

#### VRRP

- LSW7 与 PC 相连接口配置 access，与路由器相连接口配置 trunk
- AR7 和 AR8 分别设置 vlan51 和 vlan52 的 vrrp 网关，vrid 分别为 51 和 52，AR7 为vlan51 的 master（优先级 120）和 vlan52 的 backup，AR8 为 vlan52 的 master（优先级120）和 vlan51 的 backup，vlan51 的子接口 id 为 51，vlan52 的子接口 id 为 52，物理 ip 地址 AR7 的子接口为 x.253 以及 AR8 的子接口为 x.252

#### DHCP

- CE2 设置为 vlan51 和 vlan52 的 dhcp 服务器，地址池名分别为 vlan51 和 vlan52， 租约时间为 2 天，AR7 和 AR8 作为中继器，就近端口中继
- LSW7 需要配置 dhcp snooping，建立动态绑定表

---

# 运营商需求

#### IS-IS

为了使公司总部和公司分部通过 ISP 专网互访，因此 ISP 专网需要运行MPLS VPN

- AS 100 内部配置 isis 进程 1，Area 49.0001，路由器类型为 L2 路由器，实现 IGP 互通, 路由器的 system-id 根据自身的 loopback0 上的 ip 设置为"“"0000.0000.000X"

> 例如 PE1 设置为   0000.0000.0002

- AS 200 内部通过 isis 进程 2，Area 49.0002，都是 L2 路由器实现IGP 互通

#### MPLS VPN

在 ISP 中的 PE1、ASBR-PE1、ASBR-PE2、PE2 需要配置 MPLS VPN，以用来实现公司总部与分部的互访

- PE1，ASBR-PE1，ASBR-PE2，PE2 的 loopback0 分 别 设 置 从 2.2.2.2/32 到 5.5.5.5/32
- 使 CE 和PE 之间以及 ASBR 和 ASBR 之间使用直连接口建立邻居，其他用 loopback 建立邻居
- 在相关设备配置MPLS LDP，lsr-id 为每台路由器的 loopback0
- 在 CE 上把 IGP 路由引入 BGP
- PE 与CE 之间建立 EBGP 对等体关系；PE 与 ASBR 之间建立 MP-IBGP 对等体关系
- 在 PE 上需配置 VPN 实例（在 ASBR 上无需配置 VPN 实例），实例号为 1，PE1 的 RD 为100:1，PE2 的 RD 为 200:1，出入方向的 RT 均为 1:1
- ASBR 之间建立 MP-EBGP 对等体关系
- PE1 和公司总部运行 EBGP 邻居关系进行路由传递，公司总部的 AS 号为 65003，PE2 和公司分部也运行EBGP 邻居关系进行路由传递，公司分部的 AS 号为 65004
- 要求在 CE1 上将公司总部 OSPF 的路由引入 BGP 中，在 CE2 上通过 network 命令将公司分部路由宣告进 BGP

---

# 网络自动化运维

公司总部为提升运维能力，提升全性，要求利用 pycharm 软件，编写 python 代码实现“交换机 LSW6”的 Telnet 登录配置。要求如下：

- 先在 LSW6 上配置完成Telnet 配置，以下配置需要在 AAA 下完成
  - 用户名：user1
  - 密码：123456
  - 权限等级：3
- 通过python 编写 Telnet 登录配置脚本，查看设备所有配置

---

配置下载连接：[企业网省赛决赛拓扑（ensp）](https://cdn.jsdelivr.net/gh/xiaokai54/xiaokai54.github.io/download/%E4%BC%81%E4%B8%9A%E7%BD%91%E7%9C%81%E8%B5%9B%E5%86%B3%E8%B5%9B.topo)


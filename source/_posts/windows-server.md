---
title: Windows server
tags:
  - null
categories:
  - null
type: technology
mathjax: false
hide: false
date: 2021-11-29 18:51:22
description:
password:
message: 一些脚本
---

- 通过脚本批量新建正向解析区域

```powershell
dnscmd /zoneadd test001.com /primary /file test001.com.zone
```

- 离线加入域

```powershell
djoin /provision /domain chinaskills.cn /machine OutsideCli /savefile OutsideCli.join
```

# Windows Server 批量新建AD域账户

- 域用户能够使用[username]@csk.cn 进行登录
- sa01-sa20，请将该用户添加到SALES 用户组；
- it01-it20，请将该用户添加到IT 用户组；
- ma01-ma20，请将该用户添加到MANAGER 用户组。

---

1. 新建一个Excel文件，新建两列分别为 用户名和密码

   ![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/csv.png)

2. 将建好的文件另存为成csv，我这里叫userAdd.csv

3. 将保存的csv文件上传到Windows server

4. 打开cmd窗口，输入以下指令

```cmd
for /f "tokens=1,2 delims=," %a in (userAdd.csv) do dsadd user "cn=%a,dc=chinaskills,dc=cn" -samid %a -upn %a@csk.cn -pwd %b 
```

- for /f "tokens=1,2 delims=,"
  - “tokens=1,2” 这段是声明这里有2个变量。分别是%a，%b。分别对应EXCEL表格A，B列
  - ”Delims=,”表示分隔符是“,”号
- %a in (userAdd.csv)
  - 这段是表示全部变量的来源。这里就是指变量都是来源于当前目录下的CSV文件
- do dsadd user
  - 这个是添加创建用户命令
- "cn=%a,dc=chinaskills,dc=cn"
  - cn表示显示的名称，dc表示域（比如我的域名为chinaskills.cn，此时两个dc分别为chinaskills和cn）
- -samid %a -upn %a@csk.cn
  - 这句是指所要用户的名称和upn后缀。这个upn的后缀最好和用户名在一块，因为每个用户名不会一样
- -pwd %e
  - 是指用户的密码

## 找不到对应的用户

> 按照脚本新建完成但是找不到用户，刷新也没用

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/server.png)

刷新一下（刷新过的可以不刷新）点击域名就能看见了

![](https://cdn.jsdelivr.net/gh/xiaokai54/cdn/img/serverUsers.png)

然后右键移动和添加到对应组就行了

---

> 以下内容来自[Microsoft Docs](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/cc731279(v=ws.11))

```cmd
dsadd user <UserDN> [-samid <SAMName>] [-upn <UPN>] [-fn <FirstName>] [-mi <Initial>] [-ln <LastName>] [-display <DisplayName>] [-empid <EmployeeID>] [-pwd {<Password> | *}] [-desc <Description>] [-memberof <Group> ...] [-office <Office>] [-tel <PhoneNumber>] [-email <Email>] [-hometel <HomePhoneNumber>] [-pager <PagerNumber>] [-mobile <CellPhoneNumber>] [-fax <FaxNumber>] [-iptel <IPPhoneNumber>] [-webpg <WebPage>] [-title <Title>] [-dept <Department>] [-company <Company>] [-mgr <Manager>] [-hmdir <HomeDirectory>] [-hmdrv <DriveLetter>:][-profile <ProfilePath>] [-loscr <ScriptPath>] [-mustchpwd {yes | no}] [-canchpwd {yes | no}] [-reversiblepwd {yes | no}] [-pwdneverexpires {yes | no}] [-acctexpires <NumberOfDays>] [-disabled {yes | no}] [{-s <Server> | -d <Domain>}] [-u <UserName>] [-p {<Password> | *}] [-q] [{-uc | -uco | -uci}]
```

| Parameter                     | Description                                                  |
| :---------------------------- | :----------------------------------------------------------- |
| `<UserDN>`                    | Required. Specifies the distinguished name of the user that you want to add. If you omit the distinguished name, **dsadd** takes the name from standard input (stdin). |
| -samid `<SAMName>`            | Specifies the Security Accounts Manager (SAM) name as the unique SAM account name for this user, for example, Linda. If you do not specify the SAM name, **dsadd** attempts to create the SAM account name by using up to the first 20 characters from the common name (CN) value of *UserDN*. |
| -upn `<UPN>`                  | Specifies the user principal name of the user that you want to add, for example, Linda@widgets.contoso.com. |
| -fn `<FirstName>`             | Specifies the first name of the user that you want to add.   |
| -mi `<Initial>`               | Specifies the middle initial of the user that you want to add. |
| -ln `<LastName>`              | Specifies the last name of the user that you want to add.    |
| -display `<DisplayName>`      | Specifies the display name of the user that you want to add. |
| -empid `<EmployeeID>`         | Specifies the employee ID of the user that you want to add.  |
| -pwd {`<Password>`\| *}       | Specifies that the password for the user be set to *Password* or an asterisk (*). If you set the password to *, **dsadd** prompts you for a user password. |
| -desc `<Description>`         | Specifies the description of the user that you want to add.  |
| -memberof `<GroupDN>`         | Specifies the distinguished names of the groups of which you want the user to be a member. |
| -office `<Office>`            | Specifies the office location of the user that you want to add. |
| -tel `<PhoneNumbe>`r          | Specifies the telephone number of the user that you want to add. |
| -email `<Email>`              | Specifies the e-mail address of the user that you want to add. |
| -hometel `<HomePhoneNumber>`  | Specifies the home telephone number of the user that you want to add. |
| -pager `<PagerNumber>`        | Specifies the pager number of the user that you want to add. |
| -mobile `<CellPhoneNumber>`   | Specifies the cell phone number of the user that you want to add. |
| -fax `<FaxNumber>`            | Specifies the fax number of the user that you want to add.   |
| -iptel `<IPPhoneNumber>`      | Specifies the IP phone number of the user that you want to add. |
| -webpg `<WebPage>`            | Specifies the Web page URL of the user that you want to add. |
| -title `<Title>`              | Specifies the title of the user that you want to add.        |
| -dept `<Department>`          | Specifies the department of the user that you want to add.   |
| -company `<Company>`          | Specifies the company information of the user that you want to add. |
| -mgr `<ManagerDN>`            | Specifies the distinguished name of the manager of the user that you want to add. |
| -hmdir `<HomeDirectory>`      | Specifies the home directory location of the user that you want to add. If you specify *HomeDirectory* as a Universal Naming Convention (UNC) path, then you must specify a drive letter for **dsadd** to map to this path using the **-hmdrv** parameter. |
| -hmdrv `<DriveLetter>` :      | Specifies the home directory drive letter (for example, E:) of the user that you want to add. |
| -profile `<ProfilePath>`      | Specifies the profile path of the user that you want to add. |
| -loscr `<ScriptPath>`         | Specifies the logon script path of the user that you want to add. |
| -mustchpwd {yes \| no}        | Specifies whether users must change their passwords when they next log on. The available values are **yes** and **no**. By default, users do not have to change their passwords (**no**). |
| -canchpwd {yes \| no}         | Specifies whether users can change their passwords. The available values are **yes** and **no**. By default, users can change their passwords (**yes**). The value of this parameter must be **yes** if the value of the **-mustchpwd** parameter is **yes**. |
| -reversiblepwd {yes \| no}    | Specifies whether to store user passwords using reversible encryption. The available values are **yes** and **no**. By default, users cannot use reversible encryption (**no**). |
| -pwdneverexpires {yes \| no}  | Specifies whether the user password never expires. The available values are **yes** and **no**. By default, user passwords expire (**no**). |
| -acctexpires `<NumberOfDays>` | Specifies the number of days from today that the user account will expire. A value of 0 sets expiration at the end of today. A positive value sets expiration in the future. A negative value sets expiration in the past. The value **never** sets the account to never expire. For example, a value of **0** implies that the account expires at the end of today. A value of **-5** implies that the account has already expired 5 days ago and sets an expiration date in the past. A value of **5** sets the account expiration date for 5 days in the future. |
| -disabled {yes \| no}         | Specifies whether **dsadd** disables the user account for logon. The available values are **yes** or **no**. For example, the following command creates a Nicolettep user account in an enabled state:dsadd user CN=Nicolettep,CN=Users,DC=Widgets,DC=Contoso,DC=Com -pwd Password1 -disabled noBy default, the user account is disabled for log on (**yes**). For example, the following command creates a Nathanp user account in a disabled state:dsadd user CN=Nathanp,CN=Users,DC=Widgets,DC=Contoso,DC=Com |
| {-s `<Server>`                | -d `<Domain>`}                                               |
| -u `<UserName>`               | Specifies the user name with which the user logs on to a remote server. By default, **-u** uses the user name with which the user logged on. You can use any of the following formats to specify a user name:user name (for example, Linda)domain\user name (for example, widgets\Linda)user principal name (UPN) (for example, Linda@widgets.contoso.com) |
| -p {`<Password>` \| *}        | Specifies to use either a password or a * to log on to a remote server. If you type *****, you are prompted for a password. |
| -q                            | Suppresses all output to standard output (quiet mode).       |
| {-uc \| -uco \| -uci}         | Specifies that output or input data is formatted in Unicode. The following list explains each format.**-uc**: Specifies a Unicode format for input from or output to a pipe (\|).**-uco** : Specifies a Unicode format for output to a pipe (\|) or a file.**-uci**: Specifies a Unicode format for input from a pipe (\|) or a file. |
| /?                            | Displays help at the command prompt.                         |

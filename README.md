# 蹲饼

## 用于实时抓取兔兔发的动态
一起监视自由的兔兔。明日方舟兔兔发布动态发布时间越来越奇怪了，我每天下午4点刷都刷不出来，怎么办呢？写一个蹲饼器盯着兔兔看！

<img src="https://raw.githubusercontent.com/Enraged-Dun-Cookie-Development-Team/Dun-Cookie-Vue/master/readmeImage/tutu.gif" height = "200" alt="图片名称" align="center" />

    兔兔你的饼还没发完，现在还不能休息哦

<font color=23ade5>**欢迎Star！**</font>

<br/>

# 主要功能
> - 监视兔兔在各地方发饼:
>     - 官方B站
>     - 官方微博
>     - 通讯组
>     - 朝陇山微博 
>     - 一拾山微博 
>     - 塞壬官网 
>     - 泰拉记事社微博
> - 一键跳转以上网站
> - 一键跳转详细内容界面
> - 一键复制饼内容文本
> - 一键跳转方舟小工具

<br/>

# 2.0对比与1.0功能的升级

    以下升级内容未排序，想到啥说啥的那种

> - 新版的界面采用了elementUI，UI统一更好看了
> - 现在使用的底层是Vue，在添加功能和绑数据方面比V1版本更加方便了
> - 列表改成了时间线样式，比以前更加直观
> - 现在微博的置顶也拿出来了(以前的版本置顶是抹掉的)，并且标注在微博内为置顶
> - 现在的内容也能一键复制了
> - 现在的图片可以进行伸缩打开了，每次的大版本更新，那个图片，辣么长，现在可以展开和收起了
> - 现在的菜单做成了抽屉，点击右下角的更多按钮展开，腾出了几行显示文字的地方
> - 设置页面样子更新了，看起来比以前不知道高端到什么地方去了
> - 设置页面也添加了蹲饼本次蹲饼时间和下次蹲饼时间，蹲饼更精准
> - 安装的时候添加了欢迎页面，可以引导大家去设置里面进行个性化调整
> - 在没经过网站所有者允许的情况下添加了部分我觉得很有用的链接
> - 预留了很多接口，包括文本自动翻译，国际化，更新提示 微信推送（待定）

<details>
  <summary>知道我们的更新内容后，现在可以点击这里来看看我们的界面了</summary>

    图片收起与展开

![avatar](https://raw.githubusercontent.com/Enraged-Dun-Cookie-Development-Team/Dun-Cookie-Vue/master/readmeImage/1.jpg)
![avatar](https://raw.githubusercontent.com/Enraged-Dun-Cookie-Development-Team/Dun-Cookie-Vue/master/readmeImage/2.jpg)

    图片九宫格

![avatar](https://raw.githubusercontent.com/Enraged-Dun-Cookie-Development-Team/Dun-Cookie-Vue/master/readmeImage/5.jpg)


    内容快捷复制

![avatar](https://raw.githubusercontent.com/Enraged-Dun-Cookie-Development-Team/Dun-Cookie-Vue/master/readmeImage/6.jpg)

    菜单界面

![avatar](https://raw.githubusercontent.com/Enraged-Dun-Cookie-Development-Team/Dun-Cookie-Vue/master/readmeImage/4.jpg)

    设置界面

![avatar](https://raw.githubusercontent.com/Enraged-Dun-Cookie-Development-Team/Dun-Cookie-Vue/master/readmeImage/3.jpg)

</details>



<br/>

# 更新内容

## V2.0

    看上面吧

## V2.0.14

    1.修复推送图片偶尔不显示的问题
    2.优化细节

## V2.0.28

    1.通过实际蹲饼测试，发布正式版

## V2.0.30

    1.添加泰拉记事社微博接口
    2.添加一键到泰拉记事社界面

## V2.0.32

    1.添加可选是否推送的按钮

## V2.0.38

    1.修复若干BUG（创造了更多的bug)
    2.修复打开后要卡很久才能看到界面的问题

## V2.0.54

    1.添加官方网站的数据源
    2.添加了更新页面
    3.界面继续进行了调整
    4.我们可以远程说话了，添加了公告区域


<br/>

# 安装方法

我们现在还没有服务器来做检测更新的内容，可以进群或常来这里看看，说不定就有新版本。

新版本的压缩包和crx最新会发布在[releases](https://github.com/Enraged-Dun-Cookie-Development-Team/Dun-Cookie-Vue/releases)和[QQ群](https://jq.qq.com/?_wv=1027&k=Vod1uO13)内

## Chrome安装方法

    Chrome用户相当建议使用应用商店下载，因为更新方便
> - 推荐 [Chrome应用商店](https://chrome.google.com/webstore/detail/%E8%B9%B2%E9%A5%BC/gblmdllhbodefkmimbcjpflhjneagkkd)
> - 下载crx安装
> - 下载zip通过开发者模式加载已解压的扩展程序
> 
> PS: 可以通过地址栏输入`chrome://settings/?search=后台`找到“关闭 Google Chrome 后继续运行后台应用”，选择运行后台扩展程序的使用


## Edge安装方法

    正在想办法注册Edge开发者

> 1. 先解压到任意文件夹
> 2. 地址栏输入`edge://extensions/`，回车
> 3. 点击已安装的扩展右边的第一个图标“加载解压缩的扩展”![avatar](https://raw.githubusercontent.com/Enraged-Dun-Cookie-Development-Team/Dun-Cookie-Vue/master/readmeImage/edge-load.jpg)
> 4. 选择解压后的整个插件文件夹完成安装
>
> PS: 可以通过地址栏输入`edge://settings/?search=后台`找到“关闭 Microsoft Edge 后继续运行后台应用关闭”，选择运行后台扩展程序的使用

## Firefox安装方法

    正在想办法注册火狐开发者

> 1. 先解压到任意文件夹
> 2. 地址栏输入`about:debugging`，回车
> 3. 点击“此Firefox”->临时载入扩展
> 4. 随便在解压后的插件文件夹里面点开任意文件即可加载
> 
> PS: 此为临时安装，每次打开浏览器都要重新安装，建议使用edge或者chrome，因为支持后台运行，所以不需要特地打开浏览器

## QQ浏览器安装方法

> 1. 先解压到任意文件夹
> 2. 地址栏输入`qqbrowser://extensions/manage`，回车
> 3. 右上角打开开发者模式
> 3. 点击“加载已解压的扩展程序”
> 4. 选择解压后的整个插件文件夹完成安装

## 360安全浏览器安装方法

    没有实际测试过，遇到问题请联系我们

> 1. 先解压到任意文件夹
> 2. 地址栏输入`se://extensions`，回车
> 3. 打开开发者模式
> 3. 点击“加载已解压的扩展程序”
> 4. 选择解压后的整个插件文件夹完成安装

<br/>

# 注意事项

    因为编写和测试都是在Chrome上进行的，兼容性问题可能无法照顾到全部浏览器

> - Edge会有难看的滚动条，正在想办法去除



<br/>

# 可以预见的下一步
> - 添加固定时间段切换为低频率模式或手动模式 降低或停止蹲饼 节约流量与性能
> - 界面九宫格？

    我没有更多的好点子了。博士，你呢？

<br/>

# 意见建议反馈通道

    我们很欢迎博士们对我们的蹲饼器指指点点

> - github上的[issues](https://github.com/Enraged-Dun-Cookie-Development-Team/Dun-Cookie-Vue/issues)可以发送问题或建议
> - 点击[这里加群](https://jq.qq.com/?_wv=1027&k=Vod1uO13)一起聊天 群号：362860473



<br/>

# 鸣谢

> - [我自己](https://github.com/LiuZiYang1) —— 震惊！我竟然能3天内肝完V2版本主要功能
> - [@lwt-414](https://github.com/lwt-414) —— 测试很细心，正则很牛逼，我写代码很放心。还能解决我的燃眉之急（指在2021年4月18号帮我通关WD-8，能让我没有后顾之忧）
> - [@Houdou](https://github.com/Houdou) —— 帮我解决了疑难杂症
> - 蹲饼测试组成员 
> - [HYPERGRYPH](https://www.hypergryph.com/#/)
> - 脚手架支持 —— [chrome-extension-cli](https://github.com/SlowSoulWen/chrome-extension-cli)


<br/>

# “特别”鸣谢 

    傻嗨，感谢你在百忙之中到我这讨骂。

![avatar](https://raw.githubusercontent.com/Enraged-Dun-Cookie-Development-Team/Dun-Cookie-Vue/master/readmeImage/7.jpg)



# 微信公众号爬取 Chrome 插件
用于抓取公众号所有图文消息的标题，发送日期，封面图链接，文章链接。

# 使用方法

1. 开启 Chrome ，安装crx目录的插件；  
2. 登录Mac版微信（Windows版需抓包到历史消息的实际地址）；  
3. 打开公众号历史图文消息页；  
4. 选择在浏览器中打开；  
5. 点击公众号名称下方的开始抓取；
6. 等待抓取完毕即会将数据以 `json` 文件方式下载。

![预览](https://coding.net/u/imlinhanchao/p/crx_wx_mp_spider/git/raw/master/preview.png)

# 批量下载工具

内附`downloader`批量下载工具。执行`app.js --help`查看使用方法。

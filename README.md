# Luogu Info

用于获取洛谷用户信息并实时生成小徽章(Shields)

支持的用法

- 洛谷咕值
- 通过题目（可以设置目标）
- 访客统计

TODO

- 支持洛谷登录
- 添加新功能，如：提交/通过数量，AC率...

**目前仅支持使用Cookie的方式来获取个人数据**

## 效果图

![洛谷咕值](https://i.loli.net/2020/07/22/PcJo3vLdxaYRTjt.png)

![通过题目](https://i.loli.net/2020/07/22/YZPE5DIFNCOH4JB.png)

## 使用方法

需安装NodeJS至10.0版本以上

```bash
git clone https://github.com/rain15z3/luogu-info.git
cd luogu-info/
node .
```

访问```http://localhost:98/register?uid=xxx&cookie=xxx```以注册账户

**注意：cookie指的是client_id**

以上的地址和端口号改成你自己的，在```config.json```中可以设置

### 我的服务器

**注意：我的服务器不是很稳定，请谨慎使用**

服务器地址:```http://luogu.app.luoling8192.top:98/```

访问```http://luogu.app.luoling8192.top:98/register?uid=xxx&cookie=xxx```以注册账户

同理，把下文中的```localhost```换成```luogu.app.luoling8192.top```就可以了

## 接口

**使用的时候请注意大小写**

```
http://localhost:98/gen?uid=xxx&query=rating                # 总咕值
http://localhost:98/gen?uid=xxx&query=basicRating           # 基础信用
http://localhost:98/gen?uid=xxx&query=practiceRating        # 练习情况
http://localhost:98/gen?uid=xxx&query=socialRating          # 社区贡献
http://localhost:98/gen?uid=xxx&query=contestRating         # 比赛情况
http://localhost:98/gen?uid=xxx&query=prizeRating           # 获得成就
```

```
http://localhost:98/gen?uid=xxx&query=visitor               # 总访客数
http://localhost:98/gen?uid=xxx&query=ac                    # AC率（百分比）
http://localhost:98/gen?uid=xxx&query=passedProblemCount    # 通过数量
http://localhost:98/gen?uid=xxx&query=submittedProblemCount # 提交数量
http://localhost:98/gen?uid=xxx&query=followerCount         # 粉丝数量
http://localhost:98/gen?uid=xxx&query=followingCount        # 关注数量
```

```
# to表示目标数量，达到目标后颜色会变成绿色
http://localhost:98/gen?uid=xxx&query=problem0              # 未评定
http://localhost:98/gen?uid=xxx&query=problem1&to=50        # 红题
http://localhost:98/gen?uid=xxx&query=problem2&to=50        # 橙题
http://localhost:98/gen?uid=xxx&query=problem3&to=50        # 黄题
http://localhost:98/gen?uid=xxx&query=problem4&to=20        # 绿题
http://localhost:98/gen?uid=xxx&query=problem5&to=20        # 蓝题
http://localhost:98/gen?uid=xxx&query=problem6&to=5         # 紫题
http://localhost:98/gen?uid=xxx&query=problem7&to=1         # 黑题
```

## Cookie获取方法

```uid```和```client_id```都可以在网站的Cookie里面找到

以Chrome为例，进入Dev Tools（F12）后可以找到

![Dev Tools](https://i.loli.net/2020/07/22/5mUMDLWRJqOIwo7.png)


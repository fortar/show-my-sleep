# show-my-sleep

- 自己弄的 睡眠时间可视化 工具页面。
- 设计技术栈 Vue, Vant, Echarts, Vercel, TypeScript, Node.js, MongoDB

## 版本

- 最开始弄的是纯前端，数据写死在 js/data.js，定期更新该文件，直接放到 github，通过 gh-pages 分支来访问。但这种方式存在以下问题：1. github仓库必需为public，否则无法使用 github pages。（prvate的参考也可以，但是需要付费）。2. 根据数据不方便。3. github 有时无法访问（需要科学上网才行）

- 后来托管部署到 [vercel](https://vercel.com/) 了，源代码还是放在 github, vercel 中的站点已关联了 github 中的仓库，本地开发完成 push 到 github 后，vercel 会自动构建。

- 前后端统一放在一个仓库。数据库直接用的是 [mongodb](https://cloud.mongodb.com/) 云数据库，注册了用户、新建了 database, collection 等。（cluster: ClusterSleep, database: sleep, collection: sleep-2022, 设计时打算每个年度使用一个 collection）

- 路由配置在 vercel.json ，使用 vercel 本身提供的能力。

- 后台接口写在 /api/*.* 下，数据库连接配置见 /api/*/_settings.ts。 连接字符串可以在 cluster|overview|CONNECT|Connect Using MongoDB Compass 中查看。
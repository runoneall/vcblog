# vcblog

a dynamic blog on cloudflare workers

## 替换 admin 与 theme

vcblog 允许用户自行替换 `src/admin/` 与 `src/theme/`，替换后的目录仍分别作为 Hono 子应用被组合根挂载。只需符合以下约定：

- **admin/**：对外只需暴露 `admin_path()` 方法，且导入路径必须为 `@/admin/util/path`。项目其余部分仅通过它生成管理面板的挂载路径与链接，不依赖 admin 的其他内部实现。
- **theme/**：只需确保 `src/theme/style.css` 存在。根样式 `src/style.css` 会引入该文件；主题对 Tailwind / DaisyUI 的隐式依赖由项目统一提供。

除上述约定外，`src/` 下的其他模块属于共享基础设施，不属于可替换 admin / theme 的契约范围。

## 部署方式

vcblog 需要部署到 Cloudflare Workers。部署前请确保账号配额允许创建 **1 个 Worker** 和 **1 个 D1 数据库**。

部署时指定仓库为：

```text
github.com/runoneall/vcblog
```

Cloudflare Workers 的自动资源编排会根据项目配置自动创建所需的 D1 数据库，无需手动创建。

删除部署时，只需删除对应的 Worker。若需要连同数据一起删除，则需额外手动删除 D1 数据库。

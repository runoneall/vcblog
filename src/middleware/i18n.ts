import { Next } from "hono";
import { accepts } from "hono/accepts";
import { Context } from "@/types";
import { UseI18n } from "@/types/i18n";

const i18n_data: Record<string, UseI18n["i18n"]> = {
  en: {
    default_site_name: "My Blog",
    first_post: {
      title: "First Post",
      content:
        "If you are seeing this post, it means your blog has been successfully installed. Welcome to VCBlog!",
    },
    feed_description: "'s latest articles",
    search_input_placeholder: "Enter keywords to search",
    title: {
      main: "Page ${page}",
      not_found: "Not Found",
      search: "Search",
      login: "Login",
      settings: "Settings",
      change_password: "Change Password",
      create: {
        post: "New Post",
        page: "New Page",
      },
      delete: {
        post: "Delete Post",
        page: "Delete Page",
      },
    },
    login_form: {
      password: "Password",
      submit: "Submit",
    },
    settings_form: {
      site_name: "Site name",
      post_per_page: "Post per page",
      preview_char: "Preview char",
      extra_css: "Extra css",
      extra_js: "Extra js",
      submit: "Update",
    },
    change_password_form: {
      new_password: "New password",
      submit: "Change",
    },
    create_form: {
      name: "Name",
      title: "Title",
      submit: "Create",
    },
    delete_form: {
      confirm: "I confirm to delete ${name}",
    },
  },

  zh: {
    default_site_name: "我的博客",
    first_post: {
      title: "第一篇文章",
      content:
        "如果您看到这篇文章，表示您的 blog 已经安装成功。欢迎使用 VCBlog！",
    },
    feed_description: "的最新文章",
    search_input_placeholder: "输入关键词搜索",
    title: {
      main: "第 ${page} 页",
      not_found: "未找到",
      search: "搜索",
      login: "登录",
      settings: "设置",
      change_password: "更改密码",
      create: {
        post: "新文章",
        page: "新页面",
      },
      delete: {
        post: "删除文章",
        page: "删除页面",
      },
    },
    login_form: {
      password: "密码",
      submit: "提交",
    },
    settings_form: {
      site_name: "站点名称",
      post_per_page: "每页文章数",
      preview_char: "预览字符数",
      extra_css: "额外的 CSS",
      extra_js: "额外的 JS",
      submit: "更新",
    },
    change_password_form: {
      new_password: "新密码",
      submit: "更改",
    },
    create_form: {
      name: "名称",
      title: "标题",
      submit: "创建",
    },
    delete_form: {
      confirm: "我确认删除 ${name}",
    },
  },
};

export default async (c: Context, next: Next) => {
  const lang = accepts(c, {
    header: "Accept-Language",
    supports: ["en", "zh"],
    default: "en",
  });

  c.set("i18n", i18n_data[lang]);
  return await next();
};

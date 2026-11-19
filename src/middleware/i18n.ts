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

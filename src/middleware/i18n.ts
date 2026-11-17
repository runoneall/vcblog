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
  },

  zh: {
    default_site_name: "我的博客",
    first_post: {
      title: "第一篇文章",
      content:
        "如果您看到这篇文章，表示您的 blog 已经安装成功。欢迎使用 VCBlog！",
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

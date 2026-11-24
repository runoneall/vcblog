export type UseI18n = {
  i18n: {
    default_site_name: string;
    first_post: {
      title: string;
      content: string;
    };
    feed_description: string;
    search_input_placeholder: string;
    title: {
      main: string;
      not_found: string;
      search: string;
      login: string;
      settings: string;
    };
    login_form: {
      password: string;
      submit: string;
    };
    settings_form: {
      site_name: string;
      post_per_page: string;
      preview_char: string;
      extra_css: string;
      extra_js: string;
      submit: string;
    };
  };
};

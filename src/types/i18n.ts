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
      change_password: string;
      create: {
        post: string;
        page: string;
      };
      delete: {
        post: string;
        page: string;
      };
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
    change_password_form: {
      new_password: string;
      submit: string;
    };
    create_form: {
      name: string;
      title: string;
      submit: string;
    };
    delete_form: {
      confirm: string;
    };
  };
};

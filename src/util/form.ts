class Form {
  constructor(private body: FormData) {}

  text(key: string) {
    const value = this.body.get(key);
    return typeof value === "string" ? value : null;
  }

  number(key: string) {
    return Number(this.text(key));
  }
}

export default (body: FormData) => new Form(body);

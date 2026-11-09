const normalize = (path: string) => (path.startsWith("/") ? path : "/" + path);

export const admin_path = (path?: string) =>
  "/admin" + (path ? normalize(path) : "");

export const admin_dashboard_path = (path?: string) =>
  admin_path("dashboard") + (path ? normalize(path) : "");

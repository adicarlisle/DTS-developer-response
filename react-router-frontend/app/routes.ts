import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/tasks.tsx"),
  route("tasks/new", "routes/tasks.new.tsx"),
  route("tasks/:id", "routes/tasks.$id.tsx"),
  route("tasks/:id/edit", "routes/tasks.$id.edit.tsx"),
  route("tasks/:id/delete", "routes/tasks.$id.delete.tsx"),
] satisfies RouteConfig;

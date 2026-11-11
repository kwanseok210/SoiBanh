import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";
import { APP_NAME } from "@/config";

export const Route = createFileRoute("/register")({
  validateSearch: (search: Record<string, unknown>) => ({ returnTo: typeof search["returnTo"] === "string" ? search["returnTo"] : undefined }),
  head: () => ({ meta: [
    { title: `Đăng ký — ${APP_NAME}` }, { name: "description", content: "Tạo tài khoản Soi Bánh để lưu và xem lại món bánh đã khám phá." },
    { property: "og:title", content: `Đăng ký — ${APP_NAME}` }, { property: "og:description", content: "Tạo tài khoản Soi Bánh để lưu và xem lại món bánh đã khám phá." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <AuthForm mode="register" />,
});

import { redirect } from "next/navigation";

export default function ClaimRedirectPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = new URLSearchParams();
  if (typeof searchParams.code === "string") query.set("code", searchParams.code);
  if (typeof searchParams.email === "string") query.set("email", searchParams.email);

  const qs = query.toString();
  redirect(qs ? `/invite?${qs}` : "/invite");
}

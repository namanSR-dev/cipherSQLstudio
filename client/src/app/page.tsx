// Dev note: home route intentionally redirects fast; keep this file minimal to avoid duplicate landing logic.
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/assignments");
}



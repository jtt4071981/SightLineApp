import { createFileRoute } from "@tanstack/react-router";
import { LaunchDesk } from "@/components/launch-desk";

export const Route = createFileRoute("/")({ component: LaunchDesk });

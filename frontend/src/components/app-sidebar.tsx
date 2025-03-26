import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconListDetails,
  IconUsers,
  IconSettings
} from "@tabler/icons-react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { CookingPot } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      to: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Restaurants",
      to: "/restaurants",
      icon: IconListDetails,
    },
    {
      title: "Orders",
      to: "/orders",
      icon: IconChartBar,
    },
    {
      title: "Settings",
      to: "/settings",
      icon: IconSettings,
    },
    {
      title: "Team",
      to: "/team",
      icon: IconUsers,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <CookingPot className="!size-5" />
                <span className="text-base font-semibold">Dine-Express.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

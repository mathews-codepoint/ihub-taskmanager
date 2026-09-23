import { NavLink } from 'react-router'

import { useMenus } from '../features/auth/hooks/useMenus'
import { MastersMegaMenu } from '../features/masters/components/MastersMegaMenu'
import { DEFAULT_MASTER_ID } from '../features/masters/pages/MastersListPage'
import { useAuthStore, useLogoutMutation } from '../features/auth/store/useAuthStore'
import { resolveMenuHref } from '../features/auth/utils/redirectAllowlist'
import type { MenuGroup, MenuNode } from '../features/auth/api/types'
import { useTheme } from '../core/providers/ThemeProvider'
import {
  ChevronDownIcon,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../shared/ui'

const navItemClass =
  'whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-text-3 hover:bg-paper-2 hover:text-text'
const navItemActiveClass = 'whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium bg-paper-2 text-text'

/** A single top-level entry: NavLink for a same-app destination, a plain
 * external link for a legacy one, or nothing if the backend sent an unsafe
 * URL (migration-plan §6/§7 — never trust a menu URL outright). */
function MenuLink({ menu }: { menu: MenuNode }) {
  const href = resolveMenuHref(menu)
  if (!href) return null

  if (menu.application === 'new') {
    return (
      <NavLink to={href} className={({ isActive }) => (isActive ? navItemActiveClass : navItemClass)}>
        {menu.label}
      </NavLink>
    )
  }

  return (
    <a href={href} className={navItemClass}>
      {menu.label}
    </a>
  )
}

function MenuGroupItem({ group }: { group: MenuGroup }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className={`flex items-center gap-1.5 ${navItemClass}`}>
          {group.label}
          <ChevronDownIcon size={13} className="opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px]" align="start">
        <div className="flex flex-col gap-0.5">
          {group.menus.map((menu) => (
            <MenuLink key={menu.id} menu={menu} />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function Logo() {
  return (
    <span className="shrink-0 text-lg font-medium text-text">
      <em>i</em>Hub
    </span>
  )
}

export function TopNav() {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuthStore()
  const { menus } = useMenus()
  const logoutMutation = useLogoutMutation()

  const initial = user?.name.charAt(0).toUpperCase() ?? '?'

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-[color-mix(in_oklch,var(--bg)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center gap-6 px-7 py-3">
        <Logo />

        <nav className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto">
          {menus.ungroupedMenus.map((menu) => (
            <MenuLink key={menu.id} menu={menu} />
          ))}
          {menus.menuGroups.map((group) => (
            <MenuGroupItem key={group.id} group={group} />
          ))}
          <MastersMegaMenu />
          <NavLink to={`/masters/${DEFAULT_MASTER_ID}`} className={({ isActive }) => (isActive ? navItemActiveClass : navItemClass)}>
            Masters (List)
          </NavLink>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="h-9 rounded-md border border-line-2 bg-paper px-3 text-sm font-medium text-text-2 hover:bg-bg-2"
          >
            {theme === 'paper' ? 'Ink' : 'Paper'}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-paper-2 text-sm font-semibold text-text-2 hover:bg-bg-2"
                aria-label="Account menu"
              >
                {initial}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={logoutMutation.isPending}
                onSelect={() => logoutMutation.mutate()}
              >
                {logoutMutation.isPending ? 'Logging out…' : 'Log out'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

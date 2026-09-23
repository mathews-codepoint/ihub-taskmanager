import type { ReactElement } from 'react'
import { NavLink } from 'react-router'

import { useMenus } from '../features/auth/hooks/useMenus'
import { MastersMegaMenu } from '../features/masters/components/MastersMegaMenu'
import { DEFAULT_MASTER_ID } from '../features/masters/pages/MastersListPage'
import { useAuthStore, useLogoutMutation } from '../features/auth/store/useAuthStore'
import { resolveMenuHref } from '../features/auth/utils/redirectAllowlist'
import type { MenuGroup, MenuNode } from '../features/auth/api/types'
import { useTheme } from '../core/providers/ThemeProvider'
import tamdeenLogoColor from '../assets/logos/tamdeen-master-logo-color.png'
import tamdeenLogoWhite from '../assets/logos/tamdeen-master-logo-white.png'
import ihubWordmark from '../assets/logos/ihub-wordmark.png'
import {
  ActivityIcon,
  BellIcon,
  ChevronDownIcon,
  ClockIcon,
  CoinsIcon,
  DashboardIcon,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  GridIcon,
  LayersIcon,
  MoonIcon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SearchIcon,
  SettingsIcon,
  ShieldIcon,
  StarIcon,
  SunIcon,
  UserIcon,
  type IconProps,
} from '../shared/ui'

const navItemClass =
  'flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-text-3 hover:bg-paper-2 hover:text-text'
const navItemActiveClass = 'flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium bg-paper-2 text-text'

/** Maps the backend's `menu.icon` string to a line icon, per the same icon
 * names the prototype's NAV_TREE uses (migration-plan §6). Unknown names
 * fall back to a generic folder-style icon rather than rendering nothing. */
const MENU_ICONS: Record<string, (props: IconProps) => ReactElement> = {
  dashboard: DashboardIcon,
  coins: CoinsIcon,
  users: UserIcon,
  star: StarIcon,
  shield: ShieldIcon,
  clock: ClockIcon,
  activity: ActivityIcon,
  layers: LayersIcon,
  grid: GridIcon,
  settings: SettingsIcon,
}

function MenuIconGlyph({ icon, size = 15 }: { icon?: string; size?: number }) {
  const Icon = (icon && MENU_ICONS[icon]) || GridIcon
  return <Icon size={size} />
}

/** A single top-level entry: NavLink for a same-app destination, a plain
 * external link for a legacy one, or nothing if the backend sent an unsafe
 * URL (migration-plan §6/§7 — never trust a menu URL outright). */
function MenuLink({ menu }: { menu: MenuNode }) {
  const href = resolveMenuHref(menu)
  if (!href) return null

  if (menu.application === 'new') {
    return (
      <NavLink to={href} className={({ isActive }) => (isActive ? navItemActiveClass : navItemClass)}>
        <MenuIconGlyph icon={menu.icon} />
        {menu.label}
      </NavLink>
    )
  }

  return (
    <a href={href} className={navItemClass}>
      <MenuIconGlyph icon={menu.icon} />
      {menu.label}
    </a>
  )
}

function MenuGroupItem({ group }: { group: MenuGroup }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className={navItemClass}>
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
  const { theme } = useTheme()
  return (
    <span className="flex shrink-0 items-center gap-3.5">
      <img
        src={theme === 'ink' ? tamdeenLogoWhite : tamdeenLogoColor}
        alt="Tamdeen Entertainment"
        className="h-9 w-auto"
      />
      <span aria-hidden className="h-[22px] w-px bg-line-2" />
      <img src={ihubWordmark} alt="ihub" className="h-[30px] w-auto" />
    </span>
  )
}

export function TopNav() {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuthStore()
  const { menus } = useMenus()
  const logoutMutation = useLogoutMutation()

  const name = user?.name ?? ''
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?'
  const hue = [...name].reduce((sum, c) => sum + c.charCodeAt(0), 0) % 360

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
            <GridIcon size={15} />
            Masters (List)
          </NavLink>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label="Search menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-text-3 hover:bg-bg-2"
          >
            <SearchIcon size={18} />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full text-text-3 hover:bg-bg-2"
          >
            {theme === 'paper' ? <MoonIcon size={18} /> : <SunIcon size={18} />}
          </button>

          <button
            type="button"
            aria-label="Settings & Configuration"
            className="flex h-9 w-9 items-center justify-center rounded-full text-text-3 hover:bg-bg-2"
          >
            <SettingsIcon size={18} />
          </button>

          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-text-3 hover:bg-bg-2"
          >
            <BellIcon size={18} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-bad" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
                style={{ background: `oklch(0.50 0.10 ${hue})` }}
                aria-label="Account menu"
              >
                {initials}
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

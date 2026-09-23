import { useEffect, useRef, useState, type ReactElement } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, useNavigate } from 'react-router'

import { useMenus } from '../features/auth/hooks/useMenus'
import { MastersMegaMenu } from '../features/masters/components/MastersMegaMenu'
import { DEFAULT_MASTER_ID } from '../features/masters/pages/MastersListPage'
import { MASTER_CATEGORIES, MASTER_CATEGORY_LABELS, mastersByCategory } from '../features/masters/data/masterCatalog'
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
  CloseIcon,
  CoinsIcon,
  DashboardIcon,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  GridIcon,
  LayersIcon,
  MenuIcon,
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
function MenuLink({
  menu,
  onNavigate,
  indent = false,
}: {
  menu: MenuNode
  onNavigate?: () => void
  indent?: boolean
}) {
  const href = resolveMenuHref(menu)
  if (!href) return null
  const indentClass = indent ? 'ps-6' : ''

  if (menu.application === 'new') {
    return (
      <NavLink
        to={href}
        onClick={onNavigate}
        className={({ isActive }) => `${isActive ? navItemActiveClass : navItemClass} ${indentClass}`}
      >
        <MenuIconGlyph icon={menu.icon} />
        {menu.label}
      </NavLink>
    )
  }

  return (
    <a href={href} onClick={onNavigate} className={`${navItemClass} ${indentClass}`}>
      <MenuIconGlyph icon={menu.icon} />
      {menu.label}
    </a>
  )
}

interface NotificationItem {
  subject: string
  type: 'SLA' | 'Approval' | 'Alert' | 'Digest'
  time: string
  unread: boolean
}

/** Mirrors the live prototype's NotificationsBell mock feed (index.html
 * NotificationsBell) — placeholder content until a real notifications API
 * exists. */
const NOTIFICATIONS: NotificationItem[] = [
  { subject: 'Past due time — Budget Release, Eid Activation · 7h over', type: 'SLA', time: '12m ago', unread: true },
  { subject: 'Running out of time — Action Sheet: Crowd Safety Plan · 14m left', type: 'SLA', time: '20m ago', unread: true },
  { subject: 'Past due time — JO-7768 Arcade maintenance · 6.7h over', type: 'SLA', time: '1h ago', unread: true },
  { subject: 'Approval needed — Q2 Marketing Budget', type: 'Approval', time: '9:12 AM', unread: true },
  { subject: 'Overtime above budget — Operations', type: 'Alert', time: '8:30 AM', unread: true },
  { subject: 'New incident logged — Tower Plaza', type: 'Alert', time: 'Yesterday', unread: true },
  { subject: 'Daily checklist summary — SAMA Mall', type: 'Digest', time: 'Yesterday', unread: false },
  { subject: 'CEO sign-off — Cleaning vendor renewal', type: 'Approval', time: 'Apr 27', unread: false },
]

const NOTIFICATION_TYPE_CLASS: Record<NotificationItem['type'], string> = {
  SLA: 'bg-bad/[0.14] text-bad',
  Approval: 'bg-accent-dim text-accent',
  Alert: 'bg-warn/[0.14] text-warn',
  Digest: 'bg-paper-2 text-text-3',
}

/** Expandable search box: collapsed to an icon button, grows into a text
 * input on click or ⌘K/Ctrl+K, matching the live prototype's SearchBox. */
function SearchBox() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen(true)
      }
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div
      onClick={() => setOpen(true)}
      className={`hidden items-center gap-2 overflow-hidden rounded-[10px] border border-line-2 bg-bg-2 text-text-2 shadow-[0_1px_2px_rgba(20,20,30,0.04)] transition-[width] duration-300 ease-out sm:flex ${
        open ? 'w-[248px] cursor-text justify-start px-3' : 'w-9 cursor-pointer justify-center hover:bg-bg-3 hover:border-line hover:text-text'
      }`}
      style={{ height: 36 }}
    >
      <SearchIcon size={18} className="shrink-0" />
      {open ? (
        <>
          <input
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onBlur={() => {
              if (!value) setOpen(false)
            }}
            placeholder="Search menu"
            className="min-w-0 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-4"
          />
          <span className="shrink-0 rounded border border-line-2 px-1.5 py-0.5 text-[10px] text-text-4">⌘K</span>
        </>
      ) : null}
    </div>
  )
}

/** Rich notifications popover matching the live prototype's NotificationsBell:
 * All/Unread tabs, a scrollable list, and a footer link to the full page. */
function NotificationsBell() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'all' | 'unread'>('all')
  const [popoverOpen, setPopoverOpen] = useState(false)
  const unreadCount = NOTIFICATIONS.filter((item) => item.unread).length
  const items = tab === 'unread' ? NOTIFICATIONS.filter((item) => item.unread) : NOTIFICATIONS

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-text-3 hover:bg-bg-2"
        >
          <BellIcon size={18} />
          {unreadCount > 0 ? <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-bad" /> : null}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-0" align="end">
        <div className="flex items-center justify-between gap-2.5 border-b border-line px-[15px] py-[13px]">
          <span className="text-sm font-semibold text-text">Notifications</span>
        </div>
        <div className="flex gap-0.5 px-3 pb-1 pt-2.5">
          <div className="flex flex-1 gap-0.5 rounded-[9px] border border-line bg-paper-2 p-[3px]">
            {(['all', 'unread'] as const).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex-1 rounded-md py-[7px] text-[12.5px] capitalize ${
                  tab === id ? 'bg-paper font-semibold text-accent' : 'font-medium text-text-2'
                }`}
              >
                {id === 'all' ? 'All' : 'Unread'}
              </button>
            ))}
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto px-2 pb-2 pt-1.5">
          {items.length ? (
            items.map((item, index) => (
              <div
                key={index}
                className={`flex gap-2.5 rounded-[10px] px-2.5 py-2.5 ${item.unread ? 'bg-bg-2' : ''}`}
              >
                <span
                  className={`mt-0.5 h-fit shrink-0 rounded px-1.5 py-0.5 text-[10.5px] font-medium ${NOTIFICATION_TYPE_CLASS[item.type]}`}
                >
                  {item.type}
                </span>
                <div className="min-w-0 flex-1">
                  <div className={`text-[13px] leading-snug text-text ${item.unread ? 'font-semibold' : 'font-medium'}`}>
                    {item.subject}
                  </div>
                  <div className="mt-0.5 text-[11.5px] text-text-3">{item.time}</div>
                </div>
                {item.unread ? <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /> : null}
              </div>
            ))
          ) : (
            <div className="px-3 py-[26px] text-center text-sm text-text-4">You're all caught up</div>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            setPopoverOpen(false)
            navigate('/notifications')
          }}
          className="w-full border-t border-line py-3 text-sm font-semibold text-accent hover:bg-paper-2"
        >
          View all notifications
        </button>
      </PopoverContent>
    </Popover>
  )
}

/** Mobile slide-out drawer holding the full nav tree, shown once the inline
 * strip can no longer hold every item (matches the live prototype's
 * burger + drawer breakpoint at ~1040px, mapped to Tailwind's `lg`). */
function MobileNavDrawer({
  open,
  onClose,
  menus,
}: {
  open: boolean
  onClose: () => void
  menus: { ungroupedMenus: MenuNode[]; menuGroups: MenuGroup[] }
}) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[200] flex">
      <div onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      <aside className="relative flex h-full w-[min(300px,86vw)] flex-col border-e border-line bg-paper shadow-[0_24px_80px_rgba(26,26,31,0.4)]">
        <div className="flex shrink-0 items-center justify-between gap-2.5 border-b border-line px-3.5 py-3">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-text-3 hover:bg-bg-2"
          >
            <CloseIcon size={16} />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2.5">
          {menus.ungroupedMenus.map((menu) => (
            <MenuLink key={menu.id} menu={menu} onNavigate={onClose} />
          ))}
          {menus.menuGroups.map((group) => (
            <div key={group.id} className="flex flex-col gap-0.5">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.06em] text-text-4">{group.label}</div>
              {group.menus.map((menu) => (
                <MenuLink key={menu.id} menu={menu} onNavigate={onClose} indent />
              ))}
            </div>
          ))}
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.06em] text-text-4">Masters</div>
          {MASTER_CATEGORIES.map((category) => (
            <div key={category} className="flex flex-col gap-0.5">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-text-3">{MASTER_CATEGORY_LABELS[category]}</div>
              {mastersByCategory(category).map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => {
                    onClose()
                    navigate(`/masters/${entry.id}`)
                  }}
                  className="truncate rounded-md px-6 py-1.5 text-start text-[13px] text-text-2 hover:bg-bg"
                >
                  {entry.label}
                </button>
              ))}
            </div>
          ))}
          <NavLink
            to={`/masters/${DEFAULT_MASTER_ID}`}
            onClick={onClose}
            className={({ isActive }) => (isActive ? navItemActiveClass : navItemClass)}
          >
            <GridIcon size={15} />
            Masters (List)
          </NavLink>
        </nav>
      </aside>
    </div>,
    document.body,
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
    <NavLink to="/" className="flex shrink-0 items-center gap-3.5" aria-label="Go to home">
      <img
        src={theme === 'ink' ? tamdeenLogoWhite : tamdeenLogoColor}
        alt="Tamdeen Entertainment"
        className="h-9 w-auto"
      />
      <span aria-hidden className="h-[22px] w-px bg-line-2" />
      <img src={ihubWordmark} alt="ihub" className="h-[30px] w-auto" />
    </NavLink>
  )
}

export function TopNav() {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuthStore()
  const { menus } = useMenus()
  const logoutMutation = useLogoutMutation()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const name = user?.name ?? ''
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?'
  const hue = [...name].reduce((sum, c) => sum + c.charCodeAt(0), 0) % 360

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-[color-mix(in_oklch,var(--bg)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center gap-6 px-7 py-3">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Menu"
          title="Menu"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line-2 bg-paper text-text-2 lg:hidden"
        >
          <MenuIcon size={18} />
        </button>

        <Logo />

        <nav className="hidden min-w-0 flex-1 items-center gap-0.5 overflow-x-auto lg:flex">
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
        <div className="min-w-0 flex-1 lg:hidden" />

        <MobileNavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} menus={menus} />

        <div className="flex shrink-0 items-center gap-2">
          <SearchBox />

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
            onClick={() => navigate('/settings-configuration/configuration')}
            aria-label="Settings & Configuration"
            className="flex h-9 w-9 items-center justify-center rounded-full text-text-3 hover:bg-bg-2"
          >
            <SettingsIcon size={18} />
          </button>

          <NotificationsBell />

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

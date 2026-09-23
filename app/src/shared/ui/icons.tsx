import type { ReactNode, SVGProps } from 'react'

/** Line-style icon set per migration-plan/DESIGN_SYSTEM.md §5: viewBox 0 0 24 24,
 * 1.6px stroke, round caps/joins, currentColor, 20px default. Only the handful
 * shared/ui's Radix wrappers need — the full icon set is ported separately. */
export type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function IconBase({ size = 20, children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  )
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 9 6 6 6-6" />
    </IconBase>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m5 13 4 4L19 7" />
    </IconBase>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </IconBase>
  )
}

export function FilterIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 5h16M7 12h10M10 19h4" />
    </IconBase>
  )
}

export function SettingsIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 0 1-4 0v-.09A1.7 1.7 0 0 0 8.96 19a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 0 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1.04-1.56V3a2 2 0 0 1 4 0v.09A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.56 1.04H21a2 2 0 0 1 0 4h-.09A1.7 1.7 0 0 0 19.4 15Z" />
    </IconBase>
  )
}

export function TrashIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-.8 12.1a1.6 1.6 0 0 1-1.6 1.5H7.4a1.6 1.6 0 0 1-1.6-1.5L5 7" />
    </IconBase>
  )
}

export function PencilIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M14.06 5.19 18.81 9.94M3 21l3.75-.94a2 2 0 0 0 .98-.54l10.4-10.4a1.5 1.5 0 0 0 0-2.12l-1.99-1.99a1.5 1.5 0 0 0-2.12 0L4.62 15.4a2 2 0 0 0-.53.98L3 21Z" />
    </IconBase>
  )
}

export function EyeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
      <circle cx="12" cy="12" r="3" />
    </IconBase>
  )
}

export function DownloadIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3v12m0 0-4-4m4 4 4-4M4 19h16" />
    </IconBase>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </IconBase>
  )
}

export function PlusIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14M5 12h14" />
    </IconBase>
  )
}

export function FolderIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
    </IconBase>
  )
}

export function InboxIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 13l3-8h12l3 8" />
      <path d="M3 13v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6" />
      <path d="M3 13h5l1 3h6l1-3h5" />
    </IconBase>
  )
}

export function BoltIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
    </IconBase>
  )
}

export function SparkleIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </IconBase>
  )
}

export function ClockIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </IconBase>
  )
}

export function TrendIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 17l6-6 4 4 8-9" />
      <path d="M15 6h6v6" />
    </IconBase>
  )
}

export function UserIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </IconBase>
  )
}

export function GridIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="4" width="7" height="7" rx="1.2" />
      <rect x="13" y="4" width="7" height="7" rx="1.2" />
      <rect x="4" y="13" width="7" height="7" rx="1.2" />
      <rect x="13" y="13" width="7" height="7" rx="1.2" />
    </IconBase>
  )
}

export function RefreshIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 12a8 8 0 0 1 13.66-5.66L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.66 5.66L4 15.5M4 20v-4.5h4.5" />
    </IconBase>
  )
}

export function CoinsIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <ellipse cx="9" cy="7" rx="5.5" ry="3" />
      <path d="M3.5 7v4c0 1.66 2.46 3 5.5 3s5.5-1.34 5.5-3V7" />
      <path d="M9 14v3c0 1.66 2.46 3 5.5 3s5.5-1.34 5.5-3v-6.5c0-1.1-1-2-2.5-2.6" />
    </IconBase>
  )
}

export function ReceiptIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6 3h12v18l-2.5-1.5L13 21l-2.5-1.5L8 21l-2-1.5V3Z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </IconBase>
  )
}

export function CartIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L20 8H6" />
      <circle cx="9" cy="21" r="1.3" />
      <circle cx="17" cy="21" r="1.3" />
    </IconBase>
  )
}

export function ShieldIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3l7 3v6c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V6l7-3Z" />
    </IconBase>
  )
}

export function ChartIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 20V10M11 20V4M18 20v-7" />
    </IconBase>
  )
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </IconBase>
  )
}

export function AlertIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3 2 20h20L12 3Z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" />
    </IconBase>
  )
}

export function BellIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6 9a6 6 0 1 1 12 0c0 3 1 5 1.5 6H4.5C5 14 6 12 6 9Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </IconBase>
  )
}

export function MenuIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </IconBase>
  )
}

export function DashboardIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="3" width="8" height="10" rx="1.5" />
      <rect x="13" y="3" width="8" height="6" rx="1.5" />
      <rect x="13" y="11" width="8" height="10" rx="1.5" />
      <rect x="3" y="15" width="8" height="6" rx="1.5" />
    </IconBase>
  )
}

export function StarIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7Z" />
    </IconBase>
  )
}

export function ActivityIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 12h4l2.5-7 4 14L16 12h5" />
    </IconBase>
  )
}

export function LayersIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z" />
      <path d="m3.5 12 8.5 4.5 8.5-4.5" />
      <path d="m3.5 16.5 8.5 4.5 8.5-4.5" />
    </IconBase>
  )
}

export function SunIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.4M12 19.1v2.4M4.4 4.4l1.7 1.7M17.9 17.9l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.4 19.6l1.7-1.7M17.9 6.1l1.7-1.7" />
    </IconBase>
  )
}

export function MoreIcon(props: IconProps) {
  return (
    <IconBase {...props} strokeWidth={0} fill="currentColor">
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </IconBase>
  )
}

export function MoonIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20.5 14.3A8.5 8.5 0 1 1 9.7 3.5a7 7 0 0 0 10.8 10.8Z" />
    </IconBase>
  )
}

export function MapPinIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </IconBase>
  )
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20 12H4M10 6l-6 6 6 6" />
    </IconBase>
  )
}

export function CameraIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 8a2 2 0 0 1 2-2h1.5l1-1.6a1.5 1.5 0 0 1 1.3-.9h4.4a1.5 1.5 0 0 1 1.3.9L16.5 6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" />
      <circle cx="12" cy="13" r="3.5" />
    </IconBase>
  )
}

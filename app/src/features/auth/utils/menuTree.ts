import type { MenuGroup, MenuNode, MenusResponse } from '../api/types'

/** Drops leaves whose effective `view` permission is false, then drops any
 * parent left with no visible children (migration-plan §6: "React removes
 * leaf menus whose effective view permission is false"). */
function pruneMenu(menu: MenuNode): MenuNode | null {
  if (!menu.permissions.view) return null

  if (!menu.subMenus?.length) return menu

  const visibleChildren = menu.subMenus.map(pruneMenu).filter((child): child is MenuNode => child !== null)
  if (!visibleChildren.length) return null

  return { ...menu, subMenus: visibleChildren }
}

function pruneMenus(menus: MenuNode[]): MenuNode[] {
  return menus.map(pruneMenu).filter((menu): menu is MenuNode => menu !== null)
}

export interface VisibleMenus {
  menuGroups: MenuGroup[]
  ungroupedMenus: MenuNode[]
}

/** Applies the view-permission prune to every group and the ungrouped list. */
export function buildVisibleMenus(response: MenusResponse): VisibleMenus {
  const menuGroups = response.data.menuGroups
    .map((group) => ({ ...group, menus: pruneMenus(group.menus) }))
    .filter((group) => group.menus.length > 0)

  return {
    menuGroups,
    ungroupedMenus: pruneMenus(response.data.ungroupedMenus),
  }
}

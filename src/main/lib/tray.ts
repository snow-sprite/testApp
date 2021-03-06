import { Menu, Tray, dialog, shell, MenuItemConstructorOptions } from 'electron'
import path from 'path'
import pkg from '../../../package.json'
function createTray() {
  const BugsIssues = 'https://github.com/snow-sprite/CompressApp/issues'
  // 自定义任务栏
  const taryIcon = new Tray(path.join(__static, './tray/18x18.png'))
  // let baseUrl: string = process.env.BASE_URL || '/'
  // const taryIcon = new Tray(path.join(baseUrl, 'static/tray/18x18.png'))

  const contextMenuList = [
    {
      label: 'Reload',
      role: 'reload'
    },
    {
      label: 'About',
      type: 'normal',
      toolTip: 'about',
      click: () => {
        dialog.showMessageBox({
          type: 'info',
          title: 'About',
          message: `
        ${pkg.description}\n
        version: ${pkg.version}\n
        ${pkg.author.name}<${pkg.author.email}>`
        })
        // process.exit()
      }
    },
    {
      label: 'Bugs Report',
      type: 'normal',
      click: () => {
        shell.openExternal(BugsIssues)
      }
    },
    {
      label: 'Quit',
      role: 'quit'
    }
  ]
  const contextMenu = Menu.buildFromTemplate(
    contextMenuList as Array<MenuItemConstructorOptions>
  )
  // const contextMenu = Menu.buildFromTemplate(contextMenuList)
  taryIcon.on('click', () => {
    taryIcon.popUpContextMenu(contextMenu)
  })
}

export default createTray

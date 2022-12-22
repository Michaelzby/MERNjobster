import links from '../utils/links'
import { NavLink } from 'react-router-dom'

const NavLinks = ({ toggleSidebar }) => {
  return (
    <div className='nav-links'>
      {links.map((link) => {
        const { text, path, id, icon } = link
// 每个里面包含了内容 path 图标
        return (
          <NavLink
            to={path}
            key={id}
            onClick={toggleSidebar}
            // 注意 这些点一下其实就是吧现在打开的smallbar 关掉 跳转到另一个界面
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            <span className='icon'>{icon}</span>
            {text}
          </NavLink>
        )
      })}
    </div>
  )
}

export default NavLinks

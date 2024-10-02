import { Link } from 'react-router-dom'

export default function SidebarLink({ Icon, text, location }) {
    return (
      <Link to={location} className="flex items-center mx-2 py-2 px-5 rounded-lg hover:bg-gray-500 active:bg-gray-400">
        <Icon className="w-6 h-6" />
        <h1 className="px-3">{text}</h1>
      </Link>
    )
}
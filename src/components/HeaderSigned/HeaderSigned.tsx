import { useLayout } from "@/context/UseLayout";

export default function HeaderSigned() {
    const { logout, user } = useLayout();
    return (
        <header className="bg-gray-700 text-white py-1">
            <nav className="container flex">
                <ul className="flex gap-5 flex-1">
                    <li className="block py-2 px-3">Usuario: <span className="font-semibold">{user?.name}</span></li>
                    <li className="block py-2 px-3">ID User: <span className="font-semibold">{user?.id}</span></li>
                </ul>
                <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-300" onClick={logout}>Sair</button>
            </nav>
        </header>
    )
}
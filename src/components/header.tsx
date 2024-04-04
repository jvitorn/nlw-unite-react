import nwlIcon from "../assets/nlw-united-icon.svg"

import { NavLink } from "./nav-link"

export function Header() {
    return (
        <div className="flex items-center gap-5 py-2">
            <img src={nwlIcon} />

            <nav className="flex items-center gap-5">
                <NavLink href="/eventos"> 
                    Eventos
                </NavLink>
                <NavLink href="/eventos"> 
                    Participantes
                </NavLink>
                <NavLink href="/eventos"> 
                    Link 3
                </NavLink>
            </nav>
        </div>
    )
}
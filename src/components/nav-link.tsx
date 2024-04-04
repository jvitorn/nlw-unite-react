import { ComponentProps } from "react"

interface NavLinkProps extends ComponentProps<'a'> {
    children: string,
    href: string
}

export function NavLink(props: NavLinkProps) {
    return (
        <a {...props} href={props.href} className="font-medium text-sm">
            {props.children}
        </a>
    )
}
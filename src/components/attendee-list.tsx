// React
import { ChangeEvent, useEffect, useState } from "react"
// Icons
import { ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight, MoreHorizontal, Search } from "lucide-react"
// Libs
import dayjs from "dayjs"
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'
// Components
import { IconButton } from "./icon-button"
import { Table } from "./table/table"
import { TableHeader } from "./table/table-header"
import { TableCell } from "./table/table-cell"
import { TableRow } from "./table/table-row"
// Dayjs
dayjs.extend(relativeTime)
dayjs.locale('pt-br')
// Interface from attendees props
interface Attendee {
    id: string,
    name: string,
    email: string,
    createdAt: string,
    checkedInAt: string | null
}

export function AttendeeList() {

    const [searchInput, setSearchInput] = useState(() => {
        const url = new URL(window.location.toString());
    
        if (url.searchParams.has("search")) return url.searchParams.get("search") ?? "";
        
        return "";
      });
    // url state
    const [page, setPage] = useState(() => {
        const url = new URL(window.location.toString())

        if (url.searchParams.has('page')) return Number(url.searchParams.get('page'))

        return 1
    })

    function setCurrentSearch(search: string) {
        const url = new URL(window.location.toString())
        url.searchParams.set('search', search)

        window.history.pushState({}, "", url)

        setSearchInput(search)

    }

    const [attendees, setAttendees] = useState<Attendee[]>([])
    const [totalAttendees, setTotalAttendees] = useState(0)

    useEffect(() => {
        const url = new URL('http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees')

        url.searchParams.set('pageIndex', String(page - 1))

        if (searchInput.length > 1) url.searchParams.set("query", searchInput);

        fetch(url)
            .then(resp => resp.json())
            .then(data => {
                setAttendees(data.attendees)
                setTotalAttendees(data.total)
            })
    }, [page, searchInput])

    const totalPages = Math.ceil(totalAttendees / 10)

    function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
        setCurrentSearch(event.target.value)
        setCurrentPage(1)
    }
    function goToFirstPage() {
        setCurrentPage(1)
    }
    function goToLastPage() {
        setCurrentPage(totalPages)
    }
    function goToNextPage() {
        setCurrentPage(page + 1)

    }
    function goToPreviousPage() {
        setCurrentPage(page - 1)


    }

    function setCurrentPage(page: number) {
        const url = new URL(window.location.toString())

        url.searchParams.set('page', String(page))

        window.history.pushState({}, "", url)

        setPage(page)
    }

    return (
        <div className="flex flex-col gap-4">
            {/* title content */}
            <div className="flex gap-3 items-center">
                <h1 className="text-2xl font-bold">Participantes</h1>
                <div className="px-3 w-72 py-1.5 border border-white/10 rounded-lg text-sm flex items-center gap-3">
                    <Search className="size-4 text-emerald-300" />
                    <input onChange={onSearchInputChanged}
                        className="bg-transparent flex-1 outline-none h-auto border-0 p-0 text-sm focus:ring-0"
                        placeholder="Buscar participante..."
                        value={searchInput}
                    />
                </div>
            </div>
            {/* Table of contents */}
            <Table>
                <thead>
                    <tr className="border-b border-white/10">
                        <TableHeader style={{ width: 64 }}>
                            <input type="checkbox" className="size-4 bg-black/20 rounded border-white/10" />
                        </TableHeader>
                        <TableHeader> Código </TableHeader>
                        <TableHeader> Participante </TableHeader>
                        <TableHeader> Data da inscrição </TableHeader>
                        <TableHeader> Data do check-in </TableHeader>
                        <TableHeader style={{ width: 64 }}>  </TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {attendees.map((attendee) => {
                        return (
                            <TableRow key={attendee.id} >
                                <TableCell>
                                    <input type="checkbox" className="size-4 bg-black/20 rounded border-white/10" />
                                </TableCell>
                                <TableCell>{attendee.id}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold text-white">
                                            {attendee.name}
                                        </span>
                                        <span>
                                            {attendee.email}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                                <TableCell>{
                                    attendee.checkedInAt === null ?
                                        <span className="text-rose-400">Não Fez Check-In</span>
                                        : dayjs().to(attendee.checkedInAt)}
                                </TableCell>
                                <TableCell>
                                    <IconButton transparent>
                                        <MoreHorizontal className="size-4" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <TableCell colSpan={3}>
                            Mostrando {attendees.length} de {totalAttendees} itens
                        </TableCell>
                        <TableCell className="text-right" colSpan={3}>
                            <div className="inline-flex items-center gap-8">
                                <span> Pagina {page} de {totalAttendees} </span>
                                <div className="flex gap-1.5">
                                    <IconButton onClick={goToFirstPage} disabled={page === 1}>
                                        <ChevronsLeft className="size-4" />
                                    </IconButton>
                                    <IconButton onClick={goToPreviousPage} disabled={page === 1}>
                                        <ChevronLeft className="size-4" />
                                    </IconButton>
                                    <IconButton onClick={goToNextPage} disabled={page === totalPages}>
                                        <ChevronRight className="size-4" />
                                    </IconButton>
                                    <IconButton onClick={goToLastPage} disabled={page === totalPages}>
                                        <ChevronsRight className="size-4" />
                                    </IconButton>
                                </div>
                            </div>
                        </TableCell>
                    </tr>
                </tfoot>
            </Table>

        </div>

    )
}
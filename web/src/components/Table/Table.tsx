import TableHeader from "./TableHeader.tsx";
import TableBody from "./TableBody.tsx";

interface Column{
    label: string,
    accessor: string
}
interface DataProps {
    dkey: string,
    columns:Column[],
    data?:never[]|null | undefined,
    cssColClass?: string,
    noDataMsg?:string
}

const RenderNoData = (msg?:string) => {
    return(
        <>
            <tbody></tbody>
            <div className="p-table-no-data">
                <h4>{msg}</h4>
            </div>
        </>
    )
}
const Table = ({...props}:(DataProps)) => {

    return(
        <>
            <table className="p-table">
                <TableHeader columns={props.columns} cssColClass={props.cssColClass === undefined ? undefined : props.cssColClass } />
                <TableBody columns={props.columns} data={props.data} />
            </table>
            {!props.data && RenderNoData(props.noDataMsg)}
        </>
    )
}

export default Table;
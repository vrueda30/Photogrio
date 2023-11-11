import {FC} from "react";
import TableHeader from "./TableHeader.tsx";
import TableBody from "./TableBody.tsx";

interface DataProps {
    dkey: string,
    columns:{label: string, accessor: string}[],
    data?:any[]|null,
    cssColClass?: string,
    noDataMsg?:string
}

const RenderNoData = (msg:string) => {
    return(
        <>
            <tbody></tbody>
            <div className="p-table-no-data">
                <h4>{msg}</h4>
            </div>
        </>
    )
}
const Table:FC<DataProps> = ({dkey,
                                 columns,
                                 data,
                                 cssColClass,
                                 noDataMsg="No data to show"}) => {

    return(
        <>
            <table className="p-table">
                <TableHeader columns={columns} cssColClass={cssColClass === undefined ? undefined : cssColClass } />
                <TableBody />
            </table>
            {!data && RenderNoData(noDataMsg)}
        </>
    )
}

export default Table;
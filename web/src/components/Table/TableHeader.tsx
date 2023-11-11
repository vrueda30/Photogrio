import {FC} from "react";

interface column {
    label: string,
    accessor: string
}
interface props{
    columns:column[],
    cssColClass?: string
}


const TableHeader: FC<props> = ({columns, cssColClass}) => {
    return(
        <thead className="p-table-header-box">
        {columns.map(({label, accessor}) => {
            return <th key={accessor} className={cssColClass === undefined ? "p-table-col-header" : `p-table-col-header ${cssColClass}`}>{label}</th>
        })}
        </thead>
    )
}

export default TableHeader
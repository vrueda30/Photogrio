import React, {ReactComponentElement, useState} from "react";

interface Column{
    label: string,
    accessor: string,
    formatter?: React.ReactElement
}

interface Tbprops {
    data?: never[] | undefined | null,
    columns: Column[] | undefined | null
}

const buildrow = (row:object, headers:Column[] | undefined | null,rowIndex:number = 2) => {
    return (
        <tr key={row.ID} className={rowIndex % 2 ? "even-row table-row":"odd-row table-row"}>
            {headers.map((value, index) => {
                if (value.formatter){
                    return value.formatter(row[value.accessor],row.ID)
                }else {
                    return <td className="table-cell" id={row.ID}>{row[value.accessor]}</td>
                }
            })}
        </tr>
    )
}

const TableBody = ({...props}:Tbprops) => {
    return(
        <tbody className="grid-body">
        {props.data && props.data.map((value,index) => {
            return buildrow(value, props.columns, index);
        })}
        </tbody>
    )
}

export default TableBody
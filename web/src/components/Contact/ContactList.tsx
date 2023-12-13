import Table from"../Table/Table.tsx"
import {Nav, NavItem, NavLink} from "reactstrap";
import {NavLink as RouterNavLink} from 'react-router-dom'
import {useEffect} from "react";


interface props{
    data?: never[] | null | undefined
}

export const ContactList = ({data}:props) => {
    const contactType = (value: never) => {
        let contactTypeName  = ''
        switch (value){
            case 1:
                contactTypeName = 'Client';
                break;
            case 2:
                contactTypeName = 'Hot Lead'
                break;
            case 3:
                contactTypeName = 'Cold Lead'
                break;
            default:
                contactTypeName = 'Other'
        }

        return(
            <>
                {contactTypeName}
            </>
        )
    }

    const dataColumns = [
        {label: "Name", accessor: "name", formatter: (value:never,key?:never) => {
                return(
                    <div className="d-flex justify-content-center table-cell">
                    <Nav>
                        <NavItem>
                            <NavLink tag={RouterNavLink} to={`/contact/${key}`} className="router-link-exact-active contact-link">{value}</NavLink>
                        </NavItem>
                    </Nav>
                    </div>
                )
            }},
        {label: "Email", accessor: "email"},
        {label: "Contact Type", accessor: "contactType", formatter: contactType },
        {label: "Phone", accessor: "phone", formatter: (value:never,key?:never) => {return (<td key={key}>{value}</td>)}}
    ]

    return(
        <>
            <Table dkey="ID" data={data} columns={dataColumns} cssColClass={"flex-fill"} noDataMsg="No contacts to show"/>
        </>
    )
}

export default ContactList
import Table from"../Table/Table.tsx"
import {Nav, NavItem, NavLink} from "reactstrap";
import {NavLink as RouterNavLink} from 'react-router-dom'


interface props{
    data?: never[] | null | undefined
}

export const ContactList = ({data}:props) => {
    const dataColumns = [
        {label: "Name", accessor: "name", formatter: (value,key?) => {
                return(
                    <>
                    <Nav>
                        <NavItem>
                            <NavLink tag={RouterNavLink} to={`/contact/${key}`} className="router-link-exact-active">{value}</NavLink>
                        </NavItem>
                    </Nav>
                    </>
                )
            }},
        {label: "Email", accessor: "email"},
        {label: "Contact Type", accessor: "contactType"},
        {label: "Phone", accessor: "phone", formatter: (value,key) => {return (<td>{value}</td>)}}
    ]

    return(
        <>
            <Table dkey="ID" data={data} columns={dataColumns} cssColClass={"flex-fill"} noDataMsg="No contacts to show"/>
        </>
    )
}

export default ContactList
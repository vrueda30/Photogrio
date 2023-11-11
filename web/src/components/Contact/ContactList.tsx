import Table from"../Table/Table.tsx"
export const ContactList = () => {
    const dataColumns = [
        {label: "Name", accessor: "name"},
        {label: "Email", accessor: "email"},
        {label: "Contact Type", accessor: "contactType"},
        {label: "Phone", accessor: "phone"}
    ]

    return(
        <>
            <Table dkey="id" columns={dataColumns} cssColClass={"flex-fill"} noDataMsg="No contacts to show"/>
        </>
    )
}

export default ContactList
import { useEffect, useState } from "react";
export default function CorrectDatatable() {
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch('http://localhost:4000/CorrectDatatable')
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => console.log(err));
    }, []);
    const tableCorrectData = data.map((item, index) => {
        return (
            <tr key={index}>
                <td>{item.billDate}</td>
                <td>{item.billNo}</td>
                <td>{item.vat}</td>
            </tr>
        );
    });

    return (
        <>
            <div>
                <h1>Correct Datatable</h1>
                <div className="tbl-header">
                    <table cellPadding={"0"} cellSpacing={"0"} border={"0"}>
                        <thead>
                            <tr>
                                <th data-sortable="true">Fatura Date</th>
                                <th data-sortable="true">Fatura No</th>
                                <th data-sortable="true">KDV</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div className="tbl-content">
                    <table cellPadding="0" cellSpacing="0" border="0">
                        <tbody>
                            {tableCorrectData}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
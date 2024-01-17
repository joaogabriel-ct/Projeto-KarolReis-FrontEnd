
import Table from "@/components/Table";
import axios  from "axios";
import { useEffect, useState } from "react";

export default function Financeiro(){
    const [data, setData] = useState([])

    useEffect(() => {
        axios.get('http://localhost:8000/api/v1/sales/1/')
        .then(response => {
            setData(response.data);
          })
        .catch(error => {
            console.error('There was an error fetching the Closers data:', error);
        })

    },[])


    return(
    <div className="flex-1 bg-gray-100 min-h-screen">
        <Table data={data}/>
    </div>
    );
}
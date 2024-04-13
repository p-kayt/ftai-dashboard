import { DataGrid } from '@mui/x-data-grid'
import Loading from 'app/components/MatxLoading'
import React from 'react'

export default function UserPage({ data, columns, isSuccess}) {
    if(!data) {
return <Loading />
    }
    console.log(data)
  return (
    <div style={{ marginLeft: "20px", marginRight: "20px", marginTop: "20px" }}>
{isSuccess && <DataGrid
    rows={data}
    columns={columns}
    initialState={{
        pagination: {
            paginationModel: { page: 0, pageSize: 10 }
        }
    }}
    pageSizeOptions={[10, 20]}
/>}
</div> 
  )
}

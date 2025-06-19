

import { AdminTable } from "@/components/organisms/ListingCard"
import { fetchAPI } from "@/utils/apiService"

export default async function dashboard() {
  const destinationdata = await fetchAPI({ endpoint: "destinations" });
    return (

        <>
 <AdminTable
          title="Destination Management"
          buttonText="Add Destination"
          data={destinationdata.data}
          columns={[
            { label: "Location", accessor: "location" },
          ]} endpoint={""}
    />
        </>
    )
    
}
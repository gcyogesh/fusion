import { AdminTable } from "@/components/organisms/ListingCard"
import { fetchAPI } from "@/utils/apiService"

export default async function CustomiseDestinations() {
  const destinationdata = await fetchAPI({ endpoint: "destinations" });
  
  return (
    <>
      <AdminTable
        title="Destination Management"
        buttonText="Add New Destination"
        data={destinationdata.data}
        columns={[
          { label: "title", accessor: "title" },
        ]} 
        endpoint={"destinations"}
      />
    </>
  )
} 
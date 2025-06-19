
import { AdminTable } from "@/components/organisms/ListingCard" //Changes
import { fetchAPI } from "@/utils/apiService"
export default async function dashboard() {
  const blogsdata = await fetchAPI({ endpoint: "activities" });
 

    return (

        <>
 <AdminTable
          title="Activities Management"
          buttonText="Add Activities"
          data={blogsdata.data}
          columns={[
            { label: "Activities Title", accessor: "title" },
          ]} endpoint={"activities"}
    />
        </>
    )
    
}
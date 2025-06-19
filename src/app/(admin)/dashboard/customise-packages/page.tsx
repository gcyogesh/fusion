import { AdminTable } from "@/components/organisms/ListingCard"
import { fetchAPI } from "@/utils/apiService"
export default async function dashboard() {
  const packagesdata = await fetchAPI({ endpoint: "tour/tour-packages" });

    return (
        <>
          <AdminTable
            title="Packages Management"
            buttonText="Add Packages"
            data={packagesdata.data}
            columns={[
              { label: "Packages title", accessor: "title" },
            ]} 
            endpoint="tour/tour-packages"
          />
        </>
    )
}
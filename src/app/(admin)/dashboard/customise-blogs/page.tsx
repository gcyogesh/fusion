export const dynamic = "force-dynamic";
import { AdminTable } from "@/components/organisms/ListingCard"
import { fetchAPI } from "@/utils/apiService"
export default async function dashboard() {
  const blogsdata = await fetchAPI({ endpoint: "blogs" });

console.log(blogsdata)
  return (

        <>
 <AdminTable
          title="Blogs Management"
          buttonText="Add New Blogs"
          data={blogsdata.data}
          columns={[
            { label: "Blog Title", accessor: "title" },
          ]}
           endpoint="blogs"
    />
        </>
    )
    
}
import { AdminTable } from "@/components/organisms/ListingCard";
import { fetchAPI } from "@/utils/apiService";

interface Package {
  id: string;
  title: string;
  [key: string]: any;
}

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const { id } = params;

  let data: Package[] = [];
  let errorMessage = "";

  try {
    const response = await fetchAPI<{ data: Package[] | Package }>({
      endpoint: `tour/tour-packages/${id}`,
    });

    if (Array.isArray(response.data)) {
      data = response.data;
    } else if (response.data) {
      data = [response.data];
    } else {
      errorMessage = "No data found.";
    }
  } catch (error) {
    errorMessage = "Tour package not found.";
  }

  // Ensure imageUrls property exists for each package
  const normalizedData = data.map(pkg => ({
    ...pkg,
    imageUrls: pkg.imageUrls ?? "",
  }));

  return (
    <AdminTable
      title="Packages Management"
      buttonText="Add Packages"
      data={normalizedData}
      columns={[{ label: "Packages title", accessor: "title" }]}
      endpoint={`tour/tour-packages/${id}`}
    />
  );
}

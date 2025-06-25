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
            template={{
              title: "",
              description: "",
              overview: "",
              location: {
                coordinates: { lat: '', lng: '' },
                city: '',
                country: ''
              },
              duration: { days: '', nights: '' },
              basePrice: '',
              currency: '',
              gallery: [''],
              googleMapUrl: '',
              itinerary: [
                {
                  day: '',
                  title: '',
                  description: '',
                  activities: [''],
                  image: ''
                }
              ],
              inclusions: [''],
              exclusions: [''],
              highlights: [''],
              quickfacts: [''],
              feature: {
                groupSize: { min: '' },
                tripDuration: '',
                tripDifficulty: '',
                meals: [''],
                activities: [''],
                accommodation: [''],
                maxAltitude: '',
                bestSeason: [''],
                startEndPoint: ''
              },
              type: '',
              tags: [''],
              rating: '',
              destination: {
                _id: '',
                title: '',
                subtitle: '',
                imageUrls: [''],
                tag: '',
                isFeatured: false,
                slug: '',
                totalTrips: '',
                createdAt: '',
                updatedAt: '',
                __v: ''
              },
              createdAt: '',
              updatedAt: '',
              __v: ''
            }}
          />
        </>
    )
}
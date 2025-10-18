import SearchLayout from "@/components/app/search-page/layout";
import { therapists } from "@/data/therapists";

export default async function SearchPage({ searchParams }) {
  // Await searchParams as it's now a Promise in Next.js
  const params = await searchParams;
  
  // Extract search parameters
  const searchTerm = params.q || "";
  const rating = params.rating ? parseInt(params.rating) : null;
  const location = params.location || "";
  const categories = params.categories ? params.categories.split(',') : [];
  
  // Filter therapists on the server
  let filteredTherapists = [...therapists];
  
  // Filter by search term
  if (searchTerm) {
    filteredTherapists = filteredTherapists.filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Filter by rating
  if (rating) {
    filteredTherapists = filteredTherapists.filter(t => 
      Math.floor(t.rating) === rating
    );
  }
  
  // Filter by location
  if (location) {
    filteredTherapists = filteredTherapists.filter(t => 
      t.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  // Filter by categories
  if (categories.length > 0) {
    filteredTherapists = filteredTherapists.filter(t => 
      categories.includes(t.specialty)
    );
  }

  return <SearchLayout data={filteredTherapists} searchParams={params} />;
}

import { fetchAPI } from "@/utils/apiService";
import Breadcrumb from "@/components/atoms/breadcrumb";
import TeamList from "@/components/molecules/teamlist/page"; 

export default async function TeamPage() {
  const teamsdata = await fetchAPI({ endpoint: "teams" });
  const team = teamsdata.data || [];

  return (
    <>
   < Breadcrumb currentnavlink={`About/Our Teams`} />

      <TeamList team={team} />
    </>
  );
}
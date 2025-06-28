import { AdminTable } from "@/components/organisms/ListingCard";
import { fetchAPI, APIResponse } from "@/utils/apiService";
import React from "react";

export default async function CustomiseTeam() {
  const teamsData: APIResponse<any[]> = await fetchAPI({ endpoint: "teams" });

  return (
    <>
      <AdminTable
        title="Team Management"
        buttonText="Add Team Member"
        data={Array.isArray(teamsData.data) ? teamsData.data : []}
        columns={[
          { label: "Name", accessor: "name" },
          { label: "Position", accessor: "position" },
        
        ]}
        endpoint={"teams"}
      />
    </>
  );
} 
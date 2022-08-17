import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Card from "../mini/Card";
import Pagination from "@mui/material/Pagination";
import OfficersTable, { IOfficer } from "../tables/OfficersTable";

import config from "../../assets/config";
import TableSkeleton from "../skeletons/TableSkeleton";

interface IGetofficersOptions {
  id?: number;
  page: number;
  limit: number;
  offset: number;
}

const getofficers = async (options: IGetofficersOptions) => {
  const searchParams = new URLSearchParams(Object.entries(options));
  const response = await fetch(
    `${config.apiHost}/api/get/officers?${searchParams.toString()}`
  );
  if (response.ok) {
    const data = await response.json();
    if (data.success) return data as { officers: IOfficer[]; pages: number };
    else {
      return { officers: [], pages: 0 };
    }
  } else {
    return { officers: [], pages: 0 };
  }
};

function OfficersPage() {
  const [officers, setOfficers] = useState<IOfficer[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState<number>(
    Number(searchParams.get("page")) || 1
  );

  const [pages, setPages] = useState(0);
  const [skeleton, setSkeleton] = useState(true);

  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    setPage(page);
    const id = Number(searchParams.get("id")) || undefined;
    const officer_id = Number(searchParams.get("officer_id")) || undefined;
    const location_id = Number(searchParams.get("location_id")) || undefined;
    const limit = 20;
    const offset = (page - 1) * limit;

    // set fetch options
    const options: IGetofficersOptions = { page, limit, offset };

    id && (options.id = id);

    // get officers
    getofficers(options).then((data) => {
      setOfficers(data.officers);
      setPages(data.pages);
      setSkeleton(false);
    });
  }, [searchParams]);

  function deleteById(id: number) {
    setOfficers((pre) => {
      const newOfficers = pre.filter((officer) => officer.id != id);
      return newOfficers;
    });
  }
  return (
    <div id="container">
      <Card
        title="officers table"
        subTitle="this table shows a list of all officers on the russian army"
      >
        {skeleton ? (
          <>
            <TableSkeleton cols={6} rows={10} />
          </>
        ) : (
          <OfficersTable
            deleteItemById={deleteById}
            rows={officers}
          ></OfficersTable>
        )}
      </Card>
      <div className="pagination">
        <Pagination
          count={pages}
          page={page}
          onChange={(e, value: number) => {
            setPage(value);
            // set current page to search params
            searchParams.set("page", page + "");
            setSearchParams(searchParams);
          }}
        />
      </div>
    </div>
  );
}

export default OfficersPage;

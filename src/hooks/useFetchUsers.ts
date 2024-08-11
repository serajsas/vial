import { MRT_ColumnFiltersState, MRT_PaginationState, MRT_SortingState } from "mantine-react-table";
import { useState, useEffect } from "react";

export type Patient = {
    id: number;
    name: string;
    age: number;
    gender: string;
    diagnosisDate: string;
    status: 'active' | 'inactive';
};

type UserApiResponse = {
    data: Patient[];
    meta: {
        totalRowCount: number;
    };
};

type UseFetchUsersParams = {
    columnFilters: MRT_ColumnFiltersState;
    globalFilter: string;
    pagination: MRT_PaginationState;
    sorting: MRT_SortingState;
};

// Custom hook to fetch user data
export const useFetchUsers = ({
    columnFilters,
    globalFilter,
    pagination,
    sorting,
}: UseFetchUsersParams) => {
    // State for data and fetching status
    const [data, setData] = useState<Patient[]>([]);
    const [rowCount, setRowCount] = useState(0);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!data.length) {
                setIsLoading(true);
            }

            const url = new URL(
                '/api/data', process.env.NODE_ENV === 'production'
                ? process.env.NEXT_PUBLIC_BASE_URL 
                : 'http://localhost:5000'
            );
            url.searchParams.set('start', `${pagination.pageIndex * pagination.pageSize}`);
            url.searchParams.set('size', `${pagination.pageSize}`);
            url.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
            url.searchParams.set('globalFilter', globalFilter ?? '');
            url.searchParams.set('sorting', JSON.stringify(sorting ?? []));

            try {
                const response = await fetch(url.href);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const json = (await response.json()) as UserApiResponse;
                setData(json.data);
                setRowCount(json.meta.totalRowCount);
                setIsError(false);
            } catch (error) {
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [
        columnFilters,
        globalFilter,
        pagination.pageIndex,
        pagination.pageSize,
        sorting,
        data.length
    ]);

    return {
        data,
        rowCount,
        isError,
        isLoading
    };
};

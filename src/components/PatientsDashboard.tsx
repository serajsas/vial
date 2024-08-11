import { useMemo, useState } from 'react';
import {
    MantineReactTable,
    MRT_ColumnFiltersState,
    MRT_PaginationState,
    MRT_SortingState,
    useMantineReactTable,
    type MRT_ColumnDef,
} from 'mantine-react-table';
import { Text, Badge, Group, Container, Title, Paper, Grid, Stack, Divider, Alert, Tooltip } from '@mantine/core';
import { IconUser, IconCalendar, IconGenderMale, IconGenderFemale, IconUserMinus, IconUserPlus, IconUsers, IconInfoCircle } from '@tabler/icons-react';
import { ColorSchemeToggle } from './ColorSchemeToggle';
import { Patient, useFetchUsers } from '@/hooks/useFetchUsers';

const PatientsDashboard = () => {
    const columns = useMemo<MRT_ColumnDef<Patient>[]>(() => [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 80,
            Cell: ({ cell }) => (
                <div style={{ textAlign: 'center' }}>
                    {cell.getValue<string>()}
                </div>
            ),
        },
        {
            accessorKey: 'name',
            header: 'Name',
            filterVariant: 'text',
            Cell: ({ row }) => (
                <Group style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text>{row.original.name}</Text>
                </Group>
            ),
        },
        {
            accessorKey: 'age',
            header: 'Age',
            filterVariant: 'range',
            filterFn: 'between',
            Cell: ({ cell }) => (
                <div style={{ textAlign: 'center' }}>
                    {cell.getValue<string>()}
                </div>
            ),
        },
        {
            accessorKey: 'gender',
            header: 'Gender',
            filterVariant: 'select',
            mantineFilterSelectProps: {
                data: [
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                ],
            },
            Cell: ({ cell }) => (
                <Group style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text>{cell.getValue<string>()}</Text>
                </Group>
            ),
        },
        {
            accessorFn: (row) => new Date(row.diagnosisDate),
            id: 'diagnosisDate',
            header: 'Diagnosis Date',
            filterVariant: 'date-range',
            Cell: ({ cell }) => {
                const date = cell.getValue<Date>();
                const formattedDate = date.toDateString();
                const hint = `Diagnosis Date: ${formattedDate}`;
                
                return (
                    <Tooltip label={hint} position="top" withArrow>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Text>{formattedDate}</Text>
                        </div>
                    </Tooltip>
                );
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            filterVariant: 'select',
            mantineFilterSelectProps: {
                data: [
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                ],
            },
            Cell: ({ cell }) => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Badge color={cell.getValue() === 'active' ? 'green' : 'red'} variant="dot" size="lg" fullWidth={true}>
                        {cell.getValue<string>()}
                    </Badge>
                </div>
            ),
        },
    ], []);

    const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const { data, rowCount, isError, isLoading } = useFetchUsers({
        columnFilters,
        globalFilter,
        pagination,
        sorting,
    });



    const table = useMantineReactTable({
        columns,
        data,
        mantineTableProps: {
            striped: true,
            highlightOnHover: true,
            withBorder: true,
            withColumnBorders: true,
        },
        initialState: { showColumnFilters: true },
        manualFiltering: true,
        manualPagination: true,
        manualSorting: true,
        mantineToolbarAlertBannerProps: isError
            ? {
                color: 'red',
                children: (
                    <Alert variant="outline" color="red" title="Error" icon={<IconInfoCircle />} >
                        An error occurred while loading data. Please try again later.
                    </Alert>
                ),

            }
            : undefined,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        rowCount,
        state: {
            columnFilters,
            globalFilter,
            isLoading,
            pagination,
            showAlertBanner: isError,
            sorting,
        },
    });

    const activePatients = data.filter(p => p.status === 'active').length;
    const inactivePatients = data.length - activePatients;

    return (
        <Container size="xl" mt="xl">
            <Paper shadow="md" radius="lg" p="xl" withBorder mb="xl">
                <Grid>
                    <Grid.Col span={8}>
                        <Title order={2} mb="xs">Patient Dashboard</Title>
                        <Text color="dimmed" mb="md">
                            Manage and monitor patient information efficiently
                        </Text>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Group position="right" spacing="xl">
                            <Stack align="center" spacing={0}>
                                <IconUsers size={24} stroke={1.5} />
                                <Text size="xl" weight={700}>{data.length}</Text>
                                <Text size="sm" color="dimmed">Total Patients</Text>
                            </Stack>
                            <Stack align="center" spacing={0}>
                                <IconUserPlus size={24} stroke={1.5} color="green" />
                                <Text size="xl" weight={700}>{activePatients}</Text>
                                <Text size="sm" color="dimmed">Active</Text>
                            </Stack>
                            <Stack align="center" spacing={0}>
                                <IconUserMinus size={24} stroke={1.5} color="red" />
                                <Text size="xl" weight={700}>{inactivePatients}</Text>
                                <Text size="sm" color="dimmed">Inactive</Text>
                            </Stack>
                            <Divider orientation='vertical'></Divider>
                            <ColorSchemeToggle />
                        </Group>
                    </Grid.Col>
                </Grid>
            </Paper>
            <Paper shadow="sm" radius="md" p="md" withBorder>
                <MantineReactTable table={table} />
            </Paper>
        </Container>
    );
}

export default PatientsDashboard;
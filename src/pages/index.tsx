import { AppShell, Container } from '@mantine/core';
import PatientsDashboard from '@/components/PatientsDashboard';

export default function Home() {
  return (
    <AppShell
      padding="md"
    >
      <Container size="xl">
        <PatientsDashboard />
      </Container>
    </AppShell>
  );
}
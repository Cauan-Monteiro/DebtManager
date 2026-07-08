import { api } from './client';
import type { CompleteReportDTO } from './types';

// GET /api/person/people_totals returns the literal text "No people yet!" instead
// of a report body when there are no people registered.
export async function fetchPeopleTotals(): Promise<CompleteReportDTO | null> {
  const result = await api.get<CompleteReportDTO | string>('/person/people_totals');
  if (typeof result === 'string') {
    return null;
  }
  return result;
}

export function createPerson(name: string, age: number) {
  return api.post<{ name: string; age: number }>('/person', { name, age });
}

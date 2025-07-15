import { type StudyData, StudySource, StudyStatus } from '../../shared/types';
import * as fs from 'fs';

const CTG_PATH = './example-data/ctg-studies.csv';

function parseCSV(content: string): StudyData[] {
  const lines = content.split('\n');
  const headers = lines[0].split(',');
  const studies: StudyData[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const values = parseCSVLine(lines[i]);
    if (values.length < headers.length) continue;

    const study: StudyData = {
      id: values[0] || '',
      title: values[1] || '',
      url: values[2] || '',
      status: mapStudyStatus(values[4]),
      summary: values[5] || '',
      sponsor: values[12] || '',
      collaborators: parseCollaborators(values[13]),
      startISO: parseStartDate(values[22]),
      conditions: parseConditions(values[7]),
      source: StudySource.CLINICAL_TRIALS,
    };

    studies.push(study);
  }

  return studies;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function mapStudyStatus(status: string): StudyStatus {
  switch (status?.toUpperCase()) {
    case 'RECRUITING':
    case 'ACTIVE_NOT_RECRUITING':
    case 'NOT_YET_RECRUITING':
    case 'ENROLLING_BY_INVITATION':
      return StudyStatus.ACTIVE;
    case 'COMPLETED':
      return StudyStatus.COMPLETE;
    default:
      return StudyStatus.ACTIVE;
  }
}

function parseCollaborators(collaborators: string): string[] {
  if (!collaborators) return [];
  return collaborators
    .split('|')
    .map(c => c.trim())
    .filter(c => c.length > 0);
}

function parseStartDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toISOString();
  } catch {
    return '';
  }
}

function parseConditions(conditions: string): string[] {
  if (!conditions) return [];
  return conditions
    .split(',')
    .map(c => c.trim())
    .filter(c => c.length > 0);
}

export default async function parseStudyData(
  dataPath: string
): Promise<StudyData[]> {
  const result = await fetch(dataPath);
  const content = await result.text();
  const studies = parseCSV(content);
  return studies;
}

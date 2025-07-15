import { type StudyData, StudySource, StudyStatus } from '../../shared/types';
import * as fs from 'fs';

function parseCSV(content: string): StudyData[] {
  const rows = parseCSVContent(content);
  const headers = rows[0];
  const studies: StudyData[] = [];

  for (let i = 1; i < rows.length; i++) {
    const values = rows[i];
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
      enrollment: parseInt(values[17]) || 0,
      source: StudySource.CLINICAL_TRIALS,
    };

    studies.push(study);
  }

  return studies;
}

function parseCSVContent(content: string): string[][] {
  const rows: string[][] = [];
  const chars = content.split('');
  let current = '';
  let currentRow: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const nextChar = chars[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Handle escaped quotes
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(current);
      current = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // Skip \n in \r\n
      }
      currentRow.push(current);
      if (currentRow.some(field => field.trim())) {
        rows.push(currentRow);
      }
      currentRow = [];
      current = '';
    } else {
      current += char;
    }
  }

  // Handle last field and row
  if (current || currentRow.length > 0) {
    currentRow.push(current);
    if (currentRow.some(field => field.trim())) {
      rows.push(currentRow);
    }
  }

  return rows;
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

function parseEUTrials(content: string): StudyData[] {
  const studies: StudyData[] = [];
  const trials = content.split(/(?=EudraCT Number:)/);

  for (const trial of trials) {
    if (!trial.trim() || trial.startsWith('This file contains')) continue;

    const lines = trial.split('\n');
    let id = '';
    let title = '';
    let url = '';
    let status: StudyStatus = StudyStatus.ACTIVE;
    let summary = '';
    let sponsor = '';
    let startDate = '';
    let conditions: string[] = [];
    let enrollment = 0;

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('EudraCT Number:')) {
        id = trimmedLine.replace('EudraCT Number:', '').trim();
      } else if (trimmedLine.startsWith('A.3 Full title of the trial:')) {
        title = trimmedLine.replace('A.3 Full title of the trial:', '').trim();
      } else if (trimmedLine.startsWith('Link:')) {
        url = trimmedLine.replace('Link:', '').trim();
      } else if (trimmedLine.startsWith('Trial Status:')) {
        const statusStr = trimmedLine.replace('Trial Status:', '').trim();
        status = mapEUTrialStatus(statusStr);
      } else if (trimmedLine.startsWith('E.2.1 Main objective of the trial:')) {
        summary = trimmedLine
          .replace('E.2.1 Main objective of the trial:', '')
          .trim();
      } else if (trimmedLine.startsWith('B.1.1 Name of Sponsor:')) {
        sponsor = trimmedLine.replace('B.1.1 Name of Sponsor:', '').trim();
      } else if (
        trimmedLine.startsWith('Date on which this record was first entered')
      ) {
        const dateMatch = trimmedLine.match(/(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) startDate = dateMatch[1];
      } else if (
        trimmedLine.startsWith('E.1.1 Medical condition(s) being investigated:')
      ) {
        const condition = trimmedLine
          .replace('E.1.1 Medical condition(s) being investigated:', '')
          .trim();
        if (condition) conditions.push(condition);
      } else if (trimmedLine.startsWith('F.4.1 In the member state:')) {
        const enrollmentStr = trimmedLine
          .replace('F.4.1 In the member state:', '')
          .trim();
        enrollment = parseInt(enrollmentStr) || 0;
      }
    }

    if (id && title) {
      const study: StudyData = {
        id,
        title,
        url,
        status,
        summary,
        sponsor,
        collaborators: [],
        startISO: parseStartDate(startDate),
        conditions,
        enrollment,
        source: StudySource.EUDRACT,
      };
      studies.push(study);
    }
  }

  return studies;
}

function mapEUTrialStatus(
  status: string
): (typeof StudyStatus)[keyof typeof StudyStatus] {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'prematurely ended':
      return StudyStatus.COMPLETE;
    default:
      return StudyStatus.ACTIVE;
  }
}

export default async function parseStudyData(): Promise<StudyData[]> {
  const [clinicalTrialsResult, euTrialsResult] = await Promise.all([
    fetch('/ctg-studies.csv'),
    fetch('/eu-trials-full.txt'),
  ]);

  const clinicalTrialsContent = await clinicalTrialsResult.text();
  const euTrialsContent = await euTrialsResult.text();

  const clinicalTrialsStudies = parseCSV(clinicalTrialsContent);
  const euTrialsStudies = parseEUTrials(euTrialsContent);

  return [...clinicalTrialsStudies, ...euTrialsStudies];
}

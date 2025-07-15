export const StudyStatus = {
  ACTIVE: 'ACTIVE',
  COMPLETE: 'COMPLETE',
} as const;

export const StudySource = {
  CLINICAL_TRIALS: 'CLINICAL_TRIALS',
  EUDRACT: 'EUDRACT',
} as const;

export type Region = 'us' | 'eu' | 'all';

// In a production app, this would be represented as DB schema
export type StudyData = {
  /* Unique identifer for the trial (e.g., NCT Number) */
  id: string;

  /* The source of the study (i.e., ClinicalTrials.gov or clinicaltrialsregister.eu)  */
  source: (typeof StudySource)[keyof typeof StudySource];

  /* The study title */
  title: string;

  /* URL to view more information about the study */
  url: string;

  /* The status of the study */
  status: (typeof StudyStatus)[keyof typeof StudyStatus];

  /* A summary of the study, usually includes purpose, populations studied, and conditions. */
  summary: string;

  /* The study sponsor */
  sponsor: string;

  collaborators: string[];

  startISO: string;

  /* Medical conditions associated with the study. */
  conditions: string[];

  /* The number of study participants. */
  enrollment: number;
};

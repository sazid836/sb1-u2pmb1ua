import { Diagnosis, Drug, LabTest } from '../types';

export const diagnoses: Diagnosis[] = [
  {
    id: 'hypertension',
    code: 'I10',
    name: 'Essential Hypertension',
    description: 'High blood pressure without known cause',
    symptoms: ['headache', 'dizziness', 'chest-pain', 'fatigue']
  },
  {
    id: 'diabetes-t2',
    code: 'E11',
    name: 'Type 2 Diabetes Mellitus',
    description: 'Non-insulin dependent diabetes',
    symptoms: ['excessive-thirst', 'frequent-urination', 'fatigue', 'blurred-vision']
  },
  {
    id: 'upper-respiratory',
    code: 'J06.9',
    name: 'Upper Respiratory Tract Infection',
    description: 'Common cold or flu-like symptoms',
    symptoms: ['cough', 'sore-throat', 'runny-nose', 'fever', 'headache']
  },
  {
    id: 'gastritis',
    code: 'K29.7',
    name: 'Gastritis',
    description: 'Inflammation of stomach lining',
    symptoms: ['stomach-pain', 'nausea', 'vomiting', 'loss-of-appetite']
  },
  {
    id: 'migraine',
    code: 'G43.9',
    name: 'Migraine',
    description: 'Severe recurring headaches',
    symptoms: ['severe-headache', 'nausea', 'light-sensitivity', 'sound-sensitivity']
  },
  {
    id: 'anxiety',
    code: 'F41.9',
    name: 'Anxiety Disorder',
    description: 'Excessive worry and fear',
    symptoms: ['restlessness', 'fatigue', 'difficulty-concentrating', 'irritability']
  }
];

export const commonDrugs: Drug[] = [
  {
    id: 'amlodipine',
    name: 'Amlodipine',
    genericName: 'Amlodipine Besylate',
    dosage: '5mg',
    frequency: 'Once daily',
    duration: '30 days',
    instructions: 'Take with or without food',
    category: 'Antihypertensive'
  },
  {
    id: 'metformin',
    name: 'Metformin',
    genericName: 'Metformin HCl',
    dosage: '500mg',
    frequency: 'Twice daily',
    duration: '30 days',
    instructions: 'Take with meals',
    category: 'Antidiabetic'
  },
  {
    id: 'paracetamol',
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    dosage: '500mg',
    frequency: 'Every 6 hours as needed',
    duration: '5 days',
    instructions: 'Do not exceed 4g per day',
    category: 'Analgesic'
  },
  {
    id: 'amoxicillin',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    dosage: '500mg',
    frequency: 'Three times daily',
    duration: '7 days',
    instructions: 'Take with food, complete full course',
    category: 'Antibiotic'
  },
  {
    id: 'omeprazole',
    name: 'Omeprazole',
    genericName: 'Omeprazole',
    dosage: '20mg',
    frequency: 'Once daily',
    duration: '14 days',
    instructions: 'Take before breakfast',
    category: 'Proton Pump Inhibitor'
  }
];

export const labTests: LabTest[] = [
  {
    id: 'cbc',
    name: 'Complete Blood Count',
    description: 'Comprehensive blood analysis',
    normalRange: 'Various parameters',
    category: 'Hematology'
  },
  {
    id: 'fbs',
    name: 'Fasting Blood Sugar',
    description: 'Blood glucose after fasting',
    normalRange: '70-100 mg/dL',
    category: 'Biochemistry'
  },
  {
    id: 'hba1c',
    name: 'HbA1c',
    description: 'Average blood sugar over 3 months',
    normalRange: '<5.7%',
    category: 'Biochemistry'
  },
  {
    id: 'lipid-profile',
    name: 'Lipid Profile',
    description: 'Cholesterol and triglycerides',
    normalRange: 'Various parameters',
    category: 'Biochemistry'
  },
  {
    id: 'urine-routine',
    name: 'Urine Routine',
    description: 'Basic urine analysis',
    normalRange: 'Various parameters',
    category: 'Pathology'
  },
  {
    id: 'chest-xray',
    name: 'Chest X-Ray',
    description: 'Chest radiograph',
    normalRange: 'Normal lung fields',
    category: 'Radiology'
  }
];

export const symptoms = [
  { id: 'fever', name: 'Fever', description: 'Elevated body temperature' },
  { id: 'headache', name: 'Headache', description: 'Pain in head or neck' },
  { id: 'cough', name: 'Cough', description: 'Persistent coughing' },
  { id: 'sore-throat', name: 'Sore Throat', description: 'Throat pain or irritation' },
  { id: 'runny-nose', name: 'Runny Nose', description: 'Nasal discharge' },
  { id: 'fatigue', name: 'Fatigue', description: 'Extreme tiredness' },
  { id: 'dizziness', name: 'Dizziness', description: 'Feeling lightheaded' },
  { id: 'chest-pain', name: 'Chest Pain', description: 'Pain in chest area' },
  { id: 'stomach-pain', name: 'Stomach Pain', description: 'Abdominal discomfort' },
  { id: 'nausea', name: 'Nausea', description: 'Feeling sick to stomach' },
  { id: 'vomiting', name: 'Vomiting', description: 'Throwing up' },
  { id: 'excessive-thirst', name: 'Excessive Thirst', description: 'Increased thirst' },
  { id: 'frequent-urination', name: 'Frequent Urination', description: 'Urinating more often' },
  { id: 'blurred-vision', name: 'Blurred Vision', description: 'Vision problems' },
  { id: 'loss-of-appetite', name: 'Loss of Appetite', description: 'Not feeling hungry' }
];

export const motivationalQuotes = [
  "The good physician treats the disease; the great physician treats the patient who has the disease. - William Osler",
  "Medicine is not only a science; it is also an art. It does not consist of compounding pills and plasters. - Paracelsus",
  "The best doctor gives the least medicines. - Benjamin Franklin",
  "Wherever the art of medicine is loved, there is also a love of humanity. - Hippocrates",
  "To cure sometimes, to relieve often, to comfort always. - Hippocrates",
  "The physician's highest calling is to distinguish health from disease. - Hippocrates"
];
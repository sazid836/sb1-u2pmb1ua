import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  X, 
  Stethoscope, 
  CheckCircle,
  AlertCircle,
  User
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { symptoms, diagnoses } from '../../data/medical-data';
import { Diagnosis } from '../../types';

export const DiagnosisScreen: React.FC = () => {
  const { patients, updateCurrentPrescription, setCurrentView, currentPrescription } = useStore();
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomSearch, setSymptomSearch] = useState('');
  const [possibleDiagnoses, setPossibleDiagnoses] = useState<Diagnosis[]>([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(null);
  const [showAllSymptoms, setShowAllSymptoms] = useState(false);

  // Initialize with current prescription data if available
  React.useEffect(() => {
    if (currentPrescription.patientId && !selectedPatient) {
      setSelectedPatient(currentPrescription.patientId);
    }
    if (currentPrescription.diagnosis) {
      setSelectedDiagnosis(currentPrescription.diagnosis);
    }
  }, []);

  const filteredSymptoms = symptoms.filter(symptom =>
    symptom.name.toLowerCase().includes(symptomSearch.toLowerCase()) &&
    !selectedSymptoms.includes(symptom.id)
  );

  const handleAddSymptom = (symptomId: string) => {
    const newSymptoms = [...selectedSymptoms, symptomId];
    setSelectedSymptoms(newSymptoms);
    setSymptomSearch('');
    
    // Find possible diagnoses based on symptoms
    const matches = diagnoses.filter(diagnosis =>
      diagnosis.symptoms.some(symptom => newSymptoms.includes(symptom))
    ).sort((a, b) => {
      const aMatches = a.symptoms.filter(s => newSymptoms.includes(s)).length;
      const bMatches = b.symptoms.filter(s => newSymptoms.includes(s)).length;
      return bMatches - aMatches;
    });
    
    setPossibleDiagnoses(matches);
  };

  const handleRemoveSymptom = (symptomId: string) => {
    const newSymptoms = selectedSymptoms.filter(id => id !== symptomId);
    setSelectedSymptoms(newSymptoms);
    
    if (newSymptoms.length === 0) {
      setPossibleDiagnoses([]);
      setSelectedDiagnosis(null);
    } else {
      const matches = diagnoses.filter(diagnosis =>
        diagnosis.symptoms.some(symptom => newSymptoms.includes(symptom))
      );
      setPossibleDiagnoses(matches);
    }
  };

  const handleSelectDiagnosis = (diagnosis: Diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    const patient = patients.find(p => p.id === selectedPatient);
    if (patient) {
      updateCurrentPrescription({
        patientId: patient.id,
        patientName: patient.name,
        diagnosis: diagnosis
      });
    }
  };

  const handleProceedToPrescription = () => {
    if (selectedDiagnosis && selectedPatient) {
      const patient = patients.find(p => p.id === selectedPatient);
      if (patient) {
        updateCurrentPrescription({
          patientId: patient.id,
          patientName: patient.name,
          diagnosis: selectedDiagnosis
        });
      }
      setCurrentView('prescription');
    }
  };

  const getSymptomName = (symptomId: string) => {
    return symptoms.find(s => s.id === symptomId)?.name || symptomId;
  };

  const getMatchingSymptoms = (diagnosis: Diagnosis) => {
    return diagnosis.symptoms.filter(symptom => selectedSymptoms.includes(symptom));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Diagnosis Assistant</h1>
        <p className="text-gray-600 mt-1">Enter symptoms to get differential diagnoses</p>
      </div>

      {/* Patient Selection */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Patient</h2>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="">Choose a patient...</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.name} - {patient.age} years, {patient.gender}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Symptom Input */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Symptoms</h2>
        
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={symptomSearch}
            onChange={(e) => setSymptomSearch(e.target.value)}
            placeholder="Search symptoms..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Symptom Suggestions */}
        {symptomSearch && filteredSymptoms.length > 0 && (
          <div className="mb-4 max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
            {filteredSymptoms.slice(0, 5).map(symptom => (
              <button
                key={symptom.id}
                onClick={() => handleAddSymptom(symptom.id)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4 text-green-500" />
                <div>
                  <div className="font-medium">{symptom.name}</div>
                  <div className="text-sm text-gray-600">{symptom.description}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Common Symptoms Quick Add */}
        {!symptomSearch && selectedSymptoms.length === 0 && (
          <div className="mb-4">
            <h3 className="font-medium text-gray-800 mb-3">Common Symptoms (Click to add):</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {symptoms.slice(0, showAllSymptoms ? symptoms.length : 12).map(symptom => (
                <motion.button
                  key={symptom.id}
                  onClick={() => handleAddSymptom(symptom.id)}
                  className="p-3 text-left bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-gray-200 rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-medium text-sm">{symptom.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{symptom.description}</div>
                </motion.button>
              ))}
            </div>
            {symptoms.length > 12 && (
              <motion.button
                onClick={() => setShowAllSymptoms(!showAllSymptoms)}
                className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                whileHover={{ scale: 1.02 }}
              >
                {showAllSymptoms ? 'Show Less' : `Show All ${symptoms.length} Symptoms`}
              </motion.button>
            )}
          </div>
        )}

        {/* Selected Symptoms */}
        {selectedSymptoms.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Selected Symptoms:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map(symptomId => (
                <motion.span
                  key={symptomId}
                  className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <span>{getSymptomName(symptomId)}</span>
                  <button
                    onClick={() => handleRemoveSymptom(symptomId)}
                    className="hover:bg-blue-200 rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Possible Diagnoses */}
      {possibleDiagnoses.length > 0 && (
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Possible Diagnoses</h2>
            <span className="text-sm text-gray-500">{possibleDiagnoses.length} matches found</span>
          </div>
          <div className="space-y-3">
            {possibleDiagnoses.map(diagnosis => {
              const matchingSymptoms = getMatchingSymptoms(diagnosis);
              const matchPercentage = Math.round((matchingSymptoms.length / diagnosis.symptoms.length) * 100);
              
              return (
                <motion.div
                  key={diagnosis.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedDiagnosis?.id === diagnosis.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectDiagnosis(diagnosis)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-800">{diagnosis.name}</h3>
                        <span className="text-sm text-gray-500">({diagnosis.code})</span>
                        {selectedDiagnosis?.id === diagnosis.id && (
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{diagnosis.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-gray-600">
                            {matchingSymptoms.length}/{diagnosis.symptoms.length} symptoms match
                          </span>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          matchPercentage >= 70 ? 'text-green-600' :
                          matchPercentage >= 50 ? 'text-orange-600' : 'text-red-600'
                        } ${
                          matchPercentage >= 70 ? 'bg-green-100' :
                          matchPercentage >= 50 ? 'bg-orange-100' : 'bg-red-100'
                        }`}>
                          {matchPercentage}% match
                        </div>
                      </div>
                      {/* Show matching symptoms */}
                      {matchingSymptoms.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">Matching symptoms: </span>
                          <span className="text-xs text-blue-600">
                            {matchingSymptoms.map(symptomId => getSymptomName(symptomId)).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {selectedDiagnosis && (
            <motion.div
              className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4 className="font-medium text-blue-800 mb-2">Selected Diagnosis:</h4>
              <p className="text-blue-700">{selectedDiagnosis.name} ({selectedDiagnosis.code})</p>
              <p className="text-sm text-blue-600 mt-1">{selectedDiagnosis.description}</p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* No symptoms selected state */}
      {selectedSymptoms.length === 0 && !symptomSearch && (
        <motion.div
          className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Start Your Diagnosis</h3>
          <p className="text-gray-600 mb-4">
            Select symptoms from the list above or search for specific symptoms to get differential diagnoses.
          </p>
        </motion.div>
      )}

      {/* Action Button */}
      {selectedDiagnosis && selectedPatient && (
        <motion.div
          className="flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.button
            onClick={handleProceedToPrescription}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Stethoscope className="w-5 h-5" />
            <span>Proceed to Prescription</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};
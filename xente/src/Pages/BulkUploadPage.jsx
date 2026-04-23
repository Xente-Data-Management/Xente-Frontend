import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Users, Download, RefreshCw } from 'lucide-react';
import ApiService from '../services/api';
import { Button, LoadingSpinner } from '../components/components';
import { toast } from 'react-hot-toast';

const CSV_TEMPLATE = `name,email,phone
John Doe,john@example.com,0700000000
Jane Doe,jane@example.com,0711111111`;

export const BulkUploadPage = ({ currentUser }) => {
  const [ambassadors, setAmbassadors] = useState([]);
  const [selectedAmbassador, setSelectedAmbassador] = useState('');
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const loadAmbassadors = useCallback(async () => {
    try {
      const res = await ApiService.getAllAmbassadors();
      setAmbassadors(res.ambassadors || []);
    } catch (err) {
      toast.error('Failed to load ambassadors');
    }
  }, []);

  useEffect(() => { loadAmbassadors(); }, [loadAmbassadors]);

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer?.files?.[0] || e.target.files?.[0];
    if (dropped && dropped.name.endsWith('.csv')) {
      setFile(dropped);
      setResult(null);
    } else {
      toast.error('Please upload a valid .csv file');
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.error('Please select a CSV file first');
    if (!selectedAmbassador) return toast.error('Please select an ambassador');

    const ambassador = ambassadors.find(a => a.id === selectedAmbassador);

    try {
      setUploading(true);
      setResult(null);
      const res = await ApiService.uploadStaffCsv(file, ambassador.id, ambassador.name);
      setResult(res);
      if (res.summary.created > 0) {
        toast.success(`Successfully onboarded ${res.summary.created} staff members!`);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'staff_upload_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setSelectedAmbassador('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Bulk Staff Upload</h2>
          <p className="text-gray-400 text-sm mt-1">Upload a CSV file to onboard multiple staff members at once.</p>
        </div>
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 px-4 py-2 rounded-xl transition-colors border border-orange-500/20"
        >
          <Download className="w-4 h-4" />
          Download CSV Template
        </button>
      </div>

      {/* Step 1: Select Ambassador */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">1</div>
          <h3 className="font-bold text-white">Select Ambassador</h3>
        </div>
        <p className="text-gray-400 text-sm">All uploaded staff will be linked to this ambassador.</p>
        <select
          value={selectedAmbassador}
          onChange={e => setSelectedAmbassador(e.target.value)}
          className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none transition-colors"
        >
          <option value="">— Choose an Ambassador —</option>
          {ambassadors.map(a => (
            <option key={a.id} value={a.id}>{a.name} {a.ambassador_code ? `(${a.ambassador_code})` : ''}</option>
          ))}
        </select>
      </div>

      {/* Step 2: Upload CSV */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">2</div>
          <h3 className="font-bold text-white">Upload CSV File</h3>
        </div>

        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
            dragging
              ? 'border-orange-500 bg-orange-500/10'
              : file
              ? 'border-green-500/50 bg-green-500/5'
              : 'border-gray-700 hover:border-orange-500/50 hover:bg-gray-800/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileDrop}
          />
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="w-12 h-12 text-green-500" />
              <p className="font-bold text-white">{file.name}</p>
              <p className="text-gray-400 text-sm">{(file.size / 1024).toFixed(1)} KB — Ready to upload</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload className="w-12 h-12 text-gray-600" />
              <div>
                <p className="font-bold text-white">Drop your CSV here</p>
                <p className="text-gray-500 text-sm mt-1">or click to browse files</p>
              </div>
              <div className="mt-2 text-xs text-gray-600 bg-gray-800 px-4 py-2 rounded-full">
                Required columns: <span className="text-orange-400 font-mono">name</span>, <span className="text-orange-400 font-mono">phone</span> — Optional: <span className="text-orange-400 font-mono">email</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step 3: Upload */}
      <div className="flex gap-3">
        {file && (
          <button
            onClick={reset}
            className="px-5 py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors text-sm"
          >
            Clear
          </button>
        )}
        <Button
          onClick={handleUpload}
          loading={uploading}
          icon={uploading ? RefreshCw : Upload}
          className="flex-1"
          disabled={!file || !selectedAmbassador}
        >
          {uploading ? 'Processing...' : 'Upload & Onboard Staff'}
        </Button>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4 animate-in fade-in duration-300">
          <h3 className="font-bold text-white flex items-center gap-2"><FileText className="w-5 h-5 text-orange-500" /> Upload Summary</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 p-4 rounded-xl text-center border border-gray-700">
              <p className="text-2xl font-bold text-white">{result.summary.total}</p>
              <p className="text-xs text-gray-400 mt-1">Total Rows</p>
            </div>
            <div className="bg-green-500/10 p-4 rounded-xl text-center border border-green-500/20">
              <p className="text-2xl font-bold text-green-400">{result.summary.created}</p>
              <p className="text-xs text-gray-400 mt-1">Onboarded</p>
            </div>
            <div className="bg-yellow-500/10 p-4 rounded-xl text-center border border-yellow-500/20">
              <p className="text-2xl font-bold text-yellow-400">{result.summary.duplicates}</p>
              <p className="text-xs text-gray-400 mt-1">Duplicates Skipped</p>
            </div>
            <div className="bg-red-500/10 p-4 rounded-xl text-center border border-red-500/20">
              <p className="text-2xl font-bold text-red-400">{result.summary.errors}</p>
              <p className="text-xs text-gray-400 mt-1">Errors</p>
            </div>
          </div>

          {result.errors?.length > 0 && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 space-y-2">
              <p className="text-sm font-bold text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Skipped Rows
              </p>
              <ul className="space-y-1 max-h-40 overflow-y-auto">
                {result.errors.map((err, i) => (
                  <li key={i} className="text-xs text-gray-400 font-mono flex items-start gap-2">
                    <XCircle className="w-3 h-3 text-red-500 mt-0.5 shrink-0" />
                    {err}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={reset} className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
            Upload another file →
          </button>
        </div>
      )}
    </div>
  );
};

export default BulkUploadPage;

import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Download, RefreshCw } from 'lucide-react';
import ApiService from '../services/api';
import { Button } from './components';
import { toast } from 'react-hot-toast';

const CSV_TEMPLATE = `name,email,phone
John Doe,john@example.com,0700000000
Jane Doe,jane@example.com,0711111111`;

export const AmbassadorBulkUpload = ({ currentUser }) => {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

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

    try {
      setUploading(true);
      setResult(null);
      // Auto-assign to the logged in ambassador
      const res = await ApiService.uploadStaffCsv(file, currentUser.id, currentUser.name);
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bulk Staff Upload</h2>
          <p className="text-gray-500 text-sm mt-1">Upload a CSV file to onboard multiple staff members directly to your account.</p>
        </div>
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-xl transition-colors border border-orange-200"
        >
          <Download className="w-4 h-4" />
          Download CSV Template
        </button>
      </div>

      {/* Upload CSV */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-gray-900">Upload CSV File</h3>

        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
            dragging
              ? 'border-orange-500 bg-orange-50'
              : file
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-orange-300 hover:bg-gray-50'
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
              <p className="font-bold text-gray-900">{file.name}</p>
              <p className="text-gray-500 text-sm">{(file.size / 1024).toFixed(1)} KB — Ready to upload</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload className="w-12 h-12 text-gray-400" />
              <div>
                <p className="font-bold text-gray-900">Drop your CSV here</p>
                <p className="text-gray-500 text-sm mt-1">or click to browse files</p>
              </div>
              <div className="mt-2 text-xs text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                Required columns: <span className="text-orange-500 font-mono">name</span>, <span className="text-orange-500 font-mono">phone</span> — Optional: <span className="text-orange-500 font-mono">email</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Actions */}
      <div className="flex gap-3">
        {file && (
          <button
            onClick={reset}
            className="px-5 py-3 rounded-xl border border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors text-sm font-semibold"
          >
            Clear
          </button>
        )}
        <Button
          onClick={handleUpload}
          loading={uploading}
          icon={uploading ? RefreshCw : Upload}
          className="flex-1"
          disabled={!file}
        >
          {uploading ? 'Processing...' : 'Upload & Onboard Staff'}
        </Button>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-4 animate-in fade-in duration-300">
          <h3 className="font-bold text-gray-900 flex items-center gap-2"><FileText className="w-5 h-5 text-orange-500" /> Upload Summary</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-200">
              <p className="text-2xl font-bold text-gray-900">{result.summary.total}</p>
              <p className="text-xs text-gray-500 mt-1">Total Rows</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl text-center border border-green-200">
              <p className="text-2xl font-bold text-green-600">{result.summary.created}</p>
              <p className="text-xs text-green-700 mt-1">Onboarded</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl text-center border border-yellow-200">
              <p className="text-2xl font-bold text-yellow-600">{result.summary.duplicates}</p>
              <p className="text-xs text-yellow-700 mt-1">Duplicates Skipped</p>
            </div>
            <div className="bg-red-50 p-4 rounded-xl text-center border border-red-200">
              <p className="text-2xl font-bold text-red-600">{result.summary.errors}</p>
              <p className="text-xs text-red-700 mt-1">Errors</p>
            </div>
          </div>

          {result.errors?.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
              <p className="text-sm font-bold text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Skipped Rows
              </p>
              <ul className="space-y-1 max-h-40 overflow-y-auto">
                {result.errors.map((err, i) => (
                  <li key={i} className="text-xs text-red-500 font-mono flex items-start gap-2">
                    <XCircle className="w-3 h-3 text-red-500 mt-0.5 shrink-0" />
                    {err}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={reset} className="text-sm text-orange-600 hover:text-orange-700 font-semibold transition-colors">
            Upload another file →
          </button>
        </div>
      )}
    </div>
  );
};

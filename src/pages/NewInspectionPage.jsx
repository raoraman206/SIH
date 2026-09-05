import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, X, Zap, Image as ImageIcon, FileText, Calendar, Clock, MapPin, User, Package, AlertCircle } from 'lucide-react';
import { useInspection } from '../context/InspectionContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { generateId } from '../utils';

export default function NewInspectionPage() {
  const navigate = useNavigate();
  const { createInspection, setCurrentInspection, setUploadedImages } = useInspection();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [productName, setProductName] = useState('');
  const [location, setLocation] = useState(user?.location || 'Delhi NCR Region');
  const officerName = user?.name || "Authorized Officer"; 
  
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  
  const [date, setDate] = useState(today);
  const [time, setTime] = useState(now);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');

  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const combined = [...files, ...newFiles].slice(0, 5); // Max 5
      
      const fileObjects = combined.map(f => {
        if (f instanceof File) {
          return {
            id: generateId ? generateId() : Math.random().toString(36).substr(2, 9),
            file: f,
            preview: URL.createObjectURL(f),
            label: 'Front',
            size: (f.size / 1024 / 1024).toFixed(2) + ' MB',
            name: f.name
          };
        }
        return f;
      });
      setFiles(fileObjects);
      setError('');
    }
  };

  const handleRemoveFile = (id) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const handleLabelChange = (id, newLabel) => {
    setFiles(files.map(f => f.id === id ? { ...f, label: newLabel } : f));
  };

  const handleStartInspection = () => {
    if (files.length === 0) {
      setError('Please upload at least one image to proceed.');
      return;
    }

    if (setUploadedImages) {
      setUploadedImages(files);
    }

    if (createInspection) {
      createInspection(
        {
          productName: productName.trim() || undefined,
          location,
          officer: officerName,
          date,
          time,
          referenceNumber,
          notes
        },
        files
      );
    }

    navigate('/inspection/processing');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">New Inspection</h1>

      <div className="space-y-8">
        {/* Section 1: Inspection Details */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            1. Inspection Details
          </h2>
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Package className="w-4 h-4 mr-1 text-blue-600" />
                  Product Name / Commodity Description (Optional)
                </label>
                <Input 
                  type="text"
                  placeholder="e.g. Fortune Sunlite Refined Sunflower Oil 1L (or leave blank to auto-detect)"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Optional: AI will auto-detect commodity title from package text if left blank.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                  Location
                </label>
                <select 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                >
                  {['Delhi NCR Region', 'Mumbai West', 'Chennai Central', 'Bangalore Urban', 'Kolkata North', 'Hyderabad', 'Pune Zone', 'Ahmedabad'].map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <User className="w-4 h-4 mr-1 text-gray-500" />
                  Officer Name
                </label>
                <Input 
                  type="text" 
                  value={officerName} 
                  readOnly 
                  className="bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                  Date
                </label>
                <Input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-gray-500" />
                  Time
                </label>
                <Input 
                  type="time" 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)} 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference Number (Optional)
                </label>
                <Input 
                  type="text" 
                  value={referenceNumber} 
                  onChange={(e) => setReferenceNumber(e.target.value)} 
                  placeholder="e.g. REF-2023-001"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="Any additional context about this inspection..."
                />
              </div>
            </div>
          </Card>
        </section>

        {/* Section 2: Upload Product Images */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <ImageIcon className="w-5 h-5 mr-2 text-blue-600" />
            2. Upload Product Images
          </h2>
          <Card className="p-6">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-700 font-medium">Drag and drop package images here, or click to browse</p>
              <p className="text-sm text-gray-500 mt-2">Supports JPG, PNG, WEBP (Max 5 images)</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                multiple 
                accept="image/*"
              />
            </div>

            {files.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-medium text-gray-800">Uploaded Images</h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {files.length} of 5 images uploaded
                  </span>
                </div>
                
                <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-md mb-4 flex items-start">
                  <span className="mr-2 mt-0.5">â„¹ï¸</span>
                  For best OCR accuracy, upload clear images of all relevant package panels including front, back, and sides.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {files.map((file) => (
                    <div key={file.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm relative group">
                      <button 
                        onClick={() => handleRemoveFile(file.id)}
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 text-gray-700 shadow-sm z-10"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      
                      <div className="aspect-square bg-gray-100 relative">
                        <img 
                          src={file.preview} 
                          alt={file.name} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      
                      <div className="p-3">
                        <select 
                          value={file.label}
                          onChange={(e) => handleLabelChange(file.id, e.target.value)}
                          className="w-full text-sm border-gray-300 rounded shadow-sm focus:border-blue-500 focus:ring-blue-500 p-1 border mb-2"
                        >
                          <option value="Front">Front</option>
                          <option value="Back">Back</option>
                          <option value="Side">Side</option>
                          <option value="Other">Other</option>
                        </select>
                        
                        <div className="text-xs text-gray-500 truncate" title={file.name}>
                          {file.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {file.size}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
          </Card>
        </section>

        {/* Section 3: Start Inspection */}
        <section className="flex justify-end pt-4">
          <Button 
            onClick={handleStartInspection}
            disabled={files.length === 0}
            className="w-full md:w-auto text-lg py-4 px-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Zap className="w-6 h-6 mr-2" />
            Start AI Inspection
          </Button>
        </section>
      </div>
    </div>
  );
}


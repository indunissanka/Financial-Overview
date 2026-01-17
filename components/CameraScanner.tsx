import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Check, AlertCircle, Loader } from 'lucide-react';
import { Expense, Category, PaymentMethod, AIProvider, AIProviderConfig } from '../types';
import { extractBillDataFromImage, ScannedBillData } from '../services/billScannerService';

interface CameraScannerProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  aiProvider: AIProvider;
  aiConfig: AIProviderConfig;
  customCategories: Array<{ id: string; name: string }>;
  isOpen: boolean;
  onClose: () => void;
}

type ScannerStep = 'camera' | 'preview' | 'edit';

const CameraScanner: React.FC<CameraScannerProps> = ({
  onAddExpense,
  aiProvider,
  aiConfig,
  customCategories,
  isOpen,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<ScannerStep>('camera');
  const [scannedData, setScannedData] = useState<ScannedBillData | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useManualMode, setUseManualMode] = useState(false);
  const [category, setCategory] = useState<string>(Category.Shopping);
  const [amount, setAmount] = useState<string>('');
  const [merchant, setMerchant] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CreditCard);

  useEffect(() => {
    if (!isOpen || step !== 'camera') return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError('Camera access denied. Please allow camera permissions.');
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isOpen, step]);

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    // Check if AI provider is configured
    if (!aiConfig?.apiKey) {
      setError('⚠️ AI provider not configured. Please go to Settings → AI Settings and add an API key for Gemini or Claude.');
      return;
    }

    // Check if provider supports image analysis
    if (aiProvider !== 'gemini' && aiProvider !== 'claude') {
      setError(`❌ ${aiProvider} does not support image scanning. Please use Gemini or Claude in Settings → AI Settings.`);
      return;
    }

    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);

    const imageData = canvasRef.current.toDataURL('image/jpeg', 0.95);
    setCapturedImage(imageData);
    setIsScanning(true);
    setError(null);

    try {
      const result = await extractBillDataFromImage(imageData, aiProvider, aiConfig);
      setScannedData(result);
      setAmount(result.amount.toString());
      setMerchant(result.merchant);
      setCategory(result.category);
      setDate(result.date);
      setNote(`Items: ${result.items.join(', ') || 'N/A'}`);
      setStep('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scan bill');
      setStep('preview');
    } finally {
      setIsScanning(false);
    }
  };

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if AI provider is configured
    if (!aiConfig?.apiKey) {
      setError('⚠️ AI provider not configured. Please go to Settings → AI Settings and add an API key for Gemini or Claude.');
      return;
    }

    // Check if provider supports image analysis
    if (aiProvider !== 'gemini' && aiProvider !== 'claude') {
      setError(`❌ ${aiProvider} does not support image scanning. Please use Gemini or Claude in Settings → AI Settings.`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageData = event.target?.result as string;
      setCapturedImage(imageData);
      setIsScanning(true);
      setError(null);

      try {
        const result = await extractBillDataFromImage(imageData, aiProvider, aiConfig);
        setScannedData(result);
        setAmount(result.amount.toString());
        setMerchant(result.merchant);
        setCategory(result.category);
        setDate(result.date);
        setNote(`Items: ${result.items.join(', ') || 'N/A'}`);
        setStep('preview');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to scan bill');
        setStep('preview');
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveExpense = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    onAddExpense({
      amount: parseFloat(amount),
      category: category as Category,
      date,
      note: note || 'Scanned from bill',
      paymentMethod,
    });

    resetScanner();
    onClose();
  };

  const resetScanner = () => {
    setStep('camera');
    setScannedData(null);
    setCapturedImage(null);
    setAmount('');
    setMerchant('');
    setCategory(Category.Shopping);
    setDate(new Date().toISOString().split('T')[0]);
    setNote('');
    setError(null);
    setPaymentMethod(PaymentMethod.CreditCard);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-800/95 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-slate-800/95">
          <div className="flex items-center gap-2">
            <Camera size={24} className="text-emerald-400" />
            <h2 className="text-xl font-bold text-slate-100">Bill Scanner</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-300" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'camera' && (
            <div className="space-y-4">
              {/* Camera View */}
              <div className="relative bg-slate-900 rounded-lg overflow-hidden border-2 border-slate-600">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-96 object-cover"
                />
                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                      <Loader size={40} className="text-emerald-400 animate-spin" />
                      <p className="text-white font-semibold">Scanning bill...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Canvas for capture (hidden) */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-red-950/50 border border-red-700/50">
                  <AlertCircle size={20} className="text-red-400" />
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={capturePhoto}
                  disabled={isScanning}
                  className="py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Camera size={18} />
                  {isScanning ? 'Scanning...' : 'Capture'}
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isScanning}
                  className="py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-200 font-bold rounded-lg transition-all"
                >
                  Upload Image
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={uploadFile}
                className="hidden"
              />
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-6">
              {/* Captured Image */}
              {capturedImage && (
                <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-600">
                  <img
                    src={capturedImage}
                    alt="Captured bill"
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {/* Confidence Indicator */}
              {scannedData && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-300">Scan Confidence</span>
                    <span
                      className={`text-sm font-bold ${
                        scannedData.confidence >= 80
                          ? 'text-emerald-400'
                          : scannedData.confidence >= 60
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}
                    >
                      {scannedData.confidence}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        scannedData.confidence >= 80
                          ? 'bg-emerald-500'
                          : scannedData.confidence >= 60
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${scannedData.confidence}%` }}
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-red-950/50 border border-red-700/50">
                    <AlertCircle size={20} className="text-red-400" />
                    <div>
                      <p className="text-red-200 text-sm font-semibold">Scan Failed</p>
                      <p className="text-red-300 text-xs mt-1">{error}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUseManualMode(true);
                      setError(null);
                    }}
                    className="w-full py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-all text-sm"
                  >
                    💡 Use Manual Entry Instead
                  </button>
                </div>
              )}

              {/* Editable Fields */}
              {useManualMode && (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-950/50 border border-yellow-700/50 rounded-lg">
                    <p className="text-yellow-200 text-sm font-semibold">📝 Manual Entry Mode</p>
                    <p className="text-yellow-300 text-xs mt-1">Please fill in the expense details below</p>
                  </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-700 text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">
                    Merchant
                  </label>
                  <input
                    type="text"
                    value={merchant}
                    onChange={(e) => setMerchant(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-700 text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-700 text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <optgroup label="Predefined">
                        {Object.values(Category).map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </optgroup>
                      {customCategories.length > 0 && (
                        <optgroup label="Custom">
                          {customCategories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-700 text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-700 text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    {Object.values(PaymentMethod).map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-700 text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                    rows={2}
                  />
                </div>
              </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={resetScanner}
                  className="py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-lg transition-all"
                >
                  Scan Again
                </button>
                <button
                  onClick={() => setStep('camera')}
                  className="py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveExpense}
                  className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraScanner;

import React, { useState, useEffect } from "react";
import axios from "axios";
import mammoth from "mammoth";
import {
  FileUp,
  FileCheck,
  Loader2,
  Download,
  AlertCircle,
  Trash2,
  Eye,
  X,
  Files,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Translation() {
  const [files, setFiles] = useState([]);
  const [targetLang, setTargetLang] = useState("en");
  const [isUploading, setIsUploading] = useState(false);
  const [jobs, setJobs] = useState({}); // { jobId: { status, progress, filename, resultFile } }
  const [status, setStatus] = useState("idle"); // idle, uploading, processing, completed
  const [error, setError] = useState(null);
  const [previewHtml, setPreviewHtml] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isBooting, setIsBooting] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    let interval;
    const activeJobs = Object.values(jobs).filter(
      (j) => j.status === "processing" || j.status === "queued",
    );

    if (activeJobs.length > 0) {
      if (!startTime) setStartTime(Date.now());

      interval = setInterval(async () => {
        setElapsedTime(
          Math.floor((Date.now() - (startTime || Date.now())) / 1000),
        );

        const updatedJobs = { ...jobs };
        let allDone = true;
        let bootingFound = false;

        for (const jobId of Object.keys(jobs)) {
          if (
            jobs[jobId].status === "completed" ||
            jobs[jobId].status === "failed"
          )
            continue;

          try {
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("timeout")), 5000),
            );
            const fetchPromise = axios.get(`/api/job-status/${jobId}`);

            const res = await Promise.race([fetchPromise, timeoutPromise]);
            setIsBooting(false);

            updatedJobs[jobId] = {
              ...updatedJobs[jobId],
              status: res.data.status,
              progress: res.data.progress,
              resultFile: res.data.result_file,
              error: res.data.error,
              logs: res.data.logs || [],
            };
            if (
              res.data.status === "processing" ||
              res.data.status === "queued"
            ) {
              allDone = false;
            }
          } catch (err) {
            if (err.message === "timeout" || !err.response) {
              setIsBooting(true);
              bootingFound = true;
            }
            console.error(`Error polling status for ${jobId}`, err);
            allDone = false;
          }
        }

        setJobs(updatedJobs);
        if (allDone) {
          setStatus("completed");
          setStartTime(null);
          clearInterval(interval);
        }
      }, 2000);
    } else {
      setStartTime(null);
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [jobs, startTime]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter((f) => {
      const ext = f.name.split(".").pop().toLowerCase();
      return ["docx", "pdf", "pptx", "pptm"].includes(ext);
    });

    if (validFiles.length < selectedFiles.length) {
      setError("Some files were skipped. Only .docx, .pdf, .pptx and .pptm are supported.");
    } else {
      setError(null);
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setIsUploading(true);
    setStatus("uploading");
    setError(null);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("target_lang", targetLang);

    try {
      console.log("Starting upload of files:", files.map(f => f.name));
      const res = await axios.post("/api/translate", formData);
      console.log("Upload successful, received job IDs:", res.data.job_ids);
      const newJobs = {};
      res.data.job_ids.forEach((id, index) => {
        newJobs[id] = {
          status: "queued",
          progress: 0,
          filename: files[index].name,
          logs: [`File queued: ${files[index].name}`],
        };
      });
      setJobs(newJobs);
      setStatus("processing");
    } catch (err) {
      console.error("Upload failed details:", err);
      setError(err.response?.data?.detail || "Upload failed");
      setStatus("failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = (resultFile, filename) => {
    if (resultFile) {
      window.open(
        `${axios.defaults.baseURL}/api/download/${resultFile}`,
        "_blank",
      );
    }
  };

  const handlePreview = async (resultFile) => {
    if (!resultFile) return;
    setIsPreviewLoading(true);
    try {
      const response = await axios.get(`/api/download/${resultFile}`, {
        responseType: "arraybuffer",
      });
      const result = await mammoth.convertToHtml({
        arrayBuffer: response.data,
      });
      setPreviewHtml(result.value);
      setShowPreview(true);
    } catch (err) {
      setError("Failed to generate preview.");
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const reset = () => {
    setFiles([]);
    setJobs({});
    setStatus("idle");
    setError(null);
    setPreviewHtml("");
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="glass-card overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-gradient-to-r from-brand-500/10 to-transparent">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2">
              <Files className="text-brand-400" size={32} />
            </div>
            Batch Translation
          </h2>
          <p className="text-gray-400 mt-2">
            Upload multiple documents and translate them all at once.
          </p>
        </div>

        <div className="p-8 space-y-8">
          {status === "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div
                className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center transition-all cursor-pointer hover:border-brand-500/50 hover:bg-brand-500/5"
                onClick={() => document.getElementById("file-input").click()}
              >
                <input
                  type="file"
                  id="file-input"
                  className="hidden"
                  accept=".docx,.pdf,.pptx,.pptm"
                  multiple
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-white/5 text-gray-400">
                    <FileUp size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium tracking-tight">
                      Select or Drop Files
                    </h3>
                    <p className="text-sm text-gray-500">
                      Supports multiple .docx, .pdf, .pptx and .pptm files
                    </p>
                  </div>
                </div>
              </div>

              {files.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                    Selected Files ({files.length})
                  </h4>
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {files.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl group hover:border-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <FileCheck
                            size={18}
                            className="text-brand-400 flex-shrink-0"
                          />
                          <span className="text-sm font-medium truncate">
                            {f.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {(f.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(i);
                          }}
                          className="p-1 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                    Target Language
                  </label>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full input-field bg-white/5 border-white/10 text-white"
                  >
                    <option value="en" className="text-black bg-white">English (default)</option>
                    <option value="vi" className="text-black bg-white">Vietnamese</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={files.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${files.length > 0 ? "btn-primary" : "bg-white/5 text-gray-500 cursor-not-allowed border border-white/5"}`}
              >
                Start Batch Translation
              </button>
            </motion.div>
          )}

          {(status === "uploading" ||
            status === "processing" ||
            status === "completed") &&
            status !== "idle" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">
                      {status === "processing"
                        ? "Processing Batch..."
                        : status === "completed"
                          ? "All Done!"
                          : "Uploading..."}
                    </h3>
                    {Object.keys(jobs).length > 0 && (
                      <div className="flex flex-col gap-1 mt-1">
                        <p className="text-sm text-gray-400">
                          Files Processed:{" "}
                          {
                            Object.values(jobs).filter(
                              (j) =>
                                j.status === "completed" ||
                                j.status === "failed",
                            ).length
                          }{" "}
                          / {Object.keys(jobs).length}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-mono text-brand-400">
                          <Loader2 size={12} className="animate-spin" />
                          <span>Time Elapsed: {elapsedTime}s</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {status === "completed" && (
                    <button
                      onClick={reset}
                      className="text-sm font-medium text-brand-400 hover:text-brand-300"
                    >
                      Start New Batch
                    </button>
                  )}
                </div>

                {isBooting && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3 text-amber-500 text-sm"
                  >
                    <Loader2 className="animate-spin" size={18} />
                    <p>
                      Server is booting up (cold start from Render), this might
                      take about 1 minute. Please wait...
                    </p>
                  </motion.div>
                )}

                {Object.keys(jobs).length > 0 && (
                  <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(Object.values(jobs).filter((j) => j.status === "completed" || j.status === "failed").length / Object.keys(jobs).length) * 100}%`,
                      }}
                      className="h-full bg-gradient-to-r from-brand-600 to-brand-400 shadow-[0_0_15px_rgba(14,165,233,0.4)]"
                    />
                  </div>
                )}

                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {Object.entries(jobs).map(([id, job]) => (
                    <div
                      key={id}
                      className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 truncate">
                          {job.status === "completed" ? (
                            <FileCheck className="text-green-500" size={20} />
                          ) : (
                            <Loader2
                              className="animate-spin text-brand-400"
                              size={20}
                            />
                          )}
                          <span className="font-medium truncate">
                            {job.filename}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {job.status === "completed" && (
                            <>
                              {!job.filename.toLowerCase().endsWith(".pptx") && !job.filename.toLowerCase().endsWith(".pptm") && (
                                <button
                                  onClick={() => handlePreview(job.resultFile)}
                                  className="p-2 hover:bg-white/10 rounded-lg text-brand-400 transition-colors"
                                  title="Preview"
                                >
                                  <Eye size={18} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDownload(job.resultFile)}
                                className="p-2 hover:bg-white/10 rounded-lg text-brand-400 transition-colors"
                                title="Download"
                              >
                                <Download size={18} />
                              </button>
                            </>
                          )}
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${job.status === "completed" ? "bg-green-500/10 text-green-500" : job.status === "failed" ? "bg-red-500/10 text-red-500" : "bg-brand-500/10 text-brand-400"}`}
                          >
                            {job.status.charAt(0).toUpperCase() +
                              job.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                          <span>Progress</span>
                          <span>{Math.round(job.progress)}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <motion.div
                            animate={{ width: `${job.progress}%` }}
                            className={`h-full transition-all duration-500 ${job.status === "completed" ? "bg-green-500" : "bg-brand-500 shadow-[0_0_8px_rgba(14,165,233,0.3)]"}`}
                          />
                        </div>
                      </div>
                      {job.error && (
                        <p className="text-xs text-red-500 mt-1">{job.error}</p>
                      )}

                      {/* Terminal Log View */}
                      {(job.status === "processing" ||
                        job.status === "completed" ||
                        job.status === "failed") &&
                        job.logs && (
                          <div className="mt-4 bg-black/40 rounded-lg p-3 border border-white/5 font-mono text-[10px] leading-relaxed overflow-hidden">
                            <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-1">
                              <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                              </div>
                              <span className="text-[8px] text-gray-500 uppercase tracking-widest">
                                Process Console
                              </span>
                            </div>
                            <div className="max-h-32 overflow-y-auto custom-scrollbar space-y-1">
                              {job.logs.map((log, li) => (
                                <div key={li} className="flex gap-2">
                                  <span className="text-brand-500/50 select-none">
                                    ›
                                  </span>
                                  <span className="text-gray-300">{log}</span>
                                </div>
                              ))}
                              {job.status === "processing" && (
                                <div className="flex gap-2 animate-pulse">
                                  <span className="text-brand-400 select-none">
                                    ›
                                  </span>
                                  <span className="text-brand-400/50">_</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          {status === "failed" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 flex flex-col items-center gap-6"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                <AlertCircle size={32} className="text-red-500" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-red-500">
                  Operation Failed
                </h3>
                <p className="text-gray-400">
                  {error || "Something went wrong during translation."}
                </p>
              </div>
              <button onClick={reset} className="btn-secondary">
                Try Again
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 50, scale: 0.9 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.9 }}
              className="glass-card w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <h3 className="text-xl font-bold text-brand-400">
                  Document Preview
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 bg-white text-gray-900 prose prose-slate max-w-none">
                <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && status === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-6 p-4 glass-card border-red-500/20 bg-red-500/5 text-red-100 flex items-center gap-3"
          >
            <AlertCircle className="text-red-400" />
            <span className="text-sm font-medium">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Translation;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FileUp,
  FileCheck,
  Loader2,
  Download,
  AlertCircle,
  Trash2,
  Eye,
  X,
  ArrowRightLeft,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function FormatChanger() {
  const [files, setFiles] = useState([]);
  const [targetFormat, setTargetFormat] = useState("pdf");
  const [isUploading, setIsUploading] = useState(false);
  const [jobs, setJobs] = useState({}); // { jobId: { status, progress, filename, resultFile } }
  const [status, setStatus] = useState("idle"); // idle, uploading, processing, completed
  const [error, setError] = useState(null);
  const [previewText, setPreviewText] = useState("");
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
      return ["docx", "doc", "pdf", "md"].includes(ext);
    });

    if (validFiles.length < selectedFiles.length) {
      setError("Some files were skipped. Supported formats: .docx, .doc, .pdf, .md");
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

    const activeJobs = {};

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("target_format", targetFormat);

        const res = await axios.post("/api/convert-format", formData);
        const jobId = res.data.job_id;

        activeJobs[jobId] = {
          status: "queued",
          progress: 0,
          filename: file.name,
          logs: [`File queued for conversion to ${targetFormat.toUpperCase()}`],
        };
      }

      setJobs(activeJobs);
      setStatus("processing");
    } catch (err) {
      console.error("Format conversion upload failed:", err);
      setError(err.response?.data?.detail || "Upload failed during submission");
      setStatus("failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = (resultFile) => {
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
        responseType: "text",
      });
      setPreviewText(response.data);
      setShowPreview(true);
    } catch (err) {
      setError("Failed to fetch markdown file content.");
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const reset = () => {
    setFiles([]);
    setJobs({});
    setStatus("idle");
    setError(null);
    setPreviewText("");
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bazaar-card overflow-hidden border-amber-500/30">
        <div className="p-8 border-b border-amber-500/20 bg-gradient-to-r from-[#d4af37]/15 to-transparent flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-serif font-bold flex items-center gap-3 text-white">
              <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-400/30 text-amber-300">
                <ArrowRightLeft size={28} />
              </div>
              File Format Changer
            </h2>
            <p className="text-gray-300 mt-2 text-sm">
              Convert document formats seamlessly between .docx, .doc, .pdf, and .md.
            </p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {status === "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div
                className="border-2 border-dashed border-amber-500/25 rounded-2xl p-10 text-center transition-all cursor-pointer hover:border-amber-400/60 hover:bg-[#d4af37]/5"
                onClick={() => document.getElementById("converter-file-input").click()}
              >
                <input
                  type="file"
                  id="converter-file-input"
                  className="hidden"
                  accept=".docx,.doc,.pdf,.md"
                  multiple
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-amber-500/20 text-amber-300 shadow-md">
                    <FileUp size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-bold text-white tracking-tight">
                      Select or Drop Files to Convert
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 font-mono">
                      Supports .docx, .doc, .pdf, and .md files
                    </p>
                  </div>
                </div>
              </div>

              {files.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-amber-300/80 uppercase tracking-widest">
                    Selected Files ({files.length})
                  </h4>
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {files.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-[#0a0e1a] border border-amber-500/20 rounded-xl group hover:border-amber-400/40 transition-colors"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <FileCheck
                            size={18}
                            className="text-amber-300 flex-shrink-0"
                          />
                          <span className="text-sm font-medium truncate text-gray-200">
                            {f.name}
                          </span>
                          <span className="text-xs font-mono text-gray-400">
                            {(f.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(i);
                          }}
                          className="p-1 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider block">
                  Target Output Format
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {["pdf", "docx", "doc", "md"].map((format) => (
                    <button
                      key={format}
                      type="button"
                      onClick={() => setTargetFormat(format)}
                      className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-1 font-bold uppercase transition-all duration-300 ${
                        targetFormat === format
                          ? "bg-gradient-to-br from-[#d4af37]/25 to-[#e5c158]/15 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/15"
                          : "bg-white/5 border-white/10 hover:border-white/20 text-gray-400"
                      }`}
                    >
                      <span className="text-[10px] font-mono font-semibold text-gray-400">FORMAT</span>
                      <span className="text-xl tracking-wide font-mono">.{format}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={files.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  files.length > 0
                    ? "btn-bazaar-gold"
                    : "bg-white/5 text-gray-500 cursor-not-allowed border border-white/5"
                }`}
              >
                Convert {files.length > 0 ? `${files.length} File(s)` : ""}
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
                    <h3 className="text-2xl font-serif font-bold text-white">
                      {status === "processing"
                        ? "Converting Files..."
                        : status === "completed"
                          ? "Conversion Completed!"
                          : "Uploading Files..."}
                    </h3>
                    {Object.keys(jobs).length > 0 && (
                      <div className="flex flex-col gap-1 mt-1">
                        <p className="text-sm text-gray-300">
                          Processed:{" "}
                          {
                            Object.values(jobs).filter(
                              (j) =>
                                j.status === "completed" ||
                                j.status === "failed",
                            ).length
                          }{" "}
                          / {Object.keys(jobs).length} files
                        </p>
                        <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
                          <Loader2 size={12} className="animate-spin" />
                          <span>Elapsed: {elapsedTime}s</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {status === "completed" && (
                    <button
                      onClick={reset}
                      className="text-sm font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4"
                    >
                      Convert More Files
                    </button>
                  )}
                </div>

                {isBooting && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-3 text-amber-300 text-sm"
                  >
                    <Loader2 className="animate-spin" size={18} />
                    <p>
                      Server is booting up, please hold on...
                    </p>
                  </motion.div>
                )}

                {Object.keys(jobs).length > 0 && (
                  <div className="w-full bg-black/50 h-3 rounded-full overflow-hidden border border-amber-500/20">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (Object.values(jobs).filter(
                            (j) =>
                              j.status === "completed" || j.status === "failed",
                          ).length /
                            Object.keys(jobs).length) *
                          100
                        }%`,
                      }}
                      className="h-full bg-gradient-to-r from-[#d4af37] to-[#e5c158] shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                    />
                  </div>
                )}

                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {Object.entries(jobs).map(([id, job]) => (
                    <div
                      key={id}
                      className="p-4 bg-[#0a0e1a] rounded-2xl border border-amber-500/20 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 truncate">
                          {job.status === "completed" ? (
                            <FileCheck className="text-emerald-400" size={20} />
                          ) : (
                            <Loader2
                              className="animate-spin text-amber-400"
                              size={20}
                            />
                          )}
                          <span className="font-medium truncate text-white">
                            {job.filename}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {job.status === "completed" && (
                            <>
                              {job.resultFile?.toLowerCase().endsWith(".md") && (
                                <button
                                  onClick={() => handlePreview(job.resultFile)}
                                  className="p-2 hover:bg-white/10 rounded-lg text-amber-300 transition-colors"
                                  title="Preview Markdown Content"
                                >
                                  <Eye size={18} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDownload(job.resultFile)}
                                className="p-2 hover:bg-white/10 rounded-lg text-amber-300 transition-colors"
                                title="Download File"
                              >
                                <Download size={18} />
                              </button>
                            </>
                          )}
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-bold font-mono ${
                              job.status === "completed"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : job.status === "failed"
                                  ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                  : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {job.status.charAt(0).toUpperCase() +
                              job.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-tighter font-mono">
                          <span>Status</span>
                          <span>{Math.round(job.progress)}%</span>
                        </div>
                        <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                          <motion.div
                            animate={{ width: `${job.progress}%` }}
                            className={`h-full transition-all duration-500 ${
                              job.status === "completed"
                                ? "bg-emerald-400"
                                : "bg-gradient-to-r from-[#d4af37] to-[#e5c158] shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                            }`}
                          />
                        </div>
                      </div>
                      {job.error && (
                        <p className="text-xs text-rose-400 mt-1">{job.error}</p>
                      )}

                      {/* Console Logs */}
                      {(job.status === "processing" ||
                        job.status === "completed" ||
                        job.status === "failed") &&
                        job.logs && (
                          <div className="mt-4 bg-[#080b14] rounded-xl p-3 border border-amber-500/20 font-mono text-[11px] leading-relaxed overflow-hidden">
                            <div className="flex items-center gap-2 mb-2 border-b border-amber-500/15 pb-1.5">
                              <div className="flex gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-rose-500/70" />
                                <div className="w-2 h-2 rounded-full bg-amber-500/70" />
                                <div className="w-2 h-2 rounded-full bg-emerald-500/70" />
                              </div>
                              <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">
                                Format Converter Console
                              </span>
                            </div>
                            <div className="max-h-32 overflow-y-auto custom-scrollbar space-y-1">
                              {job.logs.map((log, li) => (
                                <div key={li} className="flex gap-2">
                                  <span className="text-amber-400 select-none">
                                    ›
                                  </span>
                                  <span className="text-gray-300">{log}</span>
                                </div>
                              ))}
                              {job.status === "processing" && (
                                <div className="flex gap-2 animate-pulse">
                                  <span className="text-amber-400 select-none">
                                    ›
                                  </span>
                                  <span className="text-amber-400/50">_</span>
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
              <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/30">
                <AlertCircle size={32} className="text-rose-400" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-rose-400">
                  Conversion Process Failed
                </h3>
                <p className="text-gray-300">
                  {error || "Something went wrong during format changing."}
                </p>
              </div>
              <button onClick={reset} className="btn-bazaar-ghost">
                Try Again
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Markdown Text Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ y: 50, scale: 0.9 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.9 }}
              className="bazaar-card w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden border-amber-400/40"
            >
              <div className="p-4 border-b border-amber-500/20 flex items-center justify-between bg-[#0a0e1a]">
                <h3 className="text-xl font-serif font-bold text-amber-300 flex items-center gap-2">
                  <FileText size={20} />
                  Markdown Content Preview
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                >
                  <X />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 bg-[#080b14] font-mono text-sm text-gray-200 leading-relaxed custom-scrollbar whitespace-pre-wrap select-text">
                {previewText || "No text content found."}
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
            className="mt-6 p-4 bazaar-card border-rose-500/30 bg-rose-500/10 text-rose-200 flex items-center gap-3"
          >
            <AlertCircle className="text-rose-400" />
            <span className="text-sm font-medium">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FormatChanger;

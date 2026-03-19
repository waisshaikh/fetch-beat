import { useState } from "react";
import VideoCard from "./components/VideoCard";

export default function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setResult(null);
    const trimmed = url.trim();
    if (!trimmed) return setError("Please enter a YouTube URL");
    if (!trimmed.includes("youtube.com") && !trimmed.includes("youtu.be")) {
      return setError("Please enter a valid YouTube URL");
    }
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div style={styles.page}>
      {/* Background blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoWrap}>
            <span style={styles.logoIcon}>&#9654;</span>
          </div>
          <h1 style={styles.title}>FetchBeat</h1>
          <p style={styles.subtitle}>
            Convert any YouTube video to MP3 — free, fast, and clean.
          </p>
        </div>

        {/* Input Card */}
        <div style={styles.inputCard}>
          <p style={styles.inputLabel}>Paste YouTube Link</p>
          <div style={styles.inputRow}>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </span>
              <input
                style={styles.input}
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {url && (
                <button style={styles.clearBtn} onClick={() => { setUrl(""); setResult(null); setError(""); }}>
                  &#10005;
                </button>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ ...styles.convertBtn, opacity: loading ? 0.75 : 1 }}
            >
              {loading ? (
                <span style={styles.spinnerWrap}>
                  <span style={styles.spinner} />
                  Converting...
                </span>
              ) : (
                "Convert"
              )}
            </button>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span style={{ marginRight: "6px" }}>&#9888;</span>
              {error}
            </div>
          )}
        </div>

        {/* Result */}
        {result && <VideoCard data={result} />}

        {/* How it works */}
        {!result && !loading && (
          <div style={styles.steps}>
            {[
              { icon: "&#128279;", label: "Paste Link", desc: "Copy any YouTube URL" },
              { icon: "&#9881;", label: "Convert", desc: "We extract the audio" },
              { icon: "&#11015;", label: "Download", desc: "Save MP3 to your device" },
            ].map((step, i) => (
              <div key={i} style={styles.stepCard}>
                <span style={styles.stepIcon} dangerouslySetInnerHTML={{ __html: step.icon }} />
                <p style={styles.stepLabel}>{step.label}</p>
                <p style={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <p style={styles.footer}>
          Powered by RapidAPI &nbsp;&bull;&nbsp; For personal use only
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0f",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "2rem 1rem",
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "fixed",
    top: "-120px",
    left: "-120px",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,62,62,0.15), transparent 70%)",
    pointerEvents: "none",
  },
  blob2: {
    position: "fixed",
    bottom: "-100px",
    right: "-100px",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(138,43,226,0.12), transparent 70%)",
    pointerEvents: "none",
  },
  container: {
    width: "100%",
    maxWidth: "680px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
    position: "relative",
    zIndex: 1,
  },
  header: {
    textAlign: "center",
    marginTop: "1rem",
  },
  logoWrap: {
    width: "60px",
    height: "60px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #ff3e3e, #ff6b35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1rem",
    boxShadow: "0 8px 24px rgba(255,62,62,0.35)",
  },
  logoIcon: {
    fontSize: "1.6rem",
    color: "#fff",
    marginLeft: "4px",
  },
  title: {
    fontSize: "2.8rem",
    fontWeight: "800",
    background: "linear-gradient(135deg, #fff 30%, #ff6b6b)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "-1px",
  },
  subtitle: {
    color: "#888",
    fontSize: "0.95rem",
    marginTop: "0.5rem",
  },
  inputCard: {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "1.5rem",
    backdropFilter: "blur(10px)",
  },
  inputLabel: {
    color: "#aaa",
    fontSize: "0.8rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "0.75rem",
  },
  inputRow: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
  },
  inputWrap: {
    flex: 1,
    minWidth: "200px",
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "14px",
    display: "flex",
    alignItems: "center",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "0.75rem 2.5rem 0.75rem 2.8rem",
    backgroundColor: "#111118",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "0.9rem",
    outline: "none",
    fontFamily: "Inter, sans-serif",
    transition: "border 0.2s",
  },
  clearBtn: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    color: "#666",
    cursor: "pointer",
    fontSize: "0.9rem",
    padding: "2px 6px",
  },
  convertBtn: {
    padding: "0.75rem 1.8rem",
    background: "linear-gradient(135deg, #ff3e3e, #ff6b35)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "0.95rem",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
    boxShadow: "0 4px 16px rgba(255,62,62,0.3)",
    whiteSpace: "nowrap",
    transition: "transform 0.1s",
  },
  spinnerWrap: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  spinner: {
    width: "14px",
    height: "14px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.8s linear infinite",
  },
  errorBox: {
    marginTop: "0.75rem",
    background: "rgba(255,62,62,0.1)",
    border: "1px solid rgba(255,62,62,0.3)",
    borderRadius: "10px",
    color: "#ff6b6b",
    padding: "0.6rem 1rem",
    fontSize: "0.85rem",
    display: "flex",
    alignItems: "center",
  },
  steps: {
    display: "flex",
    gap: "1rem",
    width: "100%",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  stepCard: {
    flex: "1",
    minWidth: "160px",
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "16px",
    padding: "1.2rem",
    textAlign: "center",
  },
  stepIcon: {
    fontSize: "1.8rem",
    display: "block",
    marginBottom: "0.5rem",
  },
  stepLabel: {
    fontWeight: "700",
    fontSize: "0.95rem",
    color: "#fff",
    marginBottom: "0.25rem",
  },
  stepDesc: {
    color: "#666",
    fontSize: "0.8rem",
  },
  footer: {
    color: "#444",
    fontSize: "0.78rem",
    marginTop: "1rem",
    paddingBottom: "1rem",
  },
};

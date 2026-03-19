export default function VideoCard({ data }) {
  const { title, duration, thumbnail, audioUrl } = data;

  const formatDuration = (secs) => {
    if (!secs) return "Unknown";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return h + ":" + m.toString().padStart(2, "0") + ":" + s.toString().padStart(2, "0");
    }
    return m + ":" + s.toString().padStart(2, "0");
  };

  const downloadUrl = audioUrl
    ? "http://localhost:5000/api/proxy-download?audioUrl=" +
      encodeURIComponent(audioUrl) +
      "&title=" +
      encodeURIComponent(title || "audio")
    : null;

  return (
    <div style={styles.card}>
      {/* Thumbnail */}
      {thumbnail && (
        <div style={styles.thumbWrap}>
          <img src={thumbnail} alt={title} style={styles.thumb} />
          <div style={styles.thumbOverlay} />
          <div style={styles.durationBadge}>{formatDuration(duration)}</div>
        </div>
      )}

      <div style={styles.body}>
        {/* Title */}
        <h2 style={styles.title}>{title || "Unknown Title"}</h2>

        {/* Tags row */}
        <div style={styles.tagsRow}>
          <span style={styles.tag}>
            <span style={styles.tagDot} />
            MP3 Audio
          </span>
          <span style={styles.tag}>
            <span style={{ ...styles.tagDot, background: "#a78bfa" }} />
            {formatDuration(duration)}
          </span>
        </div>

        {/* Audio preview */}
        {audioUrl ? (
          <div style={styles.previewBox}>
            <p style={styles.previewLabel}>Preview</p>
            <audio
              controls
              src={audioUrl}
              style={styles.audio}
            />
          </div>
        ) : (
          <div style={styles.noAudio}>
            Audio stream not available for this video
          </div>
        )}

        {/* Download button */}
        {downloadUrl && (
          <a
            href={downloadUrl}
            style={styles.downloadBtn}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "8px" }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download MP3
          </a>
        )}

        {!audioUrl && (
          <div style={styles.unavailableBtn}>
            Audio not available
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
    animation: "fadeIn 0.4s ease",
  },
  thumbWrap: {
    position: "relative",
    width: "100%",
    maxHeight: "280px",
    overflow: "hidden",
  },
  thumb: {
    width: "100%",
    maxHeight: "280px",
    objectFit: "cover",
    display: "block",
  },
  thumbOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "80px",
    background: "linear-gradient(to top, rgba(10,10,15,0.95), transparent)",
  },
  durationBadge: {
    position: "absolute",
    bottom: "12px",
    right: "12px",
    background: "rgba(0,0,0,0.75)",
    color: "#fff",
    fontSize: "0.78rem",
    fontWeight: "600",
    padding: "3px 8px",
    borderRadius: "6px",
    backdropFilter: "blur(4px)",
  },
  body: {
    padding: "1.4rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  title: {
    fontSize: "1.05rem",
    fontWeight: "700",
    color: "#f0f0f0",
    lineHeight: "1.4",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  tagsRow: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
  },
  tag: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "4px 12px",
    fontSize: "0.78rem",
    color: "#aaa",
    fontWeight: "500",
  },
  tagDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#ff3e3e",
    display: "inline-block",
  },
  previewBox: {
    background: "rgba(0,0,0,0.25)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "14px",
    padding: "1rem",
  },
  previewLabel: {
    color: "#666",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "0.6rem",
  },
  audio: {
    width: "100%",
    height: "36px",
    borderRadius: "8px",
    outline: "none",
  },
  noAudio: {
    textAlign: "center",
    color: "#555",
    fontSize: "0.85rem",
    padding: "0.75rem",
    background: "rgba(255,255,255,0.02)",
    borderRadius: "10px",
  },
  downloadBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.85rem",
    background: "linear-gradient(135deg, #ff3e3e, #ff6b35)",
    color: "#fff",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "0.95rem",
    textDecoration: "none",
    fontFamily: "Inter, sans-serif",
    boxShadow: "0 4px 20px rgba(255,62,62,0.3)",
    transition: "transform 0.1s, box-shadow 0.1s",
  },
  unavailableBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.85rem",
    background: "rgba(255,255,255,0.04)",
    color: "#555",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "0.95rem",
    border: "1px solid rgba(255,255,255,0.06)",
  },
};

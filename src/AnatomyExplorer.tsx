import "./AnatomyExplorer.css";

export default function AnatomyExplorer() {
  return (
    <section className="anatomy-explorer">
      <header className="anatomy-header">
        <div>
          <p className="anatomy-eyebrow">ANATOMY & RADIOLOGY</p>
          <h1>Interactive Anatomy Atlas</h1>
          <p className="anatomy-intro">
            Explore the externally hosted Z-Anatomy atlas. Rotate the model, zoom in,
            and inspect anatomical structures in the atlas viewer.
          </p>
        </div>
        <a
          className="anatomy-open-link"
          href="https://ana3d.app/en/atlas/z-anatomy/"
          target="_blank"
          rel="noreferrer"
        >
          Open atlas in a new tab ↗
        </a>
      </header>

      <div className="external-atlas">
        <div className="external-atlas-head">
          <div>
            <b>Z-Anatomy · hosted by Ana3D</b>
            <p>
              The model is provided by the external atlas. If the site prevents
              embedding, open it in a new tab using the link above.
            </p>
          </div>
        </div>
        <iframe
          title="Ana3D Z-Anatomy interactive human anatomy atlas"
          src="https://ana3d.app/en/atlas/z-anatomy/"
          loading="lazy"
          allow="fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <div className="external-atlas-foot">
          <span>Model source: Z-Anatomy / Ana3D</span>
          <span>Educational use only; not for diagnosis.</span>
        </div>
      </div>
      <p className="anatomy-attribution">
        Respect the model’s licence and attribution terms when using or adapting assets.
      </p>
    </section>
  );
}

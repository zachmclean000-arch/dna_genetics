import React, { useRef, useState } from "react";
import "./BrandStorySection.css";

export default function BrandStorySection() {
  const dialog = useRef(null);
  const [playing, setPlaying] = useState(false);
  function openVideo() {
    setPlaying(true);
    dialog.current.showModal();
  }
  return (
    <section
      className="dna-brand-story"
      aria-labelledby="dna-brand-story-title"
    >
      <div className="dna-brand-story-grid">
        <div className="dna-brand-story-copy">
          <h2 id="dna-brand-story-title">The D&amp;A Inside DNA</h2>
          <p>
            Don and Aaron, two Californians with a shared interest in cannabis
            genetics, established DNA Genetics in Amsterdam in 2004. Their move
            to the Netherlands marked the beginning of a company built around
            their enthusiasm for the plant and a desire to share it with others.
          </p>
          <p>
            The company’s story spans two decades of work, recognition and
            relationships. Alongside its awards, DNA Genetics emphasizes the
            community that has grown around the brand: people who share an
            interest in its varieties and a commitment to their craft. That
            connection remains a central part of the DNA identity.
          </p>
          <button
            className="dna-brand-story-video"
            onClick={openVideo}
            aria-label="Play the DNA Genetics story video"
          >
            <img
              className="dna-brand-story-poster"
              src="/assets/images/story/video.webp"
              alt="DNA Genetics story video preview"
              loading="lazy"
            />
            <img
              className="dna-brand-story-play"
              src="/assets/images/story/play.svg"
              alt=""
            />
          </button>
        </div>
        <img
          className="dna-brand-story-scene"
          src="/assets/images/story/scene.webp"
          alt="A scene from the DNA Genetics story"
          loading="lazy"
        />
      </div>
      <dialog
        ref={dialog}
        className="dna-brand-story-dialog"
        aria-label="DNA Genetics story video"
        onClose={() => setPlaying(false)}
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
      >
        <button
          className="dna-brand-story-close"
          onClick={() => dialog.current.close()}
          aria-label="Close video"
          autoFocus
        >
          ×
        </button>
        {playing && (
          <iframe
            src="https://player.vimeo.com/video/600180019"
            title="DNA Genetics story"
            allow="fullscreen; picture-in-picture"
            allowFullScreen
          />
        )}
      </dialog>
    </section>
  );
}

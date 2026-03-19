type VideoEmbedProps = {
  caption?: string;
  src: string;
};

export function VideoEmbed({ src, caption }: VideoEmbedProps) {
  return (
    <div className="video-embed">
      <video controls autoPlay muted loop playsInline className="video-embed__player">
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {caption ? <p className="video-embed__caption">{caption}</p> : null}
    </div>
  );
}

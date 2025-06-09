import React, { useEffect, useRef } from 'react';

const BackgroundVideo = ({ videoSrc, children }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.log("Error al reproducir el video:", error);
            });
        }
    }, []);

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden">
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover"
                style={{
                    zIndex: -1,
                    minHeight: '100vh',
                    minWidth: '100vw'
                }}
            >
                <source src={videoSrc} type="video/mp4" />
                Tu navegador no soporta el video.
            </video>

            <div className="relative min-h-screen w-full">
                {children}
            </div>
        </div>
    );
};

export default BackgroundVideo;

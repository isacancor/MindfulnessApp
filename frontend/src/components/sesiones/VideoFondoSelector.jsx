import React from 'react';

const VIDEOS_DISPONIBLES = [
    { value: '', label: 'Sin video de fondo' },
    { value: 'lluvia.mp4', label: 'Lluvia' },
    { value: 'naturaleza.mp4', label: 'Naturaleza' },
    { value: 'olas.mp4', label: 'Olas' },
    { value: 'barco.mp4', label: 'Barco' },
    { value: 'sunset.mp4', label: 'Atardecer' },
    { value: 'nubes.mp4', label: 'Nubes' },
];

const VideoFondoSelector = ({ value, onChange }) => {
    return (
        <div>
            <label htmlFor="video_fondo" className="block text-sm font-medium text-white mb-2">
                Video de Fondo
            </label>
            <select
                id="video_fondo"
                name="video_fondo"
                value={value || ''}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 outline-none transition duration-200"
            >
                {VIDEOS_DISPONIBLES.map((video) => (
                    <option key={video.value} value={video.value} className="bg-slate-800 text-white">
                        {video.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default VideoFondoSelector; 
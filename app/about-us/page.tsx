"use client";

import React, { useEffect, useRef } from "react";

export default function AboutUs() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.8;
      
      const playAudio = () => {
        audioRef.current?.play().catch((error) => {
          console.log("L'autoplay est bloqué par le navigateur. En attente d'une interaction...", error);
        });
      };

      playAudio();

      window.addEventListener("click", playAudio, { once: true });
      
      return () => window.removeEventListener("click", playAudio);
    }
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white font-sans">
      <audio ref={audioRef} src="/Rick_Astley_-_Never_Gonna_Give_You_Up_CeeNaija.com_.mp3" loop />

      <div className="text-center p-10 border border-zinc-800 rounded-3xl bg-zinc-900/50 backdrop-blur-sm shadow-2xl">
        <h1 className="text-zinc-500 text-sm uppercase tracking-[0.3em] mb-8">
          Crédits du Projet
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-light mb-6 text-zinc-300">
          Ce projet a été réalisé par :
        </h2>

        <div className="space-y-4">
          {["Mouayed Zmandar", "Hazem Cherif", "Iyed Barouni", "Adam Assas"].map((name) => (
            <p key={name} className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
              {name}
            </p>
          ))}
        </div>
      </div>
    </main>
  );
}
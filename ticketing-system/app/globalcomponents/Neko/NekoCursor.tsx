"use client";

import { useEffect } from "react";
import useLagRadar from "./useLagRadar";
import { Neko } from "./neko";

export default function NekoCursor() {
    // Keep this if you want the performance radar, remove it if you don't.

    useEffect(() => {
        // Initialize only the main following cat
        const mainNeko = new Neko({ 
            nekoName: "main-neko", 
            nekoImageUrl: "/animals/neko.png" 
        });
        
        mainNeko.init();

        return () => {
            mainNeko.destroy();
        };
    }, []);

    return null; 
}
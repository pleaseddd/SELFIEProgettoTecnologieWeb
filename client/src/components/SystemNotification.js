import React from "react";

function SystemNotification() {
    const handlesend=()=>{
        if (!("Notification" in window)) {
            alert("Questo browser non supporta le notifiche desktop.");
            return;
        }
        
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                new Notification("Notifica di prova", {
                    body: "Questa è una notifica di prova.",
                    icon: "https://example.com/icon.png", // URL dell'icona della notifica
                });
            } else {
                alert("Permesso per le notifiche non concesso.");
            }
        })
    }

    return (
        <button onClick={handlesend}>Manda notifica</button>
    );

}

export default SystemNotification;
import React, { useState, useEffect } from "react";

function SystemNotification() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    // Richiedi i permessi per le notifiche quando il componente viene montato
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      alert('Permessi per le notifiche non concessi');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        alert('Nessuna sottoscrizione push attiva');
        return;
      }

      // Calcola il tempo rimanente fino alla notifica
      const notificationTime = new Date(time);
      const now = new Date();
      const timeUntilNotification = notificationTime - now;

      if (timeUntilNotification <= 0) {
        alert('Seleziona un orario futuro per la notifica');
        return;
      }

      // Invia la notifica
      const notificationData = {
        title: title,
        body: message,
        icon: '/logo192.png',
        badge: '/logo192.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1
        }
      };

      await registration.showNotification(notificationData.title, notificationData);
      
      // Reset del form
      setTitle("");
      setMessage("");
      setTime("");
      
      alert('Notifica inviata con successo!');
    } catch (error) {
      console.error('Errore nell\'invio della notifica:', error);
      alert('Errore nell\'invio della notifica');
    }
  };

  return (
    <form className="container mt-3" onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="notificationTitle" className="form-label">Titolo</label>
          <input 
            type="text" 
            className="form-control" 
            id="notificationTitle"
            placeholder="Inserisci il titolo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="notificationTime" className="form-label">Orario</label>
          <input 
            type="datetime-local" 
            className="form-control" 
            id="notificationTime"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="notificationMessage" className="form-label">Messaggio</label>
        <textarea 
          className="form-control" 
          id="notificationMessage" 
          rows="3"
          placeholder="Inserisci il messaggio della notifica"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>
      </div>
      <button 
        type="submit" 
        className="btn btn-primary"
      >
        Invia notifica
      </button>
    </form>
  );
}

export default SystemNotification;
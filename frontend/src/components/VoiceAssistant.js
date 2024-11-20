import React, { useState, useEffect } from 'react';
import './VoiceAssistant.css';

function VoiceAssistant() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('');
    const [status, setStatus] = useState('idle'); // idle, listening, speaking
    const [conversation, setConversation] = useState([]);

    useEffect(() => {
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'es-ES';

        recognition.onstart = () => {
            setIsListening(true);
            setStatus('listening');
        };
        recognition.onend = () => {
            setIsListening(false);
            setStatus('idle');
        };
        recognition.onresult = (event) => {
            const current = event.resultIndex;
            const transcript = event.results[current][0].transcript;
            setTranscript(transcript);
        };

        if (isListening) {
            recognition.start();
        } else {
            recognition.stop();
        }

        return () => {
            recognition.stop();
        };
    }, [isListening]);

    useEffect(() => {
        if (transcript) {
            // Realizar una búsqueda en Google
            const query = transcript.trim();
            fetch(`https://nombre-de-tu-aplicacion.herokuapp.com/api/google/search?query=${query}`)
                .then(response => response.json())
                .then(data => {
                    const result = data[0] || 'No se encontraron resultados';
                    setResponse(result);
                    updateConversation(transcript, result);
                    speak(result);
                });
        }
    }, [transcript]);

    useEffect(() => {
        // Iniciar la conversación cuando el componente se monta
        const initialMessage = 'Hola, soy tu Asistente. ¿En qué puedo ayudarte hoy?';
        speak(initialMessage);
        updateConversation('Asistente', initialMessage);
        setIsListening(true);
    }, []);

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.onstart = () => setStatus('speaking');
        utterance.onend = () => setStatus('idle');
        window.speechSynthesis.speak(utterance);
    };

    const updateConversation = (userMessage, assistantMessage) => {
        const newConversation = [...conversation, { user: userMessage, assistant: assistantMessage }];
        setConversation(newConversation);
        localStorage.setItem('conversation', JSON.stringify(newConversation));
    };

    return (
        <div className="voice-assistant">
            <div className={`sphere ${status}`}></div>
            <button onClick={() => setIsListening(prevState => !prevState)}>
                {isListening ? 'Detener' : 'Hablar'}
            </button>
        </div>
    );
}

export default VoiceAssistant;
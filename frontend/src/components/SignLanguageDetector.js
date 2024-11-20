import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import Webcam from 'react-webcam';
import './SignLanguageDetector.css';

function SignLanguageDetector() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [model, setModel] = useState(null);
    const [sign, setSign] = useState('');
    const [conversation, setConversation] = useState([]);

    useEffect(() => {
        const loadModel = async () => {
            const handposeModel = await handpose.load();
            setModel(handposeModel);
        };
        loadModel();
    }, []);

    useEffect(() => {
        if (model) {
            const detect = async () => {
                if (webcamRef.current && webcamRef.current.video.readyState === 4) {
                    const video = webcamRef.current.video;
                    const videoWidth = video.videoWidth;
                    const videoHeight = video.videoHeight;

                    webcamRef.current.video.width = videoWidth;
                    webcamRef.current.video.height = videoHeight;

                    const hand = await model.estimateHands(video);
                    if (hand.length > 0) {
                        const gesture = classifyGesture(hand[0].landmarks);
                        if (gesture === 'Gesto no reconocido') {
                            const additionalInfo = await fetchAdditionalGestureInfo();
                            setSign(additionalInfo);
                            updateConversation('Usuario', additionalInfo);
                            speak(additionalInfo);
                        } else {
                            setSign(gesture);
                            updateConversation('Usuario', gesture);
                            speak(gesture);
                        }
                    } else {
                        setSign('');
                    }
                }
            };

            const interval = setInterval(detect, 100);
            return () => clearInterval(interval);
        }
    }, [model]);

    const classifyGesture = (landmarks) => {
        // Aquí puedes agregar la lógica para clasificar los gestos basados en las posiciones de las manos
        // Este es un ejemplo simple que detecta algunos gestos básicos
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        const middleTip = landmarks[12];
        const ringTip = landmarks[16];
        const pinkyTip = landmarks[20];

        if (thumbTip[1] < indexTip[1] && thumbTip[1] < middleTip[1] && thumbTip[1] < ringTip[1] && thumbTip[1] < pinkyTip[1]) {
            return 'Pulgar arriba';
        } else if (indexTip[1] < thumbTip[1] && indexTip[1] < middleTip[1] && indexTip[1] < ringTip[1] && indexTip[1] < pinkyTip[1]) {
            return 'Índice arriba';
        } else {
            return 'Gesto no reconocido';
        }
    };

    const fetchAdditionalGestureInfo = async () => {
        const response = await fetch('https://nombre-de-tu-aplicacion.herokuapp.com/api/google/search?query=gesto de lenguaje de señas');
        const data = await response.json();
        return data[0] || 'No se encontraron resultados adicionales';
    };

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
    };

    const updateConversation = (userMessage, assistantMessage) => {
        const newConversation = [...conversation, { user: userMessage, assistant: assistantMessage }];
        setConversation(newConversation);
        localStorage.setItem('conversation', JSON.stringify(newConversation));
    };

    return (
        <div className="sign-language-detector">
            <Webcam ref={webcamRef} className="webcam" />
            <canvas ref={canvasRef} className="canvas" />
        </div>
    );
}

export default SignLanguageDetector;
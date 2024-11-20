import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import VoiceAssistant from './components/VoiceAssistant';
import SignLanguageDetector from './components/SignLanguageDetector';
import './index.css';

function App() {
    const isOnline = navigator.onLine;

    return (
        <Router>
            <div>
                {isOnline ? (
                    <Switch>
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <Route path="/search" component={Search} />
                        <Route path="/voice-assistant" component={VoiceAssistant} />
                        <Route path="/sign-language" component={SignLanguageDetector} />
                        <Route path="/" exact>
                            <h1>Bienvenido a Asistente</h1>
                        </Route>
                    </Switch>
                ) : (
                    <h1>No hay conexión a internet. Por favor, verifica tu conexión e inténtalo de nuevo.</h1>
                )}
            </div>
        </Router>
    );
}

export default App;
import { VoiceProvider, VoiceProviderType } from './types';
import { WhisperProvider } from './whisper';
import { WebSpeechProvider } from './webspeech';
import { MockProvider } from './mock';
import { AssemblyAIProvider } from './assemblyai';
import { DeepgramProvider } from './deepgram';

export function getProvider(type: VoiceProviderType): VoiceProvider {
    switch (type) {
        case 'whisper':
            return new WhisperProvider();
        case 'webspeech':
            return new WebSpeechProvider();
        case 'mock':
            return new MockProvider();
        case 'assemblyai':
            return new AssemblyAIProvider();
        case 'deepgram':
            return new DeepgramProvider();
        default:
            console.warn(`Unknown provider type ${type}, falling back to Deepgram`);
            return new DeepgramProvider();
    }
}

export async function createVoiceProvider(
    preferred: VoiceProviderType[] = ['assemblyai']
): Promise<VoiceProvider> {
    const errors: Error[] = [];

    for (const type of preferred) {
        const provider = getProvider(type);
        if (provider.isSupported()) {
            try {
                await provider.initialize();
                return provider;
            } catch (e) {
                console.warn(`Provider ${type} failed to initialize:`, e);
                errors.push(e as Error);
                continue;
            }
        }
    }

    throw new Error(`No voice provider available. Errors: ${errors.map(e => e.message).join(', ')}`);
}

import { useCallback } from 'react';
import { useSettings } from '../providers/useSettings';

const morseTable = [
    { char: 'A', code: '.-' },
    { char: 'B', code: '-...' },
    { char: 'C', code: '-.-.' },
    { char: 'D', code: '-..' },
    { char: 'E', code: '.' },
    { char: 'F', code: '..-.' },
    { char: 'G', code: '--.' },
    { char: 'H', code: '....' },
    { char: 'I', code: '..' },
    { char: 'J', code: '.---' },
    { char: 'K', code: '-.-' },
    { char: 'L', code: '.-..' },
    { char: 'M', code: '--' },
    { char: 'N', code: '-.' },
    { char: 'O', code: '---' },
    { char: 'P', code: '.--.' },
    { char: 'Q', code: '--.-' },
    { char: 'R', code: '.-.' },
    { char: 'S', code: '...' },
    { char: 'T', code: '-' },
    { char: 'U', code: '..-' },
    { char: 'V', code: '...-' },
    { char: 'W', code: '.--' },
    { char: 'X', code: '-..-' },
    { char: 'Y', code: '-.--' },
    { char: 'Z', code: '--..' },
    { char: '0', code: '-' },
    { char: '1', code: '.-' },
    { char: '2', code: '..-' },
    { char: '3', code: '...-' },
    { char: '4', code: '....-' },
    { char: '5', code: '.....' },
    { char: '6', code: '-....' },
    { char: '7', code: '-...' },
    { char: '8', code: '-..' },
    { char: '9', code: '-.' },
    { char: '.', code: '.-.-.-' },
    { char: ',', code: '-..-' },
    { char: '?', code: '..-..' },
    { char: '=', code: '-...-' },
    { char: ' ', code: '  ' },
];

const textToMorse = (text: string) =>
    text
        .replace('é', 'e')
        .replace('è', 'e')
        .replace('ê', 'e')
        .replace('à', 'a')
        .replace('ç', 'c')
        .replace('ô', 'o')
        .replace('ù', 'u')
        .replace('î', 'i')
        .replace('ï', 'i')
        .replace('ô', 'o')
        .split('')
        .map(char => {
            const entry = morseTable.find(
                morse => morse.char.toLowerCase() === char.toLowerCase()
            );
            return entry ? entry.code + ' ' : entry;
        })
        .join(' ');

const morseToText = (morse: string) => {
    const words = morse.split(/\s{2,}/g);
    return words
        .map(word =>
            word
                .split(' ')
                .map(code => {
                    const entry = morseTable.find(morse => morse.code === code);
                    return entry ? entry.char : code;
                })
                .join('')
        )
        .join(' ');
};

function isEmoji(char: string) {
    return /\p{Emoji}/u.test(char);
}

console.log('🎵🌙', isEmoji('🌙'), isEmoji('🎵'));

export default function useMorse() {
    const { settings } = useSettings();

    const handleRender = useCallback(
        (text: string, customPercent?: number) => {
            if (!text) return '';

            let renderedText = '';
            const morsePercent = customPercent ?? settings.morsePercent;

            text.split('').forEach(char => {
                const isMorse: boolean = Math.random() * 100 > morsePercent;
                if (isMorse) {
                    renderedText += char;
                } else {
                    renderedText += textToMorse(char);
                }
            });

            return renderedText;
        },
        [settings.morsePercent]
    );

    return {
        encode: (text: string): string => {
            return textToMorse(text);
        },
        decode: (binary: string): string => {
            return morseToText(binary);
        },
        handleRender,
    };
}

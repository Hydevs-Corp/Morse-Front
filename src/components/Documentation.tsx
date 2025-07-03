import {
    Container,
    Space,
    List,
    ThemeIcon,
    Card,
    Group,
    Table,
    TextInput,
    Button,
    Textarea,
    Divider,
} from '@mantine/core';
import {
    IconDots,
    IconSettings,
    IconArrowRight,
    IconArrowLeft,
} from '@tabler/icons-react';
import MorseText from './morse/MorseText';
import MorseTitle from './morse/MorseTitle';
import useMorse from '../hook/useMorse';
import { useState } from 'react';

const Documentation = () => {
    const { handleRender, encode, decode } = useMorse();
    const [textInput, setTextInput] = useState('');
    const [morseInput, setMorseInput] = useState('');
    const [textResult, setTextResult] = useState('');
    const [morseResult, setMorseResult] = useState('');

    const handleTextToMorse = () => {
        const result = encode(textInput);
        setMorseResult(result);
    };

    const handleMorseToText = () => {
        const result = decode(morseInput);
        setTextResult(result);
    };

    const morseLetters = [
        { letter: 'A', morse: '·−' },
        { letter: 'B', morse: '−···' },
        { letter: 'C', morse: '−·−·' },
        { letter: 'D', morse: '−··' },
        { letter: 'E', morse: '·' },
        { letter: 'F', morse: '··−·' },
        { letter: 'G', morse: '−−·' },
        { letter: 'H', morse: '····' },
        { letter: 'I', morse: '··' },
        { letter: 'J', morse: '·−−−' },
        { letter: 'K', morse: '−·−' },
        { letter: 'L', morse: '·−··' },
        { letter: 'M', morse: '−−' },
        { letter: 'N', morse: '−·' },
        { letter: 'O', morse: '−−−' },
        { letter: 'P', morse: '·−−·' },
        { letter: 'Q', morse: '−−·−' },
        { letter: 'R', morse: '·−·' },
        { letter: 'S', morse: '···' },
        { letter: 'T', morse: '−' },
        { letter: 'U', morse: '··−' },
        { letter: 'V', morse: '···−' },
        { letter: 'W', morse: '·−−' },
        { letter: 'X', morse: '−··−' },
        { letter: 'Y', morse: '−·−−' },
        { letter: 'Z', morse: '−−··' },
    ];

    const morseNumbers = [
        { number: '0', morse: '−−−−−' },
        { number: '1', morse: '·−−−−' },
        { number: '2', morse: '··−−−' },
        { number: '3', morse: '···−−' },
        { number: '4', morse: '····−' },
        { number: '5', morse: '·····' },
        { number: '6', morse: '−····' },
        { number: '7', morse: '−−···' },
        { number: '8', morse: '−−−··' },
        { number: '9', morse: '−−−−·' },
    ];

    const morsePunctuation = [
        { symbol: '.', morse: '·−·−·−' },
        { symbol: ',', morse: '−−··−−' },
        { symbol: '?', morse: '··−−··' },
        { symbol: '!', morse: '−·−·−−' },
        { symbol: "'", morse: '·−−−−·' },
        { symbol: '"', morse: '·−··−·' },
        { symbol: '@', morse: '·−−·−·' },
    ];

    return (
        <Container size="md" py="xl">
            <MorseTitle order={1} ta="center" mb="xl">
                Morse Code Documentation
            </MorseTitle>

            <Card shadow="sm" p="lg" mb="xl">
                <MorseTitle order={2} mb="md">
                    What is Morse Code?
                </MorseTitle>
                <MorseText mb="sm">
                    Morse code is a communication system that uses sequences of
                    short and long signals (dots and dashes) to represent
                    letters, numbers, and punctuation marks.
                </MorseText>
                <MorseText>
                    Invented by Samuel Morse in the 1830s, this code
                    revolutionized telecommunications and is still used today,
                    particularly in amateur radio and emergency situations.
                </MorseText>
            </Card>

            <Card shadow="sm" p="lg" mb="xl">
                <MorseTitle order={2} mb="md">
                    Basic Principles
                </MorseTitle>
                <List
                    spacing="sm"
                    icon={
                        <ThemeIcon color="blue" size={20} radius="xl">
                            <IconDots size={12} />
                        </ThemeIcon>
                    }
                >
                    <List.Item>
                        <MorseText>Dot (·) : Short signal</MorseText>
                    </List.Item>
                    <List.Item>
                        <MorseText>
                            Dash (−) : Long signal (3 times the duration of a
                            dot)
                        </MorseText>
                    </List.Item>
                    <List.Item>
                        <MorseText>
                            Space between elements of a letter: 1 unit
                        </MorseText>
                    </List.Item>
                    <List.Item>
                        <MorseText>Space between letters: 3 units</MorseText>
                    </List.Item>
                    <List.Item>
                        <MorseText>Space between words: 7 units</MorseText>
                    </List.Item>
                </List>
            </Card>

            <Card shadow="sm" p="lg" mb="xl">
                <MorseTitle order={2} mb="md">
                    Correspondence Table
                </MorseTitle>

                <MorseTitle order={3} mb="md" size="h4">
                    Letters
                </MorseTitle>
                <Table mb="lg" withTableBorder withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>
                                <MorseText>Letter</MorseText>
                            </Table.Th>
                            <Table.Th>
                                <MorseText>Morse Code</MorseText>
                            </Table.Th>
                            <Table.Th>
                                <MorseText>Letter</MorseText>
                            </Table.Th>
                            <Table.Th>
                                <MorseText>Morse Code</MorseText>
                            </Table.Th>
                            <Table.Th>
                                <MorseText>Letter</MorseText>
                            </Table.Th>
                            <Table.Th>
                                <MorseText>Morse Code</MorseText>
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {Array.from({
                            length: Math.ceil(morseLetters.length / 3),
                        }).map((_, rowIndex) => (
                            <Table.Tr key={rowIndex}>
                                {Array.from({ length: 3 }).map(
                                    (_, colIndex) => {
                                        const itemIndex =
                                            rowIndex * 3 + colIndex;
                                        const item = morseLetters[itemIndex];
                                        return item ? (
                                            <>
                                                <Table.Td
                                                    key={`letter-${itemIndex}`}
                                                >
                                                    <MorseText fw={600}>
                                                        {item.letter}
                                                    </MorseText>
                                                </Table.Td>
                                                <Table.Td
                                                    key={`morse-${itemIndex}`}
                                                >
                                                    <MorseText c="blue">
                                                        {item.morse}
                                                    </MorseText>
                                                </Table.Td>
                                            </>
                                        ) : (
                                            <>
                                                <Table.Td
                                                    key={`empty-letter-${itemIndex}`}
                                                ></Table.Td>
                                                <Table.Td
                                                    key={`empty-morse-${itemIndex}`}
                                                ></Table.Td>
                                            </>
                                        );
                                    }
                                )}
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>

                <MorseTitle order={3} mb="md" size="h4">
                    Numbers
                </MorseTitle>
                <Table mb="lg" withTableBorder withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>
                                <MorseText>Number</MorseText>
                            </Table.Th>
                            <Table.Th>
                                <MorseText>Morse Code</MorseText>
                            </Table.Th>
                            <Table.Th>
                                <MorseText>Number</MorseText>
                            </Table.Th>
                            <Table.Th>
                                <MorseText>Morse Code</MorseText>
                            </Table.Th>
                            <Table.Th>
                                <MorseText>Number</MorseText>
                            </Table.Th>
                            <Table.Th>
                                <MorseText>Morse Code</MorseText>
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {Array.from({
                            length: Math.ceil(morseNumbers.length / 3),
                        }).map((_, rowIndex) => (
                            <Table.Tr key={rowIndex}>
                                {Array.from({ length: 3 }).map(
                                    (_, colIndex) => {
                                        const itemIndex =
                                            rowIndex * 3 + colIndex;
                                        const item = morseNumbers[itemIndex];
                                        return item ? (
                                            <>
                                                <Table.Td
                                                    key={`number-${itemIndex}`}
                                                >
                                                    <MorseText fw={600}>
                                                        {item.number}
                                                    </MorseText>
                                                </Table.Td>
                                                <Table.Td
                                                    key={`morse-${itemIndex}`}
                                                >
                                                    <MorseText c="orange">
                                                        {item.morse}
                                                    </MorseText>
                                                </Table.Td>
                                            </>
                                        ) : (
                                            <>
                                                <Table.Td
                                                    key={`empty-number-${itemIndex}`}
                                                ></Table.Td>
                                                <Table.Td
                                                    key={`empty-morse-${itemIndex}`}
                                                ></Table.Td>
                                            </>
                                        );
                                    }
                                )}
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>

                <MorseTitle order={3} mb="md" size="h4">
                    Punctuation Marks
                </MorseTitle>
                <Table mb="lg" withTableBorder withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>
                                <MorseText>Symbol</MorseText>
                            </Table.Th>
                            <Table.Th>
                                <MorseText>Morse Code</MorseText>
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {morsePunctuation.map((item, index) => (
                            <Table.Tr key={index}>
                                <Table.Td>
                                    <MorseText fw={600}>
                                        {item.symbol}
                                    </MorseText>
                                </Table.Td>
                                <Table.Td>
                                    <MorseText c="green">
                                        {item.morse}
                                    </MorseText>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>

                <MorseText size="sm" c="dimmed">
                    💡 Special signal: SOS (···−−−···) is the international
                    distress signal
                </MorseText>
            </Card>

            <Card shadow="sm" p="lg" mb="xl">
                <MorseTitle order={2} mb="md">
                    Application Usage
                </MorseTitle>
                <MorseText mb="sm">
                    This application allows you to communicate in real-time
                    using Morse code. You can send and receive messages that are
                    automatically translated.
                </MorseText>
                <Space h="md" />
                <Group align="center" mb="sm">
                    <ThemeIcon color="orange" size={24}>
                        <IconSettings size={16} />
                    </ThemeIcon>
                    <MorseText fw={600}>Morse Rate Configuration</MorseText>
                </Group>
                <MorseText ml="xl" mb="sm">
                    To customize the Morse code transmission speed, click on the
                    user icon in the interface. You will then be able to adjust
                    the morse rate according to your preferences.
                </MorseText>
            </Card>

            <Card shadow="sm" p="lg" mb="xl">
                <MorseTitle order={2} mb="md">
                    Interactive Converter
                </MorseTitle>
                <MorseText mb="lg" c="dimmed">
                    Experiment with Morse code! Type text or Morse code to see
                    real-time conversion.
                </MorseText>

                <Group grow mb="md">
                    <div>
                        <MorseText size="sm" fw={500} mb="xs">
                            Text → Morse Code
                        </MorseText>
                        <TextInput
                            placeholder="Type your text here..."
                            value={textInput}
                            onChange={e => setTextInput(e.currentTarget.value)}
                            mb="sm"
                        />
                        <Button
                            onClick={handleTextToMorse}
                            leftSection={<IconArrowRight size={16} />}
                            fullWidth
                            variant="light"
                        >
                            <MorseText>Convert to Morse</MorseText>
                        </Button>
                        {morseResult && (
                            <Textarea
                                mt="sm"
                                value={morseResult}
                                readOnly
                                placeholder="Morse code will appear here..."
                                autosize
                                minRows={2}
                                maxRows={4}
                            />
                        )}
                    </div>

                    <div>
                        <MorseText size="sm" fw={500} mb="xs">
                            Morse Code → Text
                        </MorseText>
                        <TextInput
                            placeholder="Type Morse code here... (· −)"
                            value={morseInput}
                            onChange={e => setMorseInput(e.currentTarget.value)}
                            mb="sm"
                        />
                        <Button
                            onClick={handleMorseToText}
                            leftSection={<IconArrowLeft size={16} />}
                            fullWidth
                            variant="light"
                            color="orange"
                        >
                            <MorseText>Convert to Text</MorseText>
                        </Button>
                        {textResult && (
                            <Textarea
                                mt="sm"
                                value={textResult}
                                readOnly
                                placeholder="Text will appear here..."
                                autosize
                                minRows={2}
                                maxRows={4}
                            />
                        )}
                    </div>
                </Group>

                <MorseText size="xs" c="dimmed" ta="center">
                    💡 Tip: Use spaces to separate letters in Morse code
                </MorseText>
            </Card>
            <Card>
                <MorseTitle order={2} mb="md">
                    Credits
                </MorseTitle>
                <a href="https://morsecodetranslator.com">
                    {handleRender('Morse Code Translator')}
                </a>
                <Divider my="md" />
                <MorseText>
                    This project was made with ❤️ for the Efrei Paris school. It
                    is a simple application to learn and practice fullstack web
                    developement.
                </MorseText>
                <br />
                <MorseText>Made by </MorseText>
                <MorseText>-{'>'} Louis Réville,</MorseText>
                <MorseText>-{'>'} Guillaume Maugin,</MorseText>
                <MorseText>-{'>'} Sébastien Branly</MorseText>
            </Card>
        </Container>
    );
};

export default Documentation;

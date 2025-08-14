// src/components/FlashcardModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Card, Button } from 'antd';
import '@/styles/flashcard.style.css';


export interface Flashcard {
    _id?: string;
    type: string;
    frontText?: string;
    frontImage?: string | null;
    back: string;
    example: string;
    tags: string[];
}

interface FlashcardModalProps {
    visible: boolean;
    onClose: () => void;
    flashcards: Flashcard[];
    startIndex?: number;
}

const FlashcardModal: React.FC<FlashcardModalProps> = ({
    visible,
    onClose,
    flashcards,
    startIndex = 0,
}) => {
    const [index, setIndex] = useState(startIndex);
    const [flipped, setFlipped] = useState(false);

    useEffect(() => {
        if (visible) {
            setIndex(startIndex);
            setFlipped(false);
        }
    }, [visible, startIndex]);

    const next = () => {
        setFlipped(false);
        setIndex((i) =>
            flashcards.length > 0 ? (i + 1) % flashcards.length : i,
        );
    };

    const prev = () => {
        setFlipped(false);
        setIndex((i) =>
            flashcards.length > 0
                ? (i - 1 + flashcards.length) % flashcards.length
                : i,
        );
    };
    const reset = () => {
        setIndex(0);
        setFlipped(false);
    };

    const card = flashcards[index];

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={560}
            centered
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                }}
            >
                <div>
                    Flashcard {flashcards.length ? index + 1 : 0} /{' '}
                    {flashcards.length}
                </div>
                <div>
                    <Button
                        size='small'
                        onClick={reset}
                        style={{ marginRight: 32 }}
                    >
                        Reset
                    </Button>
                    {/* <Button size='small' onClick={onClose}></Button> */}
                </div>
            </div>

            <div
                className='flashcard-wrapper'
                onClick={() => setFlipped((s) => !s)}
            >
                <div className={`flip-card ${flipped ? 'flipped' : ''}`}>
                    <div className='flip-card-front'>
                        <Card
                            variant='outlined'
                            style={{
                                minHeight: 160,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f0f8ff',
                            }}
                        >
                            {card?.type === 'text' ? (
                                <h2 style={{ margin: 0 }}>
                                    {card?.frontText ?? 'No card'}
                                </h2>
                            ) : (
                                <img
                                    style={{
                                        margin: 0,
                                        maxWidth: '5rem',
                                        height: 'auto',
                                    }}
                                    src={card?.frontImage || ''}
                                    alt='Flashcard image'
                                />
                            )}
                        </Card>
                    </div>
                    <div className='flip-card-back'>
                        <Card
                            variant='outlined'
                            style={{
                                minHeight: 160,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#ffe4e1',
                            }}
                        >
                            <h2 style={{ margin: 0 }}>{card?.back ?? ''}</h2>
                        </Card>
                    </div>
                </div>
            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 12,
                }}
            >
                <div>
                    <Button
                        disabled={index === 0}
                        onClick={prev}
                        style={{ marginRight: 8 }}
                    >
                        Prev
                    </Button>
                    <Button
                        disabled={index >= flashcards.length - 1}
                        onClick={next}
                    >
                        Next
                    </Button>
                </div>

                <div>
                    <Button
                        type='primary'
                        onClick={() => setFlipped((s) => !s)}
                    >
                        {flipped ? 'Show Front' : 'Show Back'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default FlashcardModal;

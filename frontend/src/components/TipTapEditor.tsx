import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface TipTapEditorProps {
    value?: string;
    onChange?: (content: string) => void;
    placeholder?: string;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({
    value = '',
    onChange,
    placeholder,
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: placeholder || 'Nhập nội dung...',
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
    });

    return (
        <div
            className='rounded-md p-2 min-h-[200px]'
            style={{
                border: '1.5px solid #d9d9d9',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'border 0.2s, box-shadow 0.2s',
            }}
        >
            <EditorContent
                style={{
                    minHeight: 150,
                    borderRadius: 6,
                    outline: 'none',
                }}
                editor={editor}
            />
        </div>
    );
};

export default TipTapEditor;

import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Space, Popconfirm, message } from 'antd';
import { callDeleteFlashcard } from '../../api/flashcardApi';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { fetchFlashcard } from '../../redux/flashcard/flashcard.slice';
import { FlashcardAddModal } from './flashcardAdd.modal';

interface IFlashcard {
    _id?: string;
    type: string;
    frontText?: string;
    frontImage?: string;
    back: string;
    example: string;
    tags: string[];
}

const FlashcardList: React.FC = () => {
    const flashcards = useAppSelector((state) => state.flashcard.result);
    const isFetching = useAppSelector((state) => state.flashcard.isFetching);
    const dispatch = useAppDispatch();

    const [modalVisible, setModalVisible] = useState(false);
    const [editingFlashcard, setEditingFlashcard] = useState<IFlashcard | null>(
        null,
    );
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(fetchFlashcard());
    }, [dispatch]);

    const columns = [
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (value: string) => (
                <div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {value}
                </div>
            ),
        },
        {
            title: 'Front Text',
            dataIndex: 'frontText',
            key: 'frontText',
            render: (value: string) => (
                <div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {value}
                </div>
            ),
        },
        {
            title: 'Front Image',
            dataIndex: 'frontImage',
            key: 'frontImage',
            render: (url: string) =>
                url ? (
                    <img
                        src={url}
                        alt='Front'
                        style={{
                            maxHeight: 50,
                            maxWidth: 80,
                            objectFit: 'cover',
                        }}
                    />
                ) : null,
        },
        {
            title: 'Back',
            dataIndex: 'back',
            key: 'back',
            render: (value: string) => (
                <div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {value}
                </div>
            ),
        },
        {
            title: 'Example',
            dataIndex: 'example',
            key: 'example',
            render: (value: string) => (
                <div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {value}
                </div>
            ),
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
            render: (tags: string[]) => (
                <div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {tags.join(', ')}
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: IFlashcard) => (
                <Space>
                    <Button type='link' onClick={() => openEditModal(record)}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title='Bạn có chắc muốn xóa?'
                        onConfirm={() => {
                            if (record._id) {
                                handleDelete(record._id);
                            }
                        }}
                        okText='Có'
                        cancelText='Không'
                    >
                        <Button type='link' danger>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    const openAddModel = () => {
        setEditingFlashcard(null);
        setModalVisible(true);
    };

    const openEditModal = (record: IFlashcard) => {
        setEditingFlashcard(record);
        setModalVisible(true);
    };
    const handleDelete = async (id: string) => {
        try {
            await callDeleteFlashcard(id);
            message.success('Xoá flashcard thành công!');
            dispatch(fetchFlashcard());
        } catch (err) {
            console.error(err);
            message.error('Xoá thất bại!');
        }
    };
    return (
        <>
            <Button
                type='primary'
                style={{ marginBottom: 16 }}
                onClick={openAddModel}
            >
                Thêm flashcard mới
            </Button>
            <Table
                dataSource={flashcards as IFlashcard[]}
                columns={columns}
                rowKey='_id'
                loading={isFetching}
            />
            <FlashcardAddModal
                form={form}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                editingFlashcard={editingFlashcard}
                onSuccess={() => dispatch(fetchFlashcard())}
            />
        </>
    );
};
export default FlashcardList;

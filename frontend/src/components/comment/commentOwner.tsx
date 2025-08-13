import React, { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Space,
    Popconfirm,
    message,
} from 'antd';

import type { IComment } from '../../types/backend';
import {
    callDeleteComment,
    callFetchOwnerComment,
    callUpdateComment,
} from '../../api/commentApi';

export const CommentOwner: React.FC = ({}) => {
    const [comments, setComments] = useState<IComment[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingComment, setEditingComment] = useState<IComment | null>(null);

    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await callFetchOwnerComment();

            const list = Array.isArray(res.data.data) ? res.data.data : [];
            setComments(list);
        } catch (err) {
            message.error('Không thể tải comment!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            if (!editingComment?._id) {
                message.error('Không tìm thấy ID của comment để cập nhật');
                return;
            }

            await callUpdateComment(editingComment._id, {
                content: values.content,
            });

            message.success('Cập nhật comment thành công!');
            setModalVisible(false);
            form.resetFields();
            setEditingComment(null);
            fetchData();
        } catch (err) {
            message.error('Lưu comment thất bại!');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await callDeleteComment(id);
            message.success('Xoá comment thành công!');
            fetchData();
        } catch {
            message.error('Xoá thất bại!');
        }
    };

    const columns = [
        {
            title: 'Nội dung',
            dataIndex: 'content',
        },
        {
            title: 'Người tạo',
            dataIndex: ['createdBy', 'email'],
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
        },
        {
            title: 'Hành động',
            render: (_: any, record: IComment) => (
                <Space>
                    <Button
                        type='link'
                        onClick={() => {
                            setEditingComment(record);
                            form.setFieldsValue({ content: record.content });
                            setModalVisible(true);
                        }}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title='Xác nhận xoá?'
                        onConfirm={() => handleDelete(record._id!)}
                    >
                        <Button danger type='link'>
                            Xoá
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Table
                dataSource={comments}
                columns={columns}
                rowKey='_id'
                loading={loading}
            />

            <Modal
                title={'Sửa comment'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={handleSave}
            >
                <Form form={form} layout='vertical'>
                    <Form.Item
                        label='Nội dung'
                        name='content'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập nội dung!',
                            },
                        ]}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

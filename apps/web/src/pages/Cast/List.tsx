import { useState, useEffect } from 'react'
import { 
  Button, 
  Table, 
  Avatar, 
  Card, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  Popconfirm,
  Space,
  Tag,
  Image,
  Upload,
  Progress
} from 'antd'
import type { UploadFile } from 'antd/es/upload/interface'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  UploadOutlined,
  LoadingOutlined
} from '@ant-design/icons'
import { castApi, fileApi } from '../../services/api'
import type { Cast } from '../../types/cast'

const { Option } = Select
const { TextArea } = Input

function CastList() {
  const [casts, setCasts] = useState<Cast[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingCast, setEditingCast] = useState<Cast | null>(null)
  const [form] = Form.useForm()
  
  // 头像上传状态
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [fileList, setFileList] = useState<UploadFile[]>([])

  // 加载演员列表
  const loadCasts = async () => {
    setLoading(true)
    try {
      const data = await castApi.getCasts()
      setCasts(data)
    } catch (error: any) {
      message.error('加载演员失败: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCasts()
  }, [])

  // 打开新建/编辑弹窗
  const openModal = (cast?: Cast) => {
    if (cast) {
      setEditingCast(cast)
      setAvatarUrl(cast.avatar || '')
      form.setFieldsValue({
        name: cast.name,
        type: cast.type,
        bio: cast.bio,
        email: cast.email,
        phone: cast.phone,
        contact: cast.contact,
        skills: cast.skills?.join(', '),
      })
    } else {
      setEditingCast(null)
      setAvatarUrl('')
      setFileList([])
      form.resetFields()
    }
    setModalVisible(true)
  }

  // 关闭弹窗
  const closeModal = () => {
    setModalVisible(false)
    setEditingCast(null)
    setAvatarUrl('')
    setFileList([])
    setUploadProgress(0)
    form.resetFields()
  }

  // 保存演员
  const handleSave = async (values: any) => {
    try {
      // 处理技能字符串转数组
      const data = {
        ...values,
        avatar: avatarUrl,
        skills: values.skills ? values.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      }

      if (editingCast) {
        await castApi.updateCast(editingCast.id, data)
        message.success('演员更新成功')
      } else {
        await castApi.createCast(data)
        message.success('演员创建成功')
      }
      closeModal()
      loadCasts()
    } catch (error: any) {
      message.error('保存失败: ' + error.message)
    }
  }

  // 处理头像上传
  const handleAvatarUpload = async (file: File) => {
    setUploading(true)
    setUploadProgress(0)
    
    try {
      const result = await fileApi.uploadAvatar(file, (progress) => {
        setUploadProgress(progress)
      })
      
      if (result.success) {
        setAvatarUrl(result.data.url)
        message.success('头像上传成功')
      }
    } catch (error: any) {
      message.error('上传失败: ' + error.message)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
    
    return false // 阻止默认上传行为
  }

  // 删除演员
  const handleDelete = async (id: string) => {
    try {
      await castApi.deleteCast(id)
      message.success('演员删除成功')
      loadCasts()
    } catch (error: any) {
      message.error('删除失败: ' + error.message)
    }
  }

  const columns = [
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar: string) => (
        avatar ? (
          <Image 
            src={avatar} 
            style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }}
            preview={false}
            fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3C/svg%3E"
          />
        ) : (
          <Avatar size={50} icon={<UserOutlined />} />
        )
      ),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Cast) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontWeight: 500, fontSize: 16 }}>{name}</span>
          {record.bio && (
            <span style={{ fontSize: 12, color: '#888', maxWidth: 200 }} className="ellipsis">
              {record.bio.slice(0, 50)}...
            </span>
          )}
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colors: Record<string, string> = {
          actor: 'blue',
          voice: 'purple',
          model: 'pink',
          other: 'default',
        }
        const labels: Record<string, string> = {
          actor: '演员',
          voice: '配音',
          model: '模特',
          other: '其他',
        }
        return <Tag color={colors[type] || 'default'}>{labels[type] || type}</Tag>
      },
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (_: any, record: Cast) => (
        <Space direction="vertical" size={0}>
          {record.email && (
            <span style={{ fontSize: 12 }}>
              <MailOutlined style={{ marginRight: 4 }} />
              {record.email}
            </span>
          )}
          {record.phone && (
            <span style={{ fontSize: 12 }}>
              <PhoneOutlined style={{ marginRight: 4 }} />
              {record.phone}
            </span>
          )}
        </Space>
      ),
    },
    {
      title: '技能',
      dataIndex: 'skills',
      key: 'skills',
      render: (skills: string[]) => (
        <Space wrap>
          {skills?.map((skill, index) => (
            <Tag key={index}>{skill}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Cast) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => openModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="删除后无法恢复，是否继续？"
            onConfirm={() => handleDelete(record.id)}
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24 }}>演员管理</h1>
          <p style={{ margin: '8px 0 0', color: '#888' }}>
            共 {casts.length} 位演员/配音
          </p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={() => openModal()}
        >
          添加演员
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={casts} 
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      {/* 新建/编辑弹窗 */}
      <Modal
        title={editingCast ? '编辑演员' : '添加演员'}
        open={modalVisible}
        onCancel={closeModal}
        onOk={() => form.submit()}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{ type: 'actor' }}
        >
          {/* 头像上传 */}
          <Form.Item label="头像">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }}
                  preview={false}
                />
              ) : (
                <Avatar size={100} icon={<UserOutlined />} />
              )}
              <div style={{ flex: 1 }}>
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={handleAvatarUpload}
                  fileList={fileList}
                  onChange={({ fileList }) => setFileList(fileList)}
                >
                  <Button icon={uploading ? <LoadingOutlined /> : <UploadOutlined />} disabled={uploading}>
                    {uploading ? '上传中...' : '上传头像'}
                  </Button>
                </Upload>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <Progress percent={uploadProgress} size="small" style={{ marginTop: 8 }} />
                )}
                <p style={{ fontSize: 12, color: '#888', marginTop: 8 }}>支持 JPG、PNG、WebP 格式，最大 50MB</p>
              </div>
            </div>
          </Form.Item>

          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="输入姓名" />
          </Form.Item>

          <Form.Item
            label="类型"
            name="type"
            rules={[{ required: true }]}
          >
            <Select placeholder="选择类型">
              <Option value="actor">演员</Option>
              <Option value="voice">配音</Option>
              <Option value="model">模特</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="简介"
            name="bio"
          >
            <TextArea rows={3} placeholder="输入简介（可选）" />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ type: 'email', message: '请输入有效的邮箱' }]}
          >
            <Input placeholder="输入邮箱" />
          </Form.Item>

          <Form.Item
            label="电话"
            name="phone"
          >
            <Input placeholder="输入电话" />
          </Form.Item>

          <Form.Item
            label="其他联系方式"
            name="contact"
          >
            <Input placeholder="微信/QQ等其他联系方式" />
          </Form.Item>

          <Form.Item
            label="技能"
            name="skills"
            extra="多个技能用逗号分隔，如：演技,唱歌,舞蹈"
          >
            <Input placeholder="输入技能，用逗号分隔" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default CastList

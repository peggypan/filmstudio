import { useState, useEffect, useRef } from 'react'
import { 
  Button, 
  Table, 
  Tag, 
  Card, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  Popconfirm,
  Space,
  Upload,
  Progress
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  PlayCircleOutlined,
  PauseCircleOutlined,
  UploadOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons'
import { musicApi } from '../../services/api'
import { projectApi } from '../../services/api'
import type { Music } from '../../types/music'

const { Option } = Select

// 格式化时长
const formatDuration = (seconds?: number) => {
  if (!seconds) return '-'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function MusicLibrary() {
  const [music, setMusic] = useState<Music[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingMusic, setEditingMusic] = useState<Music | null>(null)
  const [form] = Form.useForm()
  const [playingId, setPlayingId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)

  // 加载音乐列表
  const loadMusic = async () => {
    setLoading(true)
    try {
      const data = await musicApi.getMusic()
      setMusic(data)
    } catch (error: any) {
      message.error('加载音乐失败: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // 加载项目列表
  const loadProjects = async () => {
    try {
      const data = await projectApi.getProjects()
      setProjects(data)
    } catch (error) {
      console.error('加载项目失败', error)
    }
  }

  useEffect(() => {
    loadMusic()
    loadProjects()
  }, [])

  // 清理音频
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // 播放/暂停
  const togglePlay = (item: Music) => {
    if (playingId === item.id) {
      audioRef.current?.pause()
      setPlayingId(null)
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      audioRef.current = new Audio(item.url)
      audioRef.current.play()
      setPlayingId(item.id)
      audioRef.current.onended = () => setPlayingId(null)
    }
  }

  // 打开新建/编辑弹窗
  const openModal = (item?: Music) => {
    if (item) {
      setEditingMusic(item)
      form.setFieldsValue({
        title: item.title,
        artist: item.artist,
        style: item.style,
        license: item.license,
        tags: item.tags?.join(', '),
        duration: item.duration,
      })
    } else {
      setEditingMusic(null)
      form.resetFields()
    }
    setModalVisible(true)
  }

  // 关闭弹窗
  const closeModal = () => {
    setModalVisible(false)
    setEditingMusic(null)
    form.resetFields()
  }

  // 保存音乐
  const handleSave = async (values: any) => {
    try {
      const data = {
        ...values,
        tags: values.tags ? values.tags.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      }

      if (editingMusic) {
        await musicApi.updateMusic(editingMusic.id, data)
        message.success('音乐信息更新成功')
      } else {
        await musicApi.createMusic(data)
        message.success('音乐添加成功')
      }
      closeModal()
      loadMusic()
    } catch (error: any) {
      message.error('保存失败: ' + error.message)
    }
  }

  // 删除音乐
  const handleDelete = async (id: string) => {
    try {
      await musicApi.deleteMusic(id)
      message.success('音乐删除成功')
      if (playingId === id) {
        audioRef.current?.pause()
        setPlayingId(null)
      }
      loadMusic()
    } catch (error: any) {
      message.error('删除失败: ' + error.message)
    }
  }

  // 模拟上传（实际应调用后端上传接口）
  const handleUpload = (info: any) => {
    if (info.file.status === 'uploading') {
      setUploading(true)
      setUploadProgress(info.file.percent || 0)
    } else if (info.file.status === 'done') {
      setUploading(false)
      message.success(`${info.file.name} 上传成功`)
      loadMusic()
    } else if (info.file.status === 'error') {
      setUploading(false)
      message.error(`${info.file.name} 上传失败`)
    }
  }

  const columns = [
    {
      title: '',
      key: 'play',
      width: 60,
      render: (_: any, record: Music) => (
        <Button
          type="text"
          icon={playingId === record.id ? <PauseCircleOutlined style={{ fontSize: 24 }} /> : <PlayCircleOutlined style={{ fontSize: 24 }} />}
          onClick={() => togglePlay(record)}
        />
      ),
    },
    {
      title: '音乐名称',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: Music) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontWeight: 500 }}>{title}</span>
          {record.artist && (
            <span style={{ fontSize: 12, color: '#888' }}>{record.artist}</span>
          )}
        </Space>
      ),
    },
    {
      title: '风格',
      dataIndex: 'style',
      key: 'style',
      render: (style: string) => style || '-',
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (duration: number) => formatDuration(duration),
    },
    {
      title: '版权',
      dataIndex: 'license',
      key: 'license',
      render: (license: string) => {
        const colors: Record<string, string> = {
          free: 'green',
          paid: 'red',
          'royalty-free': 'blue',
          commercial: 'gold',
        }
        const labels: Record<string, string> = {
          free: '免费',
          paid: '付费',
          'royalty-free': '免版税',
          commercial: '可商用',
        }
        return <Tag color={colors[license] || 'default'}>{labels[license] || license}</Tag>
      },
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <Space wrap>
          {tags?.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Music) => (
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
          <h1 style={{ margin: 0, fontSize: 24 }}>
            <CustomerServiceOutlined style={{ marginRight: 8 }} />
            配乐管理
          </h1>
          <p style={{ margin: '8px 0 0', color: '#888' }}>
            共 {music.length} 首音乐
          </p>
        </div>
        <Space>
          <Upload
            accept="audio/*"
            showUploadList={false}
            customRequest={({ onSuccess }) => {
              // 模拟上传，实际应调用后端
              setTimeout(() => onSuccess?.('ok'), 1000)
            }}
            onChange={handleUpload}
          >
            <Button icon={<UploadOutlined />} loading={uploading}>
              上传音乐
            </Button>
          </Upload>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={() => openModal()}
          >
            添加记录
          </Button>
        </Space>
      </div>

      {uploading && (
        <div style={{ marginBottom: 16 }}>
          <Progress percent={uploadProgress} status="active" />
        </div>
      )}

      <Table 
        columns={columns} 
        dataSource={music} 
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
        title={editingMusic ? '编辑音乐' : '添加音乐'}
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
        >
          <Form.Item
            label="音乐名称"
            name="title"
            rules={[{ required: true, message: '请输入音乐名称' }]}
          >
            <Input placeholder="输入音乐名称" />
          </Form.Item>

          <Form.Item
            label="艺术家"
            name="artist"
          >
            <Input placeholder="输入艺术家名称" />
          </Form.Item>

          <Form.Item
            label="风格"
            name="style"
          >
            <Select placeholder="选择音乐风格" allowClear>
              <Option value="pop">流行</Option>
              <Option value="rock">摇滚</Option>
              <Option value="classical">古典</Option>
              <Option value="jazz">爵士</Option>
              <Option value="electronic">电子</Option>
              <Option value="folk">民谣</Option>
              <Option value="soundtrack">配乐</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="时长（秒）"
            name="duration"
          >
            <Input type="number" placeholder="输入时长（秒）" />
          </Form.Item>

          <Form.Item
            label="版权类型"
            name="license"
          >
            <Select placeholder="选择版权类型" allowClear>
              <Option value="free">免费</Option>
              <Option value="paid">付费</Option>
              <Option value="royalty-free">免版税</Option>
              <Option value="commercial">可商用</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="标签"
            name="tags"
            extra="多个标签用逗号分隔，如：欢快,背景,片头"
          >
            <Input placeholder="输入标签，用逗号分隔" />
          </Form.Item>

          <Form.Item
            label="关联项目"
            name="projectId"
          >
            <Select placeholder="关联到项目" allowClear>
              {projects.map(p => (
                <Option key={p.id} value={p.id}>{p.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default MusicLibrary

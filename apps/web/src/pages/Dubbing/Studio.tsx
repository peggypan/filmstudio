import { useState, useEffect, useRef } from 'react'
import {
  Button,
  Card,
  Input,
  Select,
  message,
  List,
  Typography,
  Space,
  Tag,
  Popconfirm,
  Empty,
  Divider,
  Avatar,
} from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SoundOutlined,
  ManOutlined,
  WomanOutlined,
  SaveOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { dubbingApi, projectApi, castApi } from '../../services/api'
import type { Dubbing, Voice } from '../../types/dubbing'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

// 预设音色（实际应从 API 获取）
const PRESET_VOICES: Voice[] = [
  { id: 'voice_1', name: '晓晨', gender: 'female', language: 'zh', description: '温柔女声，适合旁白' },
  { id: 'voice_2', name: '浩然', gender: 'male', language: 'zh', description: '磁性男声，适合纪录片' },
  { id: 'voice_3', name: '小宇', gender: 'male', language: 'zh', description: '阳光少年音' },
  { id: 'voice_4', name: '思琪', gender: 'female', language: 'zh', description: '知性女声' },
  { id: 'voice_5', name: 'Rachel', gender: 'female', language: 'en', description: 'English female voice' },
  { id: 'voice_6', name: 'Adam', gender: 'male', language: 'en', description: 'English male voice' },
]

function DubbingStudio() {
  const [dubbings, setDubbings] = useState<Dubbing[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [casts, setCasts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [editingDubbing, setEditingDubbing] = useState<Dubbing | null>(null)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  
  // 表单状态
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [voiceId, setVoiceId] = useState(PRESET_VOICES[0].id)
  const [projectId, setProjectId] = useState<string>()
  const [castId, setCastId] = useState<string>()
  const [textLength, setTextLength] = useState(0)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 加载数据
  useEffect(() => {
    loadDubbings()
    loadProjects()
    loadCasts()
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

  const loadDubbings = async () => {
    setLoading(true)
    try {
      const data = await dubbingApi.getDubbings()
      setDubbings(data)
    } catch (error: any) {
      message.error('加载配音失败: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const loadProjects = async () => {
    try {
      const data = await projectApi.getProjects()
      setProjects(data)
    } catch (error) {
      console.error('加载项目失败', error)
    }
  }

  const loadCasts = async () => {
    try {
      const data = await castApi.getCasts()
      setCasts(data)
    } catch (error) {
      console.error('加载演员失败', error)
    }
  }

  // 播放/暂停
  const togglePlay = (dubbing: Dubbing) => {
    if (!dubbing.audioUrl) {
      message.warning('暂无音频，请先生成')
      return
    }

    if (playingId === dubbing.id) {
      audioRef.current?.pause()
      setPlayingId(null)
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      audioRef.current = new Audio(dubbing.audioUrl)
      audioRef.current.play()
      setPlayingId(dubbing.id)
      audioRef.current.onended = () => setPlayingId(null)
    }
  }

  // 创建配音
  const handleCreate = async () => {
    if (!title.trim()) {
      message.error('请输入标题')
      return
    }
    if (!text.trim()) {
      message.error('请输入配音文本')
      return
    }

    try {
      await dubbingApi.createDubbing({
        title,
        text,
        voiceId,
        projectId,
        castId,
      })
      message.success('配音创建成功')
      resetForm()
      loadDubbings()
    } catch (error: any) {
      message.error('创建失败: ' + error.message)
    }
  }

  // 更新配音
  const handleUpdate = async () => {
    if (!editingDubbing) return
    if (!title.trim() || !text.trim()) {
      message.error('请填写完整信息')
      return
    }

    try {
      await dubbingApi.updateDubbing(editingDubbing.id, {
        title,
        text,
        voiceId,
      })
      message.success('配音更新成功')
      resetForm()
      loadDubbings()
    } catch (error: any) {
      message.error('更新失败: ' + error.message)
    }
  }

  // 删除配音
  const handleDelete = async (id: string) => {
    try {
      await dubbingApi.deleteDubbing(id)
      message.success('配音删除成功')
      if (playingId === id) {
        audioRef.current?.pause()
        setPlayingId(null)
      }
      loadDubbings()
    } catch (error: any) {
      message.error('删除失败: ' + error.message)
    }
  }

  // 生成配音
  const handleGenerate = async (dubbing: Dubbing) => {
    setGenerating(true)
    try {
      await dubbingApi.generateDubbing(dubbing.id)
      message.success('配音生成成功')
      loadDubbings()
    } catch (error: any) {
      message.error('生成失败: ' + error.message)
    } finally {
      setGenerating(false)
    }
  }

  // 编辑模式
  const startEdit = (dubbing: Dubbing) => {
    setEditingDubbing(dubbing)
    setFormMode('edit')
    setTitle(dubbing.title)
    setText(dubbing.text)
    setVoiceId(dubbing.voiceId)
    setProjectId(dubbing.projectId)
    setCastId(dubbing.castId)
    setTextLength(dubbing.text.length)
  }

  // 重置表单
  const resetForm = () => {
    setEditingDubbing(null)
    setFormMode('create')
    setTitle('')
    setText('')
    setVoiceId(PRESET_VOICES[0].id)
    setProjectId(undefined)
    setCastId(undefined)
    setTextLength(0)
  }

  // 文本变化
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setText(newText)
    setTextLength(newText.length)
  }

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      pending: { color: 'default', text: '待生成' },
      processing: { color: 'blue', text: '生成中' },
      completed: { color: 'green', text: '已完成' },
      failed: { color: 'red', text: '失败' },
    }
    const { color, text } = statusMap[status] || { color: 'default', text: status }
    return <Tag color={color}>{text}</Tag>
  }

  // 获取音色信息
  const getVoiceInfo = (voiceId: string) => {
    return PRESET_VOICES.find(v => v.id === voiceId) || { name: '未知', gender: 'neutral' }
  }

  return (
    <div style={{ display: 'flex', gap: 16, height: 'calc(100vh - 140px)' }}>
      {/* 左侧：配音编辑区 */}
      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Title level={4} style={{ marginBottom: 24 }}>
          <SoundOutlined /> {formMode === 'create' ? '新建配音' : '编辑配音'}
        </Title>

        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {/* 标题 */}
          <div>
            <Text strong>标题</Text>
            <Input
              placeholder="输入配音标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ marginTop: 8 }}
            />
          </div>

          {/* 配音文本 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>配音文本</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>{textLength} 字符</Text>
            </div>
            <TextArea
              rows={8}
              placeholder="输入要合成的文本..."
              value={text}
              onChange={handleTextChange}
              style={{ marginTop: 8 }}
              showCount
              maxLength={5000}
            />
          </div>

          {/* 音色选择 */}
          <div>
            <Text strong>选择音色</Text>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              value={voiceId}
              onChange={setVoiceId}
              placeholder="选择音色"
            >
              {PRESET_VOICES.map(voice => (
                <Option key={voice.id} value={voice.id}>
                  <Space>
                    <Avatar
                      size="small"
                      icon={voice.gender === 'male' ? <ManOutlined /> : <WomanOutlined />}
                      style={{
                        backgroundColor: voice.gender === 'male' ? '#1890ff' : '#eb2f96',
                      }}
                    />
                    <span>{voice.name}</span>
                    <Tag>{voice.language === 'zh' ? '中文' : 'English'}</Tag>
                    <Text type="secondary" style={{ fontSize: 12 }}>{voice.description}</Text>
                  </Space>
                </Option>
              ))}
            </Select>
          </div>

          {/* 关联 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <Text strong>关联项目</Text>
              <Select
                style={{ width: '100%', marginTop: 8 }}
                value={projectId}
                onChange={setProjectId}
                placeholder="选择项目"
                allowClear
              >
                {projects.map(p => (
                  <Option key={p.id} value={p.id}>{p.name}</Option>
                ))}
              </Select>
            </div>
            <div>
              <Text strong>关联演员</Text>
              <Select
                style={{ width: '100%', marginTop: 8 }}
                value={castId}
                onChange={setCastId}
                placeholder="选择演员"
                allowClear
              >
                {casts.map(c => (
                  <Option key={c.id} value={c.id}>{c.name}</Option>
                ))}
              </Select>
            </div>
          </div>

          <Divider />

          {/* 操作按钮 */}
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            {formMode === 'edit' && (
              <Button onClick={resetForm}>取消</Button>
            )}
            <Button
              type="primary"
              icon={formMode === 'create' ? <SaveOutlined /> : <EditOutlined />}
              onClick={formMode === 'create' ? handleCreate : handleUpdate}
              size="large"
            >
              {formMode === 'create' ? '保存配音' : '更新配音'}
            </Button>
          </Space>
        </Space>
      </Card>

      {/* 右侧：配音列表 */}
      <Card style={{ width: 400, overflow: 'auto' }}>
        <Title level={5} style={{ marginBottom: 16 }}>配音列表</Title>
        
        <List
          dataSource={dubbings}
          loading={loading}
          locale={{ emptyText: <Empty description="暂无配音" /> }}
          renderItem={(item) => {
            const voice = getVoiceInfo(item.voiceId)
            const isPlaying = playingId === item.id
            
            return (
              <List.Item
                style={{
                  padding: '16px',
                  border: editingDubbing?.id === item.id ? '1px solid #1890ff' : '1px solid #f0f0f0',
                  borderRadius: 8,
                  marginBottom: 8,
                  background: editingDubbing?.id === item.id ? '#e6f7ff' : '#fff',
                }}
                actions={[
                  <Button
                    key="play"
                    type="text"
                    icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                    onClick={() => togglePlay(item)}
                    disabled={!item.audioUrl}
                  />,
                  <Button
                    key="edit"
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => startEdit(item)}
                  />,
                  <Popconfirm
                    key="delete"
                    title="确认删除"
                    onConfirm={() => handleDelete(item.id)}
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <Text strong>{item.title}</Text>
                      {getStatusTag(item.status)}
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size={0} style={{ width: '100%' }}>
                      <Text type="secondary" ellipsis style={{ maxWidth: 200 }}>
                        {item.text.slice(0, 30)}...
                      </Text>
                      <Space style={{ marginTop: 4 }}>
                        <Tag icon={voice.gender === 'male' ? <ManOutlined /> : <WomanOutlined />}>
                          {voice.name}
                        </Tag>
                        {item.duration && (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {Math.floor(item.duration)}s
                          </Text>
                        )}
                      </Space>
                      {item.status !== 'completed' && (
                        <Button
                          type="primary"
                          size="small"
                          icon={<ThunderboltOutlined />}
                          loading={generating}
                          onClick={() => handleGenerate(item)}
                          style={{ marginTop: 8 }}
                        >
                          生成配音
                        </Button>
                      )}
                    </Space>
                  }
                />
              </List.Item>
            )
          }}
        />
      </Card>
    </div>
  )
}

export default DubbingStudio

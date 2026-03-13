import { Card, Input, Button, Space } from 'antd'
import { SaveOutlined, ThunderboltOutlined } from '@ant-design/icons'

const { TextArea } = Input

function ScriptEditor() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>剧本编辑</h1>
        <Space>
          <Button icon={<ThunderboltOutlined />}>AI生成</Button>
          <Button type="primary" icon={<SaveOutlined />}>保存</Button>
        </Space>
      </div>
      <Card>
        <Input placeholder="剧本标题" style={{ marginBottom: 16 }} />
        <TextArea rows={20} placeholder="在此输入剧本内容..." />
      </Card>
    </div>
  )
}

export default ScriptEditor
